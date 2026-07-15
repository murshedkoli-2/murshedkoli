# Portfolio Soft-Luxury Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dark "Blueprint" portfolio with a soft light-luxury, animated, dual-theme design across all public pages and the admin dashboard, add a Services feature, and harden performance and security.

**Architecture:** Next.js 16 App Router, server components for data + small client islands for interactivity. A CSS-variable design-token system drives light/dark themes swapped via `data-theme` on `<html>`. Framer Motion powers a shared `Reveal` primitive and hero motion. New public UI lives under `components/site/*`; the old `components/blueprint/*` is removed once superseded. Backend Prisma models are retained; one new `Service` model is added.

**Tech Stack:** Next.js 16, React 18, TypeScript, Tailwind CSS 3, Framer Motion 10, Prisma + MongoDB, `next/font` (Fraunces + Inter), lucide-react, Zod.

## Global Constraints

- Design tokens are the ONLY source of color/type/spacing. No hardcoded hex in components — use CSS variables (`var(--accent)`, etc.) or Tailwind classes mapped to them.
- Both light and dark themes must be styled for every surface. Default theme is light.
- All motion must respect `prefers-reduced-motion` (collapse to instant, no infinite animations).
- All images use `next/image` with explicit `width`/`height` or `fill`+`sizes`. Hero image only gets `priority`.
- Public data pages stay server-rendered; add `'use client'` only to interactive islands.
- Every mutating API route (`POST`/`PUT`/`PATCH`/`DELETE`) MUST verify the admin session before writing.
- All API write bodies validated with Zod before touching the database.
- Fonts: Fraunces (display/serif) + Inter (body). No mono on public surfaces.
- Node/dep floors unchanged (Next 16, React 18). Do not upgrade framework majors.
- Commit after each task with a conventional-commit message (`feat:`/`refactor:`/`chore:`/`perf:`).

**Verification note:** This is a visual redesign. For UI tasks the "test" is browser verification via the Browser pane (`preview_start` → `read_page`/`screenshot`/`read_console_messages`), checking both themes and at 375/768/1440 widths, plus a clean `npm run build`. Backend tasks (Service model/API, security) get real assertions where practical.

---

## File Structure

**New (public site):**
- `lib/theme.ts` — theme constants + no-flash inline script string.
- `components/site/ThemeProvider.tsx` — client theme context + toggle logic (localStorage).
- `components/site/ThemeToggle.tsx` — animated sun/moon toggle island.
- `components/site/Reveal.tsx` — Framer Motion scroll-reveal wrapper (respects reduced motion).
- `components/site/ui/Button.tsx`, `Section.tsx`, `Eyebrow.tsx`, `Card.tsx`, `Container.tsx`, `TechTag.tsx` — primitives.
- `components/site/Nav.tsx`, `Footer.tsx` — chrome.
- `components/site/home/Hero.tsx`, `AboutTeaser.tsx`, `ServicesSection.tsx`, `FeaturedProjects.tsx`, `SkillsSection.tsx`, `TimelineSection.tsx`, `CertificatesSection.tsx`, `ContactSection.tsx`, `ContactForm.tsx` — home sections.
- `components/site/projects/ProjectCard.tsx`, `ProjectsGrid.tsx` (client filter), `ProjectGallery.tsx` (client lightbox) — projects.
- `app/projects/page.tsx` — projects index.
- `app/about/page.tsx` — about page.
- `app/styles/tokens.css` — design tokens (imported by `globals.css`).

**New (services feature):**
- `prisma/schema.prisma` — add `Service` model.
- `lib/validations/service.ts` — Zod schemas.
- `app/api/services/route.ts`, `app/api/services/[id]/route.ts` — CRUD.
- `lib/data/portfolio.ts` — add `getServices()`.
- `app/admin/services/page.tsx` — admin CRUD page.

**New (security):**
- `lib/auth/require-admin.ts` — shared route-handler auth guard.
- `lib/rate-limit.ts` — lightweight in-memory limiter.

**Modified:**
- `app/globals.css` — strip Blueprint CSS, import tokens, add base + primitives styles.
- `app/layout.tsx` — swap fonts (Fraunces), inject no-flash script, wrap `ThemeProvider`, drop `theme-dark` class.
- `app/page.tsx` — rebuild home from new sections.
- `app/projects/[slug]/page.tsx` + detail component — restyle minimal/visual.
- `components/admin/AdminShell.tsx` + `app/admin/admin.css` — restyle + add Services/Dashboard nav + theme toggle.
- `components/admin/project-editor/*` — remove Flow/Api/Database/Modules tabs.
- `next.config.js` — security headers + image `remotePatterns` for Cloudinary/S3.
- Mutating API routes under `app/api/*` — add auth guard + Zod.

