'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { FeaturedProject } from '@/lib/data/portfolio'

interface ProjectRowProps {
  project: FeaturedProject
  index: number
  /** Lead with the thumbnail so it sits beside the name (projects page). */
  thumbFirst?: boolean
}

/** One editorial work row: big title, quiet meta, thumbnail that wakes on hover. */
export function ProjectRow({ project, index, thumbFirst }: ProjectRowProps) {
  const reduce = useReducedMotion()

  const thumb = (
    <div className="proj-thumb">
      {project.coverImage ? (
        <Image
          src={project.coverImage}
          alt=""
          fill
          sizes="(max-width: 860px) 92vw, 240px"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <div
          className="mono"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            fontSize: '1.6rem',
            color: 'rgba(255, 255, 255, 0.18)',
          }}
        >
          {project.number}
        </div>
      )}
    </div>
  )

  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.3), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={project.links.caseStudy}
        aria-label={project.title}
        className={`proj-row${thumbFirst ? ' proj-row--media' : ''}`}
        style={{ display: 'grid' }}
      >
        {thumbFirst && thumb}
        <div style={{ minWidth: 0 }}>
          <div className="hp-meta" style={{ marginBottom: '0.75rem', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span>{project.number}</span>
            <span>{project.projectType}</span>
            {project.isLive && <span style={{ color: '#34d399' }}>live</span>}
          </div>
          <h3 className="proj-row-title">{project.title}</h3>
          <p
            style={{
              marginTop: '0.75rem',
              color: 'rgba(255, 255, 255, 0.55)',
              lineHeight: 1.65,
              fontSize: '0.97rem',
              maxWidth: '36rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {project.summary}
          </p>
          {project.stack.length > 0 && (
            <div className="hp-meta" style={{ marginTop: '0.9rem', display: 'flex', gap: 14, flexWrap: 'wrap', color: 'rgba(255, 255, 255, 0.35)' }}>
              {project.stack.slice(0, 4).map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          )}
        </div>

        {!thumbFirst && thumb}

        <ArrowUpRight size={26} className="proj-row-arrow" />
      </Link>
    </motion.div>
  )
}
