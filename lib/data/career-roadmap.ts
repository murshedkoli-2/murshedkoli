export interface CareerTaskExam {
  prompt: string
  rubric: string[]
  referenceSolution: string
  testQuestions?: string[]
}

export interface CareerTaskSubmission {
  answerText: string
  codeSnippet?: string
  repoUrl?: string
  submittedAt?: string
}

export interface CareerTaskEvaluation {
  score: number
  passed: boolean
  summary: string
  strengths: string[]
  improvements: string[]
  seniorTips: string
  evaluatedAt: string
  evaluator: 'ai' | 'self'
}

export interface CareerTask {
  id: string
  title: string
  description: string
  estimatedMinutes: number
  status: 'todo' | 'in_progress' | 'completed'
  completedAt?: string | null
  exam: CareerTaskExam
  submission?: CareerTaskSubmission
  evaluation?: CareerTaskEvaluation
}

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
  tasks?: CareerTask[]
}

/**
 * Generates structured, high-value granular sub-tasks for any career milestone.
 * Each sub-task includes a dedicated coding challenge/exam prompt, evaluation rubric,
 * and a senior engineer benchmark reference solution.
 */
export function generateDefaultTasksForStep(step: {
  id?: string
  stepNumber?: number
  title: string
  category: string
  description: string
  keyConcepts?: string[]
  testQuestions?: string[]
  deliverable?: string
}): CareerTask[] {
  const baseId = step.id || `step-${step.stepNumber || 1}`
  const concepts = step.keyConcepts && step.keyConcepts.length > 0
    ? step.keyConcepts
    : ['Core Architecture', 'Design Patterns', 'Performance & Safety']
  const questions = step.testQuestions && step.testQuestions.length > 0
    ? step.testQuestions
    : ['How does this system behave under high concurrent load?', 'What are the main edge cases and failure modes?']
  const deliverable = step.deliverable || `Build a production-grade module demonstrating ${step.title}.`

  return [
    {
      id: `${baseId}-t1`,
      title: `Micro-Topic Deep Dive: ${concepts[0]}`,
      description: `Master the internal mechanics, runtime execution lifecycle, and mental model of ${concepts[0]}.`,
      estimatedMinutes: 30,
      status: 'todo',
      exam: {
        prompt: `Explain the technical mechanics and architectural implications of "${concepts[0]}" in modern production systems. Highlight:
1. Exact execution flow or type evaluation order.
2. How this prevents runtime failure or resource leaks.
3. Common anti-patterns to avoid.`,
        rubric: [
          'Thorough technical explanation without superficial buzzwords',
          'Demonstrates execution lifecycle or underlying mechanics accurately',
          'Identifies memory, concurrency, or performance pitfalls',
        ],
        referenceSolution: `// BENCHMARK REFERENCE SOLUTION: ${concepts[0]}
// Core Principle:
// In enterprise systems, ${concepts[0]} guarantees deterministic execution and resource predictability.
// Key Points:
// 1. Separation of concerns: Keep core state logic decoupled from transport/UI wrappers.
// 2. Failure modes: Always handle edge cases like null/undefined boundaries, memory leaks, or unhandled rejections.
// 3. Performance: Minimize unnecessary allocations, avoid synchronous blocking on hot paths.`,
      },
    },
    {
      id: `${baseId}-t2`,
      title: `Interview Coding Challenge: ${concepts[1] || 'Core Mechanics'}`,
      description: `Implement production-ready code handling edge cases for: ${questions[0] || concepts[1] || concepts[0]}.`,
      estimatedMinutes: 45,
      status: 'todo',
      exam: {
        prompt: questions[0] || `Write a production-ready implementation demonstrating ${concepts[1] || concepts[0]}, with robust error handling and type safety.`,
        rubric: [
          'Correct implementation handling edge cases and empty states',
          'Strict type safety with no unsafe \`any\` assertions',
          'Clean, idiomatic structure following SOLID principles',
        ],
        referenceSolution: `// BENCHMARK REFERENCE IMPLEMENTATION
// Highlights:
// - Defensive programming with input validation
// - Clean functional or class-based interfaces
// - Safe resource cleanup and error propagation
export async function executeProductionPattern<T>(input: T): Promise<{ success: boolean; data: T }> {
  try {
    if (!input) throw new Error('Invalid input parameter');
    return { success: true, data: input };
  } catch (error) {
    console.error('Execution failure:', error);
    throw error;
  }
}`,
      },
    },
    {
      id: `${baseId}-t3`,
      title: `Capstone Deliverable: ${deliverable.slice(0, 48)}…`,
      description: deliverable,
      estimatedMinutes: 60,
      status: 'todo',
      exam: {
        prompt: `Build and document the project deliverable: "${deliverable}". Provide your implementation code or repository URL, and outline your architectural choices.`,
        rubric: [
          'Fully functional implementation meeting deliverable specifications',
          'Clean modular organization (repositories, services, or component layers)',
          'Clear documentation or architectural explanation',
        ],
        referenceSolution: `// DELIVERABLE ARCHITECTURAL BLUEPRINT
// 1. Architecture: Modular layer (Types -> Service -> Controller / Hook -> View)
// 2. Testing: Unit test core pure functions, integration test async flows
// 3. Deployment Readiness: Zero hardcoded secrets, environment variable configuration, clean build pass.`,
      },
    },
    {
      id: `${baseId}-t4`,
      title: `Senior Interview Defense: ${questions[1] ? 'Architecture & Scaling' : 'System Review'}`,
      description: `Prepare for staff/senior-level technical evaluations on ${step.title}.`,
      estimatedMinutes: 30,
      status: 'todo',
      exam: {
        prompt: questions[1] || `How would you architect this feature to scale to 100,000+ users with high availability and minimal latency?`,
        rubric: [
          'Demonstrates senior-level understanding of trade-offs (e.g. latency vs consistency)',
          'Clear reasoning between competing technical approaches',
          'Actionable observability, monitoring, and failure recovery plans',
        ],
        referenceSolution: `// SENIOR INTERVIEW & SYSTEM ARCHITECTURE EVALUATION
// Trade-offs:
// - Caching Strategy: Use Redis or edge cache for P99 < 50ms reads with TTL and cache invalidation hooks.
// - Resilience: Implement circuit breakers and graceful degradation during partial outages.
// - Observability: Structured JSON logging, OpenTelemetry traces, and error alerts.`,
      },
    },
  ]
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
    description: 'Master how JavaScript executes under the hood: V8 JIT compiler, microtasks vs macrotasks, heap memory management, mark-and-sweep GC, closures, and DOM event delegation.',
    keyConcepts: [
      'V8 Engine Architecture: Ignition Bytecode Interpreter & TurboFan JIT Compiler',
      'Hidden Classes (Shapes) & Inline Caching (Monomorphic vs Polymorphic vs Megamorphic)',
      'Event Loop Checkpoints: Microtask Queue (queueMicrotask, Promise.then, MutationObserver)',
      'Macrotask Queue (setTimeout, setInterval, setImmediate, I/O) vs requestAnimationFrame & requestIdleCallback',
      'V8 Heap Memory: New Space (Nursery/Intermediate) vs Old Space (Tenured) & Scavenge vs Mark-and-Sweep GC',
      'Memory Leaks: Detached DOM nodes, dangling event listeners, forgotten intervals & WeakMap/WeakSet GC mechanics',
      'Closures, Lexical Environments, Scope Chains & Variable Hoisting (var vs let/const Temporal Dead Zone)',
      'Prototypal Inheritance: Prototype Chain (__proto__ vs prototype), Object.create(null) dictionary mode & call/apply/bind',
      'DOM Event Dispatch Lifecycle: Capturing Phase, Target Phase, Bubbling Phase & Passive Event Listeners'
    ],
    testQuestions: [
      'What is the exact execution order between Promise.resolve().then(), setTimeout(..., 0), queueMicrotask(), requestAnimationFrame(), and console.log()? Explain why microtask starvation occurs.',
      'How does V8 optimize property lookups using Hidden Classes and Inline Caching, and what code patterns trigger deoptimization?',
      'How does the Mark-and-Sweep garbage collection algorithm detect unreachable objects, and how do detached DOM elements create memory leaks?',
      'Write a complete Promise.all and Promise.race polyfill from scratch with error propagation and non-array input validation.',
      'What is the difference between Object.freeze(), Object.seal(), and Object.preventExtensions() in terms of property addition, deletion, and mutation?'
    ],
    deliverable: 'Build a custom JavaScript event emitter and promise queue manager with concurrency limiting and event delegation from scratch with zero dependencies.',
    order: 1,
  },
  {
    stage: 'Stage 1: Core Foundation & Advanced TypeScript Architecture',
    stageNumber: 1,
    stepNumber: 2,
    title: 'Advanced TypeScript: Generics, Discriminated Unions & Type-Level Programming',
    category: 'frontend',
    description: 'Move beyond basic types. Master generic constraints, conditional types, infer keyword, mapped types, template literal types, variance, and strict type-safe runtime validation.',
    keyConcepts: [
      'Generic Constraints & Default Types (<T extends Record<string, unknown> = Record<string, unknown>>)',
      'Discriminated (Tagged) Unions for Exhaustive Pattern Matching with the never type',
      'Conditional Types (T extends U ? X : Y) & Type Extraction using the infer keyword',
      'Mapped Types, Key Remapping (as NewKey<K>) & Modifiers (+readonly, -readonly, +?, -?)',
      'Template Literal Types (${string}.${string}) & Intrinsic String Manipulation Types',
      'Custom Type Guards (val is T) & Assertion Signatures (asserts val is string)',
      'Type Variance: Covariance in return types vs Contravariance in function arguments under strictFunctionTypes',
      'Type vs Interface: Declaration merging, mapped type compatibility, and compiler performance',
      'The satisfies Operator vs as Type Assertion (preventing widening without muting checks)',
      'Runtime Schema Validation with Zod: Safe parsing (.safeParse()), transformations, and z.infer<typeof Schema>'
    ],
    testQuestions: [
      'How does the `satisfies` operator differ from a standard type annotation and an `as` type assertion in TypeScript? Provide a production example.',
      'Build a recursive utility type `DeepReadonly<T>` from scratch that makes all nested object properties, arrays, and tuples readonly.',
      'How do you write an exhaustive switch statement using `never` that fails TypeScript compilation if an engineer adds a new variant to a discriminated union without handling it?',
      'Build a type-safe EventBus class where `.on(event, handler)` and `.emit(event, payload)` strictly enforce payload types mapped to specific event names.',
      'Explain why function parameter types are contravariant while return types are covariant when `strictFunctionTypes` is enabled in tsconfig.json.'
    ],
    deliverable: 'Build a fully type-safe CRUD query builder library with generic filtering, sorting, and pagination typing validated with Zod schemas.',
    order: 2,
  },
  {
    stage: 'Stage 1: Core Foundation & Advanced TypeScript Architecture',
    stageNumber: 1,
    stepNumber: 3,
    title: 'Clean Code, SOLID Principles & Design Patterns',
    category: 'system-design',
    description: 'Write code that engineering teams love to maintain. Learn Single Responsibility, Open/Closed, Dependency Inversion, Factory, Singleton, Observer, and Strategy patterns in TypeScript.',
    keyConcepts: [
      'Single Responsibility Principle (SRP): Isolating business rules, data access, and presentation layers',
      'Open/Closed Principle (OCP): Extending functionality via interfaces and polymorphism without modifying tested source code',
      'Liskov Substitution Principle (LSP): Subtype substitutability without breaking client expectations',
      'Interface Segregation Principle (ISP): Thin, client-specific interfaces over bloated god interfaces',
      'Dependency Inversion Principle (DIP): Inversion of Control (IoC) containers & constructor dependency injection',
      'Creational Patterns: Factory Method, Abstract Factory, and Builder Pattern',
      'Structural Patterns: Adapter Pattern (wrapping legacy/external SDKs) & Proxy Pattern',
      'Behavioral Patterns: Strategy Pattern (pluggable engines), Observer/Pub-Sub, and Chain of Responsibility',
      'Repository Pattern & Unit of Work for database abstraction'
    ],
    testQuestions: [
      'How do you apply the Strategy Pattern to dynamically swap payment gateways (Stripe vs PayPal vs SSLCommerz) without modifying core checkout logic?',
      'How does Dependency Inversion (DIP) decouple business logic from databases, allowing complete unit testing with in-memory mocks?',
      'Why is the Singleton pattern frequently considered an anti-pattern in distributed serverless systems, and how should shared state be managed instead?',
      'Refactor a monolithic 500-line controller handling validation, database access, email sending, and response formatting into clean SRP layers.'
    ],
    deliverable: 'Refactor a messy single-file script into a modular domain-driven architecture with repositories, services, and controller layers with 100% type safety.',
    order: 3,
  },
  {
    stage: 'Stage 1: Core Foundation & Advanced TypeScript Architecture',
    stageNumber: 1,
    stepNumber: 4,
    title: 'Professional Git, Branching & Production PR Workflows',
    category: 'devops',
    description: 'Work like a senior engineer on international engineering teams: conventional commits, interactive rebasing, merge conflict resolution, git bisect, reflog, and PR reviews.',
    keyConcepts: [
      'Git Internals & Data Model: Blobs, Trees, Commits, Tags & Directed Acyclic Graph (DAG)',
      'Three Trees Architecture: Working Directory, Staging Index & Commit History (HEAD)',
      'Trunk-Based Development vs GitFlow in modern high-velocity engineering teams',
      'Interactive Rebase (git rebase -i): Squashing, rewording, dropping, and fixup commits',
      'Fast-Forward Merge vs 3-Way Merge (--no-ff) vs Squash-and-Merge trade-offs',
      'Disaster Recovery with git reflog: Recovering deleted branches, detached HEADs, and lost commits',
      'Automated Bug Hunting with git bisect: Binary search debugging across commit histories',
      'Conventional Commits Specification (feat:, fix:, chore:, perf:, refactor:) & SemVer',
      'Husky Pre-commit Hooks, lint-staged & Commitlint automation'
    ],
    testQuestions: [
      'A junior developer ran `git reset --hard HEAD~3` and panicked because they lost uncommitted work from three commits. How do you recover those commits using `git reflog`?',
      'When should an engineering team use `git rebase` versus `git merge`, and what happens if you rebase commits already pushed to a public shared branch?',
      'Walk through the exact command sequence of using `git bisect` to locate which commit introduced a memory leak out of 500 recent commits.',
      'Explain the difference between `git pull` and `git fetch`, and why `git pull --rebase` is preferred in trunk-based development.'
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
    description: 'Develop algorithmic problem-solving instincts needed for technical interviews: Big O notation, HashMaps, Two-Pointers, Sliding Window, Monotonic Stacks, and Tree/Graph traversals.',
    keyConcepts: [
      'Complexity Analysis: Big-O, Big-Theta, Big-Omega, Worst-case, Average-case & Amortized Complexity',
      'Two Pointers: Opposite-direction pointers & Fast-and-Slow runner (Floyd Tortoise and Hare cycle detection)',
      'Sliding Window Technique: Fixed-size windows vs Dynamic/variable-size windows',
      'Hash Tables & Frequency Maps: Collision resolution (Chaining vs Open Addressing) & Prefix Sum caching',
      'Monotonic Stack & Queue: Next Greater Element, Daily Temperatures & Sliding Window Maximum',
      'Linked Lists: In-place reversal, cycle detection & LRU Cache implementation (Doubly-Linked List + HashMap)',
      'Trees & Binary Search Trees (BST): DFS (Pre/In/Post-order), BFS (Level-order traversal), LCA & Tree Validation',
      'Binary Search on Value Space: Boundary conditions (low <= high), search in rotated sorted array & capacity allocation',
      'Graphs: Adjacency list representation, DFS vs BFS, Cycle detection & Topological Sort (Kahn Algorithm)'
    ],
    testQuestions: [
      'Implement an LRU (Least Recently Used) Cache with `get(key)` and `put(key, value)` both running in strictly O(1) time complexity.',
      'How does the Sliding Window pattern reduce the time complexity of the "Minimum Window Substring" problem from O(N^2) to O(N)?',
      'Explain how Floyd Cycle-Finding Algorithm (Tortoise and Hare) detects a cycle in a linked list in O(N) time and O(1) space, and how it finds the cycle entrance node.',
      'How do you detect cycles in a directed graph using Topological Sort (Kahn Algorithm vs DFS three-color approach)?',
      'What is the amortized time complexity of dynamic array resizing (e.g. Array.push), and why is it O(1) rather than O(N)?'
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
    description: 'Master React 19 fundamentals: Fiber double-buffering reconciliation, React Server Components (RSC), Client Component boundaries, useActionState, useOptimistic, and Suspense streaming.',
    keyConcepts: [
      'React 19 Fiber Architecture: Fiber Nodes, Alternate Tree (Double Buffering) & 2-Phase Commit (Render vs Commit)',
      'Reconciliation Algorithm: Heuristic diffing, key stability, and avoiding index keys',
      'React Server Components (RSC): Zero-client JS bundle footprint & RSC Flight payload wire protocol',
      'Serialization Boundary: What can cross server-to-client boundaries (JSON-serializable, Promises, JSX)',
      'Server Actions (\'use server\'): Progressive enhancement, encrypted action IDs & CSRF protection',
      'useActionState Hook: Managing pending state, return data, and progressive form dispatch',
      'useOptimistic Hook: Zero-latency client feedback with automated rollback on server failure',
      'useTransition Hook: Non-blocking UI state updates & priority level scheduling',
      'Direct ref prop passing in function components (removal of forwardRef boilerplate)',
      'Resource Preloading APIs: React 19 native preload(), preinit(), and document head tags (<title>, <meta>)'
    ],
    testQuestions: [
      'Explain how React 19 Fiber reconciliation separates the Render Phase from the Commit Phase, and why Server Components execute entirely in the server phase.',
      'What is the RSC Flight wire format, and how does the browser reconstruct the virtual DOM without downloading component source code?',
      'How does `useOptimistic` work in conjunction with Server Actions? What happens to the UI if the Server Action throws an unhandled error?',
      'What are the exact serialization constraints when passing props across the Server Component to Client Component boundary?',
      'Why should you use `useTransition` instead of `setTimeout` to debounce or defer slow state updates in React 19?'
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
    description: 'Deep dive into Next.js 16 architecture: nested layouts, route groups, parallel routes (@slot), intercepting routes ((.)), route handlers, 4-tier caching, and Partial Prerendering (PPR).',
    keyConcepts: [
      'Routing System: File-system routes, Nested Layouts (layout.tsx) vs Templates (template.tsx re-mounting)',
      'Route Groups ((group)) for organizing routes and multi-layout isolation without affecting URL paths',
      'Parallel Routes (@modal, @sidebar) with default.tsx fallbacks for simultaneous independent views',
      'Intercepting Routes ((.)photos, (..)feed) for Instagram/Twitter-style modal overlays on soft navigation',
      'Next.js 16 4-Tier Caching Architecture: Request Memoization, Data Cache, Full Route Cache & Router Cache',
      'Cache Invalidation: revalidatePath(), revalidateTag(), unstable_cache, and Next.js 16 cacheLife directives',
      'Partial Prerendering (PPR): Combining static HTML shell prerendering with streaming dynamic Suspense holes',
      'Edge Middleware (middleware.ts): V8 isolate execution, URL rewrites, signed cookie auth & geo-routing',
      'Metadata API & Dynamic OG Images: generateMetadata() and @vercel/og ImageResponse generation'
    ],
    testQuestions: [
      'Explain the four caching layers in Next.js App Router (Request Memoization, Data Cache, Full Route Cache, Router Cache). How do you invalidate each?',
      'How do Parallel Routes (@slot) combined with Intercepting Routes ((.)) allow building a modal that opens as a popup on link click but renders as a full page on direct browser refresh?',
      'What is Partial Prerendering (PPR) in Next.js 16, and how does it combine the benefits of SSG and SSR in a single streaming response?',
      'What are the limitations of the Edge runtime in Next.js middleware, and why can’t you run arbitrary Node.js native libraries (e.g. bcrypt, fs) inside it?',
      'How does `template.tsx` differ from `layout.tsx`, and in what real-world scenarios must you use `template.tsx`?'
    ],
    deliverable: 'Build a multi-tenant blog engine with intercepting modal routes, dynamic OG image generation (@vercel/og), and ISR revalidation.',
    order: 7,
  },
  {
    stage: 'Stage 2: Modern Frontend Architecture & Next.js 16/React 19',
    stageNumber: 2,
    stepNumber: 8,
    title: 'Advanced State Architecture: Server State vs Client Store',
    category: 'frontend',
    description: 'Architect scalable frontend state. Master URL-driven search params, TanStack Query v5 cache mechanics, optimistic mutations, Zustand atomic selectors, and Context performance traps.',
    keyConcepts: [
      'URL as the Single Source of Truth for filters, pagination, sorting & search queries (useSearchParams / nuqs)',
      'Server State vs Client State: When to use server-rendered data vs client-cached state vs local UI state',
      'TanStack Query v5 (React Query): Query keys design, staleTime vs gcTime (cacheTime), and background refetching',
      'Optimistic Mutations in TanStack Query: onMutate context snapshot, onError rollback & onSettled invalidation',
      'Query Cancellation with AbortController to prevent race conditions during rapid user input',
      'Zustand Store Architecture: Atomic selectors, avoiding unnecessary component re-renders, and slice pattern',
      'Zustand Middleware: persist (localStorage syncing), devtools, and immer for immutable updates',
      'React Context Pitfalls: Context re-render propagation ("Context Hell") & splitting state from dispatch'
    ],
    testQuestions: [
      'Explain the difference between `staleTime` and `gcTime` in TanStack Query. What happens when a user revisits a page after staleTime has elapsed but before gcTime has expired?',
      'How do you implement an optimistic mutation in TanStack Query with automatic rollback when the server returns a 500 error?',
      'Why does updating a single value in a React Context cause all consuming components to re-render even if they only read an unchanged property, and how do you fix it?',
      'Compare Zustand with Redux Toolkit and React Context: what are the architectural trade-offs in bundle size, boilerplate, and selector performance?'
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
    description: 'Craft industry-grade interfaces with Apple/Linear level polish: CSS custom property tokens, Tailwind CSS, dark/light themes, keyboard navigation, Framer Motion, and WCAG AA accessibility.',
    keyConcepts: [
      'Design Token Architecture: CSS Custom Properties (--color-surface, --radius-lg) & semantic palette mapping',
      'Tailwind CSS Mastery: JIT compilation, arbitrary values, @layer directives & custom plugins',
      'Radix UI / Headless Primitives: Unstyled accessible components (Dialog, Popover, Dropdown, Tooltip, Accordion)',
      'Framer Motion Animation: Spring physics, layout animations (layoutId for shared element morphing) & AnimatePresence',
      'WCAG 2.1 AA Accessibility: Keyboard focus traps in modals, aria-expanded, aria-live regions & roving tabindex',
      'Preventing FOUC (Flash of Unstyled Content): Theme injection scripts & cookie-based theme synchronization',
      'Modern CSS Layout: CSS Grid subgrid, Flexbox gap, and Container Queries (@container) for component-level responsiveness',
      'Zero-Layout-Shift Skeleton Loaders with fluid CSS clamp() typography'
    ],
    testQuestions: [
      'How do you prevent theme flashing (Flash of Unstyled Content / FOUC) when loading a dark/light mode preference from cookies or localStorage in Next.js Server Components?',
      'How does Framer Motion’s `layoutId` calculate FLIP (First, Last, Invert, Play) animations across completely separate DOM elements?',
      'How do you build a fully accessible modal dialog from scratch that traps keyboard focus, closes on Escape, restores focus to the trigger element on close, and locks background scroll?',
      'Explain CSS Container Queries (@container) and why they are superior to Media Queries for reusable component design systems.'
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
    description: 'Make web applications blisteringly fast: Largest Contentful Paint (LCP), Interaction to Next Paint (INP), Cumulative Layout Shift (CLS), bundle auditing, and Chrome DevTools profiling.',
    keyConcepts: [
      'LCP (Largest Contentful Paint) < 2.5s: Identifying LCP candidate, fetchpriority="high", preloading hero assets & TTFB reduction',
      'INP (Interaction to Next Paint) < 200ms: Long tasks (>50ms), main thread blocking, scheduler.yield() & Web Workers',
      'CLS (Cumulative Layout Shift) < 0.1: Aspect-ratio reservations, font size-adjust & eliminating dynamic content layout jumps',
      'Image Optimization: next/image responsive sizes attribute, modern AVIF/WebP formats & blur placeholders',
      'Font Optimization: next/font with zero layout shift font swapping and pre-connect resource hints',
      'Bundle Auditing: Webpack Bundle Analyzer, tree-shaking principles & eliminating barrel file export overhead',
      'Dynamic Imports (next/dynamic) for code splitting heavy libraries (charts, rich-text editors, video players)',
      'Chrome DevTools Profiling: Performance recording, CPU throttling, Memory allocation timeline & Coverage tab'
    ],
    testQuestions: [
      'What is INP (Interaction to Next Paint), why did it replace FID (First Input Delay), and what concrete coding techniques reduce INP on complex data grids?',
      'Why is the `sizes` attribute in `next/image` essential, and what happens to network bandwidth if you omit it on responsive layouts?',
      'How do barrel files (`index.ts` exporting 100 components) hurt build time and bundle size, and how does Next.js optimize them?',
      'How do you diagnose and fix a high Cumulative Layout Shift (CLS) caused by custom web fonts swapping over fallback system fonts?'
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
    description: 'Design robust, developer-friendly RESTful APIs: clean status codes, idempotency keys, central error middleware, rate limiting algorithms, and request validation with Zod.',
    keyConcepts: [
      'REST Architectural Constraints: Statelessness, Client-Server separation, Cacheability & Uniform Interface',
      'HTTP Method Semantics: Safe methods (GET, HEAD) vs Idempotent methods (PUT, DELETE) vs Non-idempotent methods (POST, PATCH)',
      'HTTP Status Codes: 200, 201, 204, 304, 400, 401 (Unauthorized) vs 403 (Forbidden), 404, 409 (Conflict), 422, 429, 500, 502, 503, 504',
      'Standard JSON Envelopes: Consistent response formatting { success, data, error, meta: { page, limit, total } }',
      'Centralized Error Hierarchy: Operational errors vs Programmer errors, typed AppError classes & uncaught exception handling',
      'Request Validation using Zod: Sanitization, coercion, schema parsing, and human-readable field errors',
      'API Rate Limiting: Fixed Window vs Sliding Window Log vs Sliding Window Counter vs Token Bucket',
      'Idempotency Pattern: Idempotency-Key header, Redis response caching & distributed lock deduplication'
    ],
    testQuestions: [
      'What is the precise difference between HTTP 401 Unauthorized and HTTP 403 Forbidden? Give practical examples of when each must be returned.',
      'How do you implement the Idempotency-Key pattern in a payment API to guarantee a user is never double-charged even if their network disconnects mid-request?',
      'Compare the Token Bucket algorithm with the Sliding Window Counter algorithm for API rate limiting. What are the memory and precision trade-offs?',
      'How do you distinguish between operational errors and programmer errors in Node.js, and why should programmer errors trigger a graceful process restart?'
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
    description: 'Master PostgreSQL: database schema normalization, foreign keys, compound indexes, EXPLAIN ANALYZE query planning, ACID transaction isolation, and row-level locking.',
    keyConcepts: [
      'ACID Properties: Atomicity (WAL logging), Consistency (invariants/foreign keys), Isolation, and Durability',
      'Transaction Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, and Serializable',
      'Concurrency Anomalies: Dirty Reads, Non-repeatable Reads, Phantom Reads & Write Skew',
      'PostgreSQL Indexing Structures: B-Tree, Hash, GIN (JSONB/full-text), GiST, and BRIN indexes',
      'Composite Indexes & Leftmost Prefix Rule: Why column order in (tenant_id, status, created_at) matters',
      'Covering Indexes (INCLUDE clause) for Index-Only Scans & Partial Indexes (WHERE is_active = true)',
      'Query Performance analysis with EXPLAIN (ANALYZE, BUFFERS): Sequential Scan vs Index Scan vs Bitmap Index Scan',
      'Concurrency Control: Optimistic Locking (versioning) vs Pessimistic Locking (SELECT ... FOR UPDATE SKIP LOCKED)',
      'Relational Normalization (1NF, 2NF, 3NF) vs Intentional Denormalization for read-heavy workloads'
    ],
    testQuestions: [
      'Explain the Leftmost Prefix Rule in PostgreSQL composite indexes. Given an index on `(department_id, status, created_at)`, which queries will use the index and which will not?',
      'What is the difference between an Index Scan, a Bitmap Index Scan, and an Index Only Scan in PostgreSQL `EXPLAIN ANALYZE` output?',
      'How does `SELECT ... FOR UPDATE SKIP LOCKED` enable building a scalable, concurrent job processing queue directly in PostgreSQL without race conditions?',
      'Explain the "Write Skew" anomaly that occurs under Repeatable Read isolation level and how Serializable isolation or row-level locking prevents it.'
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
    description: 'Master MongoDB for modern web apps: embedding vs referencing, aggregation pipelines ($match, $group, $lookup, $facet), compound indexes, ESR rule, and replica sets.',
    keyConcepts: [
      'Data Modeling Patterns: 1-to-Few (embed), 1-to-Many (reference), Bucket Pattern (time series) & Subset Pattern',
      'MongoDB Aggregation Pipeline: $match, $project, $group, $lookup (left outer join), $unwind, and $sort',
      'Multi-Faceted Analytics with $facet: Generating paginated records, totals, and category breakdowns in 1 roundtrip',
      'Compound Indexes & The ESR Rule (Equality, Sort, Range) for optimal index design',
      'TTL (Time-To-Live) Indexes for expiring sessions & Sparse Indexes for optional unique fields',
      'MongoDB Storage Engine: WiredTiger, document-level locking, checkpoints & oplog replication',
      'Replica Sets & Consensus: Primary/Secondary election, Write Concern (w: majority, j: true) & Read Concern',
      'MongoDB Multi-Document ACID Transactions using ClientSessions'
    ],
    testQuestions: [
      'Explain the MongoDB ESR (Equality, Sort, Range) rule for designing compound indexes. Why does index order fail if Range precedes Sort?',
      'How do you write a single MongoDB aggregation pipeline using `$facet` to simultaneously fetch a paginated page of products and calculate category aggregations and price histograms?',
      'What is the difference between Write Concern `w: 1` and `w: majority` with `j: true`, and how does this affect data safety during primary node failover?',
      'When would embedding data in a MongoDB document cause the 16MB document size limit or document moving/reallocation performance penalties?'
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
      'ORM Architecture: Data Mapper vs Active Record, Prisma query engine vs Drizzle zero-abstraction SQL builder',
      'The N+1 Query Problem: Diagnosing sequential loop queries and eliminating them with eager loading / joins',
      'Serverless Connection Pool Exhaustion: AWS Lambda/Vercel spikes, PgBouncer (Transaction vs Session mode)',
      'Prisma Client Singleton Pattern (globalThis.prisma) to avoid connection leaks in Next.js hot reload',
      'Zero-Downtime Database Migrations: The Expand-and-Contract (Parallel Run) migration pattern',
      'Interactive Transactions (prisma.$transaction) vs Sequential batch operations',
      'Raw SQL execution ($queryRaw) with tagged templates to prevent SQL injection vulnerabilities',
      'Drizzle ORM vs Prisma trade-offs: Cold-start latency, bundle size, and developer ergonomics'
    ],
    testQuestions: [
      'What causes the N+1 query problem? Show an example of an N+1 query in an ORM and explain how both Prisma and raw SQL joins eliminate it.',
      'Why does deploying a serverless Next.js app on Vercel without a connection pooler like PgBouncer easily crash a PostgreSQL database with 100 concurrent users?',
      'Walk through the Expand-and-Contract (Parallel Run) migration pattern to rename a database column in production with zero downtime.',
      'Compare Prisma and Drizzle ORM: what are the trade-offs in cold-start latency, memory footprint, bundle size, and developer ergonomics?'
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
    description: 'Implement enterprise-level security: HTTP-only secure cookies, Web Crypto HMAC signed sessions, OAuth 2.0 with PKCE, Role-Based Access Control (RBAC), and OWASP protections.',
    keyConcepts: [
      'Authentication Architecture: Stateful Redis Sessions vs Stateless JWTs vs HMAC-Signed Cookie Tokens',
      'Refresh Token Rotation with Token Reuse Detection to prevent session hijacking',
      'Cookie Security Flags: HttpOnly (XSS defense), Secure (HTTPS), SameSite=Strict/Lax & Domain/Path scoping',
      'OAuth 2.0 & OpenID Connect: Authorization Code Flow with PKCE (code_verifier, code_challenge) & State parameter',
      'Authorization Models: Role-Based Access Control (RBAC: Admin, Manager, Member) & Permission Matrix Gates',
      'OWASP Top 10 Defenses: XSS (CSP headers, HTML encoding), CSRF (SameSite, double-submit cookie), SQL/NoSQL Injection',
      'CORS (Cross-Origin Resource Sharing): Preflight OPTIONS request, Access-Control-Allow-Origin, and credentials rules',
      'Password Hashing: Argon2id vs bcrypt vs PBKDF2 (salt rounds, memory cost) & crypto.timingSafeEqual'
    ],
    testQuestions: [
      'Why is storing JWT access tokens in browser localStorage considered a major security risk, and how do HTTP-only Secure SameSite cookies mitigate XSS and CSRF?',
      'Explain how OAuth 2.0 Authorization Code flow with PKCE works step-by-step. What security vulnerability does PKCE solve that standard Authorization Code flow couldn’t on mobile/SPAs?',
      'What is a timing attack in authentication, and how does `crypto.timingSafeEqual()` prevent attackers from guessing HMAC signatures byte-by-byte?',
      'Explain the exact lifecycle of a CORS preflight request: what headers does the browser send in `OPTIONS`, and what headers must the server return?'
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
    description: 'Handle media uploads at scale: direct client-to-cloud uploads using pre-signed URLs (AWS S3 / Cloudflare R2), mime-type magic byte validation, and server-side image compression with Sharp.',
    keyConcepts: [
      'Direct-to-S3 Uploads with Pre-Signed URLs: Eliminating API server CPU, RAM, and bandwidth bottlenecks',
      'Cloudflare R2 Storage: S3 API compatibility and zero egress fee economics',
      'S3 Multipart Uploads: Chunking large files (>100MB) for parallel upload and network resilience',
      'Binary Magic Number Validation: Verifying file headers (e.g. 89 50 4E 47 for PNG) vs spoofable extensions',
      'SVG Sanitization: Stripping embedded XML script tags to prevent stored XSS attacks',
      'Image Optimization Pipelines: Resizing, WebP/AVIF conversion, and metadata stripping with Sharp in Node.js',
      'Content Delivery Network (CDN) Caching: Cache-Control immutable headers, signed CloudFront URLs & video byte-range requests'
    ],
    testQuestions: [
      'Why should web applications use S3 Pre-signed URLs for client uploads rather than streaming files through the backend Node.js API server?',
      'How do you securely validate that an uploaded file is genuinely a PNG image rather than a malicious executable or SVG with an embedded XSS script?',
      'How do you implement an asynchronous image processing pipeline where an upload triggers background generation of multiple responsive image sizes without blocking the user?',
      'What are S3 Multipart Uploads, when should you switch from single-part PUT to multipart uploads, and how do you handle aborted/orphaned parts to avoid storage costs?'
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
      'Real-Time Protocols Comparison: Short Polling vs Long Polling vs Server-Sent Events (SSE) vs WebSockets',
      'Server-Sent Events (SSE): HTTP/2 multiplexing, text/event-stream, automatic browser reconnection & LLM token streaming',
      'WebSocket Protocol: HTTP Upgrade Handshake (Sec-WebSocket-Key), Full-duplex TCP framing & binary vs text frames',
      'WebSocket Scaling: Multi-node server instances, sticky sessions & Redis Pub/Sub backplane adapter',
      'Connection Reliability: Ping/Pong heartbeat frames for dead socket pruning & exponential backoff reconnection with jitter',
      'Presence Tracking: Online/offline status indicators with Redis TTL keys & room-based event broadcasting',
      'Message Deduplication & In-Order Delivery Guarantees in real-time chat systems'
    ],
    testQuestions: [
      'When should you choose Server-Sent Events (SSE) over WebSockets, and why is SSE significantly easier to scale and proxy over HTTP/2?',
      'How do you scale a WebSocket application horizontally across 10 Node.js server instances behind a load balancer so all connected users in a chat room receive messages instantly?',
      'How do Ping/Pong heartbeat frames detect half-open TCP connections, and what happens if you don’t implement heartbeats?',
      'How do you handle WebSocket reconnections gracefully without overwhelming the server in a reconnection storm when a temporary network outage occurs?'
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
      'Redis Core Data Structures: Strings (counters/caching), Hashes, Sets, Sorted Sets (ZSET leaderboards), and Streams',
      'Caching Strategies: Cache-Aside (Lazy Loading), Write-Through, Write-Behind (Write-Back) & Refresh-Ahead',
      'Cache Eviction Policies: allkeys-lru, volatile-lru, allkeys-lfu & TTL expiration management',
      'Cache Failure Modes: Cache Penetration (Bloom filters/null caching), Cache Avalanche (TTL jitter) & Cache Stampede (Thundering Herd)',
      'Probabilistic Early Expiration (XFetch algorithm) & Distributed Mutex Locks for stampede prevention',
      'Distributed Locking with Redis: SET NX PX pattern, Redlock algorithm & safe release via atomic Lua scripts',
      'Background Task Processing with BullMQ: Job lifecycle, worker concurrency, delayed jobs, retry backoff & Dead Letter Queues (DLQ)'
    ],
    testQuestions: [
      'Explain the Cache Stampede (Thundering Herd) problem. How does the XFetch (probabilistic early expiration) algorithm prevent it?',
      'How do you implement a distributed lock in Redis safely using `SET NX PX` and release it with an atomic Lua script?',
      'What is the difference between Cache Penetration and Cache Avalanche, and how do you prevent each in high-traffic architectures?',
      'How does BullMQ handle worker crashes midway through executing a background job, and how does it prevent the job from being permanently lost?'
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
    description: 'Learn architectural principles used by senior engineers: horizontal scaling, load balancing algorithms, database sharding/replication, CDN edge caching, and stateless backends.',
    keyConcepts: [
      'System Design 4-Step Framework: Clarify scope/scale, Define API/data model, High-level design & Deep-dive bottlenecks',
      'Vertical vs Horizontal Scaling: Stateless application architecture and externalized session storage',
      'Load Balancing Algorithms: Layer 4 vs Layer 7, Round Robin, Least Connections, IP Hash & Health Checks',
      'Distributed Data Systems: CAP Theorem (Consistency, Availability, Partition Tolerance) & PACELC Theorem',
      'Database Scaling: Read Replicas, Write Master & Managing Replication Lag (Read-Your-Own-Writes consistency)',
      'Database Sharding / Partitioning: Shard key selection, Range vs Hash partitioning, and cross-shard query penalties',
      'Consistent Hashing: Hash ring, virtual nodes (vnodes) & minimizing data migration during node add/remove',
      'Content Delivery Networks (CDNs) & Anycast Routing for global edge acceleration'
    ],
    testQuestions: [
      'Design a URL Shortener service (like bit.ly) to handle 100 million new URLs per month with low-latency redirects. Detail the ID generation strategy (Base62 vs Snowflake), database schema, and caching layer.',
      'Explain Consistent Hashing and how virtual nodes prevent hot-spotting when nodes are added or removed from a distributed cluster.',
      'How do you solve the "read-your-own-writes" consistency issue when a user updates their profile on the master database, but subsequent reads hit a read replica with 500ms replication lag?',
      'Walk through the CAP theorem: why is it physically impossible to have both Consistency and Availability during a network partition in a distributed system?'
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
    description: 'Understand modern service boundaries: when to stay monolith vs when to split into services, message brokers (Kafka/RabbitMQ), transactional outbox pattern, and Saga orchestration.',
    keyConcepts: [
      'Monolith vs Modular Monolith vs Microservices: Service boundary sizing and organizational Conway Law',
      'API Gateway Pattern: Reverse proxy, edge authentication, rate limiting, request routing & BFF (Backend For Frontend)',
      'Event-Driven Architecture: Publish/Subscribe mechanics, Message Brokers (Kafka vs RabbitMQ vs AWS SQS/SNS)',
      'Message Broker Semantics: Topics, Partitions, Consumer Groups, Offsets & At-least-once vs Exactly-once processing',
      'The Dual-Write Problem & Transactional Outbox Pattern: Atomic local DB state + event publishing via CDC / Polling',
      'Saga Pattern for Distributed Transactions: Choreography (event-driven) vs Orchestration (central workflow)',
      'Compensating Transactions: Automatic rollback mechanisms across independent microservice databases',
      'Distributed Tracing: Correlation IDs (X-Correlation-ID / traceparent) & OpenTelemetry context propagation'
    ],
    testQuestions: [
      'What is the Dual-Write problem in distributed systems, and how does the Transactional Outbox Pattern solve it reliably?',
      'Explain the Saga Pattern. Compare Choreography vs Orchestration approaches, and show how compensating transactions handle a payment failure during e-commerce checkout.',
      'How do Kafka Consumer Groups enable parallel processing of messages while guaranteeing strict in-order message processing within a single partition?',
      'Why is a well-engineered Modular Monolith often vastly superior to Microservices for engineering teams with fewer than 50 developers?'
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
    description: 'Ensure 99.9% uptime even when third-party services fail: circuit breakers, exponential backoff retries with jitter, bulkhead isolation, graceful degradation, and graceful shutdown.',
    keyConcepts: [
      'Circuit Breaker Pattern: State machine (Closed, Open, Half-Open), failure thresholds & reset timeout timers',
      'Exponential Backoff with Full Jitter: Preventing synchronized retry storms from crushing recovering backends',
      'Bulkhead Isolation Pattern: Partitioning thread pools, memory, and database connections to prevent cascading failure',
      'Timeouts & Deadlines: Connect timeouts, read timeouts & distributed deadline propagation across RPC hops',
      'Graceful Degradation: Serving stale cached data when upstream dependencies fail & fallback UI modes',
      'Health Checks: Liveness probes (/health/live) vs Readiness probes (/health/ready) for container orchestrators',
      'Graceful Shutdown in Node.js: Handling SIGTERM/SIGINT, draining active requests, and closing database pools cleanly'
    ],
    testQuestions: [
      'Explain the three states of the Circuit Breaker pattern (Closed, Open, Half-Open). What transitions the circuit between these states?',
      'Why is Exponential Backoff with Jitter critical when retrying network requests, and what mathematical problem does jitter solve?',
      'How do you implement a robust Graceful Shutdown handler in Node.js that prevents dropping active HTTP connections during a Docker rolling update?',
      'What is the difference between a Kubernetes Liveness probe and a Readiness probe? What happens if you connect database health to a Liveness probe?'
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
    description: 'Package applications for production: Dockerfiles, multi-stage builds (reducing image size from 1.5GB to <80MB), .dockerignore, non-root users, and multi-container Docker Compose environments.',
    keyConcepts: [
      'Docker Core Architecture: Images, Containers, Registries, Linux Namespaces & Cgroups resource constraints',
      'Layer Caching Optimization: Ordering COPY package*.json before application source to maximize build cache hits',
      '.dockerignore Best Practices: Excluding node_modules, .git, .env, and local build artifacts',
      'Multi-Stage Dockerfiles: Builder stage vs Lean runner stage (stripping devDependencies and build tooling)',
      'Base Image Selection: Alpine Linux vs Debian-slim vs Google Distroless (musl vs glibc compatibility)',
      'Container Security Hardening: Running as non-root user (USER node / USER 1001) & read-only file systems',
      'Next.js Standalone Output: output: "standalone" for minimal container bundling',
      'Docker Compose: Multi-container orchestration (App, Postgres, Redis, MongoDB), networks & named volume persistence'
    ],
    testQuestions: [
      'How does a multi-stage Docker build work, and why is it essential for building lean, secure production container images for Next.js?',
      'Explain Docker layer caching: why should `COPY package*.json ./` and `RUN npm install` always precede `COPY . .` in a Dockerfile?',
      'Why is running production containers as the `root` user a critical security vulnerability, and how do you configure a non-root user in Docker?',
      'What is the difference between a bind mount and a named volume in Docker Compose, and when should you use each?'
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
      'GitHub Actions Architecture: Workflows, Triggers (push, pull_request, schedule), Jobs, Steps & Runners',
      'Pull Request Gatekeeping: Parallel execution of ESLint, Prettier, TypeScript strict checks (tsc --noEmit) & Unit tests',
      'Dependency & Build Caching: actions/cache and actions/setup-node caching for npm/pnpm/yarn and Docker layer caches',
      'Secrets Management: GitHub Repository Secrets, Environment protection rules & preventing secret leaks in forks',
      'OpenID Connect (OIDC): Passwordless temporary cloud authentication for AWS / GCP without static secret keys',
      'Matrix Builds: Testing across multiple Node.js versions (18, 20, 22) or operating systems simultaneously',
      'Automated Container Delivery: Building Docker images and pushing to GitHub Container Registry (GHCR) with SemVer tags'
    ],
    testQuestions: [
      'How do you configure a GitHub Actions workflow to run typechecks, linting, and tests in parallel, and block pull request merges if any job fails?',
      'How does OpenID Connect (OIDC) allow GitHub Actions to authenticate with AWS or GCP without storing long-lived cloud secret keys in GitHub Secrets?',
      'What is the security risk of using `pull_request_target` instead of `pull_request` in GitHub Actions for public open-source repositories?',
      'How do you optimize a GitHub Actions pipeline to cut build and test duration from 12 minutes down to under 2 minutes?'
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
      'Linux Server Hardening: SSH key authentication (Ed25519), disabling root login, and non-root sudo users',
      'Firewall & Brute Force Defense: UFW (Uncomplicated Firewall) ports 22/80/443 & Fail2ban intrusion prevention',
      'Process Management with PM2: Cluster mode (-i max utilizing all CPU cores), ecosystem.config.js & zero-downtime reloads',
      'Nginx Reverse Proxy: proxy_pass, forwarding client headers (Host, X-Real-IP, X-Forwarded-For), and gzip/brotli compression',
      'Nginx WebSocket Support: proxy_set_header Upgrade $http_upgrade and Connection "upgrade"',
      'SSL/TLS Automation: Let’s Encrypt Certbot ACME HTTP-01 challenge, auto-renewal cron timers & HTTP-to-HTTPS redirects',
      'HSTS (HTTP Strict Transport Security) header and modern TLS 1.2/1.3 cipher suites'
    ],
    testQuestions: [
      'Write an Nginx configuration block that acts as a reverse proxy for a Node.js application on port 3000, supports WebSocket upgrades, and forwards client IP addresses.',
      'How does PM2 cluster mode enable a single Node.js application to utilize all available CPU cores of a server without modifying application code?',
      'How does Let’s Encrypt Certbot verify domain ownership using the ACME HTTP-01 challenge, and how is certificate renewal automated?',
      'What security hardening steps must be taken immediately after provisioning a fresh Ubuntu Linux VPS on DigitalOcean, AWS, or Hetzner?'
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
      'The Three Pillars of Observability: Logs, Metrics, and Distributed Traces',
      'Sentry SDK Integration: Next.js client, server, and edge runtime error tracking',
      'Secure Source Map Uploads: Generating sourcemaps in CI for readable TypeScript traces without exposing source code publicly',
      'Sentry Breadcrumbs: Tracking user clicks, navigation, console logs & network requests leading up to crashes',
      'Structured JSON Logging with Pino: High-performance asynchronous log writing and log levels (fatal, error, warn, info, debug)',
      'Log Sanitization & PII Redaction: Automatically masking passwords, credit cards, and authorization tokens from logs',
      'Request Correlation IDs: Tracing request lifecycles across frontend, API gateways, and microservices',
      'Synthetic Uptime Monitoring & Automated Alerts (Slack, Discord, PagerDuty)'
    ],
    testQuestions: [
      'Why are structured JSON logs superior to plain text strings when debugging production incidents across distributed services?',
      'How do you securely upload source maps to Sentry during CI/CD so production errors show exact TypeScript code lines while preventing source code theft by the public?',
      'What are Sentry breadcrumbs, and how do they allow you to reproduce rare, transient bugs reported by users?',
      'How do you redact sensitive fields (like passwords, authorization headers, or social security numbers) automatically from your production logs?'
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
      'Testing Strategy: Testing Trophy / Testing Pyramid (Static Analysis -> Unit -> Integration -> E2E)',
      'Unit Testing with Vitest: Fast ESM execution, mocking (vi.fn(), vi.spyOn()) & fake timers (vi.useFakeTimers())',
      'React Testing Library Philosophy: Testing user-visible behavior (getByRole, getByLabelText) over internal component state',
      'User Event Simulation: Using @testing-library/user-event to accurately simulate real browser keyboard and mouse events',
      'Playwright E2E Testing: Cross-browser automation (Chromium, Firefox, WebKit) & auto-waiting mechanics',
      'Playwright Storage State: Authenticating once and re-using cookies/local storage across all test suites to accelerate CI',
      'Network Mocking & Interception: Intercepting external third-party requests in Playwright with page.route()',
      'Visual Regression Testing: Pixel-by-pixel screenshot comparisons to catch unintended CSS layout breaks'
    ],
    testQuestions: [
      'Why does React Testing Library prioritize `getByRole` over `getByTestId` or CSS class selectors?',
      'How does Playwright’s auto-waiting mechanism prevent flaky tests, and why should you avoid arbitrary `page.waitForTimeout()` sleeps?',
      'How do you use Playwright’s Storage State to authenticate once and re-use the authenticated session across 50 separate test files to speed up CI runs?',
      'Explain the difference between a mock, a stub, and a spy in Vitest. When should each be used?'
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
      'Multi-Tenancy Architectures: Database-per-tenant vs Schema-per-tenant vs Shared-database with tenant_id isolation',
      'Row-Level Security & Tenant Scoping: Preventing cross-tenant data leaks in multi-tenant SaaS queries',
      'Stripe Integration Architecture: Stripe Checkout Sessions & Stripe Customer Portal for self-service billing',
      'Stripe Webhook Security: Raw request body verification with stripe.webhooks.constructEvent & signature validation',
      'Subscription Lifecycle: Handling checkout.session.completed, invoice.payment_succeeded, dunning & cancellations',
      'Subscription Proration: Calculating mid-cycle plan upgrades and downgrades without billing discrepancies',
      'B2B Team Workspaces: Organization switching, cryptographic member invitation tokens & RBAC permission matrices',
      'Production SaaS Onboarding: Guided onboarding checklists and workspace configuration flows'
    ],
    testQuestions: [
      'Why must you verify the raw request body when validating Stripe webhook signatures, and what happens if middleware parses the JSON before signature verification?',
      'How do you design a shared-database multi-tenant schema with Prisma or PostgreSQL row-level security (RLS) to guarantee tenant data cannot leak across organizations?',
      'How do you handle subscription proration when a user upgrades from a $20/month plan to a $100/month plan midway through their billing cycle?',
      'How do you guarantee idempotency when processing Stripe webhooks so a customer’s account is not credited twice if Stripe retries a webhook?'
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
      'Real-Time Collaboration Mechanics: Operational Transformation (OT) vs Conflict-free Replicated Data Types (CRDTs)',
      'Ephemeral Live State: Collaborative multi-user cursor tracking, presence indicators & active selections',
      'LLM AI Integration: OpenAI / Anthropic / Gemini SDK integration, streaming tokens to client via SSE, and tool/function calling',
      'LLM Cost & Latency Optimization: Prompt caching, token management & client-side stream parsing',
      'Public Product Launch Strategy: Launching on Product Hunt, Hacker News Show HN, Twitter/X & Reddit communities',
      'Product Analytics & Retention: Event tracking with PostHog / Umami, funnel analysis & measuring Day-7 user retention',
      'User Feedback Loops: In-app bug reporting widgets and automated onboarding NPS surveys'
    ],
    testQuestions: [
      'Explain the fundamental difference between Operational Transformation (OT) and CRDTs (Conflict-free Replicated Data Types) for real-time collaborative editing.',
      'How do you implement streaming AI responses (like ChatGPT) in a Next.js App Router route using Server-Sent Events and the AI SDK?',
      'How do you minimize WebSocket message payload sizes when broadcasting mouse cursor movements of 50 simultaneous users in a shared canvas?',
      'What metrics and analytics events should you track to measure user activation and Day-7 retention for a new web application?'
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
      'Upwork Algorithm & Profile Optimization: Job Success Score (JSS) mechanics, Top Rated badge & outcome-based headlines',
      'Winning Proposal Formula: 4-sentence structure (Direct diagnosis, Loom video teardown link, 2-week roadmap, soft CTA)',
      'Value-Based Pricing vs Hourly Rates: Pricing on business ROI rather than hours spent (charging for value created)',
      'Fixed-Price Packaging: Structuring projects into clear tiers ($1,500 MVP, $3,500 Full Stack, $5,000+ Enterprise)',
      'Scope Management & Contracts: Statement of Work (SOW), defining strict milestone boundaries & change request pricing',
      'Monthly Retainer Agreements: Converting one-off project clients into $1,500–$3,000/month recurring maintenance contracts',
      'Client Communication Etiquette: Asynchronous updates, Slack/Loom check-ins & setting professional boundaries'
    ],
    testQuestions: [
      'Why do 99% of freelance proposals fail, and how does including a custom 2-minute Loom video audit increase proposal response rates by 5x?',
      'How do you calculate and pitch a Value-Based price to a business owner instead of quoting an hourly rate?',
      'How do you handle a client who requests three additional features midway through a fixed-price contract without damaging the client relationship?',
      'What contract terms protect a freelance developer against client ghosting or scope creep?'
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
      'Target Prospecting: Sourcing funded startups on Crunchbase, YCombinator directory, Wellfound & LinkedIn Sales Navigator',
      'Website & Application Auditing: Spotting high-impact UX flaws (slow mobile LCP, broken checkout, dated design)',
      'The Loom Video Pitch: Recording 2-minute high-value screen audits demonstrating concrete technical fixes for their product',
      'Cold Email Copywriting: Under-100-words framework, personalized subject lines, pain-point hooks, and soft call-to-actions',
      'Multi-Touch Follow-Up Sequences: 4-step follow-up cadence (Day 1: Loom audit; Day 4: Insight; Day 8: Case study; Day 14: Breakup)',
      'Discovery Call Mastery: 30-minute diagnostic sales calls, uncovering budget, and presenting high-ticket proposals',
      'LinkedIn Authority Building: Sharing technical breakdowns, code snippets, and client case studies publicly'
    ],
    testQuestions: [
      'Walk through the structure of a high-converting cold email to a startup founder that achieves a 20%+ reply rate.',
      'What diagnostic questions should you ask during a client discovery call to uncover their true business goals and budget?',
      'Why is a multi-step follow-up sequence essential, and what content should you include in follow-up emails without sounding desperate?',
      'How do you position yourself as a strategic technical partner rather than a low-cost outsourced code monkey?'
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
      'ATS-Compliant Tech Resume: Single-page format, clean typography, Google XYZ formula ("Accomplished [X] as measured by [Y], by doing [Z]")',
      'High-Yield Remote Job Platforms: RemoteOK, WeWorkRemotely, Wellfound, Arc.dev, Himalayas & Hacker News Who is Hiring',
      'Behavioral Interview Mastery: Structuring stories using the STAR Method (Situation, Task, Action with technical depth, Result)',
      'Live Coding Etiquette: Clarifying requirements and constraints, stating assumptions, discussing Big-O before coding, and testing edge cases verbally',
      'System Design Interview Strategy: 45-minute pacing (Requirements -> High-level API/Data model -> Core architecture -> Bottleneck deep dive)',
      'Offer Negotiation: Anchoring, market rate research (Levels.fyi), base salary negotiation, equity & remote stipends'
    ],
    testQuestions: [
      'How do you answer "Tell me about a time you had a technical disagreement with a senior engineer or product manager" using the STAR method?',
      'How do you handle a live coding interview when you get stuck on an algorithmic problem or edge case?',
      'What questions should you ask the interviewer at the end of a technical round to demonstrate senior engineering maturity?',
      'How do you negotiate a remote salary offer without giving away your current local salary number?'
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
      'International Banking Infrastructure: Wise Business multi-currency accounts (US ACH routing, European IBAN, UK Sort Code)',
      'Payoneer Receiving Accounts: Direct local clearing payments without expensive international SWIFT wire fees',
      'Bangladesh Bank Remittance Compliance: 2.5% government export cash incentive, Form C declarations & tax exemptions',
      'Freelance Legal Contracts: Master Services Agreement (MSA), Statement of Work (SOW) & Non-Disclosure Agreements (NDA)',
      'Intellectual Property Protection: IP transfers to client only upon receipt of 100% final payment',
      'Deposit Rules: Strict 50% upfront deposit before writing a single line of client code',
      'Automated Invoicing & Accounting: Generating compliant PDF invoices with automated Stripe/Wise payment links'
    ],
    testQuestions: [
      'Why should you never hand over production deployment credentials or repository ownership before receiving the final milestone payment?',
      'How do ACH / SEPA receiving accounts in Wise allow US and European clients to pay you with standard domestic transfers instead of expensive international wire transfers?',
      'What essential legal clauses must be present in an Independent Contractor Agreement to protect both developer IP and client confidentiality?',
      'How do you structure milestone payment tranches (e.g. 50% deposit / 25% beta / 25% release) to maintain positive cash flow during client projects?'
    ],
    deliverable: 'Draft a standard Master Services Agreement (contract) template, configure your Wise/Payoneer payment receiving details, and connect them to your admin savings ledger.',
    order: 32,
  },
]
