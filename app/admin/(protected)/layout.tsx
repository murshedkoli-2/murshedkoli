import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth/require-admin'
import { AIPortfolioAssistant } from '@/components/site/AIPortfolioAssistant'

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect('/admin/login')
  return <>{children}<AIPortfolioAssistant /></>
}
