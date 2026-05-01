import { useState, useRef } from 'react'
import { callClaude } from './api'

import {FALLBACK_QUESTIONS , shuffle } from './data'
import { CATEGORIES } from './Components/Trivia'

import Nav         from './components/Nav'
import HomeView    from './components/home/HomeView'
import UploadView  from './components/UploadView'


import ConfigView  from './components/ConfigView'
import QuizView    from './components/QuizView'
import ResultsView from './components/ResultsView'
import GenOverlay  from './components/GenOverlay'
import Tutor       from './components/Tutor'
import Voice       from './components/Voice'
import {fetchTriviaQuestions} from './Components/Trivia'



// { <Routes>
//   <Route path="/" element={<Home />} />
//   <Route path="/upload" element={<Upload />} />
//   <Route path="/configure" element={<Configure />} />
//   <Route path="/tutor" element={<Tutor />} />
//   <Route path="/voice" element={<Voice />} />
// </Routes> }

// import Configure from "./pages/Configure";
// { <Routes>
//   <Route path="/" element={<Home />} />
//   <Route path="/upload" element={<Upload />} />
//   <Route path="/configure" element={<Configure />} />
// </Routes> }
function Configure() {
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(10);
  const [hintsAllowed, setHintsAllowed] = useState(3);
  const [voice, setVoice] = useState("nova");
  const [tutorEnabled, setTutorEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("quizmind_config", JSON.stringify({
      difficulty, numQuestions, hintsAllowed, voice, tutorEnabled
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const page = { minHeight:"100vh", background:"radial-gradient(ellipse at top,#1a0b2e 0%,#0a0118 60%)", color:"#fff", fontFamily:"DM Sans,sans-serif", padding:"80px 24px" };
  const card = { maxWidth:720, margin:"0 auto", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:36, display:"flex", flexDirection:"column", gap:28 };
  const gradText = { background:"linear-gradient(90deg,#8b5cf6,#ec4899)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" };
  const cta = { padding:"14px 28px", borderRadius:999, border:"none", background:"linear-gradient(90deg,#8b5cf6,#ec4899)", color:"#fff", fontWeight:700, cursor:"pointer" };
  const pill = (a) => ({ padding:"10px 20px", borderRadius:999, border:a?"none":"1px solid rgba(255,255,255,0.15)", background:a?"linear-gradient(90deg,#8b5cf6,#ec4899)":"transparent", color:"#fff", cursor:"pointer" });

  return (
    <div style={page}>
      <div style={{maxWidth:720,margin:"0 auto",textAlign:"center"}}>
        <h1 style={{fontSize:"3rem",fontWeight:800}}>Configure Your <span style={gradText}>Quiz Experience</span></h1>
        <p style={{color:"#b9b3c9",marginBottom:48}}>Tune difficulty, hints, and the AI tutor's voice.</p>
      </div>
      <form style={card} onSubmit={handleSave}>
        <div>
          <label style={{fontWeight:600}}>Difficulty</label>
          <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
            {["easy","medium","hard","expert"].map(d=>(
              <button type="button" key={d} style={pill(difficulty===d)} onClick={()=>setDifficulty(d)}>
                {d[0].toUpperCase()+d.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{fontWeight:600}}>Questions: <span style={{color:"#c084fc"}}>{numQuestions}</span></label>
          <input type="range" min="5" max="30" value={numQuestions} onChange={e=>setNumQuestions(+e.target.value)} style={{width:"100%",accentColor:"#8b5cf6"}}/>
        </div>
        <div>
          <label style={{fontWeight:600}}>Hints: <span style={{color:"#c084fc"}}>{hintsAllowed}</span></label>
          <input type="range" min="0" max="10" value={hintsAllowed} onChange={e=>setHintsAllowed(+e.target.value)} style={{width:"100%",accentColor:"#8b5cf6"}}/>
        </div>
        <div>
          <label style={{fontWeight:600}}>AI Tutor Voice</label>
          <select value={voice} onChange={e=>setVoice(e.target.value)} style={{width:"100%",padding:12,borderRadius:12,marginTop:8,background:"rgba(255,255,255,0.06)",color:"#fff",border:"1px solid rgba(255,255,255,0.12)"}}>
            {["alloy","echo","fable","onyx","nova","shimmer"].map(v=><option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <label style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontWeight:600}}>Enable AI Tutor</span>
          <input type="checkbox" checked={tutorEnabled} onChange={e=>setTutorEnabled(e.target.checked)}/>
        </label>
        <button type="submit" style={cta}>{saved?"Saved ✓":"Save Configuration →"}</button>
      </form>
    </div>
  );
}

export default function App() {
  const [view,         setView]         = useState('home')
  const [content,      setContent]      = useState('')
  const [config,       setConfig]       = useState({ diff: 'medium', qCount: 5, timeLimit: 30, voiceOn: false })
  const [questions,    setQuestions]    = useState([])
  const [curQ,         setCurQ]         = useState(0)
  const [score,        setScore]        = useState(0)
  const [times,        setTimes]        = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [chatOpen,     setChatOpen]     = useState(false)
  const [aiFeedback,   setAiFeedback]   = useState('')
  const currentQRef = useRef(null)

  /* ── Generate questions via Claude ── */
  const handleStart = async (topics) => {
    setIsGenerating(true)
    try {
      let qs
      if (content) {
        const activeTopics = topics.join(', ')
        const system = `You are an expert quiz creator. Generate exactly ${config.qCount} multiple-choice questions from the provided study material.
Rules:
- Difficulty: ${config.diff}
- Focus on: ${activeTopics || 'all topics'}
- Each question must have exactly 4 options
- Only one correct answer per question
- ${config.diff === 'easy' ? 'Straightforward factual recall' : config.diff === 'medium' ? 'Conceptual understanding, some application' : 'Deep analysis, nuanced distractors'}
- Include a brief 1-2 sentence explanation for the correct answer

Respond ONLY with valid JSON (no markdown, no preamble):
{"questions":[{"q":"...","opts":["A","B","C","D"],"ans":0,"diff":"${config.diff}","exp":"..."}]}`

        const raw   = await callClaude([{ role: 'user', content: `Study material:\n\n${content.substring(0, 4000)}` }], system, 2500)
        const clean = raw.replace(/```json|```/g, '').trim()
        qs = JSON.parse(clean).questions
      } else {
        await new Promise(r => setTimeout(r, 900))
        qs = shuffle([...FALLBACK_QUESTIONS]).slice(0, config.qCount)
      }

      setQuestions(qs)
      setScore(0); setCurQ(0); setTimes([]); setAiFeedback('')
      setView('quiz')
    } catch (err) {
      console.warn('Generation failed — using fallback questions:', err)
      setQuestions(shuffle([...FALLBACK_QUESTIONS]).slice(0, config.qCount))
      setScore(0); setCurQ(0); setTimes([]); setAiFeedback('')
      setView('quiz')
    }
    setIsGenerating(false)
  }

  /* ── End quiz & get AI feedback ── */
  const handleEnd = async () => {
    setView('results')
    const total = questions.length
    const pct   = Math.round((score / total) * 100)
    const avg   = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0
    try {
      const sys = 'You are an encouraging quiz tutor. Give brief, personalised performance feedback in 2-3 sentences. Be motivating and specific.'
      const fb  = await callClaude([{ role: 'user', content: `Student scored ${score}/${total} (${pct}%) on a ${config.diff} quiz. Avg time per question: ${avg}s.` }], sys, 200)
      setAiFeedback(fb)
    } catch {
      setAiFeedback(
        pct >= 70
          ? 'Great performance! You clearly have a solid grasp of the material. Try a harder difficulty next time to keep challenging yourself.'
          : 'Good effort! Review the questions you missed and focus on understanding the core concepts. With practice, you will improve significantly.'
      )
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <GenOverlay visible={isGenerating} />

      <Nav view={view} setView={setView} content={content} hasQuestions={questions.length > 0} />

      {view === 'home'    && <HomeView setView={setView} />}
      {view === 'upload'  && <UploadView content={content} setContent={setContent} setView={setView} />}
      {view === 'config'  && <ConfigView config={config} setConfig={setConfig} onStart={handleStart} isGenerating={isGenerating} />}
      {view === 'quiz' && questions.length > 0 && (
        <QuizView
          questions={questions}  config={config}
          score={score}          setScore={setScore}
          times={times}          setTimes={setTimes}
          curQ={curQ}            setCurQ={setCurQ}
          onEnd={handleEnd}
          onHint={()    => setChatOpen(true)}
          onExplain={() => setChatOpen(true)}
          currentQRef={currentQRef}
        />
      )}
      {view === 'results' && (
        <ResultsView
          score={score}  total={questions.length}
          times={times}  aiFeedback={aiFeedback}
          onRetry={() => { setCurQ(0); setScore(0); setTimes([]); setAiFeedback(''); setView('quiz') }}
          setView={setView}
        />
      )}

    </div>
  )
}