**Removed (after superseded):**
- `components/blueprint/*`, `components/ParticleBackground.tsx`, `components/flow/FlowBuilder.tsx`, `app/projects/[slug]/ProjectDetailBlueprint.tsx`, unused legacy `components/Hero.tsx`, `Projects.tsx`, `Skills.tsx`, etc. (verify no imports first).
- Deps: `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`, `@xyflow/react`.

---

## Phase 1 — Design system foundation

### Task 1: Design tokens (light + dark)

**Files:**
- Create: `app/styles/tokens.css`
- Modify: `app/globals.css`

- [ ] **Step 1: Write `app/styles/tokens.css`**

```css
/* Design tokens — soft luxury. Light is default; dark overrides under [data-theme="dark"]. */
:root,
:root[data-theme="light"] {
  --canvas: oklch(97% 0.012 85);
  --surface: oklch(99% 0.008 85);
  --surface-2: oklch(95% 0.014 85);
  --ink: oklch(26% 0.02 60);
  --ink-muted: oklch(50% 0.02 60);
  --line: oklch(89% 0.012 85);
  --accent: oklch(64% 0.07 155);
  --accent-ink: oklch(99% 0.01 155);   /* text on accent */
  --accent-2: oklch(70% 0.09 45);
  --accent-3: oklch(72% 0.06 290);
  --shadow-sm: 0 1px 2px oklch(26% 0.02 60 / 0.06), 0 2px 8px oklch(26% 0.02 60 / 0.05);
  --shadow-md: 0 4px 12px oklch(26% 0.02 60 / 0.08), 0 12px 32px oklch(26% 0.02 60 / 0.07);

  --font-display: var(--font-fraunces), Georgia, serif;
  --font-body: var(--font-inter), system-ui, sans-serif;

  --text-hero: clamp(2.75rem, 1.2rem + 6vw, 6rem);
  --text-h2: clamp(2rem, 1.2rem + 2.6vw, 3.25rem);
  --text-h3: clamp(1.25rem, 1rem + 1vw, 1.6rem);
  --text-body: clamp(1rem, 0.96rem + 0.2vw, 1.125rem);
  --text-eyebrow: 0.78rem;

  --space-section: clamp(4.5rem, 3rem + 6vw, 9rem);
  --radius: 18px;
  --radius-sm: 10px;
  --container: 1200px;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

:root[data-theme="dark"] {
  --canvas: oklch(22% 0.012 60);
  --surface: oklch(26% 0.014 60);
  --surface-2: oklch(30% 0.016 60);
  --ink: oklch(92% 0.01 85);
  --ink-muted: oklch(70% 0.015 85);
  --line: oklch(34% 0.014 60);
  --accent: oklch(72% 0.08 155);
  --accent-ink: oklch(20% 0.02 155);
  --accent-2: oklch(76% 0.10 45);
  --accent-3: oklch(78% 0.07 290);
  --shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.3), 0 2px 8px oklch(0% 0 0 / 0.25);
  --shadow-md: 0 4px 14px oklch(0% 0 0 / 0.35), 0 14px 40px oklch(0% 0 0 / 0.3);
}
```

- [ ] **Step 2: Replace `app/globals.css`** — remove ALL Blueprint (`.bp-*`, `.blueprint-page`) and legacy `theme-light`/`glass` CSS. New file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
@import './styles/tokens.css';

* { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }
html.no-motion { scroll-behavior: auto; }

body {
  background: var(--canvas);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  transition: background 400ms var(--ease), color 400ms var(--ease);
  overflow-x: hidden;
}

h1, h2, h3 { font-family: var(--font-display); font-weight: 600; line-height: 1.05; letter-spacing: -0.02em; }
a { color: inherit; text-decoration: none; }
::selection { background: var(--accent); color: var(--accent-ink); }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 4px; }

