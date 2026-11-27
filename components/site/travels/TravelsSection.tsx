import Link from 'next/link'
import { ArrowUpRight, MapPin } from 'lucide-react'
import type { TravelsView } from '@/lib/data/travels'
import { divisionProgress } from '@/lib/travels'
import { SectionHead } from '@/components/site/landing/SectionHead'
import { CountUp } from '@/components/site/landing/CountUp'
import { TravelMap } from './TravelMap'

const TOTAL_DISTRICTS = 64
const RECENT_PLACES = 6

/** Home-page teaser: districts visited, a live map and the latest places. */
export function TravelsSection({ travels, index }: { travels: TravelsView; index: string }) {
  const { visitedDistricts, spots, countries } = travels
  if (visitedDistricts.length === 0 && spots.length === 0 && countries.length === 0) return null

  const divisions = divisionProgress(visitedDistricts)
  const touched = divisions.filter((d) => d.visited > 0).length
  const pct = Math.round((visitedDistricts.length / TOTAL_DISTRICTS) * 100)

  return (
    <section id="travels" className="ld-section tv-home" aria-labelledby="tv-home-title">
      <div className="ld-wrap">
        <SectionHead
          id="tv-home-title"
          index={index}
          label="Travels"
          title={
            <>
              Footprints across <em>Bangladesh</em>
            </>
          }
          aside={
            <Link href="/travels" className="ld-btn ld-btn-line">
              Explore the map <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          }
        />

        <div className="tv-home-grid">
          <div className="tv-home-copy">
            <p className="tv-big">
              <CountUp value={visitedDistricts.length} />
              <span>/{TOTAL_DISTRICTS}</span>
            </p>
            <p className="tv-big-label">districts explored · {touched} of 8 divisions</p>
            <span className="tv-bar tv-bar-lg" aria-hidden="true">
              <span style={{ transform: `scaleX(${pct / 100})` }} />
            </span>

            {spots.length > 0 && (
              <>
                <p className="tv-kicker">Recently visited</p>
                <ul className="tv-chips">
                  {spots.slice(0, RECENT_PLACES).map((s) => (
                    <li key={s.id}>
                      <MapPin size={13} aria-hidden="true" />
                      {s.name}
                      {s.year ? <small>{s.year}</small> : null}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {countries.length > 0 && (
              <p className="tv-abroad">
                Abroad:{' '}
                {countries.map((c, i) => (
                  <span key={c.name}>
                    {c.flag ? `${c.flag} ` : ''}
                    {c.name}
                    {i < countries.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            )}
          </div>

          <Link href="/travels" className="tv-home-map" aria-label="Open the full travel map">
            <TravelMap visited={visitedDistricts} />
          </Link>
        </div>
      </div>
    </section>
  )
}
