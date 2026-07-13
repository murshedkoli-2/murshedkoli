# PRD — murshedkoli.com v3 ("The Blueprint")

**Owner:** Murshed Al Main · **Builder:** Solo + AI coding agents (Claude Code / Antigravity)
**Goal:** A portfolio that convinces an employer in 30 seconds that Murshed plans, specs, and ships real products — with a dashboard that makes updating content take under 1 minute.

---

## 1. Problems with v2 (current site)

1. **All content is fetched client-side.** First paint shows "0+ Projects", "Loading...", "Loading projects...". Recruiters and crawlers see an empty site. This is the #1 issue.
2. Name inconsistency: "Morshed Koli" (nav) vs "Murshed Al Main" (hero) vs "Murshed Koli" (metadata).
3. Positioning mismatch: headline says MERN, core-stack section says AI/ML.
4. 60 unproven skill badges; no case studies; no outcomes.
5. Broken footer text; incomplete sections.
6. Dashboard is basic and buggy; no image handling, no ordering, no draft/publish states.

## 2. Non-negotiable requirements

- **R1 — Server-rendered content.** Every public page is SSG/ISR. Zero "Loading..." states on public pages. Data revalidated on-demand when the dashboard saves (`revalidatePath`/`revalidateTag`).
- **R2 — One identity.** "Murshed Al Main" everywhere. Nav logo, metadata, OG image, resume filename.
- **R3 — One story.** Positioning: *"Full-stack developer who plans, specs, and ships AI-integrated products."*
- **R4 — Proof over claims.** Every featured project has: problem, stack, role, one-line outcome, and links. Skills reference the projects that use them.
- **R5 — Dashboard is trustworthy.** Draft/publish, drag-to-reorder, image upload with preview, autosave, and a "profile completeness" checker.
- **R6 — Lighthouse ≥ 95** on Performance, SEO, Accessibility, Best Practices (mobile).

## 3. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router, RSC) | SSG + ISR + Server Actions |
| Language | TypeScript (strict) | |
| DB | MongoDB Atlas (existing) + Mongoose | Migrate existing collections; write a one-off migration script |
| Auth (dashboard) | Auth.js v5, credentials + single admin user | Middleware-protected `/admin` |
| Images | Cloudinary (or UploadThing) | Never hotlink ibb.co; `next/image` everywhere |
| Styling | Tailwind CSS v4 + CSS variables from design tokens | |
| Email (contact form) | Resend (or Nodemailer + Gmail SMTP) | Also store message in DB |
| Animation | Framer Motion — sparse | Respect `prefers-reduced-motion` |
| Deploy | Vercel | Old site stays live until v3 ships |

## 4. Design system ("The Blueprint")

Concept: the site looks like an engineer's technical drawing — because Murshed's real workflow is blueprint-driven (PRDs → agent prompts → shipped product).

**Tokens**
- `--ink: #0B1C30` (drafting blue, page bg) · `--ink-2: #0F2440` (surface)
- `--paper: #E8F0F7` (text) · `--muted: #8FA9C4`
- `--amber: #F2B33D` (accent — CTAs, eyebrows, numbers) · `--shipped: #63D6A3` (status)
- Grid background: 56px faint grid lines `rgba(146,180,215,.14)` via CSS gradients
- Borders: 1px `rgba(146,180,215,.32)`; **no border-radius on public site** (technical drawing feel)

**Type**
- Display: `Archivo` (weight 750–850, slightly expanded width) — headings, big numbers
- Body: `Inter` 400/500
- Utility: `IBM Plex Mono` — labels, eyebrows, spec metadata, buttons (uppercase, letter-spaced)

**Signature elements**
1. **Hero title block** — bordered grid like an engineering drawing's title block: sheet/rev label, live "AVAILABLE FOR WORK" status, headline, stats in footer cells.
2. **Project spec sheets** — numbered (01, 02…), status line (● SHIPPED · IN PRODUCTION), and a spec row: STACK / ROLE / OUTCOME.
3. **Skills with proof** — each skill shows which project numbers use it (→ 01, 03).

