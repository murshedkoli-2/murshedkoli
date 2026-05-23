'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Briefcase, Calendar, MapPin, ChevronRight } from 'lucide-react'

interface Experience {
    id: string
    company: string
    position: string
    description: string
    startDate: string
    endDate?: string
    current: boolean
    location?: string
}

const Experience = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })
    const [experiences, setExperiences] = useState<Experience[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await fetch('/api/experience')
                if (response.ok) {
                    const data = await response.json()
                    setExperiences(data)
                }
            } catch (error) {
                console.error('Error fetching experiences:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchExperiences()
    }, [])

    if (!loading && experiences.length === 0) return null

    return (
        <section id="experience" className="py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-blue-600/[0.03] rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-600/[0.03] rounded-full blur-[120px]" />
            </div>

            <div className="max-w-5xl mx-auto relative" ref={ref}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-14 md:mb-20"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.01] mb-6"
                    >
                        <Briefcase size={12} className="text-zinc-400" />
                        <span className="text-zinc-400 text-[10px] font-medium tracking-[0.2em] uppercase">Career Path</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
                        Experience
                    </h2>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Timeline line */}
                    <motion.div 
                        className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px"
                        initial={{ height: 0 }}
                        animate={isInView ? { height: '100%' } : { height: 0 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                    >
                        <div className="w-full h-full bg-zinc-800/40" />
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-12 md:space-y-16">
                            {experiences.map((exp, index) => (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                                    transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                                    className={`relative flex flex-col md:flex-row gap-6 md:gap-10 ${
                                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={isInView ? { scale: 1 } : { scale: 0 }}
                                            transition={{ delay: 0.3 + index * 0.15, type: 'spring', stiffness: 300 }}
                                            className="relative"
                                        >
                                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                                        </motion.div>
                                    </div>

                                    {/* Date column */}
                                    <div className={`hidden md:flex md:w-[calc(50%-2rem)] ${
                                        index % 2 === 0 ? 'justify-end text-right' : 'justify-start text-left'
                                    }`}>
                                        <div className="pt-0">
                                            <p className="text-zinc-400 font-mono text-[13px] font-medium flex items-center gap-2">
                                                {index % 2 !== 0 && <Calendar size={12} />}
                                                {new Date(exp.startDate).getFullYear()} — {exp.current ? 'Present' : new Date(exp.endDate!).getFullYear()}
                                                {index % 2 === 0 && <Calendar size={12} />}
                                            </p>
                                            {exp.location && (
                                                <p className="text-zinc-600 text-xs mt-1.5 flex items-center gap-1.5">
                                                    {index % 2 !== 0 && <MapPin size={12} />}
                                                    {exp.location}
                                                    {index % 2 === 0 && <MapPin size={12} />}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content card */}
                                    <div className="ml-12 md:ml-0 md:w-[calc(50%-2rem)]">
                                        <div className="glass-card rounded-2xl p-5 group hover:shadow-xl transition-all duration-500">
                                            {/* Mobile date */}
                                            <div className="md:hidden flex flex-wrap gap-3 text-xs mb-3">
                                                <span className="flex items-center gap-1.5 text-zinc-400 font-mono">
                                                    <Calendar size={12} />
                                                    {new Date(exp.startDate).getFullYear()} — {exp.current ? 'Present' : new Date(exp.endDate!).getFullYear()}
                                                </span>
                                                {exp.location && (
                                                    <span className="flex items-center gap-1 text-zinc-500">
                                                        <MapPin size={12} /> {exp.location}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-lg font-semibold text-white mb-1">
                                                {exp.position}
                                            </h3>
                                            <h4 className="text-xs text-zinc-400 flex items-center gap-2 mb-3">
                                                <Briefcase size={12} className="text-zinc-500" />
                                                {exp.company}
                                            </h4>
                                            <p className="text-zinc-500 leading-relaxed text-[13px] whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Experience
