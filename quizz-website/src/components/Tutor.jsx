import { useState } from "react";
const API = "AIzaSyAQIcajLGCK3oyuuXXqFk5JecDstQsooPE";

export default function Tutor() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMsgs(m => [...m, { role: "user", text: userMsg }]);
    setInput("");
    const res = await fetch(`${API}/tutor/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg }),
    }).then(r => r.json());
    setMsgs(m => [...m, { role: "ai", text: res.reply }]);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0118", color: "#fff", padding: 40 }}>
      <h1>AI Tutor</h1>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ margin: "12px 0", textAlign: m.role === "user" ? "right" : "left" }}>
            <span style={{
              display: "inline-block", padding: "10px 16px", borderRadius: 16,
              background: m.role === "user" ? "linear-gradient(90deg,#8b5cf6,#ec4899)" : "rgba(255,255,255,0.08)"
            }}>{m.text}</span>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask anything..."
            style={{ flex: 1, padding: 14, borderRadius: 12, border: "1px solid #333", background: "#1a0b2e", color: "#fff" }} />
          <button onClick={send} style={{
            padding: "0 24px", borderRadius: 12, border: "none",
            background: "linear-gradient(90deg,#8b5cf6,#ec4899)", color: "#fff", cursor: "pointer"
          }}>Send</button>
        </div>
      </div>
    </div>
  );
}