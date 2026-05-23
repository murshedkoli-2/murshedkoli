'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowUp, Heart } from 'lucide-react'

interface Profile {
    name: string
}

interface Settings {
    copyrightText?: string
}

const Footer = () => {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [settings, setSettings] = useState<Settings>({})
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, settingsRes] = await Promise.all([
                    fetch('/api/profile'),
                    fetch('/api/settings')
                ])
                if (profileRes.ok) {
                    const profileData = await profileRes.json()
                    setProfile(profileData)
                }
                if (settingsRes.ok) {
                    const settingsData = await settingsRes.json()
                    setSettings(settingsData)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const currentYear = new Date().getFullYear()

    return (
        <>
            <footer className="relative border-t border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                            {settings.copyrightText || (
                                <>
                                    © {currentYear} {profile?.name || 'Portfolio'}. Built with
                                    <Heart size={12} className="text-zinc-600 inline" />
                                </>
                            )}
                        </p>
                        <p className="text-xs text-zinc-600 font-mono">
                            Crafted with Next.js & Framer Motion
                        </p>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        onClick={scrollToTop}
                        className="fixed bottom-6 right-6 z-50 group"
                        aria-label="Scroll to top"
                    >
                        <div className="relative p-3 rounded-lg border border-white/[0.06] bg-[#050507]/90 backdrop-blur-md text-zinc-400 hover:text-white hover:border-white/[0.15] transition-all duration-300">
                            <ArrowUp size={16} className="relative group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    )
}

export default Footer
