export interface InitialCareerStep {
  stage: string
  stageNumber: number
  stepNumber: number
  title: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'system-design' | 'monetization'
  description: string
  keyConcepts: string[]
  testQuestions: string[]
  deliverable: string
  order: number
}

export const STAGE_NAMES = [
  { stageNumber: 1, name: 'Stage 1: Core Foundation & Advanced TypeScript Architecture', icon: '⚡' },
  { stageNumber: 2, name: 'Stage 2: Modern Frontend Architecture & Next.js 16/React 19', icon: '◈' },
  { stageNumber: 3, name: 'Stage 3: Scalable Backend, APIs & Database Systems', icon: '⬡' },
  { stageNumber: 4, name: 'Stage 4: Real-Time Systems, Microservices & System Design', icon: '≡' },
  { stageNumber: 5, name: 'Stage 5: DevOps, Cloud Infrastructure & Automated Testing', icon: '⚙' },
  { stageNumber: 6, name: 'Stage 6: Monetization, Freelance Mastery & Remote High-Paying Career', icon: '৳' },
] as const

export const INITIAL_CAREER_ROADMAP: InitialCareerStep[] = [
  // ── STAGE 1: CORE FOUNDATION & TYPESCRIPT ──────────────────────────────────
  {
    stage: 'Stage 1: Core Foundation & Advanced TypeScript Architecture',
    stageNumber: 1,
    stepNumber: 1,
    title: 'JavaScript Deep Dive: Event Loop, Memory & Web APIs',
    category: 'frontend',
    description: 'Master how JavaScript executes under the hood: microtasks vs macrotasks, call stack, heap memory, closures, event delegation, and asynchronous mechanics.',
    keyConcepts: [
      'Event Loop & Task Queues (Promises vs setTimeout/setImmediate)',
      'Closures, Lexical Scope & Execution Context',
      'Memory Leaks, Garbage Collection & WeakMap/WeakSet',
      'Prototypal Inheritance vs ES6 Classes',
      'Event Bubbling, Capturing & Delegation'
    ],
    testQuestions: [
      'What is the exact execution order between Promise.then, setTimeout(..., 0), queueMicrotask, and requestAnimationFrame?',
      'How does JavaScript garbage collection work (Mark-and-Sweep), and how do detached DOM nodes cause memory leaks?',
      'How do you write a custom Promise.all and Promise.race implementation from scratch?'
    ],
    deliverable: 'Build a custom JavaScript event emitter and promise queue manager with concurrency limiting from scratch with zero dependencies.',
    order: 1,
  },
  {
    stage: 'Stage 1: Core Foundation & Advanced TypeScript Architecture',
    stageNumber: 1,
    stepNumber: 2,
    title: 'Advanced TypeScript: Generics, Discriminated Unions & Type-Level Programming',
    category: 'frontend',
    description: 'Move beyond basic types. Master generic constraints, conditional types, infer keyword, mapped types, template literal types, and strict type-safe APIs.',
    keyConcepts: [
      'Generic Constraints & Default Types (T extends Record<string, any>)',
      'Discriminated Unions for Exhaustive Pattern Matching',
      'Utility Types: Partial, Required, Pick, Omit, Record, ReturnType, Parameters',
      'Conditional Types & the infer Keyword',
      'Type Guards, Assertion Functions & Zod Runtime Schema Validation'
    ],
    testQuestions: [
      'How do you build a type-safe API client where endpoints automatically infer their request body and response type based on the URL parameter?',
      'What is the difference between type and interface in modern TypeScript with declaration merging and mapped types?',
      'How do you write an exhaustive switch check using never to prevent unhandled union cases at compile time?'
    ],
    deliverable: 'Build a fully type-safe CRUD query builder library with generic filtering, sorting, and pagination typing validated with Zod.',
    order: 2,
  },
  {
    stage: 'Stage 1: Core Foundation & Advanced TypeScript Architecture',
    stageNumber: 1,
    stepNumber: 3,
    title: 'Clean Code, SOLID Principles & Design Patterns',
    category: 'system-design',
    description: 'Write code that teams love to maintain. Learn Single Responsibility, Open/Closed, Dependency Inversion, Factory, Singleton, Observer, and Strategy patterns in TypeScript.',
    keyConcepts: [
      'SOLID Principles applied to modern TypeScript/React applications',
      'Design Patterns: Factory, Strategy, Observer, Adapter, Repository Pattern',
      'Separation of Concerns: Domain Logic vs Infrastructure vs Presentation',
      'Defensive Programming & Fail-Fast Principles'
    ],
    testQuestions: [
      'How do you apply the Strategy Pattern to swap payment gateways (e.g. Stripe vs PayPal vs SSLCommerz) without modifying core checkout logic?',
      'How does Dependency Inversion allow swapping a mock database for production MongoDB/PostgreSQL in tests?'
    ],
    deliverable: 'Refactor a messy single-file script into a modular domain-driven architecture with repositories, services, and controller layers.',
    order: 3,
  },
  {
    stage: 'Stage 1: Core Foundation & Advanced TypeScript Architecture',
    stageNumber: 1,
    stepNumber: 4,
    title: 'Professional Git, Branching & Production PR Workflows',
    category: 'devops',
    description: 'Work like a senior engineer on international engineering teams: conventional commits, interactive rebasing, merge conflict resolution, git bisect, and PR reviews.',
    keyConcepts: [
      'Trunk-Based Development vs Git Flow',
      'Interactive Rebase (git rebase -i), Squashing & Cherry-Picking',
      'Git Bisect for pinpointing regression bugs in history',
      'Semantic Versioning & Conventional Commits (feat:, fix:, chore:, refactor:)',
      'Writing Production Pull Request Templates & Code Review Etiquette'
    ],
    testQuestions: [
      'How do you safely rebase a feature branch onto main and resolve multiple merge conflicts cleanly?',
      'When should you use git merge --no-ff versus git squash and merge in production repos?'
    ],
    deliverable: 'Create a GitHub repo with branch protection rules, automated PR template, lint-staged pre-commit hook with Husky, and commitlint enforcement.',
    order: 4,
  },
  {
    stage: 'Stage 1: Core Foundation & Advanced TypeScript Architecture',
    stageNumber: 1,
    stepNumber: 5,
    title: 'Core Data Structures & Algorithmic Problem Solving',
    category: 'system-design',
    description: 'Develop algorithmic problem-solving instincts needed for technical interviews: Big O notation, HashMaps, Two-Pointers, Sliding Window, and Tree/Graph traversals.',
    keyConcepts: [
      'Time and Space Complexity (Big-O analysis: O(1), O(n), O(log n), O(n log n))',
      'Two Pointers & Sliding Window techniques',
      'HashMaps / Frequency Maps for fast lookups',
      'Depth First Search (DFS) & Breadth First Search (BFS)',
      'Tries & LRU Cache implementation'
    ],
    testQuestions: [
      'How would you implement a Least Recently Used (LRU) Cache in TypeScript with O(1) get and put operations?',
      'How does a sliding window algorithm reduce time complexity from O(n^2) to O(n) for substring problems?'
    ],
    deliverable: 'Solve 25 fundamental LeetCode medium problems (Two Sum II, Longest Substring Without Repeating, LRU Cache, Top K Frequent, Binary Tree Level Order) with documented solutions.',
    order: 5,
  },

  // ── STAGE 2: MODERN FRONTEND & NEXT.JS 16 ──────────────────────────────────
  {
    stage: 'Stage 2: Modern Frontend Architecture & Next.js 16/React 19',
    stageNumber: 2,
    stepNumber: 6,
    title: 'React 19 Core Mechanics: Server Components & Actions',
    category: 'frontend',
    description: 'Master React 19 fundamentals: React Server Components (RSC), Client Components boundary, useActionState, useOptimistic, useTransition, and Suspense streaming.',
    keyConcepts: [
      'React Server Components (RSC) architecture & serialization rules',
      'useActionState & Server Actions for progressive form handling',
      'useOptimistic for instantaneous zero-latency client feedback',
      'Suspense boundaries, fallback skeletons & streaming HTML',
      'useTransition for non-blocking UI state updates'
    ],
    testQuestions: [
      'What data types can and cannot cross the Server-to-Client Component serialization boundary?',
      'How does useOptimistic revert state if a Server Action throws an error or fails validation?',
      'Why do Server Components produce zero client-side JavaScript bundle footprint?'
    ],
    deliverable: 'Build a server-actions-driven task manager with Suspense streaming, optimistic updates, and instant rollback on server errors.',
    order: 6,
  },
  {
    stage: 'Stage 2: Modern Frontend Architecture & Next.js 16/React 19',
    stageNumber: 2,
    stepNumber: 7,
    title: 'Next.js 16 App Router: Routing, Layouts, Middleware & Cache',
    category: 'frontend',
    description: 'Deep dive into Next.js 16 architecture: nested layouts, route groups, parallel routes (@modal), intercepting routes ((..)), route handlers, and proxy/middleware.',
    keyConcepts: [
      'Dynamic, Catch-all ([...slug]) & Optional Catch-all routes',
      'Parallel Routes & Intercepting Routes for Instagram/Twitter-style modal overlays',
      'Next.js 16 caching & revalidation (revalidatePath, revalidateTag, cacheLife)',
      'Edge Middleware / Proxy for authentication, rewrites & geo-blocking',
      'Metadata API, OpenGraph generation & dynamic sitemaps'
    ],
    testQuestions: [
      'How do intercepting routes allow viewing a project modal on page click while rendering a full page on direct URL refresh?',
      'How does Next.js 16 revalidatePath work compared to cache tags?',
      'How do you write edge-safe middleware that inspects signed cookies without bundling Node.js libraries?'
    ],
    deliverable: 'Build a multi-tenant blog engine with intercepting modal routes, dynamic OG image generation (`@vercel/og`), and ISR revalidation.',
    order: 7,
  },
  {
    stage: 'Stage 2: Modern Frontend Architecture & Next.js 16/React 19',
    stageNumber: 2,
    stepNumber: 8,
    title: 'Advanced State Architecture: Server State vs Client Store',
    category: 'frontend',
    description: 'Architect scalable frontend state. Understand when to use URL search params, React Context, TanStack Query, and Zustand client stores without memory bloat.',
    keyConcepts: [
      'URL as the Single Source of Truth for filters, pagination & search',
      'TanStack Query (React Query) for caching, stale-time & refetch-on-window-focus',
      'Zustand for lightweight global client state (modals, active tabs, theme)',
      'Optimistic updates & cache invalidation patterns',
      'Preventing state synchronization bugs & avoiding redundant useEffect'
    ],
    testQuestions: [
      'Why is storing search query and active filters in URL query parameters superior to React state in production apps?',
      'How do you synchronize optimistic mutations across multiple TanStack Query query keys simultaneously?'
    ],
    deliverable: 'Build a high-performance eCommerce product catalog with URL-synced multi-select filters, price ranges, infinite scroll, and a persistent cart in Zustand.',
    order: 8,
  },
  {
    stage: 'Stage 2: Modern Frontend Architecture & Next.js 16/React 19',
    stageNumber: 2,
    stepNumber: 9,
    title: 'Modern UI/UX Engineering: Design Systems & Micro-Interactions',
    category: 'frontend',
    description: 'Craft industry-grade interfaces with Apple/Linear level polish: CSS custom property tokens, Tailwind CSS, dark/light themes, keyboard navigation, and Framer Motion.',
    keyConcepts: [
      'Design Token architecture (semantic colors, spacing, typography scales)',
      'Framer Motion layout animations, exit transitions, and scroll progress',
      'Radix UI / Headless UI primitives for fully accessible dialogs, popovers, and menus',
      'Zero-layout-shift skeleton loaders and graceful loading states',
      'WCAG AA Accessibility standards (screen reader announcements, focus traps, aria labels)'
    ],
    testQuestions: [
      'How do you prevent theme flashing (FOUC) on initial page load in server-rendered applications?',
      'How does Framer Motion layoutId smoothly animate elements morphing between two completely different DOM containers?'
    ],
    deliverable: 'Build an accessible component library containing a Modal, Combobox with keyboard arrows, Command Palette (Cmd+K), and Toast notification system.',
    order: 9,
  },
  {
    stage: 'Stage 2: Modern Frontend Architecture & Next.js 16/React 19',
    stageNumber: 2,
    stepNumber: 10,
    title: 'Web Performance Engineering & Core Web Vitals Optimization',
    category: 'frontend',
    description: 'Make web applications blisteringly fast: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), Cumulative Layout Shift (CLS), and bundle auditing.',
    keyConcepts: [
      'Core Web Vitals measurement & debugging with Chrome DevTools Performance panel',
      'Image Optimization: next/image, modern formats (AVIF/WebP), responsive sizes attribute',
      'Font Optimization: next/font with zero layout shift font swapping',
      'Dynamic Imports (next/dynamic) and code splitting to trim main thread JavaScript',
      'Resource hints: preconnect, dns-prefetch, preload for third-party scripts'
    ],
    testQuestions: [
      'What causes poor INP (Interaction to Next Paint) and how do you break up long tasks on the main thread?',
      'Why is the sizes attribute in next/image critical for downloading appropriately sized assets on mobile vs desktop?'
    ],
    deliverable: 'Audit a slow application and optimize it to score 95+ on Google Lighthouse across Performance, Accessibility, Best Practices, and SEO.',
    order: 10,
  },

  // ── STAGE 3: SCALABLE BACKEND & DATABASES ──────────────────────────────────
  {
    stage: 'Stage 3: Scalable Backend, APIs & Database Systems',
    stageNumber: 3,
    stepNumber: 11,
    title: 'Enterprise REST API Design, Error Handling & Validation',
    category: 'backend',
    description: 'Design robust, developer-friendly RESTful APIs: clean status codes, consistent JSON envelopes, central error handling, rate limiting, and request validation with Zod.',
    keyConcepts: [
      'REST conventions: proper HTTP methods (GET, POST, PUT, PATCH, DELETE) & status codes (200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500)',
      'Centralized Error Middleware & typed AppError classes',
      'Request Validation using Zod schemas with human-readable validation errors',
      'API Rate Limiting with sliding window algorithms',
      'Idempotency Keys for critical endpoints (e.g. payments, orders)'
    ],
    testQuestions: [
      'What is the difference between PUT (full replacement) and PATCH (partial update), and how should backend schemas handle them?',
      'How does an Idempotency-Key header prevent duplicate credit card charges when a user double-clicks submit or suffers network timeouts?'
    ],
    deliverable: 'Build a production-ready REST API boilerplate with Zod validation, global error handler, rate limiter, and OpenAPI (Swagger) documentation.',
    order: 11,
  },
  {
    stage: 'Stage 3: Scalable Backend, APIs & Database Systems',
    stageNumber: 3,
    stepNumber: 12,
    title: 'Relational Database Architecture: PostgreSQL & Indexing',
    category: 'database',
    description: 'Master PostgreSQL: database schema normalization, foreign keys, compound indexes, EXPLAIN ANALYZE query planning, and ACID transaction isolation.',
    keyConcepts: [
      'Relational Normalization (1NF, 2NF, 3NF) vs Intentional Denormalization',
      'B-Tree, Hash, and GIN/GiST indexes (when and where to apply them)',
      'Query Performance analysis using EXPLAIN ANALYZE (avoiding Sequential Scans)',
      'ACID Transactions with row-level locking (SELECT FOR UPDATE)',
      'Database Migrations workflow without downtime'
    ],
    testQuestions: [
      'When should you use a composite (compound) index in PostgreSQL, and why does the column order in the index matter?',
      'How do you prevent a race condition where two users buy the last item in inventory at the exact same millisecond?'
    ],
    deliverable: 'Design a PostgreSQL database for a booking system with seat reservations, write complex SQL queries with joins and CTEs, and optimize queries with indexes using EXPLAIN ANALYZE.',
    order: 12,
  },
  {
    stage: 'Stage 3: Scalable Backend, APIs & Database Systems',
    stageNumber: 3,
    stepNumber: 13,
    title: 'Document Database Architecture: MongoDB & Aggregations',
    category: 'database',
    description: 'Master MongoDB for modern web apps: embedding vs referencing, aggregation pipelines ($match, $group, $lookup, $facet), schema validation, and replica sets.',
    keyConcepts: [
      'Document Modeling: 1-to-Few (embedded) vs 1-to-Many (referenced)',
      'MongoDB Aggregation Pipeline: $match, $project, $group, $lookup, $unwind, $facet',
      'Compound Indexes & Sparse/TTL (Time-to-Live) indexes for expiring tokens',
      'MongoDB Atlas setup, replica sets & connection pooling',
      'MongoDB Transactions across multiple documents'
    ],
    testQuestions: [
      'When should data be embedded as sub-documents versus referenced with ObjectIds in MongoDB?',
      'How do you use $facet in a single MongoDB aggregation query to simultaneously return paginated results AND total category counts?'
    ],
    deliverable: 'Build a rich analytical dashboard API in MongoDB that calculates monthly revenue, top-selling categories, and user retention cohorts using the Aggregation Pipeline.',
    order: 13,
  },
  {
    stage: 'Stage 3: Scalable Backend, APIs & Database Systems',
    stageNumber: 3,
    stepNumber: 14,
    title: 'Modern ORMs & Query Layers: Prisma & Drizzle',
    category: 'database',
    description: 'Use ORMs effectively without the N+1 problem: schema migrations, relations, connection pooling in serverless environments (Prisma Accelerate / PgBouncer), and raw queries.',
    keyConcepts: [
      'Prisma Schema definition, relations, enums & embedded types',
      'The N+1 Query Problem: diagnosing and eliminating it with proper includes/joins',
      'Connection pooling management in serverless environments (Vercel/AWS Lambda)',
      'Database seed scripts and automated migration pipelines',
      'Drizzle ORM vs Prisma trade-offs (SQL-like vs Object-oriented)'
    ],
    testQuestions: [
      'What causes the N+1 query trap when fetching a list of authors and their books, and how does Prisma resolve it?',
      'Why do serverless environments cause database connection pool exhaustion, and how does a connection pooler like PgBouncer solve it?'
    ],
    deliverable: 'Create an automated database seeder and benchmark query performance between an un-optimized query and an optimized Prisma query with index instrumentation.',
    order: 14,
  },
  {
    stage: 'Stage 3: Scalable Backend, APIs & Database Systems',
    stageNumber: 3,
    stepNumber: 15,
    title: 'Authentication, Authorization (RBAC) & Web Security',
    category: 'backend',
    description: 'Implement enterprise-level security: HTTP-only secure cookies, Web Crypto HMAC signed sessions, OAuth 2.0 (Google, GitHub), Role-Based Access Control (RBAC), and OWASP protections.',
    keyConcepts: [
      'Stateful Sessions vs Stateless JWTs vs HMAC-Signed Cookie tokens',
      'OAuth 2.0 & OpenID Connect flow (Authorization Code with PKCE)',
      'Role-Based Access Control (RBAC) and Permission-based gates (Admin, Member, Guest)',
      'OWASP Top 10 defenses: CSRF tokens, SameSite cookies, CORS whitelisting, XSS escaping',
      'Password hashing with bcrypt/argon2 with salt rounds'
    ],
    testQuestions: [
      'Why is storing auth tokens in localStorage vulnerable to XSS attacks, and why are HTTP-only Secure SameSite cookies the industry standard?',
      'How does constant-time string comparison prevent timing attacks during password or session signature verification?'
    ],
    deliverable: 'Build an authentication system from scratch supporting email/password with argon2, Google OAuth login, email verification tokens, and Role-Based middleware protection.',
    order: 15,
  },
  {
    stage: 'Stage 3: Scalable Backend, APIs & Database Systems',
    stageNumber: 3,
    stepNumber: 16,
    title: 'File Uploads, Cloud Storage (S3/R2) & Image Processing',
    category: 'backend',
    description: 'Handle media uploads at scale: direct client-to-cloud uploads using pre-signed URLs (AWS S3 / Cloudflare R2), mime-type validation, and server-side image compression with Sharp.',
    keyConcepts: [
      'Direct-to-S3 uploads with Pre-signed URLs (avoiding backend server bottleneck)',
      'Cloudflare R2 (zero egress fees) storage configuration',
      'Image resizing and WebP conversion with Sharp in Node.js',
      'Secure file validation: checking magic bytes vs file extensions',
      'Content Delivery Network (CDN) edge caching for uploaded assets'
    ],
    testQuestions: [
      'Why should clients upload large video/image files directly to S3 via pre-signed URLs instead of sending them through your API server?',
      'How do you verify the true file type of an uploaded file using its binary magic numbers rather than trusting the filename extension?'
    ],
    deliverable: 'Build a secure file upload pipeline that generates S3/R2 pre-signed URLs, validates image dimensions, compresses variants with Sharp, and stores metadata in the database.',
    order: 16,
  },

  // ── STAGE 4: REAL-TIME & SYSTEM DESIGN ─────────────────────────────────────
  {
    stage: 'Stage 4: Real-Time Systems, Microservices & System Design',
    stageNumber: 4,
    stepNumber: 17,
    title: 'Real-Time Communication: WebSockets & Server-Sent Events',
    category: 'backend',
    description: 'Build live, interactive web apps: WebSockets for bidirectional communication (chat, multiplayer), Server-Sent Events (SSE) for unidirectional streaming (AI responses, notifications).',
    keyConcepts: [
      'WebSockets (ws / Socket.io) handshake, heartbeat & reconnection logic',
      'Server-Sent Events (SSE) for live streaming (e.g. ChatGPT-style token streams)',
      'WebSocket scaling with Redis Pub/Sub across multiple server instances',
      'Presence detection: online/offline status tracking with heartbeat intervals',
      'Message deduplication and guaranteed order delivery'
    ],
    testQuestions: [
      'When should you choose Server-Sent Events (SSE) over WebSockets, and why is SSE simpler to proxy through HTTP/2 and Nginx?',
      'How do you ensure chat messages broadcast to all users when your application is running on 3 separate server instances?'
    ],
    deliverable: 'Build a real-time collaborative workspace with live room chat, online active user indicators, and an AI chat assistant with token-by-token SSE streaming.',
    order: 17,
  },
  {
    stage: 'Stage 4: Real-Time Systems, Microservices & System Design',
    stageNumber: 4,
    stepNumber: 18,
    title: 'High-Performance Caching & Background Queues with Redis',
    category: 'backend',
    description: 'Scale read/write performance: Redis data structures (Strings, Hashes, Sets, Sorted Sets), Cache-Aside pattern, Cache Invalidation, and Background Job Queues with BullMQ.',
    keyConcepts: [
      'Redis in-memory caching: Cache-Aside pattern, TTL, and Cache Stampede prevention',
      'Background Task Processing with BullMQ (email sending, report generation, video processing)',
      'Worker concurrency, retry logic with exponential backoff & dead letter queues',
      'Distributed Locks with Redis (Redlock algorithm)',
      'Rate limiting using Redis Sliding Window'
    ],
    testQuestions: [
      'What is a Cache Stampede (Thundering Herd) problem and how do probabilistic early expiration or mutex locks prevent it?',
      'How does a Dead Letter Queue (DLQ) in BullMQ handle background jobs that repeatedly fail after maximum retries?'
    ],
    deliverable: 'Build an asynchronous PDF/report generation system: client enqueues a request, receives a job ID, workers process the report in background with BullMQ, and client is notified when ready.',
    order: 18,
  },
  {
    stage: 'Stage 4: Real-Time Systems, Microservices & System Design',
    stageNumber: 4,
    stepNumber: 19,
    title: 'System Design Fundamentals: Scaling to 100K+ Users',
    category: 'system-design',
    description: 'Learn the architectural principles used by senior engineers: horizontal scaling, load balancing algorithms, database sharding/replication, CDN edge caching, and stateless backends.',
    keyConcepts: [
      'Vertical vs Horizontal Scaling and stateless server architecture',
      'Load Balancer algorithms: Round Robin, Least Connections, IP Hash',
      'Database Read Replicas vs Write Master setup',
      'CAP Theorem (Consistency, Availability, Partition Tolerance)',
      'Content Delivery Networks (CDNs) and Edge compute'
    ],
    testQuestions: [
      'How would you design a URL shortener like bit.ly to handle 100 million URLs with low-latency redirects and high availability?',
      'How does database read replication distribute read-heavy query loads without impacting write performance?'
    ],
    deliverable: 'Write a comprehensive architectural blueprint document for a high-traffic social media feed system with database schema, caching strategy, and bottleneck mitigation.',
    order: 19,
  },
  {
    stage: 'Stage 4: Real-Time Systems, Microservices & System Design',
    stageNumber: 4,
    stepNumber: 20,
    title: 'Microservices & Event-Driven Architecture',
    category: 'system-design',
    description: 'Understand modern service boundaries: when to stay monolith vs when to split into services, message brokers (Kafka/RabbitMQ/Redis Streams), and API Gateways.',
    keyConcepts: [
      'Modular Monolith vs Microservices trade-offs',
      'API Gateway pattern: routing, authentication, rate limiting at the edge',
      'Event-Driven Architecture (Publish/Subscribe with message brokers)',
      'Saga Pattern for distributed transactions across independent services',
      'Database-per-service pattern and eventual consistency'
    ],
    testQuestions: [
      'What is the Saga Pattern, and how do compensating transactions roll back partial changes across microservices when an order fails?',
      'Why is a well-structured Modular Monolith often superior to premature microservices for small and medium teams?'
    ],
    deliverable: 'Design an event-driven e-commerce order processing flow where an order event independently triggers the inventory service, email notification service, and billing service.',
    order: 20,
  },
  {
    stage: 'Stage 4: Real-Time Systems, Microservices & System Design',
    stageNumber: 4,
    stepNumber: 21,
    title: 'Resilience Engineering: Circuit Breakers & Graceful Degradation',
    category: 'system-design',
    description: 'Ensure 99.9% uptime even when third-party services fail: circuit breakers, exponential backoff retries, fallback responses, and health check endpoints.',
    keyConcepts: [
      'Circuit Breaker pattern states: Closed, Open, Half-Open',
      'Exponential backoff with jitter for network retries',
      'Graceful Degradation: serving stale cache when upstream APIs fail',
      'Health check endpoints (/health/live, /health/ready) for orchestrators',
      'Graceful shutdown handling in Node.js (SIGTERM / SIGINT)'
    ],
    testQuestions: [
      'How does adding "jitter" (randomized delay) to exponential backoff prevent network retry collisions?',
      'How do you implement graceful shutdown in Node.js so active HTTP requests and database queries finish before the server exits?'
    ],
    deliverable: 'Implement a resilient API client wrapper with built-in circuit breaker, timeout guards, and fallback caching for a third-party weather or financial API.',
    order: 21,
  },

  // ── STAGE 5: DEVOPS, CLOUD & PRODUCTION READINESS ──────────────────────────
  {
    stage: 'Stage 5: DevOps, Cloud Infrastructure & Automated Testing',
    stageNumber: 5,
    stepNumber: 22,
    title: 'Docker & Multi-Stage Production Containerization',
    category: 'devops',
    description: 'Package applications for production: Dockerfiles, multi-stage builds (reducing image size from 1GB to <100MB), .dockerignore, and multi-container Docker Compose environments.',
    keyConcepts: [
      'Docker images vs containers, layers & build caching',
      'Multi-stage Dockerfile for Next.js and Node.js production builds',
      'Non-root user execution inside containers for security',
      'Docker Compose for local development (App + Postgres + Redis + MongoDB)',
      'Volume mounts for persistent database data'
    ],
    testQuestions: [
      'How does multi-stage building in a Dockerfile drastically reduce the final image size and keep development dependencies out of production?',
      'Why is running a container as the root user dangerous in production environments?'
    ],
    deliverable: 'Write a production-ready multi-stage Dockerfile for Next.js with standalone output and a docker-compose.yml file running the app, MongoDB, and Redis with healthchecks.',
    order: 22,
  },
  {
    stage: 'Stage 5: DevOps, Cloud Infrastructure & Automated Testing',
    stageNumber: 5,
    stepNumber: 23,
    title: 'CI/CD Automation with GitHub Actions',
    category: 'devops',
    description: 'Automate quality and deployments: GitHub Actions workflows for automated typechecking, linting, unit test execution, Docker image building, and automated deployment.',
    keyConcepts: [
      'GitHub Actions syntax: triggers, jobs, steps, matrices & secrets',
      'Automated Pull Request validation pipeline (TypeScript check, ESLint, Tests)',
      'Docker image build & push to GitHub Container Registry (GHCR) or Docker Hub',
      'Deployment webhooks or SSH-based automated VPS deployments',
      'Caching dependencies (node_modules) to accelerate CI build times'
    ],
    testQuestions: [
      'How do you securely pass environment secrets (database URLs, API tokens) into a GitHub Actions workflow without leaking them in logs?',
      'How do you configure GitHub branch protection to block merges unless all CI pipeline checks pass?'
    ],
    deliverable: 'Create a complete .github/workflows/ci.yml pipeline that validates PRs with lint, test, and typecheck, and automatically deploys the main branch upon merge.',
    order: 23,
  },
  {
    stage: 'Stage 5: DevOps, Cloud Infrastructure & Automated Testing',
    stageNumber: 5,
    stepNumber: 24,
    title: 'Linux VPS Deployment, Nginx Reverse Proxy & SSL',
    category: 'devops',
    description: 'Deploy like a DevOps pro: provision an Ubuntu VPS (DigitalOcean/Hetzner/AWS EC2), configure UFW firewall, setup Nginx reverse proxy with SSL via Let’s Encrypt Certbot, and manage processes with PM2 or Docker.',
    keyConcepts: [
      'SSH key authentication & disabling root password login',
      'Nginx reverse proxy configuration: proxy_pass, headers, gzip compression, caching',
      'Free automated SSL certificates with Let’s Encrypt Certbot & auto-renewal cron',
      'PM2 process manager: clustering mode, logs, auto-restart on system reboot',
      'UFW (Uncomplicated Firewall) configuration (ports 22, 80, 443)'
    ],
    testQuestions: [
      'How does Nginx act as a reverse proxy between the public internet and an internal Node.js port (e.g. localhost:3000)?',
      'How does PM2 cluster mode utilize all available CPU cores of a multi-core server for a single Node.js application?'
    ],
    deliverable: 'Provision a cloud Linux server, set up an Nginx reverse proxy block with HTTPS/SSL, and run a live production Node.js application managed by PM2 or Docker.',
    order: 24,
  },
  {
    stage: 'Stage 5: DevOps, Cloud Infrastructure & Automated Testing',
    stageNumber: 5,
    stepNumber: 25,
    title: 'Observability: Sentry Error Tracking & Structured Logging',
    category: 'devops',
    description: 'Never be in the dark about production bugs: Sentry error monitoring with source maps, structured JSON logging with Pino, uptime alerts, and user action breadcrumbs.',
    keyConcepts: [
      'Sentry SDK integration in client, server & edge runtimes',
      'Uploading source maps securely so production errors reveal exact TypeScript file lines',
      'Structured Logging: JSON log output with log levels (debug, info, warn, error)',
      'Contextual metadata in logs: user ID, request ID, execution duration',
      'Uptime monitoring & automated Slack/Discord/Telegram incident alerts'
    ],
    testQuestions: [
      'Why are structured JSON logs essential when searching through millions of log lines with Datadog or Grafana Loki?',
      'How do Sentry breadcrumbs help you reconstruct the exact user actions that led up to a crash?'
    ],
    deliverable: 'Integrate Sentry into a Next.js application, trigger a test error in production, and verify the stack trace correctly maps back to the original TypeScript source code.',
    order: 25,
  },
  {
    stage: 'Stage 5: DevOps, Cloud Infrastructure & Automated Testing',
    stageNumber: 5,
    stepNumber: 26,
    title: 'Automated Testing: Unit, Integration & End-to-End (Playwright)',
    category: 'frontend',
    description: 'Ship with complete confidence: Unit testing pure functions with Vitest, integration testing API routes and database calls, and E2E testing critical user flows with Playwright.',
    keyConcepts: [
      'Testing Pyramid: Unit vs Integration vs End-to-End (E2E) tests',
      'Vitest for blazing-fast TypeScript unit tests with mocking',
      'Testing React components with React Testing Library (queries by role/text)',
      'Playwright for cross-browser automated user journeys (login, checkout, form submit)',
      'Mocking network requests with MSW (Mock Service Worker)'
    ],
    testQuestions: [
      'Why should you test components by user-visible text/role rather than CSS classes or component state?',
      'How does Playwright auto-waiting reduce flaky tests compared to hardcoded sleep timeouts?'
    ],
    deliverable: 'Write a full Playwright E2E test suite covering user sign-up, login, creating an item, and verifying the item appears in the UI list.',
    order: 26,
  },

  // ── STAGE 6: MONETIZATION, FREELANCE & REMOTE CAREER ───────────────────────
  {
    stage: 'Stage 6: Monetization, Freelance Mastery & Remote High-Paying Career',
    stageNumber: 6,
    stepNumber: 27,
    title: 'Capstone SaaS #1: B2B Multi-Tenant Platform with Stripe Billing',
    category: 'monetization',
    description: 'Build an undeniable showcase product: a full-featured B2B SaaS application with multi-tenancy, authentication, subscription billing with Stripe webhooks, team roles, and analytics.',
    keyConcepts: [
      'Multi-tenant database schema architecture (tenant_id isolation)',
      'Stripe Checkout & Billing Portal integration (monthly/annual tiers)',
      'Stripe Webhook handler (handling invoice.payment_succeeded, customer.subscription.deleted)',
      'Team invitations & Member management with role permissions',
      'Production landing page with pricing table and feature breakdown'
    ],
    testQuestions: [
      'How do you verify Stripe webhook signatures to prevent forged payment events?',
      'How do you handle subscription cancellations: should a user lose access immediately or at the end of their current billing cycle?'
    ],
    deliverable: 'Deploy Capstone SaaS #1 with live Stripe test/live mode checkout, multi-tenancy, and documented user onboarding flow.',
    order: 27,
  },
  {
    stage: 'Stage 6: Monetization, Freelance Mastery & Remote High-Paying Career',
    stageNumber: 6,
    stepNumber: 28,
    title: 'Capstone SaaS #2: Real-Time Collaborative Product with Live Users',
    category: 'monetization',
    description: 'Build your second flagship capstone: a real-time collaborative product (e.g. project board, live canvas, or AI productivity tool) showcasing real-time synchronization, websockets, and AI integration.',
    keyConcepts: [
      'Live collaboration & conflict resolution (OT or CRDT basics)',
      'AI Integration: LLM API integration with streaming and function calling',
      'Public release on ProductHunt, Twitter/X, and Reddit for real user traffic',
      'Onboarding analytics and user feedback collection loop'
    ],
    testQuestions: [
      'How do you demonstrate real user traction (active accounts, feedback, stars) on your portfolio to stand out to international employers?',
      'How do you optimize LLM API costs when serving thousands of user prompts?'
    ],
    deliverable: 'Launch Capstone SaaS #2 publicly, link it to your portfolio with video walkthrough, and gather your first 25 real registered users.',
    order: 28,
  },
  {
    stage: 'Stage 6: Monetization, Freelance Mastery & Remote High-Paying Career',
    stageNumber: 6,
    stepNumber: 29,
    title: 'High-Ticket Freelance Blueprint: Upwork & Direct Client Acquisition',
    category: 'monetization',
    description: 'Turn your full-stack skills into immediate income ($1,000 to $5,000+ per project): high-converting Upwork profile, winning proposals, project scoping, and value-based pricing.',
    keyConcepts: [
      'Specialized Upwork Profile setup (focusing on client outcomes, not just languages)',
      'Winning proposal template: opening hook, identifying real problem, video loom pitch, call to action',
      'Value-Based Pricing vs Hourly Rates (charging for business value, not hours spent)',
      'Milestone-based project scoping & avoiding scope creep',
      'Landing repeat clients and retainer agreements ($1.5k–$3k/month)'
    ],
    testQuestions: [
      'Why do generic "Dear Sir, I am an expert with 5 years experience" proposals fail 99% of the time, and what 3-sentence hook wins client interviews?',
      'How do you price a project based on client revenue potential rather than an hourly wage?'
    ],
    deliverable: 'Set up an optimized Upwork profile, write 3 personalized proposals with custom Loom video teardowns for active job postings, and submit them.',
    order: 29,
  },
  {
    stage: 'Stage 6: Monetization, Freelance Mastery & Remote High-Paying Career',
    stageNumber: 6,
    stepNumber: 30,
    title: 'Direct Client Outreach: Cold Pitching & LinkedIn Authority',
    category: 'monetization',
    description: 'Acquire clients without platform fees: find funded startups and agency owners on LinkedIn and Twitter, craft hyper-relevant cold email pitches, and pitch web app rebuilds.',
    keyConcepts: [
      'Finding target clients: YCombinator companies, Wellfound (AngelList), LinkedIn Sales Navigator',
      'Auditing prospective client websites: finding broken performance, outdated design, or missing features',
      'The "Loom Teardown Pitch": recorded 2-minute video offering constructive fixes for their product',
      'Follow-up sequences (3 polite value-add followups over 14 days)',
      'Converting discovery calls into closed contracts'
    ],
    testQuestions: [
      'What makes a cold email get opened and responded to by a busy startup founder?',
      'How does recording a 2-minute video walking through a founder’s app make you 10x more memorable than plain text pitches?'
    ],
    deliverable: 'Compile a targeted list of 20 prospective startup founders or agencies and send personalized Loom video pitches offering specific architectural or UI improvements.',
    order: 30,
  },
  {
    stage: 'Stage 6: Monetization, Freelance Mastery & Remote High-Paying Career',
    stageNumber: 6,
    stepNumber: 31,
    title: 'International Remote Job Hunt & Technical Interview Prep',
    category: 'monetization',
    description: 'Crack high-paying international remote roles ($40k to $100k+/year): resume optimization for ATS filters, behavioral interview STAR method, live coding challenge confidence.',
    keyConcepts: [
      'One-page High-Impact Tech Resume (action verbs, quantifiable metrics, tech stack tags)',
      'Target remote job boards: RemoteOK, WeWorkRemotely, Wellfound, Arc.dev, LinkedIn',
      'Behavioral Interview mastery: answering "Tell me about a time you solved a hard bug" using STAR',
      'Live Coding etiquette: thinking out loud, clarifying assumptions, testing edge cases',
      'Negotiating remote salary offers and stock options'
    ],
    testQuestions: [
      'How do you structure an answer using the STAR method (Situation, Task, Action, Result) with measurable metrics?',
      'Why is talking through your thought process more important to interviewers than getting the exact right answer immediately?'
    ],
    deliverable: 'Create an ATS-friendly single-page resume with quantifiable achievements for your projects, and conduct 2 mock technical interviews with recorded self-reviews.',
    order: 31,
  },
  {
    stage: 'Stage 6: Monetization, Freelance Mastery & Remote High-Paying Career',
    stageNumber: 6,
    stepNumber: 32,
    title: 'Global Payment Setup, Contracts & Financial Automation',
    category: 'monetization',
    description: 'Set up seamless international financial pipelines to receive payments in USD/EUR/GBP into your local bank: Wise, Payoneer, contracts, and invoicing automation.',
    keyConcepts: [
      'Setting up Wise Business & Payoneer accounts for receiving international client wire transfers (ACH / SEPA)',
      'Contract Agreements: Non-Disclosure (NDA), Independent Contractor Agreement, Statement of Work (SOW)',
      '50% Upfront Deposit rule for freelance software projects',
      'Tax compliance, foreign remittance incentives, and invoicing automation',
      'Reinvesting earnings into developer tools, hardware, and recurring revenue SaaS assets'
    ],
    testQuestions: [
      'Why should you never write a single line of client code without a signed contract and a 50% upfront deposit?',
      'How do multi-currency receiving accounts in Wise allow US and European clients to pay you via standard local bank transfers without expensive wire fees?'
    ],
    deliverable: 'Draft a standard Master Services Agreement (contract) template, configure your Wise/Payoneer payment receiving details, and connect them to your admin savings ledger.',
    order: 32,
  },
]
