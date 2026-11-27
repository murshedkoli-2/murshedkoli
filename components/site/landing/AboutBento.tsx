import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Download, MapPin } from 'lucide-react'
import type { ProfileView, TimelineEntry } from '@/lib/data/portfolio'
import { pickPortrait } from '@/lib/landing'
import { SectionHead } from './SectionHead'
import { Spotlight } from './Spotlight'

interface AboutBentoProps {
  profile: ProfileView
  currentRole: TimelineEntry | null
}

/** About as a bento board; every tile catches a cursor-following light. */
export function AboutBento({ profile, currentRole }: AboutBentoProps) {
  return (
    <section id="about" className="ld-section" aria-labelledby="ld-about-title">
      <div className="ld-wrap">
        <SectionHead
          id="ld-about-title"
          index="02"
          label="About"
          title={
            <>
              The person <em>behind</em> the code
            </>
          }
        />

        <Spotlight className="ld-bento">
          <figure className="ld-tile ld-tile-photo" data-spot>
            <Image
              src={pickPortrait(profile)}
              alt={`Portrait of ${profile.name}`}
              fill
              sizes="(max-width: 900px) 92vw, 380px"
              className="ld-tile-photo-img"
            />
            <figcaption>{profile.name}</figcaption>
          </figure>

          <div className="ld-tile ld-tile-intro" data-spot>
            <p className="ld-tile-kicker">Hello —</p>
            <p className="ld-tile-lead">{profile.description}</p>
          </div>

          <div className="ld-tile ld-tile-now" data-spot>
            <p className="ld-tile-kicker">Right now</p>
            <p className="ld-tile-big">{currentRole ? currentRole.title : profile.title}</p>
            {currentRole ? <p className="ld-tile-sub">at {currentRole.subtitle}</p> : null}
          </div>

          <div className="ld-tile ld-tile-place" data-spot>
            <MapPin size={18} aria-hidden="true" />
            <p className="ld-tile-kicker">Based in</p>
            <p className="ld-tile-big">{profile.location || 'Remote'}</p>
            <p className="ld-tile-sub">Working with teams worldwide</p>
          </div>

          <Link href="/about" className="ld-tile ld-tile-link" data-spot>
            <span className="ld-tile-kicker">Full story</span>
            <span className="ld-tile-big">More about me</span>
            <ArrowUpRight className="ld-tile-arrow" size={28} aria-hidden="true" />
          </Link>

          {profile.resume ? (
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="ld-tile ld-tile-link ld-tile-accent"
              data-spot
            >
              <span className="ld-tile-kicker">Résumé</span>
              <span className="ld-tile-big">Download CV</span>
              <Download className="ld-tile-arrow" size={26} aria-hidden="true" />
            </a>
          ) : null}
        </Spotlight>
      </div>
    </section>
  )
}
