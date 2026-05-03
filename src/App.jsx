// import { useState, useRef } from 'react'
// import { callClaude } from './api'
// // import { FALLBACK_QUESTIONS, shuffle } from './data'
// import { CATEGORIES } from './components/Trivia'

// import Nav         from './components/Nav'
// import HomeView    from './components/home/HomeView'
// import UploadView  from './components/UploadView'


// import ConfigView  from './components/ConfigView'
// import QuizView    from './components/QuizView'
// import ResultsView from './components/ResultsView'
// // import Chatbot    from './components/Chatbot'
// import GenOverlay  from './components/GenOverlay'
// import Tutor       from './components/Tutor'
// import Voice       from './components/Voice'
// import {fetchTriviaQuestions} from './components/Trivia'



// {/* <Routes>
//   <Route path="/" element={<Home />} />
//   <Route path="/upload" element={<Upload />} />
//   <Route path="/configure" element={<Configure />} />
//   <Route path="/tutor" element={<Tutor />} />
//   <Route path="/voice" element={<Voice />} />
// </Routes> */}

// // import Configure from "./pages/Configure";
// {/* <Routes>
//   <Route path="/" element={<Home />} />
//   <Route path="/upload" element={<Upload />} />
//   <Route path="/configure" element={<Configure />} />
// </Routes> */}
// function Configure() {
//   const [difficulty, setDifficulty] = useState("medium");
//   const [numQuestions, setNumQuestions] = useState(10);
//   const [hintsAllowed, setHintsAllowed] = useState(3);
//   const [voice, setVoice] = useState("nova");
//   const [tutorEnabled, setTutorEnabled] = useState(true);
//   const [saved, setSaved] = useState(false);

//   const handleSave = (e) => {
//     e.preventDefault();
//     localStorage.setItem("quizmind_config", JSON.stringify({
//       difficulty, numQuestions, hintsAllowed, voice, tutorEnabled
//     }));
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2000);
//   };

//   const page = { minHeight:"100vh", background:"radial-gradient(ellipse at top,#1a0b2e 0%,#0a0118 60%)", color:"#fff", fontFamily:"DM Sans,sans-serif", padding:"80px 24px" };
//   const card = { maxWidth:720, margin:"0 auto", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:36, display:"flex", flexDirection:"column", gap:28 };
//   const gradText = { background:"linear-gradient(90deg,#8b5cf6,#ec4899)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" };
//   const cta = { padding:"14px 28px", borderRadius:999, border:"none", background:"linear-gradient(90deg,#8b5cf6,#ec4899)", color:"#fff", fontWeight:700, cursor:"pointer" };
//   const pill = (a) => ({ padding:"10px 20px", borderRadius:999, border:a?"none":"1px solid rgba(255,255,255,0.15)", background:a?"linear-gradient(90deg,#8b5cf6,#ec4899)":"transparent", color:"#fff", cursor:"pointer" });

//   return (
//     <div style={page}>
//       <div style={{maxWidth:720,margin:"0 auto",textAlign:"center"}}>
//         <h1 style={{fontSize:"3rem",fontWeight:800}}>Configure Your <span style={gradText}>Quiz Experience</span></h1>
//         <p style={{color:"#b9b3c9",marginBottom:48}}>Tune difficulty, hints, and the AI tutor's voice.</p>
//       </div>
//       <form style={card} onSubmit={handleSave}>
//         <div>
//           <label style={{fontWeight:600}}>Difficulty</label>
//           <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
//             {["easy","medium","hard","expert"].map(d=>(
//               <button type="button" key={d} style={pill(difficulty===d)} onClick={()=>setDifficulty(d)}>
//                 {d[0].toUpperCase()+d.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div>
//           <label style={{fontWeight:600}}>Questions: <span style={{color:"#c084fc"}}>{numQuestions}</span></label>
//           <input type="range" min="5" max="30" value={numQuestions} onChange={e=>setNumQuestions(+e.target.value)} style={{width:"100%",accentColor:"#8b5cf6"}}/>
//         </div>
//         <div>
//           <label style={{fontWeight:600}}>Hints: <span style={{color:"#c084fc"}}>{hintsAllowed}</span></label>
//           <input type="range" min="0" max="10" value={hintsAllowed} onChange={e=>setHintsAllowed(+e.target.value)} style={{width:"100%",accentColor:"#8b5cf6"}}/>
//         </div>
//         <div>
//           <label style={{fontWeight:600}}>AI Tutor Voice</label>
//           <select value={voice} onChange={e=>setVoice(e.target.value)} style={{width:"100%",padding:12,borderRadius:12,marginTop:8,background:"rgba(255,255,255,0.06)",color:"#fff",border:"1px solid rgba(255,255,255,0.12)"}}>
//             {["alloy","echo","fable","onyx","nova","shimmer"].map(v=><option key={v} value={v}>{v}</option>)}
//           </select>
//         </div>
//         <label style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
//           <span style={{fontWeight:600}}>Enable AI Tutor</span>
//           <input type="checkbox" checked={tutorEnabled} onChange={e=>setTutorEnabled(e.target.checked)}/>
//         </label>
//         <button type="submit" style={cta}>{saved?"Saved ✓":"Save Configuration →"}</button>
//       </form>
//     </div>
//   );
// }

