import { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Portfolio',
  description: 'Admin dashboard for portfolio management',
  robots: 'noindex, nofollow',
}
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-layout">{children}</div>
}
