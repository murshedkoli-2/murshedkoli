# Project forms redesign — guided create, random-access edit

Date: 2026-07-31
Status: approved

## Problem

The create and edit screens for projects are the same shape as each other and the
wrong shape for both jobs.

**Create** is a single card with four fields (type, title, slug, description). It
creates a stub and dumps you into the editor, so "creating a project" and
"filling in a project" blur into one long, unguided form.

**Edit** is three tabs (Overview / Features / Tech Stack), where Overview is a
570-line component holding five unrelated jobs: identity, prose, status, media,
and links. Changing one link means scrolling past everything else.

## Approach

Split the two modes deliberately:

- **Create is guided and linear.** You are being walked through a structure you
  do not yet know.
- **Edit is random-access.** You already know what you want to change; the UI
  should not make you walk past the rest of it.

They will not look like each other. That is the point.

## Create — 8-step wizard, one save at the end

| # | Step       | Fields                                              |
|---|------------|-----------------------------------------------------|
| 1 | Type       | `projectType`                                        |
| 2 | Identity   | `title`, `slug`, `description`                       |
| 3 | Story      | `longDescription`, `outcome`, `role`                 |
| 4 | Media      | `coverImage`, `logoUrl`, `gallery`                   |
| 5 | Links      | 7 URL fields + their `*Enabled` toggles              |
| 6 | Features   | `features[]`                                         |
| 7 | Tech Stack | `techStack[]`                                        |
| 8 | Review     | summary + `publishStatus`, `lifecycleStatus`, `featured`, `order` |

- A single `createProject()` call fires on Review. `CreateProjectSchema` already
  accepts `features`, `techStack`, and `gallery`, so no server-action changes.
- Only step 2 has required fields. Every other step is skippable; Continue is
  disabled only when the current step is invalid.
- Review lists all eight steps with a jump-back link per row, and carries the
  publish settings that only make sense once the rest exists.
- **Draft autosave to `localStorage`** under a single in-flight key, restored on
  return, cleared on successful create. This is the insurance against losing
  eight steps to a closed tab.
- Image uploads already POST to `/api/upload` and return URLs immediately, so
  media survives independently of the deferred save.

### Layout

Left rail of numbered steps: mono labels, amber for current, filled dot for
complete, hairline connectors. Under 900px the rail collapses to a slim progress
line with `step N of 8`. Footer holds Back / Continue.

## Edit — section map

Landing is a map, not a form. One card per section:

Identity · Story · Media · Links · Features · Tech Stack · Status

Each card shows a completeness signal (`4/7 links enabled`, `no cover image`)
and a one-line preview. Clicking opens that section alone, full width, with Save
and Back to map. Never a sequence.

- Section is URL state (`?section=media`), so it is linkable and the browser
  back button works.
- Existing per-section server actions are unchanged: `updateProject`,
  `updateProjectFeatures`, `updateProjectTechStack`.

## Shared internals

The two modes share their inputs and nothing else. Extract **field groups** that
render only inputs — no chrome, no save logic, no layout opinion:

```
project-editor/
  fields/     IdentityFields, StoryFields, MediaFields, LinksFields, StatusFields
  wizard/     ProjectWizard, WizardRail, ReviewStep
  ProjectEditor  -> SectionMap + section host
```

Each field group takes `value` and `onChange` and is used by exactly two callers:
one wizard step and one edit section. `FeaturesTab` and `TechStackTab` already
have this shape and are reused unchanged.

`OverviewTab.tsx` dissolves into the field groups; that is where most of the
deleted code comes from.

## Visual system

Both modes inherit the amber-on-hairline editorial system already established in
`app/admin/admin.css` (`.pe-*`) and the global theme tokens. Every color resolves
from `--surface` / `--line` / `--ink` / `--accent`, so both follow the light/dark
toggle. No new palette.

## Risks

- **Two dissimilar screens.** Someone who just completed 8 steps lands on a map
  that looks unfamiliar. The Review step is laid out like the map to bridge this.
- **Deferred save.** Mitigated by localStorage draft persistence.

## Out of scope

- `modules`, `roadmap`, `apiStructure`, `databaseDesign`, `flowDiagram`,
  `deployment` — present in the schema, not currently edited by any UI. Not added.
- Dead files `EditorSidebar.tsx`, `SaveBar.tsx`, `ui/Tabs.tsx`, `ui/Badge.tsx`,
  `ui/Modal.tsx` — unreferenced, left alone.
