import type { RepoRef } from './repo-url'

/**
 * Small, deliberate markdown reading — enough to prefill a project form, not a
 * general parser. Everything it returns is a suggestion the user then edits.
 */

/** Lines that are only badges/images carry no prose worth importing. */
const BADGE_ONLY = /^\s*(\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)|!\[[^\]]*\]\([^)]*\)|<img[^>]*>)\s*$/i

const HEADING = /^(#{1,6})\s+(.*)$/
const BULLET = /^\s*[-*+]\s+(.+)$/
const FEATURE_HEADING = /^(key\s+)?features?$|^what\s+it\s+does$|^highlights?$|^capabilities$/i

/** Strips inline markdown so a bullet reads as a plain sentence. */
export function stripInline(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')        // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')      // links -> label
    .replace(/`([^`]+)`/g, '$1')                  // code spans
    .replace(/(\*\*|__)(.*?)\1/g, '$2')           // bold
    .replace(/(\*|_)(.*?)\1/g, '$2')              // italic
    .replace(/<[^>]+>/g, '')                      // stray html
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Drops a leading emoji so "🚀 Fast builds" becomes "Fast builds".
 *
 * Matches surrogate pairs directly rather than using \p{...}, which needs the
 * `u` flag and an ES6+ target — this project compiles to ES5.
 */
function stripLeadingEmoji(text: string): string {
  return text
    .replace(/^(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[←-⯿☀-➿️‍⃣])+\s*/, '')
    .trim()
}

export interface ReadmeFacts {
  title: string | null
  summary: string | null
  features: string[]
  coverImage: string | null
}

export function parseReadme(markdown: string, ref: RepoRef, defaultBranch: string): ReadmeFacts {
  // Fenced code must not be mistaken for headings or bullets.
  const lines: string[] = []
  let inFence = false
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; continue }
    if (!inFence) lines.push(line)
  }

  let title: string | null = null
  let summary: string | null = null
  const features: string[] = []

  // The document's *first* heading is its title — but only if it is an H1.
  // Taking the first H1 anywhere picks up section headings like "# Recipes"
  // in READMEs whose intro uses H2s.
  for (const line of lines) {
    const h = line.match(HEADING)
    if (!h) continue
    if (h[1].length === 1) {
      const text = stripLeadingEmoji(stripInline(h[2]))
      if (text && text.length <= 80) title = text
    }
    break
  }

  // First real paragraph — skipping headings, badges, blockquotes and lists.
  const paragraph: string[] = []
  let started = false
  for (const line of lines) {
    if (HEADING.test(line)) { if (started) break; continue }
    if (BADGE_ONLY.test(line)) continue
    if (/^\s*>/.test(line)) continue
    if (BULLET.test(line)) { if (started) break; continue }
    if (!line.trim()) { if (started) break; continue }
    paragraph.push(line.trim())
    started = true
  }
  if (paragraph.length) {
    const text = stripInline(paragraph.join(' '))
    if (text) summary = text.length > 400 ? `${text.slice(0, 397).trimEnd()}…` : text
  }

  // Bullets under the first heading that looks like a feature list.
  let capturing = false
  for (const line of lines) {
    const h = line.match(HEADING)
    if (h) {
      const heading = stripLeadingEmoji(stripInline(h[2]))
      capturing = FEATURE_HEADING.test(heading)
      continue
    }
    if (!capturing) continue
    const b = line.match(BULLET)
    if (b) {
      // "**Name** — detail" reads better as just the name.
      const bold = b[1].match(/^\s*(?:\*\*|__)(.+?)(?:\*\*|__)\s*[:—–-]?\s*(.*)$/)
      const text = stripLeadingEmoji(stripInline(bold ? bold[1] : b[1]))
      if (text && text.length <= 120) features.push(text)
      if (features.length >= 25) break
    }
  }

  return { title, summary, features, coverImage: findCoverImage(lines, ref, defaultBranch) }
}

/** First image in the README that is not a badge, resolved to an absolute URL. */
function findCoverImage(lines: string[], ref: RepoRef, defaultBranch: string): string | null {
  for (const line of lines) {
    const md = line.match(/!\[[^\]]*\]\(([^)\s]+)/)
    const html = line.match(/<img[^>]+src=["']([^"']+)["']/i)
    const src = md?.[1] ?? html?.[1]
    if (!src) continue

    // Shields/badges are decoration, never a cover.
    if (/shields\.io|badge|travis-ci|circleci|codecov|coveralls|app\.netlify\.com/i.test(src)) continue

    if (/^https?:\/\//i.test(src)) return src
    if (src.startsWith('data:')) continue

    const clean = src.replace(/^\.?\//, '')
    return `https://raw.githubusercontent.com/${ref.owner}/${ref.repo}/${defaultBranch}/${clean}`
  }
  return null
}

