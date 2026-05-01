import { useState, useRef } from 'react'

export default function UploadView({ content, setContent, setView }) {
  const [pasteText, setPasteText]   = useState(content || '')
  const [fileName, setFileName]     = useState('')
  const [dragging, setDragging]     = useState(false)
  const fileRef = useRef()

  const readFile = file => {
    const reader = new FileReader()
    reader.onload = e => { setContent(e.target.result); setFileName(file.name) }
    reader.readAsText(file)
  }

  const handleProcess = () => {
    const txt = pasteText.trim()
    if (txt) setContent(txt)
    if (!txt && !content) { alert('Please upload a file or paste some text first.'); return }
    setView('config')
  }

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '2.5rem 2rem', animation: 'fadeUp 0.35s ease' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.9rem', fontWeight: 700, marginBottom: 5 }}>Add Your Content</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Upload a file or paste text — Claude AI will extract topics and generate quiz questions.</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) readFile(f) }}
        onClick={() => fileRef.current.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 16, padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'rgba(124,106,255,0.04)' : 'var(--card)', transition: 'all 0.2s',
        }}
      >
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(124,106,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7c6aff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4-4 4M12 8v8" />
          </svg>
        </div>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 6 }}>Drop your file here</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.83rem' }}>or click to browse your device</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
          {['PDF', 'TXT', 'DOCX', 'MD', 'CSV'].map(t => (
            <span key={t} style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.73rem', border: '1px solid var(--border)', color: 'var(--muted)' }}>{t}</span>
          ))}
        </div>
      </div>
      <input ref={fileRef} type="file" accept=".pdf,.txt,.docx,.md,.csv" style={{ display: 'none' }}
        onChange={e => { if (e.target.files[0]) readFile(e.target.files[0]) }} />

      {fileName && (
        <div style={{ background: 'var(--card)', border: '1px solid rgba(106,255,224,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: '0.84rem', marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--easy)' }}>
          ✓ {fileName} — ready to process
        </div>
      )}

      {/* Divider */}
      <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.83rem', margin: '1.6rem 0', position: 'relative' }}>
        <span style={{ background: 'var(--bg)', padding: '0 12px', position: 'relative', zIndex: 1 }}>or paste text directly</span>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--border)', zIndex: 0 }} />
      </div>

      <textarea
        value={pasteText}
        onChange={e => setPasteText(e.target.value)}
        placeholder={`Paste your notes, textbook chapter, article, or any study material here...\n\nExample:\nThe mitochondria is the powerhouse of the cell...`}
        style={{
          width: '100%', background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '1rem', color: 'var(--text)', fontSize: '0.88rem',
          resize: 'vertical', minHeight: 180, outline: 'none', lineHeight: 1.6,
        }}
      />

       <button onClick={handleProcess} style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent2))', color: '#fff', border: 'none',margin: '1rem 0',justifyContent: 'center', borderRadius: 10, padding: '10px 22px', fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
          Analyze & Continue →
        </button>
      </div>
    
  )
}