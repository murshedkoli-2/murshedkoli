import type { ServiceView, SkillColumn } from '@/lib/data/portfolio'
import { Container } from '@/components/site/ui/Container'
import { HomeSectionHeader } from './HomeSectionHeader'

/** Shown until at least MIN_SERVICES services are published from the admin panel. */
const DEFAULT_CAPABILITIES: ServiceView[] = [
  { id: 'frontend', icon: null, title: 'Frontend engineering', description: 'Responsive, accessible interfaces in React and Next.js, with strict TypeScript contracts and fluid interactions.' },
  { id: 'backend', icon: null, title: 'Backend systems & APIs', description: 'Node.js services, REST API design, background jobs, webhooks and secure authentication.' },
  { id: 'database', icon: null, title: 'Database architecture', description: 'MongoDB schema modelling, aggregation pipelines, indexing and low-latency caching.' },
  { id: 'dashboards', icon: null, title: 'Admin & operational dashboards', description: 'Internal tools with role-based access, data visualisation, exports and workflow management.' },
  { id: 'saas', icon: null, title: 'SaaS platforms', description: 'Multi-tenant foundations with customer lifecycle flows, subscription billing and transactional email.' },
  { id: 'ai', icon: null, title: 'AI integration', description: 'Generative content pipelines, document analysis and streaming endpoints built into real products.' },
]
const MIN_SERVICES = 3

interface CapabilitiesSectionProps {
  services: ServiceView[]
  skills: SkillColumn[]
}

/** What I build, as a numbered list, followed by the tools I build it with. */
export function CapabilitiesSection({ services: published, skills }: CapabilitiesSectionProps) {
  const services = published.length >= MIN_SERVICES ? published : DEFAULT_CAPABILITIES
  const stack = skills.filter((column) => column.skills.length > 0)

  return (
    <section id="expertise" className="hm-section">
      <Container>
        <HomeSectionHeader title="What I" accent="build" meta={`${String(services.length).padStart(2, '0')} disciplines`} />
        <ol className="hm-cap-list">
          {services.map((service, i) => (
            <li key={service.id} className="hm-cap-row">
              <span className="hm-cap-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="hm-cap-title">{service.title}</h3>
              <p className="hm-cap-text">{service.description}</p>
            </li>
          ))}
        </ol>

        {stack.length > 0 && (
          <div id="stack" className="hm-stack">
            <dl className="hm-stack-grid">
              {stack.map((column) => (
                <div key={column.key} className="hm-stack-col">
                  <dt>{column.label}</dt>
                  <dd>{column.skills.map((skill) => skill.name).join(' · ')}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Container>
    </section>
  )
}
