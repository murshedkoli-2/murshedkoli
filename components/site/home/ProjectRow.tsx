'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ArrowRight, ExternalLink } from 'lucide-react'
import type { FeaturedProject } from '@/lib/data/portfolio'

interface ProjectRowProps {
  project: FeaturedProject
  index: number
  thumbFirst?: boolean
}

export function ProjectRow({ project, index, thumbFirst }: ProjectRowProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: 24,
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.025)',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.7)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 200ms ease, transform 200ms ease',
      }}
      className="project-viewport-card"
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
          background: '#121216',
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
              color: 'rgba(255, 255, 255, 0.15)',
              background: 'radial-gradient(circle, rgba(245, 176, 76, 0.08) 0%, transparent 70%)',
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
              background: 'rgba(15, 15, 18, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'rgba(255, 255, 255, 0.8)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
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
                background: 'rgba(16, 185, 129, 0.15)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: '#34d399',
                fontWeight: 600,
                letterSpacing: '0.03em',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: '#34d399' }} />
              <span>LIVE</span>
            </div>
          )}
        </div>
      </Link>

      {/* Meta Content & Actions: Concise, Clean (No Walls of Text) */}
      <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h3
              style={{
                fontSize: '1.45rem',
                fontWeight: 600,
                letterSpacing: '-0.025em',
                color: '#ececea',
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
                color: 'rgba(255, 255, 255, 0.6)',
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
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'rgba(255, 255, 255, 0.65)',
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
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
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
              color: '#ececea',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span>CASE STUDY</span>
            <ArrowRight size={14} style={{ color: '#f5b04c' }} />
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
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
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
