# murshedkoli — Developer Portfolio & Admin CMS

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

A full-stack personal portfolio built with **Next.js 16 (App Router)**, **React 19**, **Prisma + MongoDB**, and a private admin CMS with AI-assisted writing.

---

## Features

**Public site**
- Home page: hero, expertise, featured projects, skills, experience/education timeline, certificates, services, work process, contact form
- Project index and detail pages with gallery and lightbox
- Light/dark theme without flash
- SEO: sitemap, robots, JSON-LD, and `/llms.txt` for AI crawlers
- `/api/resume` — resume PDF generated from database content (pdf-lib)

**Admin CMS (`/admin`)**
- Single-admin login (credentials from env) with an HMAC-signed, 8-hour session cookie
- Manage projects, skills, experience, education, certificates, services, profile/about, site settings, and contact messages
- Project wizard with optional **GitHub import** (README parsing + tech-stack detection)
- Certificate uploads (PDF/images) to Cloudflare R2 with presigned viewing
- AI field generation and a portfolio-aware admin chat assistant
- Personal tools: career roadmap with AI evaluation, savings tracker, travel planner

**AI providers** — NVIDIA NIM → Google Gemini → OpenRouter fallback chain. All optional; when none is available the API returns 503 instead of fabricated output.

---

## Tech Stack

| Area | Tools |
|------|-------|
| Framework | Next.js 16, React 19, TypeScript |
| UI | Tailwind CSS 3, Framer Motion, Lucide icons, Sonner |
| Data | Prisma 6, MongoDB (replica set required by Prisma) |
| Storage | Cloudflare R2 (via AWS S3 SDK), ImgBB for images |
| AI | NVIDIA NIM, `@google/genai` (Gemini), OpenRouter |
| Validation | Zod |
| Testing / CI | Vitest, ESLint, GitHub Actions |

---

## Security

- `proxy.ts` gates `/admin/*`, all mutating `/api/*` calls, and private reads; each route re-checks the session
- Zod validation and byte-bounded JSON bodies on every write
- Shared MongoDB-backed rate limiting (login, contact form, AI); fails closed in production
- CSP, HSTS, `X-Frame-Options: DENY` and related headers in `next.config.js`
- Provider API keys stored in settings are masked in admin responses and never exposed publicly

> **Deployment note:** rate limits key on client IP. On Vercel this works automatically. Behind another proxy set `TRUST_PROXY=true` only if the ingress overwrites `X-Forwarded-For`; otherwise every visitor shares one bucket.

---

## Quickstart

Requires Node.js 22+ and a MongoDB replica set.

```bash
git clone https://github.com/murshedkoli-2/murshedkoli.git
cd murshedkoli
npm install            # also runs prisma generate
cp .env.example .env   # fill in DATABASE_URL, ADMIN_*, NEXTAUTH_SECRET (32+ chars)
npx prisma db push
npm run dev
```

Then open http://localhost:3000 and sign in at `/admin/login`.

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run check` | Lint + typecheck + tests (what CI runs) |
| `npm test` | Vitest |
| `npm run frames` | Rebuild scroll-sequence background frames |

---

## License

No license file is included yet; all rights reserved unless one is added.
