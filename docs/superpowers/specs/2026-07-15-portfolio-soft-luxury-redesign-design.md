# Portfolio Redesign — "Soft Luxury" Design Spec

**Date:** 2026-07-15
**Status:** Approved (design), pending implementation plan
**Scope:** Full visual redesign of all public pages and the admin dashboard, plus targeted functionality additions and a performance/security pass. Backend data models and APIs are largely retained; this is primarily a design + presentation overhaul.

---

## 1. Goals

- Replace the current dark "Blueprint" (technical engineering-drawing) aesthetic with a **soft light-luxury** aesthetic: warm, muted, premium, editorial.
- Support **light and dark** themes with an animated toggle; both must feel intentional.
- **Balanced motion**: cinematic hero + smooth scroll reveals, calm and fast elsewhere. Full `prefers-reduced-motion` support.
- **Minimal, visual** project case-study pages.
- **Superfast**: reduce JS bundle (drop Three.js and xyflow), server-render data, client islands only where interactive.
- **Secure**: security headers, input validation, rate limiting, auth-gated admin.
- Redesign the home page first; design every other surface to match it.

## 2. Non-goals

- No blog and no testimonials (explicitly deferred).
- No auth system overhaul beyond hardening.
- No database migration of existing models beyond adding `Service` (existing Project fields such as flow/API/DB remain in schema but are no longer edited or shown).

---

## 3. Design language

### 3.1 Palette (OKLCH, defined as CSS custom properties)

**Light (default)**
- `--canvas`: `oklch(97% 0.012 85)` — warm cream off-white
- `--surface`: `oklch(99% 0.008 85)` — near-white warm card
- `--surface-2`: `oklch(95% 0.014 85)` — subtle elevated/inset tone
- `--ink`: `oklch(26% 0.02 60)` — warm near-black text
- `--ink-muted`: `oklch(50% 0.02 60)` — secondary text
- `--line`: `oklch(89% 0.012 85)` — hairline borders
- `--accent` (primary, sage/eucalyptus): `oklch(64% 0.07 155)`
- `--accent-2` (clay/terracotta): `oklch(70% 0.09 45)`
- `--accent-3` (soft lavender): `oklch(72% 0.06 290)`

**Dark**
- `--canvas`: `oklch(22% 0.012 60)` — warm espresso ink (never pure black)
- `--surface`: `oklch(26% 0.014 60)`
- `--surface-2`: `oklch(30% 0.016 60)`
- `--ink`: `oklch(92% 0.01 85)` — warm off-white
- `--ink-muted`: `oklch(70% 0.015 85)`
- `--line`: `oklch(34% 0.014 60)`
- `--accent`: `oklch(72% 0.08 155)`
- `--accent-2`: `oklch(76% 0.10 45)`
- `--accent-3`: `oklch(78% 0.07 290)`

Accents are used **semantically**: `--accent` for primary CTAs/links, `--accent-2` for secondary emphasis, `--accent-3` sparingly for highlights. No decorative-only color noise.

Soft gradient "blobs" (sage → clay → lavender, very low opacity, blurred) drift slowly behind the hero. Implemented in **CSS/SVG only** — no WebGL.

### 3.2 Typography

- **Display / headings:** Fraunces (variable serif via `next/font/google`) — soft optical, editorial, premium.
- **Body / UI:** Inter (already in the project).
- **Eyebrows / labels:** uppercase, letter-spaced Inter. The IBM Plex Mono / mono "blueprint" treatment is dropped from public surfaces.
- Fluid type scale via `clamp()` CSS variables (e.g. `--text-hero`, `--text-h2`, `--text-body`).

### 3.3 Motion (balanced) — Framer Motion (already installed)

- **Hero:** staggered word/line headline reveal, parallax on hero image, slow floating blobs.
- **Sections:** gentle fade-and-rise on scroll (`whileInView`, once, with staggered children) via a shared `Reveal` primitive.
- **Cards/buttons:** soft magnetic/scale hover, smooth theme cross-fade.
- **Reduced motion:** a single hook (`useReducedMotion`) collapses all motion to instant; blobs stop animating.

### 3.4 Theming

- `data-theme="light|dark"` on `<html>`; palette swapped via CSS variables under `:root[data-theme=...]`.
- Inline **no-flash script** in `<head>` reads `localStorage` (falls back to `prefers-color-scheme`) and sets the attribute before paint.
- Animated toggle in the public nav and the admin shell. Choice persisted to `localStorage`.

---

## 4. Public site architecture (Hybrid)

### 4.1 Routes

- `/` — single-scroll home (centerpiece).
- `/projects` — full filterable/sortable grid of all published projects.
- `/projects/[slug]` — minimal visual case study.
- `/about` — fuller bio, services, skills, full experience/education, certificates, resume download.

Contact remains a home section with an anchor; no separate `/contact` route.

### 4.2 Home sections (in order)

