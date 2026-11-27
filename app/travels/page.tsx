import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Compass, Globe2, MapPin, Mountain } from 'lucide-react'
import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { CountUp } from '@/components/site/landing/CountUp'
import { TravelsExplorer } from '@/components/site/travels/TravelsExplorer'
import { getProfile } from '@/lib/data/portfolio'
import { getTravels } from '@/lib/data/travels'
import { divisionProgress } from '@/lib/travels'
import '@/components/site/landing/landing.css'
import '@/components/site/travels/travels.css'

export const metadata: Metadata = {
  title: 'Travels',
  description: 'Districts of Bangladesh and places around the world I have explored.',
}

export const revalidate = 600

const TOTAL_DISTRICTS = 64

export default async function TravelsPage() {
  const [profile, travels] = await Promise.all([getProfile(), getTravels()])
  const { visitedDistricts, spots, countries } = travels
  const divisions = divisionProgress(visitedDistricts)
  const touched = divisions.filter((d) => d.visited > 0).length

  const stats = [
    { icon: MapPin, label: 'Districts explored', value: visitedDistricts.length, of: TOTAL_DISTRICTS },
    { icon: Compass, label: 'Divisions touched', value: touched, of: 8 },
    { icon: Mountain, label: 'Places visited', value: spots.length },
    { icon: Globe2, label: 'Countries abroad', value: countries.length },
  ]

  return (
    <>
      <Nav name={profile.name} resumeUrl={profile.resume} />
      <main className="ld tv-page">
        <section className="ld-section tv-hero" aria-labelledby="tv-title">
          <div className="ld-wrap">
            <Link href="/#travels" className="tv-back">
              <ArrowLeft size={15} aria-hidden="true" /> Back home
            </Link>
            <p className="ld-head-label">
              <span className="ld-head-index">Travels</span>
              <span className="ld-head-rule" aria-hidden="true" />
              Bangladesh & beyond
            </p>
            <h1 id="tv-title" className="tv-title">
              {visitedDistricts.length} of {TOTAL_DISTRICTS} districts — <em>and counting</em>.
            </h1>
            <p className="tv-lede">
              Every district I have set foot in, filled in on the map. Hover a district for its name, or a division to
              light it up.
            </p>

            <dl className="tv-stats">
              {stats.map(({ icon: Icon, label, value, of }) => (
                <div key={label} className="tv-stat">
                  <Icon size={18} aria-hidden="true" />
                  <dt>{label}</dt>
                  <dd>
                    <CountUp value={value} pad={1} />
                    {of ? <small>/{of}</small> : null}
                  </dd>
                </div>
              ))}
            </dl>

            <TravelsExplorer visited={visitedDistricts} divisions={divisions} />
          </div>
        </section>

        {spots.length > 0 && (
          <section className="ld-section ld-section-alt" aria-labelledby="tv-places">
            <div className="ld-wrap">
              <h2 id="tv-places" className="tv-h2">
                Places I&apos;ve <em>been</em>
              </h2>
              <ul className="tv-places">
                {spots.map((s) => (
                  <li key={s.id} className="tv-place">
                    <span className="tv-place-icon" aria-hidden="true">
                      <MapPin size={18} />
                    </span>
                    <span className="tv-place-main">
                      <b>{s.name}</b>
                      <small>{[s.districtName, s.division].filter(Boolean).join(' · ') || 'Bangladesh'}</small>
                    </span>
                    {s.year && <span className="tv-year">{s.year}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {countries.length > 0 && (
          <section className="ld-section" aria-labelledby="tv-abroad">
            <div className="ld-wrap">
              <h2 id="tv-abroad" className="tv-h2">
                Beyond <em>borders</em>
              </h2>
              <ul className="tv-countries">
                {countries.map((c) => (
                  <li key={c.name} className="tv-country">
                    <span className="tv-flag" aria-hidden="true">{c.flag ?? '🌍'}</span>
                    <b>{c.name}</b>
                    <small>{c.places.join(' · ')}</small>
                    {c.year && <span className="tv-year">{c.year}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer name={profile.name} email={profile.email} socialLinks={profile.socialLinks} />
    </>
  )
}