// export default function App() {
//   const [view,         setView]         = useState('home')
//   const [content,      setContent]      = useState('')
//   const [config,       setConfig]       = useState({ diff: 'medium', qCount: 5, timeLimit: 30, voiceOn: false })
//   const [questions,    setQuestions]    = useState([])
//   const [curQ,         setCurQ]         = useState(0)
//   const [score,        setScore]        = useState(0)
//   const [times,        setTimes]        = useState([])
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [chatOpen,     setChatOpen]     = useState(false)
//   const [aiFeedback,   setAiFeedback]   = useState('')
//   const currentQRef = useRef(null)

//   /* ── Generate questions via Claude ── */
//   const handleStart = async (topics) => {
//     setIsGenerating(true)
//     try {
//       let qs
//       if (content) {
//         const activeTopics = topics.join(', ')
//         const system = `You are an expert quiz creator. Generate exactly ${config.qCount} multiple-choice questions from the provided study material.
// Rules:
// - Difficulty: ${config.diff}
// - Focus on: ${activeTopics || 'all topics'}
// - Each question must have exactly 4 options
// - Only one correct answer per question
// - ${config.diff === 'easy' ? 'Straightforward factual recall' : config.diff === 'medium' ? 'Conceptual understanding, some application' : 'Deep analysis, nuanced distractors'}
// - Include a brief 1-2 sentence explanation for the correct answer

// Respond ONLY with valid JSON (no markdown, no preamble):
// {"questions":[{"q":"...","opts":["A","B","C","D"],"ans":0,"diff":"${config.diff}","exp":"..."}]}`

//         const raw   = await callClaude([{ role: 'user', content: `Study material:\n\n${content.substring(0, 4000)}` }], system, 2500)
//         const clean = raw.replace(/```json|```/g, '').trim()
//         qs = JSON.parse(clean).questions
//       } else {
//         await new Promise(r => setTimeout(r, 900))
//         qs = shuffle([...FALLBACK_QUESTIONS]).slice(0, config.qCount)
//       }

//       setQuestions(qs)
//       setScore(0); setCurQ(0); setTimes([]); setAiFeedback('')
//       setView('quiz')
//     } catch (err) {
//       console.warn('Generation failed — using fallback questions:', err)
//       setQuestions(shuffle([...FALLBACK_QUESTIONS]).slice(0, config.qCount))
//       setScore(0); setCurQ(0); setTimes([]); setAiFeedback('')
//       setView('quiz')
//     }
//     setIsGenerating(false)
//   }

//   /* ── End quiz & get AI feedback ── */
//   const handleEnd = async () => {
//     setView('results')
//     const total = questions.length
//     const pct   = Math.round((score / total) * 100)
//     const avg   = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0
//     try {
//       const sys = 'You are an encouraging quiz tutor. Give brief, personalised performance feedback in 2-3 sentences. Be motivating and specific.'
//       const fb  = await callClaude([{ role: 'user', content: `Student scored ${score}/${total} (${pct}%) on a ${config.diff} quiz. Avg time per question: ${avg}s.` }], sys, 200)
//       setAiFeedback(fb)
//     } catch {
//       setAiFeedback(
//         pct >= 70
//           ? 'Great performance! You clearly have a solid grasp of the material. Try a harder difficulty next time to keep challenging yourself.'
//           : 'Good effort! Review the questions you missed and focus on understanding the core concepts. With practice, you will improve significantly.'
//       )
//     }
//   }

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
//       <GenOverlay visible={isGenerating} />

//       <Nav view={view} setView={setView} content={content} hasQuestions={questions.length > 0} />

