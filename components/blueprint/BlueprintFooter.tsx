export function BlueprintFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--bp-line)',
        marginTop: 32,
      }}
    >
      <div
        className="bp-container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          paddingBlock: 26,
        }}
      >
        <span className="bp-mono" style={{ color: 'var(--muted)' }}>
          © 2026 MURSHED AL MAIN
        </span>
        <span className="bp-mono" style={{ color: 'var(--muted)' }}>
          DRAWN &amp; BUILT WITH NEXT.JS — REV 3.0
        </span>
      </div>
    </footer>
  )
}