**Dashboard design** — deliberately different: light utilitarian admin (bg `#F5F7FA`, white panels, 12px radius, dark-blue sidebar with amber active state). Optimized for speed of editing, not show.

## 5. Data models (Mongoose)

```
Project {
  title, slug (unique), summary (≤160 chars), problem, solution,
  outcome (one line, required for publish), stack: string[],
  role, status: 'draft'|'published', featured: boolean, order: number,
  links: { live?, github?, caseStudy? }, coverImage, gallery: string[],
  content (MDX/rich text for case study), createdAt, updatedAt
}
Skill { name, category: 'frontend'|'backend'|'ai-workflow'|'tools',
        projectRefs: ObjectId[], order, visible }
Certificate { title, issuer, issueDate, credentialId?, verifyUrl?, fileUrl?, order, visible }
Experience { role, company, start, end?, current, bullets: string[], order }
Education { degree, institution, field, start, end, order }
Profile (singleton) { name, headline, subheadline, email, phone, location,
        socials{}, resumeUrl, resumeUpdatedAt, availability: boolean, avatarUrl,
        seo { title, description, ogImage } }
Message { name, email, subject, body, read, flaggedAsJob, createdAt }
```

**Migration:** one-off script `scripts/migrate.ts` reads old collections, maps fields, backfills `slug`, `order`, `status:'published'`, and reports items missing `outcome`.

## 6. Public site — pages

### `/` (single scrolling page)
1. **Nav** — sticky, logo `MURSHED.AL MAIN`, links, amber `RESUME.PDF ↓` button (direct file download, filename `Murshed-Al-Main-Resume.pdf`).
2. **Hero title block** (see design system). Stats pulled from DB at build time — never zero.
3. **Project spec sheets** — featured projects (max 4), each linking to case study.
4. **Skills with proof** — 3 columns (Frontend / Backend & Data / AI & Workflow), max ~15 visible skills.
5. **Experience & Education** — compact timeline rows.
6. **Certificates** — cards with issuer, date, credential ID, VERIFY link (opens PDF or verification URL).
7. **Contact** — form (Server Action → DB + email notification) + direct contact metadata. Success/failure states inline; honeypot + rate limit for spam.
8. **Footer** — complete, correct.

### `/projects` — all published projects (spec-sheet list).
### `/projects/[slug]` — case study page: problem → approach → stack decisions → outcome → gallery. Generated with `generateStaticParams`. This is what separates Murshed from badge-wall portfolios.
### `/resume` — optional: embedded PDF viewer + download button.

**SEO:** per-page `generateMetadata`, OG images (static template with name/role), sitemap.xml, robots.txt, JSON-LD `Person` + `CreativeWork` for projects, canonical URLs. All text server-rendered.

## 7. Dashboard — `/admin`

**Layout:** dark-blue sidebar (Content: Projects, Skills, Certificates, Experience, About & Hero, Resume File · Inbox: Messages · System: SEO & Metadata, Settings), light main area.

**Dashboard home ("Health strip"):**
- Site status (last deploy/revalidation)
- **Profile completeness %** — checks: every published project has outcome + cover image; resume < 6 months old; ≤ 16 visible skills; certificates have verify links. Shows warning banner with "Fix now" deep links.
- Unread messages count
- Resume file card (replace in one click)

**Projects manager:**
- Table: thumbnail, title, stack, status pills (Live/Draft/Featured), completeness check, actions
- Drag-to-reorder (persists `order`; triggers revalidation)
- Editor: form with live slug preview, image upload w/ crop preview, stack tag input, MDX case-study editor with preview, **autosave drafts**, publish button disabled until required fields (incl. outcome) present
- Delete requires typed confirmation

**Skills manager:** grouped by category, drag-to-reorder, multi-select project references, visibility toggle. Hard cap warning above 16 visible.

**Certificates:** upload PDF/image, verify URL, reorder.

**Resume:** upload new PDF → replaces `/resume` file + updates `resumeUpdatedAt`; keeps last 3 versions.

