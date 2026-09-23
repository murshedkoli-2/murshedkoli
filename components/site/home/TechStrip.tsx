'use client'

import { Container } from '@/components/site/ui/Container'
import {
  Code2,
  Database,
  Layers,
  Cpu,
  Server,
  Terminal,
  Globe,
  Flame,
  ShieldCheck,
  Zap,
} from 'lucide-react'

const TECH_ITEMS = [
  { name: 'MongoDB', category: 'Database', icon: Database },
  { name: 'Express.js', category: 'Backend', icon: Server },
  { name: 'React 19', category: 'Frontend', icon: Code2 },
  { name: 'Next.js 16', category: 'Full-Stack', icon: Zap },
  { name: 'Node.js', category: 'Runtime', icon: Terminal },
  { name: 'TypeScript', category: 'Language', icon: Code2 },
  { name: 'Prisma ORM', category: 'Data Layer', icon: Database },
  { name: 'PostgreSQL', category: 'Relational DB', icon: Database },
  { name: 'Tailwind CSS', category: 'Styling', icon: Layers },
  { name: 'Docker', category: 'Container', icon: Cpu },
  { name: 'Redis', category: 'Cache', icon: Flame },
  { name: 'REST & GraphQL', category: 'APIs', icon: Globe },
  { name: 'JWT & NextAuth', category: 'Security', icon: ShieldCheck },
]

export function TechStrip() {
  return (
    <section
      aria-label="Technologies and production stack"
      style={{
        position: 'relative',
        background: 'var(--surface-2)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        paddingBlock: '1.75rem',
        overflow: 'hidden',
        transition: 'background 300ms ease',
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--ink-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ color: 'var(--accent)' }}>{'//'}</span>
            <span>TECHNOLOGIES I WORK WITH</span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--ink-muted)',
            }}
            className="hidden sm:block"
          >
            BATTLE-TESTED RUNTIMES &amp; FRAMEWORKS
          </div>
        </div>
      </Container>

      {/* Infinite Marquee Track with Masked Fade Edges */}
      <div
        className="tech-marquee-container"
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          paddingBlock: '0.25rem',
        }}
      >
        <div className="tech-marquee-track">
          {/* Double array for seamless loop */}
          {[...TECH_ITEMS, ...TECH_ITEMS].map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={`${item.name}-${idx}`} className="tech-badge-chip">
                <Icon size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>{item.name}</span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--ink-muted)',
                    paddingLeft: 2,
                    opacity: 0.8,
                  }}
                >
                  · {item.category}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
