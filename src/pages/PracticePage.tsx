import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getQuestion, evaluate } from "../api/api";
import { useSpeech } from "../hooks/useSpeech";
import type { Topic, Difficulty, QuestionResponse, FeedbackResponse } from "../types/types";

interface Props { token: string; onLogout: () => void; }
type Phase = "loading" | "ready" | "recording" | "submitting" | "results";
type Mode  = "speak" | "write";

/* ── Bell curve ── */
function normalPDF(x: number, mean: number, sd: number) {
  const z = (x - mean) / sd;
  return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
}
function normalCDF(x: number, mean: number, sd: number) {
  const z = (x - mean) / (sd * Math.SQRT2);
  const t = 1 / (1 + 0.3275911 * Math.abs(z));
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-z * z);
  return 0.5 * (1 + (z >= 0 ? erf : -erf));
}
function BellCurve({ mean, sd, score }: { mean: number; sd: number; score: number }) {
  const W = 480, H = 110, PX = 20;
  const lo = mean - 3.5 * sd, hi = mean + 3.5 * sd;
  const pts = Array.from({ length: 120 }, (_, i) => {
    const x = lo + (i / 119) * (hi - lo);
    return { x, y: normalPDF(x, mean, sd) };
  });
  const maxY = Math.max(...pts.map(p => p.y));
  const toSvg = (x: number, y: number) => ({
    sx: PX + ((x - lo) / (hi - lo)) * (W - 2 * PX),
    sy: H - 10 - (y / maxY) * (H - 20),
  });
  const curvePath = pts.map((p, i) => { const s = toSvg(p.x, p.y); return `${i === 0 ? "M" : "L"}${s.sx.toFixed(1)},${s.sy.toFixed(1)}`; }).join(" ");
  const fillPath  = curvePath + ` L${toSvg(hi, 0).sx.toFixed(1)},${H - 10} L${toSvg(lo, 0).sx.toFixed(1)},${H - 10} Z`;
  const pct    = Math.round(normalCDF(score, mean, sd) * 100);
  const marker = toSvg(Math.min(Math.max(score, lo), hi), normalPDF(Math.min(Math.max(score, lo), hi), mean, sd));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W, display: "block" }}>
      <path d={fillPath} fill="rgba(240,165,0,0.12)" />
      <path d={curvePath} fill="none" stroke="var(--amber)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={toSvg(mean, 0).sx} y1={10} x2={toSvg(mean, 0).sx} y2={H - 10} stroke="var(--line-strong)" strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx={marker.sx} cy={marker.sy} r="6" fill="var(--coral-dark)" />
      <text x={marker.sx} y={marker.sy - 12} textAnchor="middle" fontSize="11" fontFamily="var(--mono)" fill="var(--coral-dark)" fontWeight="600">{pct}th %ile</text>
    </svg>
  );
}

function buildTips(keywords: string[]) {
  const k0 = keywords[0] ?? "the main concept";
  const k1 = keywords[1] ?? "related ideas";
  return [
    `Define "${k0}" clearly in your own words`,
    "Explain when and why it occurs in practice",
    `Mention "${k1}" and other related techniques`,
    "Give a concrete real-world example if you can",
  ];
}