// ── Tech detection ─────────────────────────────────────────────────────────

type Category = 'frontend' | 'backend' | 'database' | 'devops' | 'ai' | 'other'

/** Name as it should be stored, matched case-insensitively as a whole word. */
const TECH: [name: string, category: Category, pattern?: RegExp][] = [
  ['React', 'frontend'], ['Next.js', 'frontend', /next\.?js/i], ['Vue.js', 'frontend', /vue\.?js|vuejs/i],
  ['Angular', 'frontend'], ['Svelte', 'frontend'], ['Tailwind CSS', 'frontend', /tailwind/i],
  ['TypeScript', 'frontend'], ['JavaScript', 'frontend'], ['Sass', 'frontend', /\bsass\b|\bscss\b/i],
  ['Redux', 'frontend'], ['Vite', 'frontend'], ['Flutter', 'frontend'], ['React Native', 'frontend', /react[\s-]native/i],
  ['Node.js', 'backend', /node\.?js/i], ['Express', 'backend', /express(\.js)?/i], ['NestJS', 'backend', /nest\.?js/i],
  ['Django', 'backend'], ['FastAPI', 'backend'], ['Flask', 'backend'], ['Spring Boot', 'backend', /spring[\s-]boot/i],
  ['Laravel', 'backend'], ['Rails', 'backend', /ruby[\s-]on[\s-]rails|\brails\b/i], ['Go', 'backend', /\bgolang\b/i],
  ['Rust', 'backend'], ['GraphQL', 'backend'], ['tRPC', 'backend', /\btrpc\b/i],
  ['MongoDB', 'database'], ['PostgreSQL', 'database', /postgres(ql)?/i], ['MySQL', 'database'],
  ['Redis', 'database'], ['SQLite', 'database'], ['Prisma', 'database'], ['Supabase', 'database'],
  ['Firebase', 'database'], ['Drizzle', 'database'],
  ['Docker', 'devops'], ['Kubernetes', 'devops', /kubernetes|\bk8s\b/i], ['AWS', 'devops'],
  ['Vercel', 'devops'], ['GitHub Actions', 'devops', /github[\s-]actions/i], ['Nginx', 'devops'],
  ['Terraform', 'devops'], ['Netlify', 'devops'],
  ['OpenAI', 'ai'], ['LangChain', 'ai', /lang[\s-]?chain/i], ['TensorFlow', 'ai', /tensor[\s-]?flow/i],
  ['PyTorch', 'ai', /py[\s-]?torch/i], ['Hugging Face', 'ai', /hugging[\s-]?face/i], ['Anthropic', 'ai'],
  ['Stripe', 'other'], ['Socket.io', 'other', /socket\.?io/i], ['JWT', 'other'], ['OAuth', 'other'],
]

/** GitHub's language stats are authoritative; map the ones we categorise. */
const LANGUAGE_CATEGORY: Record<string, Category> = {
  TypeScript: 'frontend', JavaScript: 'frontend', HTML: 'frontend', CSS: 'frontend', SCSS: 'frontend',
  Vue: 'frontend', Svelte: 'frontend', Dart: 'frontend', Swift: 'frontend', 'Objective-C': 'frontend',
  Python: 'backend', Go: 'backend', Rust: 'backend', Java: 'backend', Kotlin: 'backend',
  Ruby: 'backend', PHP: 'backend', 'C#': 'backend', C: 'backend', 'C++': 'backend', Elixir: 'backend',
  Shell: 'devops', Dockerfile: 'devops', HCL: 'devops', Makefile: 'devops',
  PLpgSQL: 'database', SQL: 'database',
}

export interface DetectedTech {
  name: string
  category: Category
}

/**
 * Union of GitHub's language stats, repo topics, and names mentioned in the
 * README — deduplicated case-insensitively, first spelling wins.
 */
export function detectTech(readme: string, languages: string[], topics: string[]): DetectedTech[] {
  const found = new Map<string, DetectedTech>()
  const add = (name: string, category: Category) => {
    const key = name.toLowerCase()
    if (!found.has(key)) found.set(key, { name, category })
  }

  for (const lang of languages) {
    add(lang, LANGUAGE_CATEGORY[lang] ?? 'other')
  }

  const haystack = `${readme}\n${topics.join('\n')}`
  for (const [name, category, pattern] of TECH) {
    const re = pattern ?? new RegExp(`(^|[^a-z0-9])${escapeRegex(name)}([^a-z0-9]|$)`, 'i')
    if (re.test(haystack)) add(name, category)
  }

  return Array.from(found.values()).slice(0, 30)
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** "aurora-ledger" -> "Aurora Ledger" */
export function prettifyRepoName(repo: string): string {
  return repo
    .replace(/[-_.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(w => (w.length <= 3 && w === w.toUpperCase() ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}
