# Portfolio and admin CMS

A Next.js 16 / React 19 portfolio backed by Prisma 6 and MongoDB. Public pages show published projects, skills, experience, education, services, and certificates. The private dashboard also includes messages, a career roadmap, travel tracking, savings tracking, and AI writing tools.

## Local setup

Use Node.js 22 or newer (CI uses Node.js 24) and npm.

1. Copy `.env.example` to `.env.local` and fill in the required values.
2. Configure MongoDB with a database name in its URL. Prisma writes that use transactions require a replica set; MongoDB Atlas provides one.
3. Set `ADMIN_USERNAME`, a unique `ADMIN_PASSWORD`, and a randomly generated `NEXTAUTH_SECRET` of at least 32 characters.
4. Run `npm ci`. The postinstall step generates Prisma Client and synchronizes the PDF worker.
5. Apply the schema to your development database with `npx prisma db push`. Prisma CLI reads `.env`, not Next.js's `.env.local`; supply `DATABASE_URL` in the shell when running Prisma commands.
6. Run `npm run dev` and open `http://localhost:3000/admin/login`.

Generate a session secret locally with:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Seed scripts in `scripts/` are optional and can overwrite existing records. Review them and target a development database before running them.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve a production build |
| `npm run lint` | ESLint with Next.js flat configuration |
| `npm run typecheck` | TypeScript validation |
| `npm test` | Regression tests using mocked database/provider boundaries |
| `npm run check` | Lint, typecheck, and tests |
| `npm run frames` | Regenerate optional scroll-sequence assets |

GitHub Actions runs the checks and production build on pushes and pull requests. Tests never need production credentials. A disposable MongoDB service supports build-time reads in CI.

## Structure

- `app/`: public pages and API handlers.
- `app/admin/login/`: public login page.
- `app/admin/(protected)/`: authenticated dashboard pages; the group does not change URLs.
- `lib/auth/`: signed HTTP-only sessions and server checks.
- `lib/projects/`: shared project mutations and explicit public field selection.
- `lib/content-routes.ts`: shared CMS validation, authentication, and cache invalidation.
- `lib/data/portfolio.ts`: cached public-page data.
- `lib/ai/`: bounded AI requests, provider integration, and evaluation validation.
- `prisma/schema.prisma`: database models.
- `tests/`: access-control and data-integrity regression tests.

## Authentication and public data

Sessions last eight hours. Production cookies are secure, HTTP-only, and SameSite=Lax. Logout expires the cookie. Proxy redirects unauthenticated dashboard navigation, and the protected layout, private route handlers, and project service independently check server sessions. Local storage is not an authorization source.

Public project reads require published status and return an explicit set of presentation fields. Disabled project links are removed. Drafts, internal tasks, deployment configuration, and Markdown exports require administrator authentication.

`GET /api/settings` is private and masks stored AI credentials. Sending the mask back preserves a key; saving an empty string removes the database override (an environment-configured key can still apply). Public consumers use `GET /api/settings/public`, which returns only approved public settings. Prefer environment variables for provider secrets.

Contact submissions are public; reading or changing messages is private. Career, savings, and travel data are private, including GET requests.

## Caching and rate limits

Public data carries the shared `portfolio` cache tag and a 600-second revalidation interval. Successful CMS writes immediately expire that tag and invalidate the root layout, including pages that share project/profile data. JSON-LD serialization escapes HTML script delimiters.

Login, contact submissions, and AI requests use atomic fixed-window counters in MongoDB's `_rate_limits` collection. The application creates a TTL index on `expiresAt`; the database account must be allowed to create that index and read/write the collection. Counters are shared across server instances. Production rejects rate-limited operations if the store is unavailable.

Without a database URL, development uses a bounded in-memory limiter. Vercel client addresses come from `X-Vercel-Forwarded-For`. Other deployments default to one shared unknown-client bucket unless `TRUST_PROXY=true` is set behind an ingress that overwrites forwarded IP headers.

## AI tools

The assistant is an **admin-only editing assistant**, not a public visitor chatbot. It helps draft copy from portfolio facts and cannot publish changes.

Providers are tried in order: NVIDIA NIM, Google Gemini, then OpenRouter. Network requests have timeouts; input bodies, conversation history, and provider output token counts are bounded. No provider configured or all providers failing returns an explicit error. Credentials can be supplied through environment variables or the masked settings editor.

Career evaluation loads the stored task and rubric. It evaluates pasted text/code, does not fetch repository URLs, validates provider JSON, and derives pass/fail from the numeric score. Unavailable or invalid evaluations do not change progress. A legitimate zero score stays zero. Concurrent step edits return a conflict instead of being overwritten by a slow evaluation.

## Uploads

General image uploads use ImgBB. Certificates use Cloudflare R2 when configured, with ImgBB as an image-only fallback. PDF certificate uploads require R2. The admin generates PDF thumbnails in the browser using the synchronized PDF.js worker. Certificate object keys are resolved through the certificate view endpoint.

## Deployment and existing installations

Set the variables in `.env.example` on the hosting platform. The current Vercel configuration uses a 30-second function limit. Validate login/logout, content edits, certificate uploads, and AI provider access in staging with real integration credentials.

If an earlier deployed version stored AI keys in database settings, its public settings endpoint may have exposed them. Deploy the access-control fix first, then rotate the affected keys at their providers and replace the saved values. Changing `NEXTAUTH_SECRET` invalidates existing signed sessions. Provider key rotation requires access to the provider accounts; changing source code cannot perform it.

Old career evaluations created by the previous heuristic fallback may contain unsupported passing scores. Review those records and re-evaluate them after configuring a provider; this update does not delete or rewrite historical progress.

The README describes the checked-in implementation. It does not claim production performance measurements, successful provider calls, or a completed accessibility audit.
