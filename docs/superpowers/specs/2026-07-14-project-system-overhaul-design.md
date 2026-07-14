# Project System Overhaul — Design Spec
**Date:** 2026-07-14
**Status:** Approved

---

## 1. Goal

Full end-to-end overhaul of the portfolio project system:
- Add `outcome`, `role`, and gallery display to the public site
- Add a feature point system (story points + priority score) to project features
- Replace the client-rendered homepage projects section with a server-rendered Blueprint-style section
- Add a quick-look modal (client island) triggered from project cards
- Add a full `/projects/[slug]` detail page in Blueprint style
- Add a gallery lightbox (client island) with keyboard and swipe navigation

---

## 2. Schema & Data Layer

### 2.1 Prisma Schema Changes (`prisma/schema.prisma`)

Add to `Project` model:
```
outcome  String?   // punchy result line, e.g. "Shipped to 12K users"
role     String?   // contributor role, e.g. "Lead Full-Stack Engineer"
```

`gallery String[]` already exists — no change needed.

Update `FeatureItem` embedded type:
```
storyPoints   Int  @default(1)   // Fibonacci: 1, 2, 3, 5, 8, 13
priorityScore Int  @default(5)   // 1–10; higher = must-ship sooner
```

### 2.2 Validation Schema (`lib/validations/project.ts`)

- Add `outcome: z.string().optional()` and `role: z.string().optional()` to `CreateProjectSchema` / `UpdateProjectSchema`
- Add `storyPoints: z.number().int()` and `priorityScore: z.number().int().min(1).max(10)` to `FeatureItemSchema`

### 2.3 Data Layer (`lib/data/portfolio.ts`)

Update `FeaturedProject` interface:
```ts
outcome: string | null
role: string | null
gallery: string[]
longDescription: string | null
```

Update `mapProjectToSpecSheet()` to map all four fields (currently `outcome` and `role` are hardcoded `null`).

Update `getFeaturedProjects()` and `getAllPublishedProjects()` to pass through new fields.

---

## 3. Feature Point System

### 3.1 Fields (per feature)
- `storyPoints` — Fibonacci scale: 1, 2, 3, 5, 8, 13. Represents build effort/complexity.
- `priorityScore` — 1–10. Higher = must-ship sooner.

### 3.2 Admin UI (Features tab)
Each feature card shows alongside existing status dropdown:
- **Story points pill selector:** `1 · 2 · 3 · 5 · 8 · 13` — amber highlight on selected value
- **Priority score stepper:** `−` / value / `+` with color bar below (red 1–3, amber 4–6, green 7–10)

**Summary bar** at top of Features tab:
- Total story points committed
- Average priority score
- Quick wins count: features where `priorityScore ≥ 7` AND `storyPoints ≤ 3`

### 3.3 Public Display (detail page)
Each feature shows a compact `SP: X` tag and a color-coded priority dot. Section header shows **Total SP · Quick Wins** summary.

Points are informational only — do not affect `overallProgress` calculation.

---

## 4. Admin Editor Changes

### 4.1 Overview Tab
Two new fields below existing description:
- `outcome` — single-line input, placeholder: `"e.g. Shipped to 12K users · Reduced load time 60%"`
- `role` — single-line input, placeholder: `"e.g. Lead Full-Stack Engineer"`
- **Gallery manager** — upload zone using existing `/api/upload` + R2. Thumbnail grid with remove buttons. Stores R2 keys in `gallery[]`.

### 4.2 Features Tab
Adds story points + priority score controls to each feature card. Adds summary bar at top.

### 4.3 Other Tabs
Unchanged: TechStack, Modules, API, Database, Deployment, Flow.

---

## 5. Homepage Projects Section

### 5.1 Replace
Remove `components/Projects.tsx` (client-rendered, loading spinner).
Add `components/blueprint/ProjectsSection.tsx` (server component).

### 5.2 Layout

**Section header:** `WORK` eyebrow (amber monospace) + `Projects` title + project count.

**Tier 1 — Featured projects** (2-column grid):
- Cover image strip
- Project type eyebrow
- Title (display font)
- `outcome` (amber, punchy line)
- `role`
- Tech stack pills (first 5)
- Status dot + lifecycle badge
- `VIEW DETAILS →` link

**Tier 2 — Other published projects** (3-column compact grid):
- Title
- Role
- First 3 tech tags
- Status badge
- No cover image

### 5.3 Interaction
Clicking any card opens the quick-look modal (client island). No navigation on card click.

### 5.4 Data
`page.tsx` adds `getAllPublishedProjects()` to the existing parallel `Promise.all` fetch.

---

