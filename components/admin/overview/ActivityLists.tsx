import Image from 'next/image'
import Link from 'next/link'
import { FolderKanban, Mail } from 'lucide-react'
import { isLive, relativeTime, stackLabel, type AdminMessage, type AdminProject } from '@/lib/admin/portfolio-summary'
import { initials } from '@/lib/admin/overview'
import { EmptyState } from '@/components/admin/kit/EmptyState'

export function RecentProjects({ projects, loaded }: { projects: AdminProject[]; loaded: boolean }) {
  return (
    <section className="ov-tile ov-recent" aria-labelledby="ov-recent-title">
      <header className="ov-tile-head">
        <h2 id="ov-recent-title">Recently updated</h2>
        <Link href="/admin/projects" className="ov-more">
          All projects →
        </Link>
      </header>
      {loaded && projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          body="Your first case study is one click away."
          action={<Link href="/admin/projects/new" className="adm-btn amber">New project</Link>}
        />
      ) : (
        <ul className="ov-list">
          {projects.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/projects/${p.id}`} className="ov-project">
                <span className="ov-project-cover">
                  {p.coverImage ? (
                    <Image src={p.coverImage} alt="" fill sizes="72px" className="ov-cover-img" />
                  ) : (
                    <FolderKanban size={18} aria-hidden="true" />
                  )}
                </span>
                <span className="ov-project-main">
                  <b>{p.title}</b>
                  <small>
                    {stackLabel(p)}
                    {p.updatedAt ? ` · ${relativeTime(p.updatedAt)}` : ''}
                  </small>
                </span>
                {p.featured && <span className="adm-pill feat">Featured</span>}
                <span className={`adm-pill ${isLive(p) ? 'live' : 'draft'}`}>{isLive(p) ? 'Live' : 'Draft'}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function LatestMessages({ messages, loaded }: { messages: AdminMessage[]; loaded: boolean }) {
  return (
    <section className="ov-tile ov-messages" aria-labelledby="ov-messages-title">
      <header className="ov-tile-head">
        <h2 id="ov-messages-title">Latest messages</h2>
        <Link href="/admin/messages" className="ov-more">
          Inbox →
        </Link>
      </header>
      {loaded && messages.length === 0 ? (
        <EmptyState icon={Mail} title="Inbox zero" body="New contact-form messages will land here." />
      ) : (
        <ul className="ov-list">
          {messages.map((m) => (
            <li key={m.id}>
              <Link href="/admin/messages" className="ov-message" data-unread={m.status === 'unread'}>
                <span className="ov-avatar" aria-hidden="true">{initials(m.name)}</span>
                <span className="ov-project-main">
                  <b>{m.name || 'Anonymous'}</b>
                  <small>{m.subject || 'No subject'}</small>
                </span>
                <span className="ov-time">{relativeTime(m.createdAt) || 'just now'}</span>
                {m.status === 'unread' && <span className="ov-unread" aria-label="Unread" />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
