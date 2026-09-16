'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import type { FeaturedProject } from '@/lib/data/portfolio'

interface ProjectRowProps {
  project: FeaturedProject
  index: number
  thumbFirst?: boolean
}

export function ProjectRow({ project, index }: ProjectRowProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: 22,
        overflow: 'hidden',
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.07)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease',
      }}
      className="apple-project-card"
    >
      {/* Immersive Visual Media Viewport */}
      <Link
        href={project.links.caseStudy}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          overflow: 'hidden',
          display: 'block',
          background: '#f5f5f7',
        }}
      >
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 900px) 100vw, 600px"
            style={{
              objectFit: 'cover',
              transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="project-img-zoom"
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '2.5rem',
              color: 'rgba(0, 0, 0, 0.15)',
              background: '#f5f5f7',
            }}
          >
            {project.number}
          </div>
        )}

        {/* Viewport Top Tag Badges */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              padding: '5px 12px',
              borderRadius: 999,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: '#1d1d1f',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontWeight: 600,
            }}
          >
            {project.projectType}
          </div>

          {project.isLive && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 999,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: '#059669',
                fontWeight: 600,
                letterSpacing: '0.03em',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: '#10b981' }} />
              <span>LIVE</span>
            </div>
          )}
        </div>
      </Link>

      {/* Meta Content & Actions: Concise, Clean (No Walls of Text) */}
      <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <h3
            style={{
              fontSize: '1.45rem',
              fontWeight: 600,
              letterSpacing: '-0.025em',
              color: '#1d1d1f',
              marginBottom: 4,
            }}
          >
            <Link
              href={project.links.caseStudy}
              style={{ color: 'inherit', textDecoration: 'none' }}
              className="hover-underline"
            >
              {project.title}
            </Link>
          </h3>
          {/* 1-Line Punchline */}
          <p
            style={{
              color: '#6e6e73',
              fontSize: '0.92rem',
              lineHeight: 1.5,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {project.outcome || project.summary}
          </p>
        </div>

        {/* Tech Badges */}
        {project.stack.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {project.stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: '#f5f5f7',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  color: '#424245',
                  fontWeight: 500,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 14,
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            marginTop: 4,
          }}
        >
          <Link
            href={project.links.caseStudy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#1d1d1f',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span>CASE STUDY</span>
            <ArrowRight size={14} style={{ color: '#d97706' }} />
          </Link>

          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.8rem',
                color: '#6e6e73',
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
              }}
            >
              <span>PREVIEW</span>
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