**Messages inbox:** list, read/unread, "job inquiry" flag, reply via mailto.

**About & Hero editor:** headline, subheadline, availability toggle (drives the green status dot), avatar upload, socials.

**Every save** calls `revalidateTag()` so the public site updates instantly — no redeploys.

**Auth:** single admin credential in env vars; middleware guards `/admin/*`; rate-limited login; session via Auth.js.

## 8. Quality gates (agent must verify before finishing each phase)

- `npm run build` passes with zero TS errors
- View-source of `/` contains real project titles and stats (proves SSR)
- No layout shift on load (CLS ≈ 0); no "Loading…" text anywhere public
- Mobile 375px layout verified for every section
- Keyboard focus visible; reduced motion respected
- Lighthouse mobile ≥ 95 across the board

---

## 9. Sequential build prompts for AI agents

Run in order. Each prompt assumes the previous phase is complete and committed.

### Prompt 1 — Scaffold & design system
> Create a Next.js 15 (App Router) + TypeScript (strict) + Tailwind v4 project named `portfolio-v3`. Add Google Fonts: Archivo (600–850, variable width), Inter (400–600), IBM Plex Mono (400–500) via `next/font`. Define CSS variables in globals.css exactly: --ink:#0B1C30, --ink-2:#0F2440, --paper:#E8F0F7, --muted:#8FA9C4, --amber:#F2B33D, --shipped:#63D6A3, border color rgba(146,180,215,.32), plus a body background 56px grid using two linear-gradients of rgba(146,180,215,.14). Public site uses NO border-radius. Build shared components: Container (max-w 1120px), SectionHeading (mono amber uppercase eyebrow prefixed with "//" + Archivo heading), MonoLabel, Button (variants: primary amber / ghost bordered, IBM Plex Mono uppercase). Create the sticky nav with logo "MURSHED.AL MAIN" (amber dot) and a RESUME.PDF ↓ button. Commit.

### Prompt 2 — Data layer & migration
> Add Mongoose with models exactly as specified in section 5 of the attached PRD (paste section 5). Create a typed data-access layer in `lib/data/` with functions: getProfile, getFeaturedProjects, getAllPublishedProjects, getProjectBySlug, getSkillsGrouped, getCertificates, getExperience, getEducation — all used only from server components, each wrapped with `unstable_cache` and cache tags ('profile','projects','skills','certs','experience'). Write `scripts/migrate.ts` that connects to the existing database (env: OLD_MONGODB_URI, NEW_MONGODB_URI), maps old documents to the new schemas, backfills slug/order/status, and prints a report of published projects missing `outcome` or `coverImage`. Do not run it destructively; it writes to the new DB only. Commit.

### Prompt 3 — Public homepage (server-rendered)
> Build the `/` page as a fully server-rendered single scrolling page per PRD section 6, using the design system from Prompt 1. Sections: (1) Hero title block: a bordered grid — top row with "SHEET / PORTFOLIO / REV 3.0" cell and "STATUS / ● AVAILABLE FOR WORK" cell (green dot, driven by profile.availability); main cell with Archivo 850 headline "Full-stack developer who *plans, specs, and ships* AI-integrated products." (amber emphasis), subheadline from DB, two CTAs; footer row of 4 stat cells computed from real DB counts. (2) Featured Project Spec Sheets: numbered 01/02/03 in amber Archivo 850, status line "● SHIPPED · IN PRODUCTION", title, summary, spec row STACK/ROLE/OUTCOME in mono, links row. (3) Skills With Proof: 3 columns by category, each skill row shows "→ 01, 03" project references. (4) Experience & Education compact rows. (5) Certificates grid with VERIFY links. (6) Contact section (form UI only for now) + metadata column. (7) Complete footer: "© 2026 MURSHED AL MAIN" / "DRAWN & BUILT WITH NEXT.JS — REV 3.0". CRITICAL: zero client-side data fetching; view-source must contain all content. Verify no "Loading" text exists anywhere. Responsive to 375px. Commit.