//       {view === 'home'    && <HomeView setView={setView} />}
//       {view === 'upload'  && <UploadView content={content} setContent={setContent} setView={setView} />}
//       {view === 'config'  && <ConfigView config={config} setConfig={setConfig} onStart={handleStart} isGenerating={isGenerating} />}
//       {view === 'quiz' && questions.length > 0 && (
//         <QuizView
//           questions={questions}  config={config}
//           score={score}          setScore={setScore}
//           times={times}          setTimes={setTimes}
//           curQ={curQ}            setCurQ={setCurQ}
//           onEnd={handleEnd}
//           onHint={()    => setChatOpen(true)}
//           onExplain={() => setChatOpen(true)}
//           currentQRef={currentQRef}
//         />
//       )}
//       {view === 'results' && (
//         <ResultsView
//           score={score}  total={questions.length}
//           times={times}  aiFeedback={aiFeedback}
//           onRetry={() => { setCurQ(0); setScore(0); setTimes([]); setAiFeedback(''); setView('quiz') }}
//           setView={setView}
//         />
//       )}

//       {/* <Chatbot
//         open={chatOpen}  setOpen={setChatOpen}
//         currentQRef={currentQRef}
//         score={score}    totalQs={questions.length}
//         content={content} diff={config.diff}
//       /> */}
//     </div>
//   )
// }






import { useState, useRef } from 'react'
import { callClaude } from './api'
import { fetchTriviaQuestions, CATEGORIES } from './components/Trivia'

import Nav         from './components/Nav'
import HomeView    from './components/home/HomeView'
import UploadView  from './components/UploadView'
import ConfigView  from './components/ConfigView'
import QuizView    from './components/QuizView'
import ResultsView from './components/ResultsView'
import GenOverlay  from './components/GenOverlay'
import Tutor       from './components/Tutor'
import Voice       from './components/Voice'

// ── Emergency fallback questions (only used if all APIs fail) ──────
const EMERGENCY_QS = [
  { q:"What does CPU stand for?",         opts:["Central Processing Unit","Computer Personal Unit","Central Program Utility","Core Processor Unit"], ans:0, diff:"easy", exp:"CPU = Central Processing Unit — the brain of a computer." },
  { q:"What is 12 × 12?",                 opts:["132","144","124","148"],                                                                            ans:1, diff:"easy", exp:"12 × 12 = 144." },
  { q:"Which planet is closest to Sun?",  opts:["Venus","Earth","Mercury","Mars"],                                                                   ans:2, diff:"easy", exp:"Mercury is the closest planet to the Sun." },
  { q:"What gas do plants absorb?",       opts:["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"],                                                    ans:2, diff:"easy", exp:"Plants absorb CO₂ during photosynthesis." },
  { q:"How many sides does a triangle have?", opts:["2","3","4","5"],                                                                                ans:1, diff:"easy", exp:"A triangle has exactly 3 sides." },
]

