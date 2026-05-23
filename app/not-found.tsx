'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[120px]" />
      </div>

      <div className="relative text-center max-w-md w-full space-y-8 z-10">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* Minimalist 404 code */}
            <h1 className="text-[120px] font-extralight tracking-widest text-white/10 font-mono leading-none select-none">
              404
            </h1>
            <div className="h-px bg-white/[0.08] w-12 my-6" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-2"
          >
            <h2 className="text-xs font-semibold text-white uppercase tracking-[0.2em] font-mono">
              Error // Page Not Found
            </h2>
            <p className="text-zinc-500 text-xs font-mono max-w-xs mx-auto leading-relaxed">
              The page you are looking for does not exist, has been removed, or is temporarily unavailable.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
        >
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-zinc-950 rounded-lg font-mono uppercase tracking-[0.15em] text-[10px] font-semibold hover:bg-zinc-100 transition-all border border-white"
          >
            <ArrowLeft size={12} />
            Go Back
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-transparent hover:bg-white/[0.03] text-zinc-400 hover:text-white rounded-lg font-mono uppercase tracking-[0.15em] text-[10px] font-semibold border border-white/[0.08] hover:border-white/20 transition-all"
          >
            <Home size={12} />
            Return Home
          </Link>
        </motion.div>
      </div>

      {/* Footer annotation */}
      <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none select-none">
        <span className="text-[9px] text-zinc-700 font-mono uppercase tracking-widest">
          Murshed Koli © {new Date().getFullYear()}
        </span>
      </div>
    </div>
  )
}