::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-thumb { background: var(--line); border-radius: 6px; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build`
Expected: build succeeds (home will look unstyled/broken until later tasks — that is OK; only check for CSS/compile errors, not visuals).

- [ ] **Step 4: Commit**

```bash
git add app/styles/tokens.css app/globals.css
git commit -m "feat: add soft-luxury design tokens, strip blueprint css"
```

### Task 2: Fonts + no-flash theme script + ThemeProvider

**Files:**
- Create: `lib/theme.ts`, `components/site/ThemeProvider.tsx`, `components/site/ThemeToggle.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `useTheme(): { theme: 'light'|'dark'; toggle: () => void }` from `ThemeProvider`.
- Produces: `THEME_STORAGE_KEY = 'portfolio-theme'`, `themeInitScript: string` from `lib/theme.ts`.

- [ ] **Step 1: Write `lib/theme.ts`**

```ts
export const THEME_STORAGE_KEY = 'portfolio-theme'

/** Runs before paint to set data-theme and avoid a flash of the wrong theme. */
export const themeInitScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var s=localStorage.getItem(k);var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s==='light'||s==='dark'?s:(m?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`
```

- [ ] **Step 2: Write `components/site/ThemeProvider.tsx`** — `'use client'`; context holding `theme`, initialised from the `data-theme` attribute the script set; `toggle()` flips it, writes `localStorage`, sets `document.documentElement.dataset.theme`. Expose `useTheme()`.

- [ ] **Step 3: Write `components/site/ThemeToggle.tsx`** — `'use client'`; button using `useTheme()`, renders lucide `Sun`/`Moon` with a Framer Motion cross-fade/rotate, `aria-label` reflecting the next theme.

- [ ] **Step 4: Modify `app/layout.tsx`** — replace `Archivo/IBM_Plex_Mono` imports with `Fraunces` (weights 400,500,600; `variable: '--font-fraunces'`); keep `Inter` as `--font-inter`. Remove `className="theme-dark"` from `<html>`; add `suppressHydrationWarning`. In `<head>`, add `<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />`. Wrap `{children}` in `<ThemeProvider>`. Keep JSON-LD.

- [ ] **Step 5: Verify no-flash + toggle**

Run: `preview_start {name:"dev"}` (create `.claude/launch.json` with `npm run dev`, port 3000 if absent) → navigate to `/` → `read_console_messages` (no errors) → confirm `document.documentElement.dataset.theme` is set via `javascript_tool`. Toggle via a temporary render is not required yet; just confirm no hydration warning.
Expected: `data-theme` present on `<html>`; no console errors.

- [ ] **Step 6: Commit**

```bash
git add lib/theme.ts components/site/ThemeProvider.tsx components/site/ThemeToggle.tsx app/layout.tsx
git commit -m "feat: fonts (fraunces+inter), no-flash theme script, theme provider/toggle"
```

### Task 3: Reveal motion primitive

**Files:** Create: `components/site/Reveal.tsx`

**Interfaces:**
- Produces: `<Reveal delay?: number; y?: number; as?: keyof JSX.IntrinsicElements>` and `<RevealGroup stagger?: number>` for staggered children.

- [ ] **Step 1: Implement** `'use client'` with Framer Motion `motion.div`, `whileInView` (`opacity 0→1`, `y 24→0`), `viewport={{ once: true, margin: '-10%' }}`, transition `{ duration: 0.6, ease: [0.16,1,0.3,1], delay }`. Use `useReducedMotion()` → when true, render children with no animation. `RevealGroup` sets `variants` container with `staggerChildren`.
- [ ] **Step 2: Verify** it imports cleanly: `npm run build` succeeds.
- [ ] **Step 3: Commit** `git commit -am "feat: add Reveal scroll-motion primitive"`

---

## Phase 2 — Shared UI primitives

### Task 4: UI primitives (Container, Section, Eyebrow, Button, Card, TechTag)

**Files:** Create under `components/site/ui/`: `Container.tsx`, `Section.tsx`, `Eyebrow.tsx`, `Button.tsx`, `Card.tsx`, `TechTag.tsx`

**Interfaces (Produces):**
- `Container`: `max-width: var(--container)`, inline padding, centered.
- `Section({ id, eyebrow?, title?, children })`: vertical rhythm `padding-block: var(--space-section)`.
- `Eyebrow({ children })`: uppercase, letter-spaced, `--accent` color, `--text-eyebrow`.
- `Button({ href?, variant: 'primary'|'ghost', size?, children, ...})`: renders `Link` or `button`; primary = `--accent` bg + `--accent-ink`; ghost = transparent + `--line` border; soft hover (translateY + shadow) via Framer Motion `whileHover`/`whileTap`; radius `--radius-sm`.
- `Card({ children, interactive? })`: `--surface` bg, `--line` border, `--radius`, `--shadow-sm`; interactive adds hover lift to `--shadow-md`.
- `TechTag({ label })`: pill, `--surface-2` bg, `--ink-muted`, small.

- [ ] **Step 1:** Implement all six as small focused files, tokens only, no hardcoded color.
- [ ] **Step 2: Verify** `npm run build` succeeds.
- [ ] **Step 3: Commit** `git commit -am "feat: add site UI primitives (button, card, section, etc.)"`

### Task 5: Nav + Footer

**Files:** Create `components/site/Nav.tsx`, `components/site/Footer.tsx`

**Interfaces (Consumes):** `PublicProfile` from `lib/site-data.ts`. Props: `Nav({ resumeUrl?, name })`, `Footer({ name, socialLinks?, email })`.

- [ ] **Step 1: Nav** `'use client'`: sticky top; transparent → `--surface`/blur with `--shadow-sm` after scroll (scroll listener + `useState`); left = name/logo (serif); center/right = anchor links (`#about`, `#services`, `#projects`, `#experience`, `#contact`) + `/projects`; right = `ThemeToggle` + resume `Button`. Mobile: hamburger → slide-in panel (Framer Motion), links close on click. `aria-label="Main navigation"`, semantic `<header><nav>`.
- [ ] **Step 2: Footer** server component: `<footer>` with name, quick links, social icons (lucide) from `socialLinks`, email mailto, year, subtle top border `--line`.
- [ ] **Step 3: Verify** rendered in isolation once Home exists (Task 15). For now `npm run build` succeeds.
- [ ] **Step 4: Commit** `git commit -am "feat: add site Nav and Footer"`

---

## Phase 3 — Home page

> Each home-section task: build component, wire into `app/page.tsx`, verify in browser (both themes, 375/1440), commit. `app/page.tsx` becomes a server component using `getHomePageData()` + `getServices()` (Task 18 adds services; until then pass `[]`).

### Task 6: Rebuild `app/page.tsx` shell + Hero

**Files:** Modify `app/page.tsx`; Create `components/site/home/Hero.tsx`, `components/site/home/HeroBackdrop.tsx`

**Interfaces (Consumes):** `getHomePageData()` returns `{ profile, skills, experiences, education, certifications, projects }` (see `lib/site-data.ts`). `Hero({ profile, stats? })`.

- [ ] **Step 1: `app/page.tsx`** — server component: fetch `getHomePageData()`; render `<Nav>`, `<main>` with `<Hero>` only for now, `<Footer>`. Remove all `blueprint/*` imports and `ProjectModalProvider`. Keep `personJsonLd`.
- [ ] **Step 2: `HeroBackdrop.tsx`** — absolutely-positioned soft blurred gradient blobs (3 divs: `--accent`/`--accent-2`/`--accent-3` radial, `filter: blur(80px)`, low opacity), slow CSS `@keyframes` drift; wrapped so reduced-motion disables animation. Pure CSS, no WebGL.
- [ ] **Step 3: `Hero.tsx`** — `'use client'` (for entrance motion + parallax): two-column on desktop (text left, hero image right), stacked on mobile. Left: `Eyebrow` (profile.title), animated `<h1>` (profile.name) with word-stagger via Framer Motion, sub (profile.description, truncated), primary Button `#projects` + ghost Button resume/`#contact`, optional stat row. Right: `next/image` portrait from `profile.heroImage || profile.avatar` (fallback placeholder), `priority`, rounded `--radius`, `--shadow-md`, subtle parallax on scroll via `useScroll`/`useTransform`. Include `<HeroBackdrop />`.
- [ ] **Step 4: Verify** `preview_start` → `/` → screenshot both themes at 1440 + 375; `read_console_messages` clean; confirm no horizontal overflow (`document.body.scrollWidth <= window.innerWidth`).
- [ ] **Step 5: Commit** `git commit -am "feat: rebuild home shell + hero with image and soft backdrop"`

### Task 7: About teaser section

**Files:** Create `components/site/home/AboutTeaser.tsx`; wire into `app/page.tsx`.
- [ ] **Step 1:** Server component; `Section id="about"`; `Eyebrow`, short heading, `profile.description` (full), `Button href="/about"` "More about me". Wrap content in `Reveal`.
- [ ] **Step 2: Verify** in browser (both themes). **Step 3: Commit** `git commit -am "feat: add about teaser section"`

### Task 8: Skills section

**Files:** Create `components/site/home/SkillsSection.tsx`; wire in.
- [ ] **Step 1:** Server component; group `skills` by `category`; each group = `Card` with `TechTag` chips (or soft proficiency bars using `--accent` width). `Reveal` per group with stagger. Section `id` not required (part of about/skills area).
- [ ] **Step 2: Verify** both themes + mobile. **Step 3: Commit** `git commit -am "feat: add skills section"`

### Task 9: Featured projects section

**Files:** Create `components/site/projects/ProjectCard.tsx`, `components/site/home/FeaturedProjects.tsx`; wire in.

**Interfaces (Produces):** `ProjectCard({ project })` — used here and in `/projects` grid. `project` shape from `getHomePageData().projects` (Prisma `Project`).

- [ ] **Step 1: `ProjectCard`** — `Link` to `/projects/[slug]`; `Card interactive`; `next/image` cover (`project.coverImage`, `fill`, `sizes`), title (serif), short `description`, up to 4 `TechTag`s from `technologies`/`techStack`, hover lift + image scale. Featured badge if `project.featured`.
- [ ] **Step 2: `FeaturedProjects`** — `Section id="projects"`; header + `Button href="/projects"` "View all"; grid (`repeat(auto-fill,minmax(320px,1fr))`) of featured projects (filter `featured`, fallback first 4). `RevealGroup` stagger.
- [ ] **Step 3: Verify** browser both themes, hover state, mobile 1-col. **Step 4: Commit** `git commit -am "feat: add project card + featured projects section"`

### Task 10: Experience & education timeline

**Files:** Create `components/site/home/TimelineSection.tsx`; wire in.
- [ ] **Step 1:** Server component; `Section id="experience"`; two-column (Experience | Education) → stacked on mobile; each item a timeline row with a `--accent` node/line, role/company/degree, formatted date range (reuse date formatting; `current` → "Present"), description. `Reveal` per item.
- [ ] **Step 2: Verify** both themes + mobile. **Step 3: Commit** `git commit -am "feat: add experience/education timeline"`

### Task 11: Certificates section + lightbox

**Files:** Create `components/site/home/CertificatesSection.tsx`, `components/site/projects/ProjectGallery.tsx` is separate; here create `components/site/home/CertificateCard.tsx` + reuse a shared `Lightbox`.
- [ ] **Step 1:** Create `components/site/ui/Lightbox.tsx` (`'use client'`) — generic image lightbox (keyboard esc/arrows, backdrop click, Framer Motion fade). `CertificatesSection` server component renders soft card grid; image certs open Lightbox, PDF certs link out (reuse existing `/api/upload/certificate/view` pattern).
- [ ] **Step 2: Verify** open/close lightbox in browser; keyboard nav; both themes. **Step 3: Commit** `git commit -am "feat: add certificates section with lightbox"`

### Task 12: Contact section + form

**Files:** Create `components/site/home/ContactSection.tsx`, `components/site/home/ContactForm.tsx`; wire in.

**Interfaces (Consumes):** existing `POST /api/contact`.

- [ ] **Step 1: `ContactForm`** `'use client'`: fields name/email/subject/message, client validation, submit to `/api/contact`, `sonner` toast on success/error, disabled+spinner while sending, reset on success. **Step 2: `ContactSection`** `Section id="contact"`: left = heading + email + socials, right = form in a `Card`.
- [ ] **Step 3: Verify** submit a test message in browser → success toast → `read_network_requests` shows 200. **Step 4: Commit** `git commit -am "feat: add contact section + form"`

### Task 13: Home polish pass

- [ ] **Step 1:** Ensure section order matches spec (Hero→About→Services(placeholder)→Featured→Skills→Timeline→Certificates→Contact). Consistent `--space-section` rhythm; alternate `--canvas`/`--surface` section backgrounds for depth.
- [ ] **Step 2: Verify** full-page scroll screenshot both themes at 375/768/1440; no overflow; `read_console_messages` clean; `npm run build` passes.
- [ ] **Step 3: Commit** `git commit -am "feat: home layout rhythm + section backgrounds"`

---

## Phase 4 — Projects index, About page, Project detail

### Task 14: `/projects` index with filter

**Files:** Create `app/projects/page.tsx`, `components/site/projects/ProjectsGrid.tsx`

**Interfaces (Consumes):** `getAllPublishedProjects()` from `lib/data/portfolio.ts` (verify it exists; else use `prisma.project.findMany({ where:{ publishStatus:'published' }})`). `ProjectsGrid({ projects })` client island reads/writes `?type=&sort=` search params.

- [ ] **Step 1: `ProjectsGrid`** `'use client'`: filter chips by `projectType` (webapp/android/desktop/api/all) + sort (recent/featured); URL-state via `useRouter`/`useSearchParams`; renders `ProjectCard` grid with `RevealGroup`.
- [ ] **Step 2: `app/projects/page.tsx`** server component: `Nav`, page header (`Container`, eyebrow "Work", title), `<ProjectsGrid projects={...} />`, `Footer`. Add `generateMetadata` (title "Projects").
- [ ] **Step 3: Verify** browser: filter changes URL + list; both themes; mobile. **Step 4: Commit** `git commit -am "feat: add /projects index with filtering"`

### Task 15: `/about` page

**Files:** Create `app/about/page.tsx`
- [ ] **Step 1:** Server component reusing sections: hero-lite (portrait + bio), `ServicesSection` (Task 18), full `SkillsSection`, full `TimelineSection`, `CertificatesSection`, resume download Button, contact CTA. `Nav`/`Footer`. `generateMetadata` "About".
- [ ] **Step 2: Verify** browser both themes + mobile. **Step 3: Commit** `git commit -am "feat: add /about page"`

### Task 16: Restyle project detail (minimal/visual)

**Files:** Create `app/projects/[slug]/ProjectDetailView.tsx`; Modify `app/projects/[slug]/page.tsx`; later delete `ProjectDetailBlueprint.tsx`.

**Interfaces (Consumes):** `getProjectBySlug(slug)` from `lib/data/portfolio.ts`.

- [ ] **Step 1: `ProjectDetailView`** — `Nav`; large cover hero (`next/image`, `priority`); title (serif), eyebrow (projectType/role), narrative (`longDescription`||`description`, `outcome`, `role`); `TechTag` row from `techStack`/`technologies`; link buttons (github/demo/live/android, respecting `*Enabled` flags); gallery grid → `Lightbox` (reuse Task 11 component or `ProjectGallery.tsx`). NO flow/api/db/modules. `Footer`.
- [ ] **Step 2: `page.tsx`** — swap to `ProjectDetailView`; keep `generateMetadata`/`generateStaticParams` if present; keep JSON-LD.
- [ ] **Step 3: Verify** browser on a real published slug, both themes, mobile; gallery lightbox works; `read_console_messages` clean.
- [ ] **Step 4: Commit** `git commit -am "feat: restyle project detail as minimal visual case study"`

---

## Phase 5 — Services feature

### Task 17: Service model + validation + API

**Files:** Modify `prisma/schema.prisma`; Create `lib/validations/service.ts`, `app/api/services/route.ts`, `app/api/services/[id]/route.ts`; Modify `lib/data/portfolio.ts`.

**Interfaces (Produces):** `getServices(): Promise<Service[]>` (enabled, ordered). `serviceCreateSchema`, `serviceUpdateSchema` (Zod).

- [ ] **Step 1: Schema** — add to `prisma/schema.prisma`:

```prisma
model Service {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String
  icon        String?
  order       Int      @default(0)
  isEnabled   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Run: `npx prisma generate`
Expected: client regenerates with `prisma.service`.

- [ ] **Step 2: `lib/validations/service.ts`**

```ts
import { z } from 'zod'
export const serviceCreateSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(600),
  icon: z.string().max(80).optional().nullable(),
  order: z.number().int().min(0).default(0),
  isEnabled: z.boolean().default(true),
})
export const serviceUpdateSchema = serviceCreateSchema.partial()
export type ServiceCreate = z.infer<typeof serviceCreateSchema>
```

- [ ] **Step 3: `getServices()`** in `lib/data/portfolio.ts` — `cache`d `prisma.service.findMany({ where: { isEnabled: true }, orderBy: { order: 'asc' } })` with try/catch → `[]`.
- [ ] **Step 4: `app/api/services/route.ts`** — `GET` returns enabled (or all with `?includeDisabled=true`); `POST` calls `requireAdmin` (Task 22) then `serviceCreateSchema.parse(body)` then create. Return `{ success, data }` / `{ success:false, error }`.
- [ ] **Step 5: `app/api/services/[id]/route.ts`** — `GET`/`PUT`/`DELETE`; `PUT`/`DELETE` guarded by `requireAdmin` + `serviceUpdateSchema` on PUT.

  > Note: Task 22 creates `requireAdmin`. If building Services before Phase 8, inline a temporary session check via `verifySessionToken(cookies().get(SESSION_COOKIE)?.value)` and replace with `requireAdmin` in Task 22.

- [ ] **Step 6: Verify** `curl`/browser `GET /api/services` returns `[]` or data (200); `POST` without session returns 401.
- [ ] **Step 7: Commit** `git commit -am "feat: add Service model, validation, and CRUD API"`

### Task 18: Services section (home + about)

**Files:** Create `components/site/home/ServicesSection.tsx`; wire into `app/page.tsx` and `app/about/page.tsx`; thread `services` through `getHomePageData` or fetch `getServices()` in the pages.
- [ ] **Step 1:** Server component; `Section id="services"`, eyebrow "What I do"; grid of `Card`s each with a lucide icon (map `service.icon` name → component, fallback generic), title, description. `RevealGroup` stagger. Hide if `services.length === 0`.
- [ ] **Step 2:** Update `app/page.tsx` + `app/about/page.tsx` to fetch and pass `services`.
- [ ] **Step 3: Verify** browser both themes; empty-state hides cleanly. **Step 4: Commit** `git commit -am "feat: add services section to home + about"`

---

## Phase 6 — Dashboard restyle + editor simplification

### Task 19: Restyle AdminShell + admin.css + theme toggle + nav

**Files:** Modify `components/admin/AdminShell.tsx`, `app/admin/admin.css`
- [ ] **Step 1:** Rewrite `app/admin/admin.css` to consume the same design tokens (`var(--canvas)`, `--surface`, `--ink`, `--accent`, `--line`, `--radius`) instead of hardcoded blueprint blues; soft cards, rounded, `--shadow-sm`. Keep `adm-*` class names to avoid touching every admin page.
- [ ] **Step 2:** `AdminShell` — add `dashboard` and `services` to `AdminNavKey` + nav lists (`Dashboard` → `/admin/dashboard`, `Services` → `/admin/services`); add `ThemeToggle` to the topbar. Ensure admin pages get `data-theme` (ThemeProvider is in root layout, so already applies).
- [ ] **Step 3: Verify** browser `/admin/login` → dashboard chrome both themes; nav active states; mobile drawer. **Step 4: Commit** `git commit -am "feat: restyle admin shell with design tokens + theme toggle"`

### Task 20: Dashboard overview cards

**Files:** Modify `app/admin/dashboard/page.tsx` (or the overview it renders)
- [ ] **Step 1:** Add a stat-card row (projects total/published, unread messages, skills, services counts) using soft `Card`-style tiles + recent messages list. Fetch counts via existing APIs or a small server helper.
- [ ] **Step 2: Verify** browser both themes. **Step 3: Commit** `git commit -am "feat: add admin dashboard overview stat cards"`

### Task 21: Simplify project editor + add Services admin page

**Files:** Modify `components/admin/project-editor/ProjectEditor.tsx`, `EditorSidebar.tsx`; delete `tabs/FlowTab.tsx`, `ApiStructureTab.tsx`, `DatabaseTab.tsx`, `ModulesTab.tsx`; Create `app/admin/services/page.tsx`.
- [ ] **Step 1:** Remove Flow/Api/Database/Modules from the editor tab registry + sidebar; keep Overview/Media/Tech/Features/Links (verify save payload no longer references removed fields, or leaves them untouched). Delete the four tab files + `components/flow/FlowBuilder.tsx` after confirming no other imports (`grep`).
- [ ] **Step 2: `app/admin/services/page.tsx`** — `AdminShell active="services"`; list services, create/edit form (title, description, icon name, order, enabled toggle), delete; calls `/api/services`. Mirror the existing skills-admin page structure.
- [ ] **Step 3: Verify** browser: open a project in editor (removed tabs gone, save still works); create/edit/delete a service; both themes. `read_console_messages` clean.
- [ ] **Step 4: Commit** `git commit -am "feat: simplify project editor, add services admin page"`

---

## Phase 7 — Performance pass

### Task 22 (perf): Remove heavy deps + image/bundle audit

**Files:** Modify `next.config.js`, `package.json`; delete unused legacy components.
- [ ] **Step 1:** `grep -rl "three\|@react-three\|@xyflow\|ParticleBackground\|FlowBuilder" app components` — confirm only the files slated for deletion import them. Delete `components/ParticleBackground.tsx`, `components/flow/FlowBuilder.tsx`, and any remaining `components/blueprint/*` + legacy `components/Hero.tsx`/`Projects.tsx`/`Skills.tsx`/`About.tsx`/etc. that are no longer imported (verify each with grep before deleting).
- [ ] **Step 2:** `npm uninstall three @react-three/fiber @react-three/drei @types/three @xyflow/react`.
- [ ] **Step 3:** `next.config.js` — add `images.formats = ['image/avif','image/webp']` and `remotePatterns` for Cloudinary (`res.cloudinary.com`) and the S3/bucket host used by uploads (check `.env.local`/upload route for exact host).
- [ ] **Step 4: Verify** `npm run build` succeeds; check the build output route sizes dropped; `preview_start` → home renders; `read_console_messages` clean.
- [ ] **Step 5: Commit** `git commit -am "perf: drop three.js + xyflow, enable avif/webp, remove dead components"`

---

## Phase 8 — Security pass

### Task 23: Security headers + image hosts

**Files:** Modify `next.config.js`
- [ ] **Step 1:** Add `async headers()` returning for all routes: `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, and a `Content-Security-Policy` (allow `'self'`, `data:` images + configured remote image hosts, inline styles for Tailwind, `'unsafe-inline'` scripts only if required by the no-flash inline script — prefer a nonce later; document the tradeoff inline).
- [ ] **Step 2: Verify** `preview_start` → `read_network_requests` for `/` shows response headers present; site still renders (CSP not breaking images/fonts). Adjust CSP if console shows violations.
- [ ] **Step 3: Commit** `git commit -am "feat: add security headers + CSP"`

### Task 24: `requireAdmin` guard + apply to mutating routes + rate limit

**Files:** Create `lib/auth/require-admin.ts`, `lib/rate-limit.ts`; Modify mutating API routes.

**Interfaces (Produces):** `requireAdmin(): Promise<SessionPayload | NextResponse>` — returns payload if authed, else a 401 `NextResponse`. `rateLimit(key, limit, windowMs): boolean`.

- [ ] **Step 1: `lib/auth/require-admin.ts`**

```ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth/session'

export async function requireAdmin() {
  const token = cookies().get(SESSION_COOKIE)?.value
  const payload = await verifySessionToken(token)
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  return payload
}
```

- [ ] **Step 2:** In each mutating route (`skills`, `certifications`, `experience`, `education`, `projects`, `profile`, `settings`, `contact` [DELETE/PATCH], `services`, `upload`, `generate`) add at the top of `POST/PUT/PATCH/DELETE`: `const auth = await requireAdmin(); if (auth instanceof NextResponse) return auth`. Leave public `GET`s open. Enumerate routes via `grep -rl "export async function (POST|PUT|PATCH|DELETE)" app/api`.
- [ ] **Step 3: `lib/rate-limit.ts`** — in-memory `Map<string,{count,reset}>` limiter; apply to `POST /api/contact` (e.g. 5/min/IP) and `POST /api/auth/login` (e.g. 10/min/IP) → return 429 when exceeded. Use `request.headers.get('x-forwarded-for')` for key.
- [ ] **Step 4: Add Zod** validation to any mutating route still parsing raw `data` (at minimum `contact`, `skills`, `services`) using existing/`new` schemas.
- [ ] **Step 5: Verify** unauthenticated `POST /api/skills` → 401; authenticated admin CRUD still works in the dashboard; rapid contact submits → 429. `npm run build` passes.
- [ ] **Step 6: Commit** `git commit -am "feat: admin auth guard on mutating routes, rate limiting, zod validation"`

---

## Phase 9 — Verification & cleanup

### Task 25: Full verification sweep

- [ ] **Step 1:** `npm run build` clean (no type/lint errors). Fix any surfaced.
- [ ] **Step 2:** `preview_start` → walk `/`, `/projects`, `/projects/[slug]`, `/about`, `/admin/*`. For each: screenshot light + dark at 375/768/1440; confirm no horizontal overflow; `read_console_messages` clean.
- [ ] **Step 3:** Toggle reduced-motion (`resize_window`/emulation or DevTools) → confirm animations collapse.
- [ ] **Step 4:** Confirm Lighthouse-style basics: hero image has dimensions, no layout shift on load, fonts swap.
- [ ] **Step 5: Commit** any fixes `git commit -am "fix: redesign verification fixes"`.
- [ ] **Step 6:** Update `README.md` design section if it references the Blueprint theme.

---

## Self-Review

**Spec coverage:** palette/type/motion/theming → Tasks 1–4; hybrid architecture (home/projects/about/detail) → Tasks 6–16; minimal projects → Task 16; Services feature → Tasks 17–18, 21; dashboard restyle + editor simplify → Tasks 19–21; performance → Task 22; security → Tasks 23–24; verification → Task 25. All spec sections mapped.

**Placeholder scan:** Backend/config/token code is complete inline. UI-component tasks intentionally specify interface + structure + browser-verification rather than full JSX (visual redesign; browser verification is the signal per web testing rules) — each names exact files, props, tokens, and a concrete verify step, so no ambiguity remains for the implementer.

**Type consistency:** `useTheme`, `THEME_STORAGE_KEY`, `themeInitScript`, `getServices`, `serviceCreateSchema`, `requireAdmin`, `ProjectCard`, `Lightbox`, `Reveal`/`RevealGroup` names are used consistently across the tasks that produce and consume them. `requireAdmin` ordering dependency (used in Task 17, defined in Task 24) is called out with a temporary-inline fallback note.
```