### Prompt 4 — Case studies & projects index
> Build `/projects` (all published projects as spec sheets) and `/projects/[slug]` case study pages with generateStaticParams. Case study layout: title block header (project number, status, stack), then sections Problem → Approach → Stack Decisions → Outcome → Gallery (next/image), then prev/next project links. MDX or rich-text content rendered server-side. Add generateMetadata for both routes with OG tags. Commit.

### Prompt 5 — Contact form & email
> Implement the contact form with a Server Action: validate with zod, honeypot field, simple rate limit by IP (upstash or in-memory LRU), save to Message collection, send notification email via Resend to murshedkoli@gmail.com. Inline success ("Message sent — I reply within 24h") and error states, no toast library. Commit.

### Prompt 6 — Auth & dashboard shell
> Add Auth.js v5 credentials auth for a single admin (ADMIN_EMAIL/ADMIN_PASSWORD_HASH env vars, bcrypt). Middleware protects /admin/*. Build the dashboard shell per PRD section 7 design: light theme (#F5F7FA bg, white panels, #E3E8EF borders, 12px radius), dark-blue (#0B1C30) sidebar with amber active state, groups Content/Inbox/System. Dashboard home shows the health strip: site status, profile completeness % (implement the checker per PRD), unread messages, resume card. Include the amber warning banner with deep links when completeness checks fail. Commit.

### Prompt 7 — Projects manager
> Build /admin/projects: table with thumbnail, title, stack, pills (Live/Draft/Featured), completeness indicator, row actions. Drag-to-reorder with dnd-kit persisting `order` via Server Action, then revalidateTag('projects'). Project editor at /admin/projects/[id]: react-hook-form + zod, live slug preview, Cloudinary image upload with preview, tag input for stack, MDX editor with side-by-side preview, autosave drafts every 10s of inactivity, Publish disabled until title/summary/outcome/coverImage present (show which are missing). Delete requires typing the project title. Every mutation revalidates tags. Commit.

### Prompt 8 — Remaining managers
> Build admin managers for Skills (grouped by category, drag-reorder, project multi-select, visibility toggle, warn above 16 visible), Certificates (PDF/image upload, verify URL, reorder), Experience & Education (CRUD + reorder), About & Hero editor (headline, subheadline, availability toggle, avatar, socials, SEO fields), Resume manager (upload PDF, keep last 3 versions, update resumeUpdatedAt, serve at /Murshed-Al-Main-Resume.pdf), and Messages inbox (read/unread, job-inquiry flag, mailto reply). All mutations revalidate the right cache tags. Commit.

### Prompt 9 — SEO, polish, QA
> Add sitemap.ts, robots.ts, JSON-LD (Person on /, CreativeWork on case studies), canonical URLs, and a static OG image template. Add Framer Motion sparsely: hero title-block cells fade-in staggered on load, spec sheets fade-up on scroll — all disabled under prefers-reduced-motion. Then run the full quality gate from PRD section 8: build passes, view-source check, 375px pass on every section, keyboard focus visible, Lighthouse mobile ≥95 all categories. Fix everything found. Produce a final report of scores. Commit.

### Prompt 10 — Launch
> Run scripts/migrate.ts against production data, review the missing-outcome report, deploy to Vercel with all env vars, verify the live site view-source contains content, point murshedkoli.com DNS to the new deployment, and confirm the old deployment can be removed after 48h of monitoring.

---

## 10. Content homework (only you can do this — agents can't)

1. Write a **one-line outcome** for every project ("cut production time ~60%", "serves daily readers", "3 shops onboarded"). This is the highest-ROI hour you'll spend.
2. Pick **3–4 featured projects** max. Recommended: ServiceDesk SaaS, Muktir Kantho, ANA Studio, +1 mobile (election app).
3. Cut visible skills to ~12–15 with project references.
4. Decide the case-study narrative for each featured project (problem → approach → outcome, 300–500 words).
5. Export a clean resume PDF named `Murshed-Al-Main-Resume.pdf` matching the site's positioning line.