1. **Nav** — logo/name, anchor links, resume button, theme toggle. Sticky, condenses on scroll.
2. **Hero** — headline (animated), subhead, primary + secondary CTAs, **hero image** (portrait from `Profile.heroImage`/`avatar`) with parallax and soft blobs. Optional small stat row.
3. **About teaser** — short bio + link to `/about`.
4. **Services ("What I do")** — icon + title + blurb cards from the new `Service` model.
5. **Featured Projects** — visual cards (cover image, title, tech tags), link out to `/projects`.
6. **Skills** — grouped, soft chips/bars.
7. **Experience & Education timeline** — elegant vertical timeline.
8. **Certificates** — soft card grid with lightbox (retain existing lightbox behavior, restyled).
9. **Contact** — form (name, email, subject, message) posting to existing `/api/contact`, plus social links.
10. **Footer** — name, nav, socials, subtle credit.

### 4.3 Components / islands

Server components render data. Client islands: `Nav` (scroll + toggle), `ThemeToggle`, `Reveal`/motion wrappers, `ContactForm`, `GalleryLightbox`, `ProjectsFilter` (on `/projects`).

---

## 5. Project system (minimal & visual)

- Public case study shows: cover/gallery imagery (large), title, short narrative (`description`, `longDescription`, `outcome`, `role`), tech tags (`technologies`/`techStack` names), and links (GitHub / demo / live / android download, respecting existing enable toggles).
- **Removed from public view and admin editing:** flow diagram, API structure, database design, modules/tasks, roadmap. Fields remain in the Prisma schema (no destructive migration) but are unused by UI.
- `/projects` grid supports filter by `projectType` and sort by recency/featured. URL-state driven (search params).

---

## 6. New feature — Services ("What I do")

### 6.1 Data model (Prisma, MongoDB)

```prisma
model Service {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String
  icon        String?  // lucide icon name or image URL
  order       Int      @default(0)
  isEnabled   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 6.2 API

- `GET /api/services` — list (public reads only `isEnabled`).
- `POST /api/services` — create (auth).
- `GET/PUT/DELETE /api/services/[id]` — read/update/delete (mutations auth-gated).
- Zod validation on all writes; consistent `{ success, data?, error? }` envelope.

### 6.3 Admin

- `/admin/services` — list + create/edit/delete, order + enable toggle. Icon picker (lucide names).

---

## 7. Dashboard redesign

- Restyle `AdminShell` in soft-luxury light/dark: cleaner sidebar, refined nav, theme toggle.
- **Overview** (`/admin/dashboard`): soft stat cards (projects, published, messages unread, skills, services counts) + recent messages list.
- **Simplified project editor:** keep tabs/sections for Overview (title, slug, description, longDescription, outcome, role, projectType, lifecycleStatus, publishStatus, featured, order), Media/Gallery (cover, logo, gallery), Tech tags, Links, and a simple feature checklist. **Remove** Flow, API, Database, Modules tabs from the editor.
- New **Services** admin page (§6.3).
- Existing admin sections (skills, experience, education, certificates, about/profile, messages, settings) restyled to match.

---

## 8. Performance

- Remove `three`, `@react-three/fiber`, `@react-three/drei`, and `@xyflow/react` from the app (drop `ParticleBackground` and `FlowBuilder`/flow tab). Uninstall packages once no imports remain.
- Server components for all data fetching; client islands only where interactive.
- `next/image` for all imagery with explicit `width`/`height`/`sizes`, AVIF/WebP, `priority` on hero only, `loading="lazy"` below the fold.
- Lazy-load below-fold client islands with `next/dynamic` where it helps.
- Fonts via `next/font` (subset, `display: swap`), preload only the critical weight.
- Targets: LCP < 2.5s, CLS < 0.1, INP < 200ms; landing JS budget under ~150kb gzipped.

## 9. Security

- Security headers via `next.config.js` (or middleware): `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geo off), `X-Frame-Options: DENY`.
- Zod validation at every API write boundary; reject on invalid input with clear errors.
- Rate limit `/api/contact` and `/api/auth/login` (lightweight in-memory or KV-backed limiter).
- Confirm every `/admin` route and every mutating API route is auth-gated (session/JWT check). No secrets in client code.
- No `dangerouslySetInnerHTML` with unsanitized content (existing JSON-LD is static/serialized — acceptable).

---

## 10. Build order

1. **Design-system foundation** — tokens in `globals.css` + Tailwind, Fraunces font wiring, theme toggle + no-flash script, motion primitives (`Reveal`, `useReducedMotion`).
2. **Shared UI** — `Nav`, `Footer`, `Button`, `Card`, `Section`, `Eyebrow`, `ThemeToggle`, reveal wrappers.
3. **Home page** — all sections (§4.2), starting with Hero.
4. **`/projects` grid + `/about` + restyled `/projects/[slug]`**.
5. **Services** — model + API + admin + home section.
6. **Dashboard restyle + editor simplification**.
7. **Performance pass** — remove heavy deps, image/bundle audit.
8. **Security pass** — headers, rate limiting, auth/validation audit.
9. **Verify** — browser check both themes, responsive breakpoints (320/375/768/1024/1440), reduced motion, Lighthouse-style sanity.

## 11. Risks / notes

- Dropping Three.js and xyflow permanently removes the particle background and flow-diagram feature. Confirmed acceptable.
- Existing Blueprint components (`components/blueprint/*`) are superseded; they will be replaced, not extended. Remove once the new system renders the home page to avoid dead code.
- Keep existing API contracts stable where the admin still uses them to avoid breaking CRUD mid-redesign.
```