function shuffleArr(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function App() {
  const [view,           setView]           = useState('home')
  const [content,        setContent]        = useState('')
  const [detectedTopics, setDetectedTopics] = useState([])
  const [isAnalyzing,    setIsAnalyzing]    = useState(false)

  const [config, setConfig] = useState({
    diff:       'medium',
    qCount:     10,
    timeLimit:  30,
    voiceOn:    false,
    source:     'trivia',   // 'trivia' | 'upload'
    categoryId: 0,
  })

  const [questions,    setQuestions]    = useState([])
  const [curQ,         setCurQ]         = useState(0)
  const [score,        setScore]        = useState(0)
  const [times,        setTimes]        = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [genMsg,       setGenMsg]       = useState('')
  const [chatOpen,     setChatOpen]     = useState(false)
  const [aiFeedback,   setAiFeedback]   = useState('')
  const currentQRef = useRef(null)

  // ── STEP 1: Analyse uploaded content — detect topics with Claude ──
  const handleAnalyze = async (rawContent) => {
    setIsAnalyzing(true)
    setDetectedTopics([])

    try {
      const system = `You are an expert content analyser.
Read the study material and extract the main topics covered.
Return ONLY a JSON array of topic strings — no extra text, no markdown.
Example: ["Photosynthesis","Cell Respiration","DNA Structure","Mitosis"]
Extract between 3 and 10 specific topics.`

      const raw    = await callClaude(
        [{ role: 'user', content: `Study material:\n\n${rawContent.substring(0, 3000)}` }],
        system, 300
      )
      const clean  = raw.replace(/```json|```/g, '').trim()
      const topics = JSON.parse(clean)

      if (Array.isArray(topics) && topics.length > 0) {
        setDetectedTopics(topics)
        setConfig(c => ({ ...c, source: 'upload' }))
      }
    } catch (err) {
      console.warn('Topic detection failed:', err.message)
      setDetectedTopics(['Your Study Material'])
      setConfig(c => ({ ...c, source: 'upload' }))
    }

    setIsAnalyzing(false)
  }

  // ── STEP 2: Generate quiz questions ──────────────────────────────
  const handleStart = async (topics) => {
    setIsGenerating(true)
    let qs = []

    try {
      // ── From uploaded content via Claude ──────────────────────
      if (config.source === 'upload' && content) {
        const topicsText = detectedTopics.length > 0
          ? `Focus on these detected topics: ${detectedTopics.join(', ')}.`
          : topics && topics.length > 0
            ? `Focus on: ${topics.join(', ')}.`
            : ''

        setGenMsg('Claude AI is generating questions from your content…')

        const system = `You are an expert quiz creator.
Read the study material and generate exactly ${config.qCount} multiple-choice questions.
${topicsText}
Difficulty: ${config.diff}
Rules:
- Questions must come DIRECTLY from the content — not general knowledge
- Each question has exactly 4 answer options
- Only one correct answer
- ${config.diff === 'easy'   ? 'Test basic recall and definitions from the text'     : ''}
  ${config.diff === 'medium' ? 'Test understanding and application of the concepts'  : ''}
  ${config.diff === 'hard'   ? 'Test deep analysis, comparisons, nuanced details'    : ''}
- Include a 1-2 sentence explanation for the correct answer

Respond ONLY with this exact JSON (no markdown, no extra text):
{"questions":[{"q":"question here","opts":["option A","option B","option C","option D"],"ans":0,"diff":"${config.diff}","exp":"explanation here"}]}`

        const raw    = await callClaude(
          [{ role: 'user', content: `Study material:\n\n${content.substring(0, 4500)}` }],
          system, 3000
        )
        const clean  = raw.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(clean)
        qs = parsed.questions

      // ── From Open Trivia DB ──────────────────────────────────
      } else if (config.source === 'trivia') {
        setGenMsg('Fetching live questions from Open Trivia DB…')
        qs = await fetchTriviaQuestions(config.qCount, config.diff, config.categoryId)

      } else {
        setGenMsg('Loading questions…')
        qs = shuffleArr(EMERGENCY_QS)
      }

    } catch (err) {
      console.error('Question generation failed:', err.message)
      setGenMsg('Loading fallback questions…')
      await new Promise(r => setTimeout(r, 600))
      qs = shuffleArr(EMERGENCY_QS)
    }

    setQuestions(qs)
    setScore(0); setCurQ(0); setTimes([]); setAiFeedback('')
    setIsGenerating(false); setGenMsg('')
    setView('quiz')
  }

  // ── STEP 3: End quiz — get AI performance feedback ─────────────
  const handleEnd = async () => {
    setView('results')
    const total = questions.length
    const pct   = Math.round((score / total) * 100)
    const avg   = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0

    try {
      const topicCtx = detectedTopics.length > 0
        ? `The quiz was based on topics: ${detectedTopics.slice(0, 4).join(', ')}.`
        : ''
      const sys = `You are an encouraging quiz tutor. ${topicCtx} Give personalised feedback in 2-3 sentences. Be specific and motivating.`
      const fb  = await callClaude(
        [{ role: 'user', content: `Student scored ${score}/${total} (${pct}%) on a ${config.diff} difficulty quiz. Average time per question: ${avg}s.` }],
        sys, 250
      )
      setAiFeedback(fb)
    } catch {
      setAiFeedback(
        pct >= 70
          ? 'Great performance! You clearly have a solid grasp of the material. Try a harder difficulty next time!'
          : 'Good effort! Review the questions you missed and focus on understanding the core concepts. You will improve with practice!'
      )
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      <GenOverlay
        visible={isGenerating || isAnalyzing}
        message={isAnalyzing ? 'Claude is reading your content and detecting topics…' : genMsg}
      />

      <Nav
        view={view}
        setView={setView}
        content={content}
        hasQuestions={questions.length > 0}
      />

      {/* ── Views ── */}
      {view === 'home' && (
        <HomeView setView={setView} />
      )}

      {view === 'upload' && (
        <UploadView
          content={content}
          setContent={setContent}
          setView={setView}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          topics={detectedTopics}
        />
      )}

      {view === 'config' && (
        <ConfigView
          config={config}
          setConfig={setConfig}
          onStart={handleStart}
          isGenerating={isGenerating}
          hasContent={!!content}
          detectedTopics={detectedTopics}
        />
      )}

      {view === 'tutor' && (
        <Tutor />
      )}

      {view === 'voice' && (
        <Voice />
      )}

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
          onRetry={() => {
            setCurQ(0); setScore(0); setTimes([])
            setAiFeedback(''); setView('quiz')
          }}
          setView={setView}
        />
      )}

    </div>
  )
}