import { Metadata } from 'next'
import './styles/tokens.css'
import './styles/kit.css'
import './styles/components.css'
import './styles/shell.css'
import './admin.css'
import './styles/overview.css'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Portfolio',
  description: 'Admin dashboard for portfolio management',
  robots: 'noindex, nofollow',
}
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-layout">{children}</div>
}
