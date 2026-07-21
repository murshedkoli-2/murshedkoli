# Dev-Minimalist Redesign — Design Spec

**Date:** 2026-07-21
**Status:** Approved (pending spec review)
**Scope:** Public-facing pages only. Admin, API, Prisma schema, and the `lib/data`
data-access layer are **not** touched.

## Goal

Replace the current warm "soft-luxury" aesthetic with a **developer-minimalist**
design language inspired by [tamalsen.dev](https://tamalsen.dev): neutral palette,
code-comment `//` navigation, monospace accents, filterable work gallery, and a
clean technical feel — while reusing the existing content and data model.

## Non-Goals

- No changes to Prisma schema, API routes, admin UI, or `lib/data/portfolio.ts`.
- No new content types. **Testimonials** and **"as featured in" logos** (which
  tamalsen uses) are **dropped** — no data source exists and we are not adding one.
- No new heavy dependencies. Reuse `framer-motion`, `lucide-react`, `next/font`.

## Design Language

### Palette (neutral + one accent)

Replaces all tokens in `app/styles/tokens.css`. OKLCH throughout.

| Token | Light | Dark |
|-------|-------|------|
| `--canvas` | `oklch(98.5% 0 0)` | `oklch(16% 0 0)` |
| `--surface` | `oklch(100% 0 0)` | `oklch(20% 0 0)` |
| `--surface-2` | `oklch(96.5% 0 0)` | `oklch(24% 0 0)` |
| `--ink` | `oklch(20% 0 0)` | `oklch(96% 0 0)` |
| `--ink-muted` | `oklch(52% 0 0)` | `oklch(68% 0 0)` |
| `--line` | `oklch(90% 0 0)` | `oklch(30% 0 0)` |
| `--accent` | `oklch(62% 0.19 250)` (electric blue) | `oklch(68% 0.17 250)` |
| `--accent-ink` | `oklch(99% 0 0)` | `oklch(16% 0 0)` |
| `--comment` | `oklch(62% 0 0)` | `oklch(58% 0 0)` |

Shadows become tighter and cooler (near-neutral). Radii tighten from the current
soft `18px` to a crisper `10px` / `6px` to match the technical feel.

### Typography (three families, deliberate)

Loaded via `next/font/google` in `app/layout.tsx`, exposed as CSS variables.

- `--font-display` → **Space Grotesk** (headings, wordmark)
- `--font-body` → **Inter** (paragraph/body copy)
- `--font-mono` → **JetBrains Mono** (eyebrows, `//` nav labels, tech tags,
  project numbers, meta strips, stat values)

Fraunces is removed. Existing `var(--font-fraunces)` / `var(--font-inter)`
references are migrated to the new variables.

### Motion

- Keep existing framer-motion reveal pattern (fade + rise on scroll into view).
- Add a blinking-cursor accent after mono eyebrows (`▍`), CSS-only.
- All motion gated behind `useReducedMotion` / `prefers-reduced-motion`, as today.

## Components & Pages

### Navigation (`components/site/Nav.tsx`)

- Sticky, transparent → blurred surface on scroll (keep existing scroll logic).
- Wordmark left: first name in ink, surname in accent (Space Grotesk).
- Desktop links right, mono, rendered as `// about  // work  // experience  // contact`.
  Hover/active → accent. Links map to existing anchors/routes (About, Work=/projects,
  Experience, Contact).
- Theme toggle (reuse `ThemeToggle`) + mono outlined `resume ↗` button.
- Mobile: full-screen overlay with the same `//` list (keep AnimatePresence drawer,
  restyle to mono + neutral).

### Homepage (`app/page.tsx` — section order unchanged, presentation reskinned)

1. **Hero** (`home/Hero.tsx`) — mono eyebrow `// {title}` with blinking cursor,
   large name (Space Grotesk), role/subhead, two CTAs (`view work →`,
   `get in touch`). Right: portrait in a mono-framed card with a small terminal-style
   caption bar (filename-like label). Mono stat row (projects / years / technologies)
   underneath. Drops the warm `HeroBackdrop` gradient for a subtle grid/dot texture
   or plain canvas.
2. **Expertise** (`home/ServicesSection.tsx`) — Services as a 3-column block
   (icon, title, description). Numbered/mono labels.
3. **Selected Work** (`home/FeaturedProjects.tsx`) — Projects with filter chips by
   `projectType` (`all / webapp / android / api …`), mono numbering `01 / 02`,
   hover-reveal cards, first item featured larger. Client-side filter state.
4. **Stack** (`home/SkillsSection.tsx`) — Skills grouped, rendered as a dense
   monospace tag matrix grouped by column label.
5. **Experience** (`home/TimelineSection.tsx`) — Experience + Education as a
   mono-timestamped list (period on the left in mono, role/detail right).
6. **Certificates** (`home/CertificatesSection.tsx`) — compact mono cards.
7. **Contact** (`home/ContactSection.tsx`) — oversized `let's build something ↗`,
   email, socials, resume. Keep existing `ContactForm` behavior; restyle inputs to
   neutral/mono.

Footer (`components/site/Footer.tsx`): mono, minimal — copyright, socials, a
"built with Next.js" line.

### /projects (`app/projects/page.tsx`, `components/site/projects/*`)

Full filterable grid reusing the same chip + numbering system as the homepage Work
section. Reskin `ProjectsGrid`, `ProjectCard` to neutral/mono.

### /projects/[slug] (`app/projects/[slug]/ProjectDetailView.tsx`)

- Mono meta header: role, stack, year/status, links as `live ↗ / source ↗`.
- Keep gallery + lightbox behavior (`ProjectGallery`, `Lightbox`), restyle frames.

### /about (`app/about/page.tsx`)

Reskin to match: mono section labels, neutral palette, Space Grotesk headings.

### Shared UI primitives (`components/site/ui/*`)

Restyle in place (tokens do most of the work): `Button` (add mono/outline variant
with `→` affordance), `Eyebrow` (mono + cursor), `TechTag` (mono chip), `Section`,
`Container`, `Card`. No API changes to these components beyond additive variants.

## Data Flow

Unchanged. `app/page.tsx` and page components continue to read from
`lib/data/portfolio.ts` exactly as today. This redesign is presentation-only:
props, view models, and server-fetch logic stay identical.

## Error Handling

No new failure surfaces. Missing optional fields (no hero image, no services, empty
skills) already have fallbacks in the current components; those fallbacks are
preserved and restyled. Sections that receive empty arrays render nothing (existing
behavior).

## Testing / Verification

- **Visual:** manual review at 320 / 768 / 1024 / 1440 in **both light and dark**
  themes for every reskinned page.
- **Build:** `npm run build` and `npm run lint` must pass clean.
- **Accessibility:** keyboard nav on Nav + filter chips + lightbox; visible focus
  states; `prefers-reduced-motion` disables transforms; accent/ink contrast ≥ WCAG AA.
- **No regressions:** contact form submit still works; project filtering returns the
  right sets; theme toggle persists.

## Risks & Mitigations

- **Three font families** → within budget; subset to needed weights, `display: swap`,
  preconnect already present. Justified by the dev aesthetic.
- **Palette contrast** → verify accent-on-canvas and muted-ink meet AA before finalizing.
- **Filter state on homepage Work** → keep it a small isolated client component so the
  rest of the page stays server-rendered.

## Rollback

All work is on the `redesign/soft-luxury` branch (or a new branch off it). The
previous soft-luxury design is recoverable via git history if needed.
