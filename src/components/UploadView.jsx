


import { useState, useRef } from 'react'

// Supported file types
const ACCEPTED = '.pdf,.txt,.docx,.md,.csv,.pptx,.xlsx'

export default function UploadView({ content, setContent, setView, onAnalyze, isAnalyzing, topics }) {
  const [pasteText, setPasteText] = useState(content || '')
  const [fileName,  setFileName]  = useState('')
  const [fileSize,  setFileSize]  = useState('')
  const [dragging,  setDragging]  = useState(false)
  const [error,     setError]     = useState('')
  const fileRef = useRef()

  // Read uploaded file as text
  const readFile = file => {
    setError('')
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) { setError('File is too large. Max size is 5MB.'); return }

    const sizeKB = (file.size / 1024).toFixed(1)
    setFileSize(sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB')
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = e => {
      setContent(e.target.result)
      setPasteText('')
    }
    reader.onerror = () => setError('Failed to read file. Please try a .txt or .md file.')
    reader.readAsText(file)
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) readFile(f)
  }

  // Save pasted text and trigger analysis
  const handleAnalyze = () => {
    setError('')
    const txt = pasteText.trim()
    const finalContent = txt || content

    if (!finalContent || finalContent.trim().length < 20) {
      setError('Please add at least a few sentences of content before analyzing.')
      return
    }
    if (txt) setContent(txt)

    // Trigger AI analysis in parent (App.jsx)
    onAnalyze(finalContent)
  }

  const charCount = (pasteText || content || '').length

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '2.5rem 2rem 5rem', animation: 'fadeUp 0.35s ease' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.9rem', fontWeight: 700, marginBottom: 6, background: 'linear-gradient(135deg,var(--accent),var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Upload Your Study Content
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Upload a file or paste your notes — Claude AI will read it, detect topics, and generate quiz questions tailored exactly to your content.
        </p>
      </div>

      {/* How it works banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: '2rem' }}>
        {[
          { step:'1', icon:'📄', label:'Upload Content',     desc:'File or paste text' },
          { step:'2', icon:'🧠', label:'AI Reads & Analyses',desc:'Claude detects topics' },
          { step:'3', icon:'❓', label:'Quiz Generated',      desc:'Questions from your material' },
        ].map(s => (
          <div key={s.step} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '0.82rem', marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : fileName ? 'var(--easy)' : 'var(--border)'}`,
          borderRadius: 16, padding: '2.5rem 2rem', textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'rgba(124,106,255,0.05)' : fileName ? 'rgba(106,255,224,0.04)' : 'var(--card)',
          transition: 'all 0.2s',
        }}
      >
        {fileName ? (
          // File loaded state
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>📄</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '1rem', color: 'var(--easy)', marginBottom: 4 }}>
              ✓ {fileName}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.8rem' }}>{fileSize} — file loaded successfully</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', border: '1px solid var(--border)', display: 'inline-block', borderRadius: 8, padding: '4px 12px' }}>
              Click to replace file
            </div>
          </div>
        ) : (
          // Empty state
          <div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(124,106,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c6aff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4-4 4M12 8v8" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 6 }}>Drop your file here</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '0.8rem' }}>or click to browse your device</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['TXT', 'MD', 'CSV', 'PDF*', 'DOCX*'].map(t => (
                <span key={t} style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', border: '1px solid var(--border)', color: 'var(--muted)' }}>{t}</span>
              ))}
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 8, opacity: 0.7 }}>* PDF and DOCX work best as plain text exports</p>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept={ACCEPTED} style={{ display: 'none' }}
        onChange={e => { if (e.target.files[0]) readFile(e.target.files[0]) }} />

      {/* Divider */}
      <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.83rem', margin: '1.6rem 0', position: 'relative' }}>
        <span style={{ background: 'var(--bg)', padding: '0 14px', position: 'relative', zIndex: 1 }}>or paste your notes directly</span>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--border)', zIndex: 0 }} />
      </div>

      {/* Paste area */}
      <div style={{ position: 'relative' }}>
        <textarea
          value={pasteText}
          onChange={e => { setPasteText(e.target.value); setFileName(''); setError('') }}
          placeholder={`Paste your textbook chapter, lecture notes, article, or any study material here...\n\nExample:\nThe water cycle (also known as the hydrological cycle) describes the continuous movement of water on, above and below the surface of the Earth. The mass of water on Earth remains fairly constant over time but the partitioning of the water into the major reservoirs of ice, fresh water, saline water and atmospheric water is variable...\n\nClaude will read this and generate questions like:\n• What is another name for the water cycle?\n• What does the water cycle describe?`}
          style={{
            width: '100%', background: 'var(--card)', border: `1px solid ${pasteText.length > 50 ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 12, padding: '1rem', color: 'var(--text)', fontSize: '0.88rem',
            resize: 'vertical', minHeight: 220, outline: 'none', lineHeight: 1.7, transition: 'border 0.2s',
          }}
        />
        {charCount > 0 && (
          <div style={{ position: 'absolute', bottom: 10, right: 12, fontSize: '0.7rem', color: 'var(--muted)' }}>
            {charCount.toLocaleString()} characters
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div style={{ background: 'rgba(255,106,176,0.08)', border: '1px solid rgba(255,106,176,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: '0.83rem', color: 'var(--hard)', marginTop: 12, display: 'flex', gap: 8 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Topics preview (shown after analysis) */}
      {topics && topics.length > 0 && (
        <div style={{ background: 'rgba(124,106,255,0.06)', border: '1px solid rgba(124,106,255,0.2)', borderRadius: 12, padding: '1rem 1.2rem', marginTop: '1.2rem' }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.7rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8 }}>
            🧠 Topics Detected by AI
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {topics.map((t, i) => (
              <span key={i} style={{ padding: '5px 14px', borderRadius: 20, fontSize: '0.78rem', background: 'rgba(124,106,255,0.12)', border: '1px solid rgba(124,106,255,0.25)', color: 'var(--accent)', fontWeight: 500 }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.4rem', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--accent)', background: 'rgba(124,106,255,0.08)', border: '1px solid rgba(124,106,255,0.2)', borderRadius: 20, padding: '6px 14px' }}>
        Powered by AI
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {topics && topics.length > 0 && (
            <button
              onClick={() => setView('config')}
              style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 22px', fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>
              Configure Quiz →
            </button>
          )}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            style={{
              background: isAnalyzing ? 'rgba(124,106,255,0.4)' : 'linear-gradient(135deg,var(--accent),var(--accent2))',
              color: '#fff', border: 'none', borderRadius: 10, padding: '10px 26px',
              fontSize: '0.9rem', cursor: isAnalyzing ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans',sans-serif", fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
            {isAnalyzing ? (
              <>
                <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Analysing Content…
              </>
            ) : (
              topics?.length > 0 ? '🔄 Re-Analyse' : '🧠 Analyse & Detect Topics'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}