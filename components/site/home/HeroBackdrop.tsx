/**
 * Soft drifting gradient blobs behind the hero. Pure CSS — no WebGL.
 * Sits behind content (aria-hidden) and stops animating under reduced-motion.
 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <div
        className="hero-blob"
        style={{
          top: '-8%',
          left: '-6%',
          width: 'min(46vw, 560px)',
          height: 'min(46vw, 560px)',
          background: 'radial-gradient(circle at 30% 30%, var(--accent), transparent 68%)',
          opacity: 0.5,
          animation: 'blob-drift-a 20s ease-in-out infinite',
        }}
      />
      <div
        className="hero-blob"
        style={{
          top: '-4%',
          right: '-10%',
          width: 'min(42vw, 520px)',
          height: 'min(42vw, 520px)',
          background: 'radial-gradient(circle at 60% 40%, var(--accent-2), transparent 66%)',
          opacity: 0.42,
          animation: 'blob-drift-b 26s ease-in-out infinite',
        }}
      />
      <div
        className="hero-blob"
        style={{
          bottom: '-16%',
          left: '28%',
          width: 'min(40vw, 480px)',
          height: 'min(40vw, 480px)',
          background: 'radial-gradient(circle at 50% 50%, var(--accent-3), transparent 66%)',
          opacity: 0.38,
          animation: 'blob-drift-c 23s ease-in-out infinite',
        }}
      />
    </div>
  )
}
