import { useState } from "react";
const API = "AIzaSyAQIcajLGCK3oyuuXXqFk5JecDstQsooPE";

export default function Voice() {
  const [text, setText] = useState("Hello! I am your AI tutor.");
  const [audio, setAudio] = useState(null);

  const speak = async () => {
    const res = await fetch(`${API}/tutor/speak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice: "nova" }),
    }).then(r => r.json());
    setAudio(`data:audio/mp3;base64,${res.audioBase64}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0118", color: "#fff", padding: 40, textAlign: "center" }}>
      <h1>Voice System</h1>
      <textarea value={text} onChange={e => setText(e.target.value)}
        style={{ width: "100%", maxWidth: 600, height: 120, padding: 14, borderRadius: 12,
                 background: "#1a0b2e", color: "#fff", border: "1px solid #333" }} />
      <br />
      <button onClick={speak} style={{
        marginTop: 20, padding: "14px 28px", borderRadius: 999, border: "none",
        background: "linear-gradient(90deg,#8b5cf6,#ec4899)", color: "#fff", cursor: "pointer", fontWeight: 700
      }}>🔊 Speak</button>
      {audio && <audio controls autoPlay src={audio} style={{ display: "block", margin: "24px auto" }} />}
    </div>
  );
}