export default function PracticePage({ token, onLogout }: Props) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { topic, difficulty } = (location.state ?? {}) as { topic?: Topic; difficulty?: Difficulty | null };

  const [phase,          setPhase]          = useState<Phase>("loading");
  const [mode,           setMode]           = useState<Mode>("speak");
  const [question,       setQuestion]       = useState<QuestionResponse | null>(null);
  const [feedback,       setFeedback]       = useState<FeedbackResponse | null>(null);
  const [answer,         setAnswer]         = useState("");          // final transcript or typed text
  const [writeText,      setWriteText]      = useState("");
  const [showIdeal,      setShowIdeal]      = useState(false);
  const [hovSub,         setHovSub]         = useState(false);
  const [hovNext,        setHovNext]        = useState(false);
  const [error,          setError]          = useState("");
  const [elapsed,        setElapsed]        = useState(0);          // counts up in seconds

  const speech        = useSpeech();
  const transcriptRef = useRef(speech.transcript);
  const writeStartRef = useRef<number | null>(null);  // epoch ms when user first typed
  useEffect(() => { transcriptRef.current = speech.transcript; });

  /* Countdown timer for speak mode */
  useEffect(() => {
    if (phase !== "recording") return;
    if (elapsed >= 60) { handleStop(); return; }
    const t = setTimeout(() => setElapsed(s => s + 1), 1000);
    return () => clearTimeout(t);
  }, [phase, elapsed]);

  useEffect(() => {
    if (!topic) { navigate("/dashboard"); return; }
    fetchQuestion();
  }, []);

  async function fetchQuestion() {
    setPhase("loading"); setError("");
    try {
      const q = await getQuestion(topic!, difficulty ?? null, token);
      setQuestion(q); setPhase("ready");
    } catch (e: any) { setError(e.message); setPhase("ready"); }
  }

  function handleStart() {
    if (!speech.supported) { setError("Speech recognition not supported in this browser. Please use Chrome or Edge."); return; }
    speech.reset(); speech.start(); setElapsed(0); setPhase("recording");
  }

  function handleStop() {
    speech.stop(); setPhase("submitting");
    setTimeout(() => {
      const final = transcriptRef.current || "(no answer recorded)";
      setAnswer(final);
      submitAnswer(final, speech.getDurationSeconds(), speech.pauseCount, speech.confidence);
    }, 1500);
  }

  function handleWriteSubmit() {
    const text = writeText.trim() || "(no answer written)";
    const durationSecs = writeStartRef.current
      ? Math.max(1, (Date.now() - writeStartRef.current) / 1000)
      : 0;
    setAnswer(text); setPhase("submitting");
    submitAnswer(text, durationSecs, 0, 1.0);
  }

  async function submitAnswer(text: string, durationSeconds: number, pauseCount: number, confidenceScore: number) {
    if (!question) return;
    setError("");
    try {
      const result = await evaluate({ questionId: question.questionId, transcribedAnswer: text, durationSeconds, pauseCount, confidenceScore }, token);
      setFeedback(result); setPhase("results");
    } catch (e: any) { setError(e.message); setPhase("ready"); }
  }

  function handleNext() {
    speech.reset(); setFeedback(null); setAnswer(""); setWriteText(""); setShowIdeal(false); setElapsed(0);
    writeStartRef.current = null;
    fetchQuestion();
  }

  function handleRetry() {
    speech.reset(); setFeedback(null); setAnswer(""); setWriteText(""); setShowIdeal(false); setElapsed(0);
    writeStartRef.current = null;
    setPhase("ready");
  }

  /* ── Derived ── */
  const inResults  = phase === "results";
  const recording  = phase === "recording";
  const submitting = phase === "submitting";
  const tips = question ? buildTips(question.keywords) : [];
  const mins = Math.floor(elapsed / 60);
  const secs = String(elapsed % 60).padStart(2, "0");
  const clock = `${mins}:${secs}`;

  /* ── Waveform bars ── */
  const bars = Array.from({ length: 34 }, (_, i) => {
    const c = Math.abs(i - 17) / 17;
    const h = 18 + 78 * (1 - c * c) * (0.55 + 0.45 * Math.abs(Math.sin(i * 2.3)));
    return (
      <div key={i} style={{
        flex: 1, margin: "0 2px", height: h + "%",
        background: "var(--coral)", borderRadius: 99, transformOrigin: "center",
        animation: recording ? `wavePulse ${(0.7 + (i % 6) * 0.12).toFixed(2)}s ease-in-out ${(i * 0.06).toFixed(2)}s infinite` : "none",
        transform: recording ? undefined : "scaleY(0.22)",
      }} />
    );
  });

  /* ── Mode toggle button style ── */
  const modeS = (active: boolean) => ({
    background: active ? "var(--surface)" : "transparent",
    color: "var(--ink)", border: active ? "1.5px solid var(--amber)" : "1.5px solid transparent",
    borderRadius: "6px", padding: "7px 16px", fontSize: "14.5px",
    fontWeight: active ? 700 : 500, display: "inline-flex", alignItems: "center" as const, gap: "7px", cursor: "pointer",
  });

  /* ── Tab style ── */
  const tabS = (active: boolean, disabled: boolean) => ({
    background: "none", border: "none", padding: "18px 4px 15px",
    fontSize: "16.5px", fontWeight: active ? 700 : 500,
    color: active ? "var(--ink)" : disabled ? "var(--line-strong)" : "var(--tone-medium)",
    borderBottom: active ? "3px solid var(--amber)" : "3px solid transparent",
    cursor: disabled ? "default" : "pointer",
  });

  /* ── Score color ── */
  const score = feedback?.score ?? null;
  const scoreColor = score === null ? "var(--tone-medium)" : score >= 65 ? "var(--green)" : score >= 35 ? "var(--amber-dark)" : "var(--coral)";
  const scoreBarColor = score === null ? "var(--tone-medium)" : score >= 65 ? "var(--green)" : score >= 35 ? "var(--amber)" : "var(--coral)";

  /* ── Submit button hover strip ── */
  const strip = (on: boolean) => ({
    position: "absolute" as const, top: 0, right: 0, bottom: 0, width: "26px",
    backgroundColor: "var(--amber)", backgroundImage: "radial-gradient(var(--ink) 1.3px, transparent 1.3px)", backgroundSize: "5px 5px",
    transform: on ? "translateX(0)" : "translateX(110%)", transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1)",
  });
  const slideText = (on: boolean) => ({
    display: "inline-flex", alignItems: "center" as const, gap: "10px",
    transform: on ? "translateX(-8px)" : "translateX(0)", transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1)",
  });

  /* ── Card shell ── */
  const card = { background: "var(--surface)", border: "1px solid var(--line-strong)", borderRadius: "4px", boxShadow: "0 2px 0 rgba(20,20,20,0.05)" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{`@keyframes wavePulse{0%,100%{transform:scaleY(0.22)}50%{transform:scaleY(1)}} @keyframes recBlink{0%,100%{opacity:1}50%{opacity:0.35}}`}</style>

      {/* ── Header ── */}
      <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1420px", margin: "0 auto", padding: "0 40px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <a href="/" style={{ display: "inline-flex" }}><img src="/logo-datalystlm.png" alt="DatalystLM" style={{ height: "46px" }} /></a>
            <span style={{ width: "1.5px", height: "30px", background: "var(--line-strong)" }} />
            <span style={{ fontSize: "17px", fontWeight: 500, color: "var(--ink-soft)" }}>Interview Practice</span>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "14px", fontWeight: 600, letterSpacing: "0.22em" }}>
            SPEAK. THINK. <span style={{ borderBottom: "3px solid var(--amber)", paddingBottom: "3px" }}>IMPACT.</span>
          </div>
        </div>
      </header>

      {/* ── Two-tab bar ── */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)", position: "sticky", top: "72px", zIndex: 49 }}>
        <div style={{ maxWidth: "1420px", margin: "0 auto", padding: "0 40px", display: "flex", gap: "36px" }}>
          <button style={tabS(!inResults, false)} onClick={() => !inResults ? undefined : undefined} disabled={!inResults}>Practice</button>
          <button style={tabS(inResults, !inResults)} onClick={() => inResults ? undefined : undefined} disabled={!inResults}>Results</button>
          <span style={{ flex: 1 }} />
          <button className="btn btn--secondary btn--sm" style={{ alignSelf: "center" }} onClick={() => navigate("/dashboard")}>← Dashboard</button>
          <button className="btn btn--secondary btn--sm" style={{ alignSelf: "center" }} onClick={onLogout}>Sign out</button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div style={{ maxWidth: "1420px", margin: "16px auto 0", padding: "0 40px" }}>
          <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "6px", padding: "12px 16px", color: "var(--coral)", fontSize: "14px" }}>⚠ {error}</div>
        </div>
      )}

      {/* ════════════════ PRACTICE SECTION ════════════════ */}
      {!inResults && (
        <section style={{ maxWidth: "1420px", margin: "0 auto", padding: "44px 40px 70px", display: "grid", gridTemplateColumns: "1.9fr 1fr", gap: "28px", alignItems: "start", position: "relative" }}>

          {/* Decorative open-quote */}
          <div style={{ position: "absolute", left: "-2px", top: "44px", fontFamily: "var(--serif)", fontWeight: 900, fontSize: "96px", lineHeight: 0.6, color: "var(--ink)", pointerEvents: "none" }}>"</div>

          {/* ── Left: Question card ── */}
          <div style={{ ...card, padding: "38px 44px 28px", display: "flex", flexDirection: "column" }}>

            {/* Top row: badges + mode toggle */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                {question && (
                  <>
                    <span style={{ background: question.topic === "ML" ? "var(--sky)" : question.topic === "SQL" ? "var(--green-bg)" : question.topic === "STATISTICS" ? "var(--purple)" : "var(--peach)", fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", padding: "7px 20px", borderRadius: "999px" }}>{question.topic}</span>
                    <span style={{ background: question.difficulty === "EASY" ? "var(--green-bg)" : question.difficulty === "MEDIUM" ? "var(--amber-bg)" : "var(--peach)", fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", padding: "7px 20px", borderRadius: "999px" }}>{question.difficulty}</span>
                  </>
                )}
              </div>
              {/* Speak / Write toggle */}
              <div style={{ display: "flex", background: "var(--bg-alt)", border: "1px solid var(--line-strong)", borderRadius: "8px", padding: "3px", gap: "3px" }}>
                <button onClick={() => { if (recording) return; setMode("speak"); }} style={modeS(mode === "speak")}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" /><path d="M17.5 11a.9.9 0 0 1 1.8 0 7.3 7.3 0 0 1-6.4 7.25V21h2.2a.9.9 0 0 1 0 1.8H8.9a.9.9 0 0 1 0-1.8h2.2v-2.75A7.3 7.3 0 0 1 4.7 11a.9.9 0 0 1 1.8 0 5.5 5.5 0 0 0 11 0z" /></svg>
                  Speak
                </button>
                <button onClick={() => { if (recording) return; setMode("write"); }} style={modeS(mode === "write")}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" /></svg>
                  Write
                </button>
              </div>
            </div>

            {/* Question text */}
            {submitting ? (
              <div style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "44px", lineHeight: 1.12, margin: "26px 0 0", color: "var(--tone-medium)" }}>Evaluating your answer…</div>
            ) : phase === "loading" ? (
              <div style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "44px", lineHeight: 1.12, margin: "26px 0 0", color: "var(--tone-medium)" }}>Loading question…</div>
            ) : (
              <h1 style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "44px", lineHeight: 1.12, letterSpacing: "-0.01em", margin: "26px 0 0", textWrap: "balance" as any }}>{question?.text}</h1>
            )}
            <div style={{ width: "62px", height: "4px", background: "var(--amber)", margin: "20px 0 0" }} />

            {/* Keywords */}
            {question && (
              <>
                <div style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.14em", marginTop: "30px" }}>KEY CONCEPTS TO MENTION</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "14px" }}>
                  {question.keywords.map(kw => (
                    <span key={kw} style={{ fontFamily: "var(--mono)", fontSize: "13px", border: "1px solid var(--faint)", background: "var(--bg-alt)", padding: "7px 18px", borderRadius: "999px" }}>{kw}</span>
                  ))}
                </div>
              </>
            )}

            {/* Info box */}
            <div style={{ display: "flex", border: "1.5px solid var(--ink)", borderRadius: "6px", overflow: "hidden", marginTop: "28px" }}>
              <div style={{ background: "var(--amber)", width: "60px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "28px" }}>i</span>
              </div>
              <div style={{ padding: "16px 22px", fontSize: "15px", lineHeight: 1.55, fontWeight: 500, color: "var(--tone-subtle)" }}>
                {mode === "speak" ? "Answer as if you're in a live interview. Speak clearly, structure your response, and cover the key concepts. You have 60 seconds — use them well." : "Write your answer as if you're explaining to an interviewer. Be concise, structured, and cover the key concepts."}
              </div>
            </div>

            {/* ── Speak mode: live transcript ── */}
            {mode === "speak" && (
              <div style={{ marginTop: "28px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.14em" }}>LIVE TRANSCRIPT</div>
                <div style={{ width: "46px", height: "3px", background: "var(--amber)", marginTop: "6px" }} />
                <div style={{ position: "relative", border: "1px solid var(--faint)", borderRadius: "4px", background: "var(--bg)", minHeight: "110px", marginTop: "12px", padding: "20px 24px", boxSizing: "border-box" }}>
                  <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "18px", color: recording ? "var(--ink)" : "var(--tone-medium)" }}>
                    {recording ? (speech.transcript || "Listening… start speaking.") : "Press Record to start."}
                  </div>
                  <svg viewBox="0 0 24 24" width="44" height="66" style={{ position: "absolute", right: "22px", bottom: "12px", opacity: 0.13 }} fill="var(--ink-soft)"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" /><path d="M17.5 11a.9.9 0 0 1 1.8 0 7.3 7.3 0 0 1-6.4 7.25V21h2.2a.9.9 0 0 1 0 1.8H8.9a.9.9 0 0 1 0-1.8h2.2v-2.75A7.3 7.3 0 0 1 4.7 11a.9.9 0 0 1 1.8 0 5.5 5.5 0 0 0 11 0z" /></svg>
                </div>
              </div>
            )}

            {/* ── Write mode: textarea ── */}
            {mode === "write" && (
              <div style={{ borderTop: "1.5px dashed var(--faint)", marginTop: "26px", paddingTop: "24px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.14em" }}>WRITE YOUR ANSWER</div>
                <textarea
                  value={writeText}
                  onChange={e => { setWriteText(e.target.value); if (!writeStartRef.current) writeStartRef.current = Date.now(); }}
                  placeholder="Type your answer here…"
                  style={{ marginTop: "12px", border: "1px solid var(--faint)", borderRadius: "4px", background: "var(--bg)", minHeight: "100px", padding: "14px 18px", fontSize: "16px", lineHeight: 1.55, color: "var(--ink)", resize: "vertical", boxSizing: "border-box", outline: "none", width: "100%", fontFamily: "inherit" }}
                />
              </div>
            )}

            {/* ── Action row ── */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "26px", flexWrap: "wrap" }}>
              {mode === "speak" && !recording && (
                <button onClick={handleStart} style={{ background: "none", border: "1.5px solid var(--coral)", color: "var(--coral)", borderRadius: "8px", padding: "12px 22px", fontSize: "15px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "9px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--coral)", display: "inline-block" }} /> Record
                </button>
              )}
              {mode === "speak" && recording && (
                <button onClick={handleStop} style={{ background: "none", border: "1.5px solid var(--coral)", color: "var(--coral)", borderRadius: "8px", padding: "12px 22px", fontSize: "15px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "9px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--coral)", display: "inline-block", animation: "recBlink 1.1s ease-in-out infinite" }} /> Stop
                </button>
              )}
              <span style={{ flex: 1 }} />
              {mode === "write" && (
                <button
                  onClick={handleWriteSubmit}
                  disabled={!writeText.trim()}
                  onMouseEnter={() => setHovSub(true)} onMouseLeave={() => setHovSub(false)}
                  style={{ position: "relative", overflow: "hidden", background: "var(--ink)", color: "var(--surface)", border: "none", borderRadius: "8px", padding: "14px 30px 14px 24px", fontSize: "16px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "10px", opacity: !writeText.trim() ? 0.5 : 1, cursor: !writeText.trim() ? "not-allowed" : "pointer" }}
                >
                  <span style={slideText(hovSub)}>Submit Answer <span style={{ color: "var(--amber)" }}>→</span></span>
                  <span style={strip(hovSub)} />
                </button>
              )}
              {mode === "speak" && (
                <button
                  onClick={handleStop}
                  disabled={!recording}
                  onMouseEnter={() => setHovSub(true)} onMouseLeave={() => setHovSub(false)}
                  style={{ position: "relative", overflow: "hidden", background: "var(--ink)", color: "var(--surface)", border: "none", borderRadius: "8px", padding: "14px 30px 14px 24px", fontSize: "16px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "10px", opacity: !recording ? 0.45 : 1, cursor: !recording ? "not-allowed" : "pointer" }}
                >
                  <span style={slideText(hovSub)}>Submit Answer <span style={{ color: "var(--amber)" }}>→</span></span>
                  <span style={strip(hovSub)} />
                </button>
              )}
            </div>
          </div>

          {/* ── Right column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

            {/* Tips card */}
            <div style={{ ...card, overflow: "hidden" }}>
              <div style={{ background: "var(--ink)", color: "var(--surface)", padding: "15px 20px", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, borderTop: "20px solid var(--amber)", borderRight: "20px solid transparent" }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em" }}>TIPS FOR A GREAT ANSWER</span>
              </div>
              <div style={{ padding: "20px 20px 24px", display: "grid", gap: "16px", position: "relative" }}>
                <div style={{ position: "absolute", right: "12px", bottom: "12px", width: "52px", height: "52px", backgroundImage: "radial-gradient(var(--faint) 1.5px, transparent 1.5px)", backgroundSize: "8px 8px", pointerEvents: "none" }} />
                {tips.map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--amber)", color: "var(--ink)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: "15px", lineHeight: 1.5, fontWeight: 500, color: "var(--tone-subtle)" }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recording panel (speak mode only) */}
            {mode === "speak" && (
              <div style={{ ...card, padding: "22px 22px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--coral)", animation: recording ? "recBlink 1.2s ease-in-out infinite" : "none" }} />
                  <span style={{ fontFamily: "var(--mono)", fontSize: "14px", fontWeight: 600, letterSpacing: "0.16em", color: "var(--coral)" }}>RECORDING</span>
                </div>
                <div style={{ height: "1.5px", background: "var(--coral)", opacity: 0.45, marginTop: "12px" }} />
                <div style={{ fontSize: "14px", color: "var(--tone-subtle)", marginTop: "14px" }}>Mode: <span style={{ fontWeight: 600, color: "var(--ink)" }}>Speak</span></div>
                <div style={{ height: "70px", marginTop: "14px", display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>{bars}</div>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "58px", fontWeight: 600, letterSpacing: "0.04em", textAlign: "center", marginTop: "6px" }}>{clock}</div>
                <div style={{ fontSize: "13px", color: "var(--tone-medium)", textAlign: "center", marginTop: "6px" }}>60 second limit</div>
                <div style={{ height: "1.5px", background: "var(--line-strong)", marginTop: "16px" }} />
                <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                  <button onClick={recording ? handleStop : handleStart} style={{ flex: 1, background: "none", border: "1.5px solid var(--coral)", color: "var(--coral)", borderRadius: "8px", padding: "14px 16px", fontSize: "16px", fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "9px" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--coral)", display: "inline-block", animation: recording ? "recBlink 1.1s ease-in-out infinite" : "none" }} />
                    {recording ? "Stop" : "Record"}
                  </button>
                  <button onClick={handleStop} disabled={!recording} style={{ flex: 1.3, background: "var(--coral)", color: "var(--surface)", border: "none", borderRadius: "8px", padding: "14px 16px", fontSize: "16px", fontWeight: 700, opacity: recording ? 1 : 0.4, cursor: recording ? "pointer" : "not-allowed" }}>Submit</button>
                </div>
                <div style={{ fontSize: "13px", color: "var(--tone-medium)", textAlign: "center", marginTop: "12px" }}>You can switch to Write mode above.</div>
              </div>
            )}

            {/* Write mode: ready indicator */}
            {mode === "write" && (
              <div style={{ ...card, padding: "22px 22px 24px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.14em", color: "var(--tone-medium)" }}>WRITE MODE</div>
                <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "18px", margin: "14px 0 6px", color: "var(--tone-medium)" }}>Type your answer on the left</div>
                <div style={{ fontSize: "13px", color: "var(--tone-medium)" }}>Hit "Submit Answer" when ready.</div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* ════════════════ RESULTS SECTION ════════════════ */}
      {inResults && feedback && (
        <section style={{ maxWidth: "1420px", margin: "0 auto", padding: "44px 40px 80px", display: "grid", gridTemplateColumns: "1.9fr 1fr", gap: "28px", alignItems: "start", position: "relative" }}>

          <div style={{ position: "absolute", left: "-2px", top: "44px", fontFamily: "var(--serif)", fontWeight: 900, fontSize: "96px", lineHeight: 0.6, color: "var(--ink)", pointerEvents: "none" }}>"</div>

          {/* ── Left: main results card ── */}
          <div style={{ ...card, padding: "38px 44px 32px", display: "flex", flexDirection: "column", gap: "0" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.14em" }}>RESULTS OVERVIEW</div>
            <h1 style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "52px", lineHeight: 1.08, letterSpacing: "-0.01em", margin: "12px 0 0" }}>
              Your answer <em style={{ fontWeight: 700 }}>&amp;</em> score
            </h1>

            <div style={{ height: "1px", background: "var(--line)", margin: "28px 0" }} />

            {/* Transcript */}
            <div style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.14em" }}>YOUR ANSWER</div>
            <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "19px", color: answer === "(no answer recorded)" || answer === "(no answer written)" ? "var(--tone-medium)" : "var(--ink-soft)", marginTop: "12px", lineHeight: 1.6 }}>
              {answer || "(no answer recorded)"}
            </div>

            <div style={{ height: "1px", background: "var(--line)", margin: "26px 0" }} />

            {/* Score */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.14em" }}>SESSION SCORE</div>
              <div style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "56px", lineHeight: 0.9, color: scoreColor }}>
                {feedback.isOutlier ? "—" : score !== null ? `${Math.round(score)}` : "—"}
              </div>
            </div>
            <div style={{ height: "8px", background: "var(--cream)", borderRadius: "99px", marginTop: "12px", overflow: "hidden" }}>
              <div style={{ width: `${Math.max(0, Math.min(100, score ?? 0))}%`, height: "100%", background: scoreBarColor, borderRadius: "99px", transition: "width 0.6s ease" }} />
            </div>
            {feedback.isOutlier && <div style={{ fontSize: "13px", color: "var(--tone-medium)", marginTop: "8px" }}>Answer was too short or off-topic to score.</div>}

            <div style={{ height: "1px", background: "var(--line)", margin: "26px 0" }} />

            {/* Keywords */}
            <div style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.14em" }}>KEYWORDS HIT</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px" }}>
              {feedback.keyWordHit.length > 0
                ? feedback.keyWordHit.map(kw => <span key={kw} style={{ fontFamily: "var(--mono)", fontSize: "13px", background: "var(--green-bg)", padding: "7px 18px", borderRadius: "999px" }}>{kw}</span>)
                : <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "16px", color: "var(--tone-medium)" }}>None mentioned</span>
              }
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.14em", marginTop: "20px" }}>MISSED</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px" }}>
              {feedback.keyWordMiss.length > 0
                ? feedback.keyWordMiss.map(kw => <span key={kw} style={{ fontFamily: "var(--mono)", fontSize: "13px", border: "1px solid var(--faint)", background: "var(--bg-alt)", padding: "7px 18px", borderRadius: "999px" }}>{kw}</span>)
                : <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "16px", color: "var(--green)" }}>All keywords mentioned!</span>
              }
            </div>

            <div style={{ height: "1px", background: "var(--line)", margin: "28px 0" }} />

            {/* Actions */}
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={() => navigate("/dashboard")} style={{ border: "1px solid var(--line-strong)", background: "none", borderRadius: "8px", padding: "13px 22px", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
                ← Dashboard
              </button>
              <button onClick={handleRetry} style={{ background: "none", border: "1px solid var(--line-strong)", borderRadius: "8px", padding: "13px 22px", fontSize: "15px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "9px", cursor: "pointer" }}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--sky)" strokeWidth="2" strokeLinecap="round"><path d="M3 12a9 9 0 0 1 15.5-6.2M21 12a9 9 0 0 1-15.5 6.2" /><path d="M18.5 2v4h-4M5.5 22v-4h4" /></svg>
                Retry Same
              </button>
              <span style={{ flex: 1 }} />
              <button
                onClick={handleNext}
                onMouseEnter={() => setHovNext(true)} onMouseLeave={() => setHovNext(false)}
                style={{ position: "relative", overflow: "hidden", background: "var(--ink)", color: "var(--surface)", border: "none", borderRadius: "8px", padding: "14px 30px 14px 24px", fontSize: "16px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
              >
                <span style={slideText(hovNext)}>Next Question <span style={{ color: "var(--amber)" }}>→</span></span>
                <span style={strip(hovNext)} />
              </button>
            </div>
          </div>

          {/* ── Right: AI feedback + ideal answer + voice analytics ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* AI Feedback */}
            {feedback.llmFeedBack ? (
              <div style={{ ...card, overflow: "hidden" }}>
                <div style={{ background: "var(--ink)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", color: "var(--surface)" }}>AI FEEDBACK</span>
                  <span style={{ background: "var(--amber)", color: "var(--ink)", fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "4px" }}>CLAUDE</span>
                </div>
                <div style={{ padding: "18px 20px", display: "grid", gap: "10px" }}>
                  {([
                    { label: "CONCEPTS", text: feedback.llmFeedBack.concepts, color: "var(--green)" },
                    { label: "ACCURACY", text: feedback.llmFeedBack.accuracy, color: "var(--sky)" },
                    { label: "MISSING",  text: feedback.llmFeedBack.missing,  color: "var(--coral)" },
                    { label: "TIP",      text: feedback.llmFeedBack.tip,      color: "var(--amber-dark)" },
                  ]).map(r => (
                    <div key={r.label} style={{ background: "var(--bg-alt)", borderLeft: `3px solid ${r.color}`, borderRadius: "4px", padding: "10px 14px" }}>
                      <div style={{ fontSize: "13.5px", lineHeight: 1.55, marginTop: "5px", color: "var(--ink-soft)" }}>{r.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ ...card, padding: "24px 22px", textAlign: "center" }}>
                <div style={{ fontSize: "22px", marginBottom: "8px" }}>🔒</div>
                <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>AI Feedback — PRO only</div>
                <div style={{ fontSize: "13.5px", lineHeight: 1.55, color: "var(--tone-medium)" }}>Upgrade to PRO to get detailed Claude feedback on your answers.</div>
              </div>
            )}

            {/* Ideal Answer */}
            {feedback.matchedIdealAnswerText && (
              <div style={{ ...card, padding: "20px 22px" }}>
                <button onClick={() => setShowIdeal(v => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "9px", fontSize: "16px", fontWeight: 700 }}>
                    <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "var(--amber)", display: "inline-block" }} />
                    See Ideal Answer
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--tone-medium)" }}>{showIdeal ? "Hide ▲" : "Show ▼"}</span>
                </button>
                {showIdeal && (
                  <div style={{ fontSize: "15px", lineHeight: 1.65, color: "var(--tone-subtle)", marginTop: "14px", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                    {feedback.matchedIdealAnswerText}
                  </div>
                )}
              </div>
            )}

            {/* Writing Stats — write mode only */}
            {feedback.voiceMetrics && mode === "write" && (
              <div style={{ ...card, padding: "20px 22px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.14em" }}>WRITING STATS</div>
                <div style={{ height: "2px", background: "var(--ink)", marginTop: "10px" }} />
                <div style={{ display: "grid", marginTop: "4px" }}>
                  {[
                    { label: "Words written",  val: feedback.voiceMetrics.totalWordCount,                                       note: feedback.voiceMetrics.totalWordCount >= 60 ? "Thorough" : feedback.voiceMetrics.totalWordCount >= 30 ? "Solid" : "Brief",       good: feedback.voiceMetrics.totalWordCount >= 40 },
                    { label: "Time taken",      val: `${Math.round(feedback.voiceMetrics.durationSeconds)}s`,                    note: feedback.voiceMetrics.durationSeconds < 20 ? "Very fast" : feedback.voiceMetrics.durationSeconds <= 90 ? "Good pace" : "Thorough", good: feedback.voiceMetrics.durationSeconds >= 20 },
                    { label: "Words / min",     val: feedback.voiceMetrics.wordsPerMinute,                                       note: feedback.voiceMetrics.wordsPerMinute >= 40 ? "Fast" : feedback.voiceMetrics.wordsPerMinute >= 20 ? "Steady" : "Slow",         good: feedback.voiceMetrics.wordsPerMinute >= 25 },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", padding: "12px", borderBottom: "1px solid var(--line)", background: "var(--bg)" }}>
                      <span style={{ fontSize: "14.5px", fontWeight: 500 }}>{row.label}</span>
                      <span style={{ fontSize: "14px" }}>
                        <span style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "18px" }}>{row.val}</span>
                        {" "}<span style={{ color: "var(--tone-medium)" }}>/</span>{" "}
                        <span style={{ color: row.good ? "var(--green)" : "var(--amber-dark)", fontWeight: 600, fontSize: "13px" }}>{row.note}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Voice Analytics — speak mode only */}
            {feedback.voiceMetrics && mode === "speak" && (
              <div style={{ ...card, padding: "20px 22px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.14em" }}>VOICE ANALYTICS</div>
                <div style={{ height: "2px", background: "var(--ink)", marginTop: "10px" }} />
                <div style={{ display: "grid", marginTop: "4px" }}>
                  {[
                    { label: "Words / min",  val: feedback.voiceMetrics.wordsPerMinute,  note: feedback.voiceMetrics.wordsPerMinute >= 120 && feedback.voiceMetrics.wordsPerMinute <= 160 ? "Ideal" : feedback.voiceMetrics.wordsPerMinute < 120 ? "Too slow" : "Too fast",  good: feedback.voiceMetrics.wordsPerMinute >= 120 && feedback.voiceMetrics.wordsPerMinute <= 160 },
                    { label: "Filler words", val: feedback.voiceMetrics.fillerWordCount,  note: feedback.voiceMetrics.fillerWordCount <= 2 ? "Low" : feedback.voiceMetrics.fillerWordCount <= 5 ? "Moderate" : "High",  good: feedback.voiceMetrics.fillerWordCount <= 2 },
                    { label: "Confidence",   val: `${Math.round(feedback.voiceMetrics.confidenceScore * 100)}%`, note: feedback.voiceMetrics.confidenceScore >= 0.8 ? "High" : feedback.voiceMetrics.confidenceScore >= 0.5 ? "Medium" : "Low", good: feedback.voiceMetrics.confidenceScore >= 0.8 },
                    { label: "Pauses",       val: feedback.voiceMetrics.pauseCount,  note: feedback.voiceMetrics.pauseCount <= 3 ? "Natural" : "Frequent",  good: feedback.voiceMetrics.pauseCount <= 3 },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", padding: "12px", borderBottom: "1px solid var(--line)", background: "var(--bg)" }}>
                      <span style={{ fontSize: "14.5px", fontWeight: 500 }}>{row.label}</span>
                      <span style={{ fontSize: "14px" }}>
                        <span style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "18px" }}>{row.val}</span>
                        {" "}<span style={{ color: "var(--tone-medium)" }}>/</span>{" "}
                        <span style={{ color: row.good ? "var(--green)" : "var(--coral)", fontWeight: 600, fontSize: "13px" }}>{row.note}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid var(--line-strong)", borderRadius: "4px", background: "var(--bg-alt)", padding: "11px 13px", marginTop: "14px" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", color: "var(--tone-subtle)" }}>IMPROVE DELIVERY OVER TIME</span>
                  <span style={{ color: "var(--green)", fontWeight: 700 }}>↗</span>
                </div>
              </div>
            )}

            {/* Bell curve */}
            {feedback.stats && score !== null && !feedback.isOutlier && (
              <div style={{ ...card, padding: "20px 22px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.14em" }}>YOUR PERCENTILE</div>
                <div style={{ marginTop: "16px" }}>
                  <BellCurve mean={feedback.stats.meanScore} sd={feedback.stats.stdDev} score={score} />
                </div>
                <div style={{ fontSize: "12px", color: "var(--tone-medium)", marginTop: "8px", textAlign: "center" }}>Based on {feedback.stats.attemptCount} attempts</div>
              </div>
            )}

          </div>
        </section>
      )}
    </div>
  );
}
