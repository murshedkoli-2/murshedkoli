import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth/require-admin'

export default async function AdminIndex() {
  redirect(await isAdmin() ? '/admin/dashboard' : '/admin/login')
}
