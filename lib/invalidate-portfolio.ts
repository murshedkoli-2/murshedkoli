import { revalidatePath, revalidateTag } from 'next/cache'
import { PORTFOLIO_TAG } from '@/lib/cache'

export function invalidatePortfolio() {
  // Unpublishing must not serve a stale copy on the next request.
  revalidateTag(PORTFOLIO_TAG, { expire: 0 })
  revalidatePath('/', 'layout')
}
