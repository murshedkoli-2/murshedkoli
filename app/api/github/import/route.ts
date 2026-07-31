import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { parseRepoUrl, repoHtmlUrl, type RepoRef } from '@/lib/github/repo-url'
import { parseReadme, detectTech, prettifyRepoName, type DetectedTech } from '@/lib/github/readme'

/**
 * Prefills the project wizard from a public GitHub repository.
 *
 * The request body carries a URL, but nothing here fetches it. We extract
 * owner/repo, validate both against GitHub's own naming rules, and build every
 * outbound URL against the fixed api.github.com host — so a crafted "url" can
 * never redirect this server at an internal address.
 */

const API = 'https://api.github.com'
const TIMEOUT_MS = 10_000

interface GithubRepo {
  name: string
  description: string | null
  homepage: string | null
  topics?: string[]
  default_branch: string
  license?: { spdx_id?: string | null } | null
  stargazers_count?: number
  archived?: boolean
}

function ghHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    // GitHub rejects requests without one.
    'User-Agent': 'portfolio-admin-importer',
  }
  // Optional: lifts the rate limit from 60/hr to 5000/hr.
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return headers
}

async function ghFetch(path: string): Promise<Response> {
  return fetch(`${API}${path}`, {
    headers: ghHeaders(),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  })
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  let url: unknown
  try {
    ({ url } = await request.json())
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (typeof url !== 'string' || url.length > 300) {
    return NextResponse.json({ error: 'Provide a GitHub repository URL.' }, { status: 400 })
  }

  const ref = parseRepoUrl(url)
  if (!ref) {
    return NextResponse.json(
      { error: 'That does not look like a GitHub repository URL. Try github.com/owner/repo.' },
      { status: 400 }
    )
  }

  try {
    const repoRes = await ghFetch(`/repos/${ref.owner}/${ref.repo}`)

    if (repoRes.status === 404) {
      return NextResponse.json(
        { error: 'Repository not found. It may be private, renamed, or misspelled.' },
        { status: 404 }
      )
    }
    if (repoRes.status === 403 || repoRes.status === 429) {
      const reset = repoRes.headers.get('x-ratelimit-remaining') === '0'
      return NextResponse.json(
        {
          error: reset
            ? 'GitHub rate limit reached. Set GITHUB_TOKEN to raise it, or try again later.'
            : 'GitHub refused the request.',
        },
        { status: 429 }
      )
    }
    if (!repoRes.ok) {
      return NextResponse.json({ error: `GitHub returned ${repoRes.status}.` }, { status: 502 })
    }

    const repo: GithubRepo = await repoRes.json()

    // Both are optional extras — a repo with neither still imports fine.
    const [readme, languages] = await Promise.all([
      fetchReadme(ref),
      fetchLanguages(ref),
    ])

    const facts = parseReadme(readme ?? '', ref, repo.default_branch || 'main')
    const topics = repo.topics ?? []
    const techStack: DetectedTech[] = detectTech(readme ?? '', languages, topics)

    // Repo description beats the README paragraph: it is written to be a summary.
    const description = repo.description?.trim() || facts.summary || ''

    return NextResponse.json({
      title: facts.title || prettifyRepoName(repo.name),
      slug: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      description,
      longDescription: readme ?? '',
      coverImage: facts.coverImage ?? '',
      githubUrl: repoHtmlUrl(ref),
      demoUrl: normaliseHomepage(repo.homepage),
      features: facts.features,
      techStack,
      topics,
      hasReadme: Boolean(readme),
      stars: repo.stargazers_count ?? 0,
      archived: Boolean(repo.archived),
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json({ error: 'GitHub took too long to respond.' }, { status: 504 })
    }
    console.error('GitHub import failed:', error)
    return NextResponse.json({ error: 'Could not reach GitHub.' }, { status: 502 })
  }
}

async function fetchReadme(ref: RepoRef): Promise<string | null> {
  try {
    const res = await ghFetch(`/repos/${ref.owner}/${ref.repo}/readme`)
    if (!res.ok) return null
    const data = await res.json()
    if (typeof data.content !== 'string') return null
    const decoded = Buffer.from(data.content, data.encoding === 'base64' ? 'base64' : 'utf8').toString('utf8')
    // Guard the wizard against a pathological README.
    return decoded.length > 200_000 ? decoded.slice(0, 200_000) : decoded
  } catch {
    return null
  }
}

async function fetchLanguages(ref: RepoRef): Promise<string[]> {
  try {
    const res = await ghFetch(`/repos/${ref.owner}/${ref.repo}/languages`)
    if (!res.ok) return []
    const data = await res.json()
    // Object keys come back ordered by bytes, most-used first.
    return Object.keys(data).slice(0, 8)
  } catch {
    return []
  }
}

/** The homepage field is often bare ("example.com") or blank. */
function normaliseHomepage(homepage: string | null): string {
  const value = homepage?.trim()
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  return `https://${value}`
}
