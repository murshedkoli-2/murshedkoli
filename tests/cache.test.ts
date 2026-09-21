import { expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ tag: vi.fn(), path: vi.fn() }))
vi.mock('next/cache', () => ({ revalidateTag: mocks.tag, revalidatePath: mocks.path, unstable_cache: (fn: unknown) => fn }))
import { invalidatePortfolio } from '@/lib/invalidate-portfolio'
it('expires shared data immediately and invalidates pages using the root layout', () => {
  invalidatePortfolio()
  expect(mocks.tag).toHaveBeenCalledWith('portfolio', { expire: 0 })
  expect(mocks.path).toHaveBeenCalledWith('/', 'layout')
})