## 6. Quick-Look Modal

**File:** `components/blueprint/ProjectModal.tsx` (`'use client'`)

### 6.1 Trigger
Cards dispatch a custom DOM event with project data. Modal listens at page level — no prop drilling through server components.

### 6.2 Structure
- **Left:** cover image, type + lifecycle badge, gallery thumbnail strip (first 4, click opens lightbox)
- **Right:** title, `role` eyebrow, `outcome` in amber, short description, tech stack pills, SP summary, action buttons (LIVE DEMO ↗, SOURCE ↗, VIEW FULL DETAILS →)

### 6.3 Behavior
- Slides in from right (desktop), slides up from bottom (mobile)
- `ESC` closes, backdrop click closes
- Body scroll locked while open
- `VIEW FULL DETAILS →` navigates to `/projects/[slug]`

### 6.4 State
`ProjectModalProvider` wraps the blueprint page, exposes `openModal(project)` via context. Project cards call `openModal` — server components remain unmodified.

---

## 7. `/projects/[slug]` Detail Page

**File:** `app/projects/[slug]/page.tsx` (server-rendered)

### 7.1 Hero
- Breadcrumb: `WORK / PROJECT` (amber monospace)
- `role` as eyebrow above title
- Title (display font, large)
- `outcome` in amber
- Status dot + lifecycle badge + project type tag
- Circular progress ring
- Action buttons (respect `*Enabled` toggles)

### 7.2 Body (2/3 + 1/3 layout)

**Main column:**
1. About — `longDescription`
2. Gallery — 3-column thumbnail grid, click opens lightbox
3. Features — status icon, `SP: X` tag, priority dot, description. Header: Total SP · Quick Wins
4. Roadmap — phase timeline with progress bars
5. Modules & Tasks — client island for expand/collapse toggle

**Sidebar:**
1. Tech stack grouped by category
2. Deployment info
3. Project metadata (type, dates)
4. Links panel

### 7.3 SEO
- `generateStaticParams` — pre-renders all published slugs at build time
- `generateMetadata` — sets title, description, og:image from cover image

---

## 8. Gallery Lightbox

**File:** `components/blueprint/GalleryLightbox.tsx` (`'use client'`)

### 8.1 Structure
- Full-screen dark backdrop (`rgba(0,0,0,0.92)`)
- Centered image (`max-height: 85vh`, `object-fit: contain`)
- Top bar: counter `2 / 7` in amber monospace + close button
- Side arrows: `←` / `→`
- Bottom thumbnail strip: all images, active highlighted with amber border

### 8.2 Behavior
- `←` / `→` keyboard navigation
- `ESC` closes
- Touch swipe left/right (mobile)
- Body scroll locked while open
- Preloads adjacent images

### 8.3 Integration
Both `ProjectModal` and the detail page pass `gallery: string[]` + `startIndex: number` to the lightbox. R2 keys routed through `/api/upload/certificate/view?key=...` — same presigned URL pattern already in use.

---

## 9. File Map

| File | Action |
|------|--------|
| `prisma/schema.prisma` | Add `outcome`, `role` to Project; add `storyPoints`, `priorityScore` to FeatureItem |
| `lib/validations/project.ts` | Add new fields to schemas |
| `lib/data/portfolio.ts` | Update `FeaturedProject`, `mapProjectToSpecSheet`, fetch functions |
| `components/blueprint/ProjectsSection.tsx` | New server component |
| `components/blueprint/ProjectCard.tsx` | New — featured card |
| `components/blueprint/ProjectCardCompact.tsx` | New — compact card |
| `components/blueprint/ProjectModal.tsx` | New client island |
| `components/blueprint/ProjectModalProvider.tsx` | New context provider |
| `components/blueprint/GalleryLightbox.tsx` | New client island |
| `app/projects/[slug]/page.tsx` | New detail page |
| `app/projects/[slug]/ProjectDetailBlueprint.tsx` | New detail view component |
| `app/page.tsx` | Add `getAllPublishedProjects()` to fetch, replace Projects with ProjectsSection |
| `components/admin/project-editor/OverviewTab.tsx` | Add outcome, role, gallery manager |
| `components/admin/project-editor/FeaturesTab.tsx` | Add SP + priority controls + summary bar |
| `app/globals.css` | New Blueprint project section styles |
| `app/admin/admin.css` | New SP pill + priority stepper styles |

---

## 10. Out of Scope

- Flow diagram on the public detail page (admin-only for now)
- API Structure / Database Design sections on the public page (collapsible, low priority)
- Project search or filtering on the homepage
- Pagination (portfolio assumed < 20 projects)
