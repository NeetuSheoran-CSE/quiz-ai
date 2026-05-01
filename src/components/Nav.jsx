export default function Nav({ view, setView, content, hasQuestions }) {
  const tabs = [
    { id: 'home',   label: 'Home' },
    { id: 'upload', label: 'Upload' },
    { id: 'config', label: 'Configure' },
  ]

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem 2rem', borderBottom: '1px solid var(--border)',
      background: 'rgba(10,10,18,0.96)', backdropFilter: 'blur(16px)',
      position: 'sticky', top: 0, zIndex: 300,
    }}>
      <div
        onClick={() => setView('home')}
        style={{
          fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.35rem',
          background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer',
        }}
      >
        QuizMind AI
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            style={{
              padding: '7px 16px', borderRadius: 8, border: 'none',
              background: view === t.id ? 'rgba(124,106,255,0.12)' : 'transparent',
              color: view === t.id ? 'var(--accent)' : 'var(--muted)',
              fontFamily: "'DM Sans',sans-serif", fontSize: '0.84rem',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => setView(content || hasQuestions ? 'config' : 'upload')}
        style={{
          padding: '8px 22px', borderRadius: 9, border: 'none',
          background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
          color: '#fff', fontFamily: "'DM Sans',sans-serif",
          fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer',
        }}
      >
        ▶ Start Quiz
      </button>
    </nav>
  )
}