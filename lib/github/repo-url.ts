/**
 * Strict owner/repo extraction.
 *
 * The caller never fetches a user-supplied URL — it extracts these two segments
 * and builds the api.github.com URL itself. That is what keeps this endpoint
 * from becoming an SSRF pivot.
 */

/** GitHub's own rules: 1-39 chars, alphanumeric or hyphen, no leading/trailing hyphen. */
const OWNER = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/
/** Repo names additionally allow dot and underscore. */
const REPO = /^[a-zA-Z0-9._-]{1,100}$/

export interface RepoRef {
  owner: string
  repo: string
}

/**
 * Accepts the forms people actually paste:
 *   https://github.com/owner/repo            github.com/owner/repo
 *   https://github.com/owner/repo.git        git@github.com:owner/repo.git
 *   https://github.com/owner/repo/tree/main  owner/repo
 */
export function parseRepoUrl(input: string): RepoRef | null {
  const raw = input.trim()
  if (!raw) return null

  let path: string

  const sshMatch = raw.match(/^git@github\.com:(.+)$/i)
  if (sshMatch) {
    path = sshMatch[1]
  } else if (/^[a-z]+:\/\//i.test(raw) || /^(www\.)?github\.com\//i.test(raw)) {
    let url: URL
    try {
      url = new URL(/^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`)
    } catch {
      return null
    }
    // Only github.com. Not a subdomain-suffix match — "evilgithub.com" must fail.
    const host = url.hostname.toLowerCase()
    if (host !== 'github.com' && host !== 'www.github.com') return null
    path = url.pathname
  } else {
    // Bare "owner/repo".
    path = raw
  }

  const segments = path.replace(/^\/+/, '').split('/')
  if (segments.length < 2) return null

  const owner = segments[0]
  const repo = segments[1].replace(/\.git$/i, '')

  if (!OWNER.test(owner)) return null
  if (!REPO.test(repo)) return null
  // ".." would be caught by REPO's charset only if it also passed length; guard anyway.
  if (repo === '.' || repo === '..') return null

  return { owner, repo }
}

/** Canonical browse URL, rebuilt from validated parts. */
export function repoHtmlUrl({ owner, repo }: RepoRef): string {
  return `https://github.com/${owner}/${repo}`
}
