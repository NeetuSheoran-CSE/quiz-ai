
export default function GenOverlay({ visible, message }) {
  if (!visible) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,18,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 500, backdropFilter: 'blur(8px)' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite', marginBottom: '1.5rem' }} />
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.3rem', fontWeight: 600, marginBottom: 8 }}>
        Loading Questions
        <span style={{ display: 'inline-flex' }}>
          {[0, 0.3, 0.6].map((d, i) => (
            <span key={i} style={{ animation: `blink 1.2s ${d}s infinite` }}>.</span>
          ))}
        </span>
      </h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.88rem', maxWidth: 340, textAlign: 'center' }}>
        {message || 'Fetching questions for your quiz…'}
      </p>
    </div>
  )
}