'use client'

import { useEffect, useRef } from 'react'
import { VISA_CATEGORY_META, type CountryData } from '@/lib/data/world-countries'

interface CountryDetailsProps {
  country: CountryData
  rank: number
  onClose: () => void
}

export function CountryDetails({ country, rank, onClose }: CountryDetailsProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const { flight, dailyBudget, visaFee, totalEstimate } = country.estimatedCost

  return (
    <div className="trv-overlay" onClick={onClose}>
      <div className="trv-modal" role="dialog" aria-modal="true" aria-labelledby="trv-country-title" onClick={(e) => e.stopPropagation()}>
        <div className="trv-modal-head">
          <div>
            <div className="trv-strip-label">#{rank} easiest · {country.continent}</div>
            <h2 id="trv-country-title"><span aria-hidden="true">{country.flag}</span> {country.name}</h2>
          </div>
          <button ref={closeRef} type="button" className="adm-icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="adm-banner" style={{ margin: 0 }}>
          <div>
            <b>{VISA_CATEGORY_META[country.visaCategory].label}</b> — {country.visaLabel}. {country.visaNotes}
          </div>
        </div>

        <dl className="trv-facts">
          <div className="trv-fact"><dt>Capital</dt><dd>{country.capital}</dd></div>
          <div className="trv-fact"><dt>Currency</dt><dd>{country.currency}</dd></div>
          <div className="trv-fact"><dt>Best time</dt><dd>{country.bestTime}</dd></div>
          <div className="trv-fact"><dt>Visa fee</dt><dd>{visaFee}</dd></div>
          <div className="trv-fact"><dt>Flights from Dhaka</dt><dd>{flight}</dd></div>
          <div className="trv-fact"><dt>Daily budget</dt><dd>{dailyBudget}</dd></div>
          <div className="trv-fact"><dt>Total estimate</dt><dd>{totalEstimate}</dd></div>
        </dl>

        <h3 style={{ font: '700 14px var(--adm-display)', margin: '16px 0 8px' }}>Visa steps for a Bangladeshi passport</h3>
        <ol className="trv-steps">
          {country.visaProcessSteps.map((step) => <li key={step}>{step.replace(/^\d+\.\s*/, '')}</li>)}
        </ol>

        <h3 style={{ font: '700 14px var(--adm-display)', margin: '16px 0 8px' }}>Places to see</h3>
        <div className="trv-chips">
          {country.touristSpots.map((spot) => <span key={spot} className="trv-chip" style={{ cursor: 'default' }}>{spot}</span>)}
        </div>

        <p className="trv-note" style={{ marginTop: 16 }}>
          Estimates and visa rules are a starting point only — check the embassy or IATA Timatic before booking.
        </p>
      </div>
    </div>
  )
}
