'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simple credential check
    if (credentials.username === 'murshedkoli' && credentials.password === 'Murshedk5') {
      // Store login state in localStorage
      localStorage.setItem('adminLoggedIn', 'true')
      localStorage.setItem('adminUser', 'murshedkoli')
      router.push('/admin/dashboard')
    } else {
      setError('Invalid username or password')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-white/[0.01] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-white/[0.01] rounded-full blur-[100px]" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-sm"
      >
        <div className="bg-white/[0.01] border border-white/[0.04] backdrop-blur-sm rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="h-px bg-white/[0.08] w-12 mx-auto mb-6" />
            <h1 className="text-lg font-semibold text-white mb-2 tracking-tight uppercase tracking-[0.1em]">
              Welcome Back
            </h1>
            <p className="text-zinc-500 text-xs">
              Sign in to access your portfolio dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-[10px] font-medium text-zinc-500 uppercase tracking-[0.15em]">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.01] border border-white/[0.06] rounded-lg text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-all text-xs font-mono"
                placeholder="Enter username"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[10px] font-medium text-zinc-500 uppercase tracking-[0.15em]">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/[0.01] border border-white/[0.06] rounded-lg text-white placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-all text-xs font-mono"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400 text-xs text-center font-mono"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-zinc-950 py-3 px-6 rounded-lg font-mono uppercase tracking-[0.2em] text-xs font-semibold hover:bg-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 border border-white"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-zinc-650 hover:text-white transition-colors text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 mx-auto group"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
              Back to Portfolio
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin