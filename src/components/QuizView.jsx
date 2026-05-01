import { useState, useEffect, useRef, useCallback } from 'react'
import { LETTERS } from '../data'

function ActionBtn({ onClick, label, border = 'var(--border)', color = 'var(--muted)', hoverBorder, hoverColor }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "'DM Sans',sans-serif", padding: '9px 18px', borderRadius: 9,
        fontSize: '0.82rem', cursor: 'pointer', background: 'transparent',
        border: `1px solid ${hover ? hoverBorder : border}`,
        color: hover ? hoverColor : color, transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
      {label}
    </button>
  )
}

const DIFF_STYLE = {
  easy:   { background: 'rgba(106,255,224,0.1)', color: 'var(--easy)',   border: '1px solid rgba(106,255,224,0.22)' },
  medium: { background: 'rgba(255,209,102,0.1)', color: 'var(--medium)', border: '1px solid rgba(255,209,102,0.22)' },
  hard:   { background: 'rgba(255,106,176,0.1)', color: 'var(--hard)',   border: '1px solid rgba(255,106,176,0.22)' },
}

export default function QuizView({
  questions, config, score, setScore,
  times, setTimes, curQ, setCurQ,
  onEnd, onHint, onExplain, currentQRef,
}) {
  const [selected, setSelected]   = useState(null)
  const [answered, setAnswered]   = useState(false)
  const [timeLeft, setTimeLeft]   = useState(config.timeLimit)
  const [showExp,  setShowExp]    = useState(false)
  const timerRef = useRef(null)

  const q    = questions[curQ]
  const diff = (q?.diff || config.diff)

  const reset = useCallback(() => {
    setSelected(null); setAnswered(false); setShowExp(false); setTimeLeft(config.timeLimit)
  }, [config.timeLimit])

  useEffect(() => { reset() }, [curQ, reset])

  useEffect(() => {
    if (answered) return
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setAnswered(true); setShowExp(true)
          setTimes(prev => [...prev, config.timeLimit])
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [curQ, answered, config.timeLimit, setTimes])

  useEffect(() => {
    if (!q) return
    currentQRef.current = q
    if (config.voiceOn) speakText(q.q)
  }, [curQ, q])

  const speakText = text => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.88; u.pitch = 1.05
    window.speechSynthesis.speak(u)
  }

  const pickAnswer = idx => {
    if (answered) return
    clearInterval(timerRef.current)
    setSelected(idx); setAnswered(true); setShowExp(true)
    setTimes(prev => [...prev, config.timeLimit - timeLeft])
    if (idx === q.ans) setScore(s => s + 1)
  }

  const nextQ = () => curQ + 1 >= questions.length ? onEnd() : setCurQ(c => c + 1)

  if (!q) return null

  const pct = ((curQ / questions.length) * 100).toFixed(1)

  const optBorder = i => { if (!answered) return 'var(--border)'; if (i === q.ans) return 'var(--easy)'; if (i === selected) return 'var(--hard)'; return 'var(--border)' }
  const optBg     = i => { if (!answered) return 'var(--card)';   if (i === q.ans) return 'rgba(106,255,224,0.09)'; if (i === selected) return 'rgba(255,106,176,0.09)'; return 'var(--card)' }
  const optColor  = i => { if (!answered) return 'var(--text)';   if (i === q.ans) return 'var(--easy)'; if (i === selected) return 'var(--hard)'; return 'var(--muted)' }

  return (
    <div style={{ animation: 'fadeUp 0.35s ease' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '0.88rem' }}>
            Question {curQ + 1} / {questions.length}
          </span>
          <span style={{ background: 'rgba(124,106,255,0.14)', border: '1px solid rgba(124,106,255,0.28)', borderRadius: 20, padding: '4px 14px', fontSize: '0.8rem', color: 'var(--accent)' }}>
            Score: {score}
          </span>
        </div>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.15rem', color: timeLeft <= 5 ? 'var(--hard)' : 'var(--gold)', animation: timeLeft <= 5 ? 'pulse 0.8s infinite' : 'none' }}>
          {timeLeft}s
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--border)' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,var(--accent),var(--accent2))', transition: 'width 0.5s ease' }} />
      </div>

      {/* Body */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, fontSize: '0.73rem', marginBottom: '1.2rem', ...DIFF_STYLE[diff] }}>
          ● {diff.charAt(0).toUpperCase() + diff.slice(1)}
        </div>

        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.45rem', fontWeight: 600, lineHeight: 1.45, marginBottom: '2rem' }}>
          {q.q}
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: '2rem' }}>
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => pickAnswer(i)} disabled={answered}
              style={{
                width: '100%', padding: '1rem 1.25rem', borderRadius: 12,
                border: `1px solid ${optBorder(i)}`, background: optBg(i), color: optColor(i),
                cursor: answered ? 'default' : 'pointer', textAlign: 'left',
                fontFamily: "'DM Sans',sans-serif", fontSize: '0.93rem',
                display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s',
              }}>
              <span style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '0.78rem', color: optColor(i), background: answered && i === q.ans ? 'rgba(106,255,224,0.18)' : answered && i === selected ? 'rgba(255,106,176,0.18)' : 'rgba(255,255,255,0.05)' }}>
                {LETTERS[i]}
              </span>
              {opt}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showExp && (
          <div style={{ background: 'rgba(124,106,255,0.07)', border: '1px solid rgba(124,106,255,0.18)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', animation: 'fadeUp 0.3s ease' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Explanation</div>
            <div style={{ fontSize: '0.88rem', lineHeight: 1.65 }}>{q.exp}</div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <ActionBtn onClick={onHint}                         label="💡 AI Hint"     hoverBorder="var(--gold)"    hoverColor="var(--gold)" />
          <ActionBtn onClick={() => speakText(q.q)}          label="🔊 Read"        hoverBorder="var(--accent3)" hoverColor="var(--accent3)" />
          {answered && <ActionBtn onClick={onExplain}        label="🤖 Explain More" border="rgba(124,106,255,0.3)" color="var(--accent)" hoverBorder="var(--accent)" hoverColor="var(--accent)" />}
          {answered && (
            <button onClick={nextQ} style={{ fontFamily: "'DM Sans',sans-serif", padding: '9px 22px', borderRadius: 9, fontSize: '0.82rem', cursor: 'pointer', background: 'var(--accent)', color: '#fff', border: 'none', transition: 'all 0.2s' }}>
              {curQ + 1 >= questions.length ? 'See Results →' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}