<div align="center">

# Portfolio — Murshed Al Main

**A database-driven personal portfolio with a full content management dashboard.**

Dark editorial front end. Typed, cached data layer. Every word and image on the public
site is editable from `/admin` — nothing is hardcoded.

[![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18-087EA4?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma&logoColor=white)](https://prisma.io)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[**murshedkoli.com**](https://murshedkoli.com)

</div>

---

## Contents

- [What this is](#what-this-is)
- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [How it fits together](#how-it-fits-together)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Content model](#content-model)
- [The scroll background](#the-scroll-background)
- [Design system](#design-system)
- [Security](#security)
- [Deployment](#deployment)
- [Notes for contributors](#notes-for-contributors)

---

## What this is

Most portfolio sites are a static page you edit by opening a code editor. This one is a
small CMS with a portfolio attached.

The public site (`/`, `/about`, `/projects`, `/projects/[slug]`) renders entirely from
MongoDB through a typed, cached data layer. The admin dashboard (`/admin`) is a complete
back office for that data: projects with a multi-step editor and GitHub import, services,
skills, experience, education, certificates with PDF thumbnailing, contact messages, site
settings, plus a couple of personal tools. Content changes appear on the public site
without a redeploy.

## Highlights

**Front end**

- **Dark editorial homepage** — near-black ground, bone type, hairline rules, a single
  amber accent, serif-italic accent words. Built to look intentional, not templated.
- **Scroll-scrubbed portrait background** — a 100-frame WebP sequence painted to a fixed
  canvas, scrubbed by scroll depth with a synchronised zoom. See
  [The scroll background](#the-scroll-background).
- **Light and dark themes** — OKLCH token system, animated toggle, no-flash pre-paint
  script so there's no theme flicker on first load.
- **Motion with a floor** — Framer Motion reveals and scroll-linked transforms, all of
  which collapse cleanly under `prefers-reduced-motion`.
- **Real case studies** — `/projects/[slug]` renders a visual project page with a
  keyboard- and swipe-navigable gallery lightbox.

**Data and performance**

- **Two-layer caching** — `unstable_cache` persists query results across requests;
  React `cache` de-dupes within a render. All entries share one `portfolio` tag.
- **ISR** — the homepage and project pages are served static and regenerate in the
  background every 10 minutes.
- **Static params** — published project slugs are pre-rendered at build time.
- **Image pipeline** — AVIF/WebP via `next/image` with a 30-day optimised-image cache.

**Back office**

- **Project editor** — tabbed editor covering identity, media, links, story, tech stack
  and a feature checklist, plus a guided wizard for new projects.
- **GitHub import** — pull a repo's README and metadata to bootstrap a project entry.
- **AI assist** — optional field-level generation (descriptions, titles, SEO copy) via
  Google Gemini, with OpenRouter as a fallback provider.
- **Certificates** — image or PDF upload; page 1 of a PDF is rasterised once at upload so
  cards show a real preview without shipping a PDF viewer.
- **Generated résumé** — `/api/resume` builds a PDF from live database content.
- **`/llms.txt`** — a machine-readable profile summary for LLM crawlers.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React Server Components) |
| UI | React 18, TypeScript 5 (strict) |
| Styling | Tailwind CSS 3 + CSS custom-property tokens in OKLCH |
| Type | Space Grotesk (display), Inter (body), JetBrains Mono (meta), Instrument Serif (accent) — all self-hosted via `next/font` |
| Motion | Framer Motion 10 |
| Icons | Lucide React |
| Database | MongoDB (Atlas) via Prisma 6 |
| Validation | Zod 4 |
| Auth | Custom HMAC-signed session cookie on Web Crypto |
| Images | ImgBB (general), Cloudflare R2 (certificates) |
| AI | Google Gemini (`@google/genai`), OpenRouter fallback |
| PDF | `pdf-lib` (résumé generation), `pdfjs-dist` (certificate thumbnails) |
| Hosting | Vercel |

## How it fits together

```
                    ┌──────────────────────────────────────────┐
   Public request → │  app/(public)   RSC pages, ISR 10 min    │
                    │  page · about · projects · projects/[…]  │
                    └───────────────────┬──────────────────────┘
                                        │  typed view models
                    ┌───────────────────▼──────────────────────┐
                    │  lib/data/portfolio.ts                    │
                    │  every query wrapped in cached()          │
                    │  ┌──────────────────────────────────────┐ │
                    │  │ unstable_cache  → across requests    │ │
                    │  │ React cache     → within one render  │ │
                    │  │ tag: "portfolio" · revalidate 600s   │ │
                    │  └──────────────────────────────────────┘ │
                    └───────────────────┬──────────────────────┘
                                        │
                    ┌───────────────────▼──────────────────────┐
                    │  Prisma 6  →  MongoDB Atlas               │
                    └───────────────────▲──────────────────────┘
                                        │
                    ┌───────────────────┴──────────────────────┐
   Admin request →  │  app/api/*   Zod-validated route handlers│
                    │  app/admin/* client dashboard            │
                    └───────────────────▲──────────────────────┘
                                        │
                    ┌───────────────────┴──────────────────────┐
                    │  proxy.ts (edge middleware)               │
                    │  every non-GET /api/* needs a valid       │
                    │  admin session — allowlist: login, contact│
                    └──────────────────────────────────────────┘
```

Three things worth calling out:

**The public site never touches Prisma directly.** It goes through `lib/data/portfolio.ts`,
which returns narrow view models (`FeaturedProject`, `TimelineEntry`, `SkillColumn`) rather
than raw Prisma rows. Database shape and render shape stay decoupled.

**Authorisation is centralised at the edge.** `proxy.ts` rejects any mutating `/api/*`
request without a valid session before it reaches a handler. Handlers also check
in-place (`lib/auth/require-admin.ts`) — defence in depth, so a middleware matcher mistake
can't silently open a write endpoint.

**Sessions are deliberately small.** `base64url(payload).base64url(HMAC-SHA256)`, signed
with Web Crypto so identical code runs in edge middleware and Node handlers, with an
8-hour expiry and a constant-time signature comparison. No session store, no NextAuth.

## Project structure

```
portfolio/
├── app/
│   ├── page.tsx                 # homepage — hero, craft, services, work, skills…
│   ├── about/                   # long-form about page
│   ├── projects/                # index + [slug] case studies
│   ├── admin/                   # dashboard (12 sections, client-rendered)
│   ├── api/                     # 28 route handlers, Zod-validated
│   ├── llms.txt/                # machine-readable profile for LLM crawlers
│   ├── robots.ts · sitemap.ts   # generated from published content
│   ├── globals.css              # global styles + homepage editorial system
│   └── styles/tokens.css        # OKLCH design tokens, light + dark
│
├── components/
│   ├── site/                    # public site
│   │   ├── home/                # one file per homepage section
│   │   ├── projects/            # grid + gallery
│   │   ├── ui/                  # Button, Container, Lightbox, TechTag…
│   │   └── ScrollSequenceBackground.tsx
│   └── admin/                   # dashboard shell + project editor/wizard
│
├── lib/
│   ├── data/portfolio.ts        # cached public read layer
│   ├── site-data.ts             # layout-level profile/settings
│   ├── cache.ts                 # cached() — the two-layer wrapper
│   ├── auth/                    # session signing + require-admin
│   ├── validations/             # Zod schemas per domain
│   ├── admin/                   # dashboard helpers, PDF thumbnails
│   ├── github/                  # README fetch + repo URL parsing
│   └── rate-limit.ts            # in-memory fixed-window limiter
│
├── prisma/schema.prisma         # 13 models
├── proxy.ts                     # edge middleware — API authorisation
├── scripts/                     # frame builder, seeds, pdf worker sync
└── public/sequence/             # generated scroll-background frames
```

## Getting started

**Prerequisites:** Node 20+, a MongoDB database (Atlas free tier is fine).

```bash
git clone https://github.com/morshedkoli/portfolio.git
cd portfolio
npm install          # runs prisma generate + pdf worker sync on postinstall
```

Create `.env.local` with at minimum:

```ini
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/portfolio"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="something-long-and-random"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Push the schema and seed baseline content:

```bash
npx prisma db push
node scripts/seed-settings.js
node scripts/seed-skills.js
npm run dev
```

Public site on `http://localhost:3000`, dashboard on `/admin/login`.

## Environment variables

**Required**

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | MongoDB connection string |
| `NEXTAUTH_SECRET` | HMAC key for signing admin session cookies |
| `ADMIN_USERNAME` | Dashboard login |
| `ADMIN_PASSWORD` | Dashboard login |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL — used in metadata, JSON-LD, sitemap |

> **Naming note:** `NEXTAUTH_SECRET` is a leftover name. This project does **not** use
> NextAuth — the variable is simply the HMAC signing key for `lib/auth/session.ts`. Any
> sufficiently random string works.

**Optional — features degrade gracefully without them**

| Variable | Enables |
|---|---|
| `IMGBB_API_KEY` | Image uploads from the dashboard |
| `CLOUDFLARE_R2_ACCOUNT_ID` | Certificate file storage |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | ↳ |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | ↳ |
| `CLOUDFLARE_R2_BUCKET_NAME` | ↳ |
| `GOOGLE_AI_API_KEY` | AI field generation (Gemini) |
| `OPENROUTER_API_KEY` | AI fallback provider |
| `GITHUB_TOKEN` | Higher rate limits on GitHub project import |

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run frames` | Rebuild the scroll-background WebP sequence |

## Content model

Thirteen Prisma models back the site. The ones that drive public pages:

| Model | Drives |
|---|---|
| `Profile` | Name, title, bio, contact, social links, hero/story imagery, résumé |
| `Project` | Case studies — tech stack, features, gallery, links, lifecycle status |
| `Service` | The "What I do" capability rows |
| `Skill` | Skills grid, grouped by category, individually toggleable |
| `Experience` · `Education` | The experience/education timeline |
| `Certification` | Certificate cards, image or PDF with generated thumbnail |
| `Contact` | Inbound messages from the contact form |
| `Settings` | Key/value site config (titles, descriptions, keywords) |

Admin-only: `User`, `Analytics`, `TourLocation`, `SavingsAccount`.

`Project` is deliberately wide — it carries optional structures for API endpoints,
database collections, deployment metadata and roadmap phases that the current public
templates don't render yet.

## The scroll background

The homepage sits on a fixed `<canvas>` that scrubs a 100-frame portrait clip as you
scroll. The clip plays through exactly once: top of page is frame 0, bottom is frame 99,
with a single zoom breath peaking at 118% mid-page.

**Regenerating the frames.** `scripts/build-scroll-frames.mjs` takes a folder of extracted
video frames, subsamples them (keeping every 3rd), and writes two WebP tiers:

```bash
npm run frames -- /path/to/frame/folder
```

| Tier | Width | Total | Serves |
|---|---|---|---|
| `lg` | 540px | ~1.6 MB | ≥768px viewports |
| `sm` | 300px | ~0.6 MB | phones |

Only one tier loads per device. Output lands in `public/sequence/` and is committed, so
builds never depend on the source folder existing.

**How the component behaves.** Frames load progressively with a nearest-already-loaded
fallback, so the canvas is never blank while filling in. The rAF loop parks once the frame
settles rather than spinning. Device pixel ratio is capped at 1.5 — it's a dimmed,
vignetted background, so retina fill cost buys nothing. Under `prefers-reduced-motion` it
draws one still frame and never registers a scroll listener.

**Tuning.** `--section-ground` in `app/globals.css` is the single dial for how visible the
background is. Below roughly `0.72` alpha, muted body copy drops under 4.5:1 contrast over
the lit areas of the face — prefer adjusting `ZOOM_AMOUNT` or the canvas `brightness`
filter instead.

## Design system

Tokens live in `app/styles/tokens.css`, all colours in **OKLCH** for perceptually even
lightness steps between themes. Light is the default; dark overrides under
`[data-theme="dark"]`.

- **Type scale** is fluid `clamp()` throughout — no breakpoint jumps.
- **One accent.** Amber, used semantically. The `//` comment prefix on eyebrows, the
  terminal cursor and the serif-italic accent words all pull from it.
- **Hairlines over boxes.** Sections divide with 1px rules rather than cards wherever
  the content allows.
- **Motion is compositor-only** — `transform`, `opacity`, `filter`. Nothing animates
  layout-bound properties.

The homepage-specific editorial layer (`.hp-*`, `.proj-row`, `.svc-row`, `.craft-grid`)
lives at the bottom of `app/globals.css`; the admin dashboard has its own scoped
`app/admin/admin.css`.

## Security

- **Edge authorisation.** Every mutating `/api/*` request is checked in `proxy.ts` before
  reaching a handler. Only `POST /api/auth/login` and `POST /api/contact` are public.
- **In-handler checks.** Routes independently verify the session via
  `lib/auth/require-admin.ts`, so authorisation doesn't rest on the matcher alone.
- **Signed sessions.** HMAC-SHA256 over the payload, constant-time comparison, 8-hour
  expiry, `httpOnly` cookie.
- **Input validation.** Zod schemas at every write boundary (`lib/validations/`).
- **Rate limiting.** Fixed-window limiter on the public contact endpoint.
- **Security headers.** CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`,
  `Referrer-Policy`, `Permissions-Policy` — all in `next.config.js`.

The CSP currently needs `'unsafe-inline'` for scripts because of the no-flash theme
snippet, JSON-LD blocks and Next's hydration bootstrap. Moving to a nonce-based policy is
the intended next step and is documented inline in `next.config.js`.

## Deployment

Built for Vercel; `vercel.json` pins the `iad1` region and allows 30s for API functions.

1. Import the repo at [vercel.com](https://vercel.com) — Next.js is auto-detected.
2. Add the environment variables above under **Settings → Environment Variables**.
   Set `NEXT_PUBLIC_SITE_URL` to the production domain.
3. Deploy.

MongoDB Atlas must allow connections from Vercel — either allowlist `0.0.0.0/0` or use
Atlas's Vercel integration.

## Notes for contributors

A few things that will cost you an hour if you don't know them:

**Prisma is pinned to 6.19.3 exactly.** Prisma 7 dropped MongoDB support. Do not bump
`prisma` or `@prisma/client` past 6.x — both are pinned without a caret for this reason.

**Never use `<style jsx>` in this project.** styled-jsx silently wedges the Next 16
Turbopack compile — the build hangs with no error. Use `app/globals.css`, a scoped css
file, or inline `style={{}}`.

**Cache invalidation is not wired up yet.** `lib/cache.ts` tags every portfolio query with
`portfolio` so a single `revalidateTag('portfolio')` would refresh them all, but no admin
write currently calls it. Public content therefore refreshes on the 10-minute ISR timer
rather than immediately after an edit. Wiring `revalidateTag` into the write paths is a
good first contribution.

**There is no test suite.** No test runner is configured. Changes are verified by
`npx tsc --noEmit` and `npm run build`.

**Line endings.** The repo has mixed LF/CRLF history on Windows. Git will warn on commit;
it's harmless.

---

<div align="center">
<sub>Built by <a href="https://murshedkoli.com">Murshed Al Main</a> · Dhaka, Bangladesh</sub>
</div>
