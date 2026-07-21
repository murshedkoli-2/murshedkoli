import { cache as reactCache } from 'react'
import { unstable_cache } from 'next/cache'

/**
 * Persistent, cross-request cache for read-only portfolio queries.
 *
 * Composes two layers:
 *  - `unstable_cache` (Next Data Cache) persists results across requests and
 *    navigations, so repeated renders (dev navigation, ISR regeneration) don't
 *    re-hit the database. Revalidated on a timer and tagged for invalidation.
 *  - React `cache` de-dupes calls within a single render pass.
 *
 * Every cached entry shares the `portfolio` tag, so a single
 * `revalidateTag('portfolio')` (e.g. from an admin write) refreshes them all.
 */
export const PORTFOLIO_TAG = 'portfolio'
export const PORTFOLIO_REVALIDATE = 600 // seconds

// Matches Next's `unstable_cache` Callback shape without decomposing the
// argument tuple (which would widen typed params like `max = 4` to `unknown`).
type AnyAsync = (...args: any[]) => Promise<any>

export function cached<T extends AnyAsync>(name: string, fn: T): T {
  const persisted = unstable_cache(fn, [name], {
    revalidate: PORTFOLIO_REVALIDATE,
    tags: [PORTFOLIO_TAG],
  })
  return reactCache(persisted) as T
}
