const FEATURES = [
  { icon: '📄', color: 'rgba(124,106,255,0.14)', title: 'AI Question Generation',  desc: 'Claude reads your PDF, notes, or text and generates relevant, varied quiz questions automatically.' },
  { icon: '🎯', color: 'rgba(255,106,176,0.14)', title: 'Adaptive Difficulty',      desc: 'Choose Easy, Medium, or Hard. AI adjusts complexity, vocabulary, and trap options accordingly.' },
  { icon: '🤖', color: 'rgba(106,255,224,0.14)', title: 'Live AI Tutor Chat',       desc: 'Ask the Claude-powered chatbot to explain answers, give hints, or dive deeper into any topic.' },
  { icon: '🔊', color: 'rgba(255,209,102,0.14)', title: 'Voice System',             desc: 'Questions read aloud via TTS. Speak your answers or chat with the bot hands-free.' },
]

export default function HomeView({ setView }) {
  return (
    <div style={{ animation: 'fadeUp 0.35s ease' }}>
      {/* Hero */}
      <div style={{ padding: '5rem 2rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 500,
          background: 'radial-gradient(ellipse at 50% 40%,rgba(124,106,255,0.18) 0%,transparent 65%)',
          pointerEvents: 'none',
        }} />

        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: '3.4rem', fontWeight: 800, lineHeight: 1.12, marginBottom: '1.1rem' }}>
          Learn Smarter with<br />
          <span style={{ background: 'linear-gradient(135deg,var(--accent) 20%,var(--accent2) 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI-Generated Quizzes
          </span>
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--muted)', maxWidth: 520, margin: '0 auto 2.2rem', lineHeight: 1.75 }}>
          Upload any study material — Claude AI reads it, understands it, and builds a personalised quiz
          with adaptive difficulty, voice support, and an AI tutor chatbot.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <button
            onClick={() => setView('upload')}
            style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent2))', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 36px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
          >
            Upload Your Content →
          </button>
          <button
            onClick={() => setView('config')}
            style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 28px', fontSize: '1rem', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
          >
            Quick Demo Quiz
          </button>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, maxWidth: 900, margin: '0 auto', padding: '0 2rem 4rem' }}>
        {FEATURES.map(f => (
          <div key={f.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.4rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontSize: '1.25rem' }}>
              {f.icon}
            </div>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '0.95rem', fontWeight: 600, marginBottom: 6 }}>{f.title}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}




// import './HomeView.css'

// const FEATURES = [
//   {
//     icon: '📄', bg: 'rgba(124,106,255,0.14)', accent: 'var(--accent)',
//     title: 'AI Question Generation',
//     desc: 'Claude reads your PDF, notes, or text and generates relevant, varied quiz questions automatically.',
//     view: 'ai-generation', label: 'Learn More →',
//   },
//   {
//     icon: '🎯', bg: 'rgba(255,106,176,0.14)', accent: 'var(--accent2)',
//     title: 'Adaptive Difficulty',
//     desc: 'Choose Easy, Medium, or Hard. AI adjusts complexity, vocabulary, and trap options accordingly.',
//     view: 'adaptive-difficulty', label: 'Explore Levels →',
//   },
//   {
//     icon: '🤖', bg: 'rgba(106,255,224,0.14)', accent: 'var(--accent3)',
//     title: 'Live AI Tutor Chat',
//     desc: 'Ask the Claude-powered chatbot to explain answers, give hints, or dive deeper into any topic.',
//     view: 'config', label: 'Try It →',
//   },
//   {
//     icon: '🔊', bg: 'rgba(255,209,102,0.14)', accent: 'var(--gold)',
//     title: 'Voice System',
//     desc: 'Questions read aloud via TTS. Speak your answers or chat with the bot hands-free.',
//     view: 'voice-system', label: 'Learn More →',
//   },
// ]

// export default function HomeView({ setView }) {
//   return (
//     <div className="home-page">
//       <div className="home-hero">
//         <div className="home-hero__glow" />
//         <div className="home-hero__badge">✦ AI-Powered Learning</div>
//         <h1>Learn Smarter with<br /><span className="home-hero__grad">AI-Generated Quizzes</span></h1>
//         <p>Upload any study material — AI reads it, understands it, and builds a personalised quiz with adaptive difficulty, voice support, and an AI tutor chatbot.</p>
//         <div className="home-hero__btns">
//           <button className="btn-hero-primary" onClick={() => setView('upload')}>Upload Your Content →</button>
//           <button className="btn-hero-secondary" onClick={() => setView('config')}>Quick Demo Quiz</button>
//         </div>
//       </div>

//       <div className="home-stats">
//         {[{num:'20+',label:'Quiz Categories'},{num:'3',label:'Difficulty Levels'},{num:'AI',label:'Claude-Powered'},{num:'🔊',label:'Voice Support'}].map(s=>(
//           <div className="home-stat" key={s.label}>
//             <div className="home-stat__num">{s.num}</div>
//             <div className="home-stat__label">{s.label}</div>
//           </div>
//         ))}
//       </div>

//       <div className="home-features">
//         {FEATURES.map(f => (
//           <div className="home-feat" key={f.title} onClick={() => setView(f.view)} style={{cursor:'pointer'}}>
//             <div className="home-feat__icon" style={{background:f.bg}}>{f.icon}</div>
//             <h3>{f.title}</h3>
//             <p>{f.desc}</p>
//             <span className="home-feat__link" style={{color:f.accent}}>{f.label}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }