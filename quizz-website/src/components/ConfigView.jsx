import { useState } from 'react'
import { CATEGORIES } from './Trivia'

const API_BASE = "AIzaSyAQIcajLGCK3oyuuXXqFk5JecDstQsooPE";


function DiffBtn({ label, active, color, bg, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '8px 4px', borderRadius: 8,
      border: active ? `1px solid ${color}` : '1px solid var(--border)',
      background: active ? bg : 'transparent',
      color: active ? color : 'var(--muted)',
      cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'DM Sans',sans-serif", transition: 'all 0.2s',
    }}>
      {label}
    </button>
  )
}

const DIFF_META = {
  easy:   { color: 'var(--easy)',   bg: 'rgba(106,255,224,0.08)' },
  medium: { color: 'var(--medium)', bg: 'rgba(255,209,102,0.08)' },
  hard:   { color: 'var(--hard)',   bg: 'rgba(255,106,176,0.08)' },
}

// Source toggle: 'trivia' = Open Trivia DB, 'upload' = user uploaded content
const SOURCES = [
  { id: 'trivia', label: '🌐 Trivia API', desc: 'Live questions from Open Trivia DB (free, no key needed)' },
  { id: 'upload', label: '📄 My Content', desc: 'Generate questions from your uploaded notes or text' },
]

export default function ConfigView({ config, setConfig, onStart, isGenerating, hasContent }) {
  const card  = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 13, padding: '1.2rem' }
  const label = { fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10, display: 'block' }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 2rem', animation: 'fadeUp 0.35s ease' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.9rem', fontWeight: 700, marginBottom: 5 }}>Configure Your Quiz</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Choose your question source, category, difficulty and more.</p>
      </div>

      {/* ── Question Source ── */}
      <div style={{ marginBottom: '1.4rem' }}>
        <span style={label}>Question Source</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {SOURCES.map(src => {
            const active = config.source === src.id
            const disabled = src.id === 'upload' && !hasContent
            return (
              <div key={src.id}
                onClick={() => !disabled && setConfig(c => ({ ...c, source: src.id }))}
                style={{
                  background: active ? 'rgba(124,106,255,0.1)' : 'var(--card)',
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 12, padding: '1rem 1.2rem', cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.45 : 1, transition: 'all 0.2s',
                }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '0.92rem', marginBottom: 4, color: active ? 'var(--accent)' : 'var(--text)' }}>
                  {src.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {disabled ? '⚠️ Upload content first to use this option' : src.desc}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Category (only for Trivia API) ── */}
      {config.source === 'trivia' && (
        <div style={{ ...card, marginBottom: '1.4rem' }}>
          <span style={label}>Category</span>
          <select
            value={config.categoryId}
            onChange={e => setConfig(c => ({ ...c, categoryId: +e.target.value }))}
            style={{
              width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 9, padding: '10px 14px', color: 'var(--text)',
              fontFamily: "'DM Sans',sans-serif", fontSize: '0.88rem', outline: 'none', cursor: 'pointer',
            }}
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* ── Grid: difficulty, count, time, voice ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: '2rem' }}>
        <div style={card}>
          <span style={label}>Difficulty</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {['easy', 'medium', 'hard'].map(d => (
              <DiffBtn key={d}
                label={d.charAt(0).toUpperCase() + d.slice(1)}
                active={config.diff === d}
                {...DIFF_META[d]}
                onClick={() => setConfig(c => ({ ...c, diff: d }))}
              />
            ))}
          </div>
        </div>

        <div style={card}>
          <span style={label}>Number of Questions: {config.qCount}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="range" min={3} max={20} step={1} value={config.qCount}
              onChange={e => setConfig(c => ({ ...c, qCount: +e.target.value }))} style={{ flex: 1 }} />
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent)', minWidth: 28 }}>{config.qCount}</span>
          </div>
        </div>

        <div style={card}>
          <span style={label}>Time per Question: {config.timeLimit}s</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="range" min={15} max={120} step={15} value={config.timeLimit}
              onChange={e => setConfig(c => ({ ...c, timeLimit: +e.target.value }))} style={{ flex: 1 }} />
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent)', minWidth: 40 }}>{config.timeLimit}s</span>
          </div>
        </div>

        <div style={card}>
          <span style={label}>Voice Narration</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <DiffBtn label="On"  active={config.voiceOn}  color="var(--easy)" bg="rgba(106,255,224,0.08)" onClick={() => setConfig(c => ({ ...c, voiceOn: true }))} />
            <DiffBtn label="Off" active={!config.voiceOn} color="var(--hard)" bg="rgba(255,106,176,0.08)" onClick={() => setConfig(c => ({ ...c, voiceOn: false }))} />
          </div>
        </div>
      </div>

      {/* ── Source badge ── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
        {config.source === 'trivia' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--easy)', background: 'rgba(106,255,224,0.08)', border: '1px solid rgba(106,255,224,0.2)', borderRadius: 20, padding: '6px 16px' }}>
            🌐 Questions from Open Trivia DB — Free &amp; No API Key Needed
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--accent)', background: 'rgba(124,106,255,0.08)', border: '1px solid rgba(124,106,255,0.2)', borderRadius: 20, padding: '6px 16px' }}>
            ✦ Questions generated by AI from your content
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', padding: '0.5rem 0 2.5rem' }}>
        <button onClick={onStart} disabled={isGenerating} style={{
          fontSize: '1.1rem', padding: '16px 52px', borderRadius: 14,
          background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
          border: 'none', color: '#fff', cursor: isGenerating ? 'not-allowed' : 'pointer',
          fontFamily: "'Syne',sans-serif", fontWeight: 600, letterSpacing: '0.02em',
          opacity: isGenerating ? 0.6 : 1, transition: 'all 0.2s',
        }}>
          {isGenerating ? 'Loading Questions…' : 'Start Quiz ✦'}
        </button>
      </div>
    </div>
  )
}



