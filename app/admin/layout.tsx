import { Metadata } from 'next'
import './admin.css'
import { AIPortfolioAssistant } from '@/components/site/AIPortfolioAssistant'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Portfolio',
  description: 'Admin dashboard for portfolio management',
  robots: 'noindex, nofollow', // Prevent search engines from indexing admin pages
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      {children}
      <AIPortfolioAssistant />
    </div>
  )
}