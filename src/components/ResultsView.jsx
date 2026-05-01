const CIRCUMFERENCE = 408.41

export default function ResultsView({ score, total, times, aiFeedback, onRetry, setView }) {
  const pct    = Math.round((score / total) * 100)
  const avg    = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0
  const offset = CIRCUMFERENCE * (1 - pct / 100)
  const title  = pct >= 80 ? 'Excellent Work!' : pct >= 60 ? 'Good Job!' : pct >= 40 ? 'Keep Practicing!' : "Let's Review!"
  const trophy = pct >= 80 ? '🏆' : pct >= 60 ? '🥈' : pct >= 40 ? '📚' : '💪'

  const card = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem' }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '3.5rem 2rem', textAlign: 'center', animation: 'fadeUp 0.35s ease' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 24px rgba(255,209,102,0.55))' }}>{trophy}</div>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: '2.1rem', fontWeight: 800, marginBottom: 6 }}>{title}</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', fontSize: '0.92rem' }}>
        You answered {score} out of {total} correctly ({pct}%)
      </p>

      {/* Score ring */}
      <div style={{ width: 150, height: 150, margin: '0 auto 2rem', position: 'relative' }}>
        <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#7c6aff" />
              <stop offset="100%" stopColor="#ff6ab0" />
            </linearGradient>
          </defs>
          <circle fill="none" stroke="var(--border)" strokeWidth="10" cx="75" cy="75" r="65" />
          <circle fill="none" stroke="url(#rg)" strokeWidth="10" strokeLinecap="round"
            cx="75" cy="75" r="65"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.9rem', fontWeight: 800 }}>{pct}%</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{score}/{total}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: '2rem' }}>
        {[
          { num: score,   label: 'Correct',  color: 'var(--easy)' },
          { num: total - score, label: 'Wrong', color: 'var(--hard)' },
          { num: avg + 's', label: 'Avg Time', color: 'var(--gold)' },
        ].map(st => (
          <div key={st.label} style={card}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: 3, color: st.color }}>{st.num}</div>
            <div style={{ fontSize: '0.73rem', color: 'var(--muted)' }}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* AI feedback */}
      <div style={{ ...card, marginBottom: '2rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontFamily: "'Syne',sans-serif", fontSize: '0.92rem', fontWeight: 600 }}>
          🤖 AI Performance Feedback
        </div>
        <div style={{ fontSize: '0.87rem', color: 'var(--muted)', lineHeight: 1.65 }}>
          {aiFeedback || 'Generating personalised feedback…'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={onRetry}             style={primaryBtn}>Retry Quiz</button>
        <button onClick={() => setView('config')} style={secondaryBtn}>New Quiz</button>
        <button onClick={() => setView('upload')} style={secondaryBtn}>New Content</button>
      </div>
    </div>
  )
}

const primaryBtn = {
  background: 'linear-gradient(135deg,var(--accent),var(--accent2))', color: '#fff',
  border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: '1rem',
  fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
}
const secondaryBtn = {
  background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)',
  borderRadius: 12, padding: '14px 24px', fontSize: '0.9rem',
  cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
}