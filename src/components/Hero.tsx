import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Tab = { label: string; left: React.ReactNode; right: React.ReactNode };

const tabs: Tab[] = [
  {
    label: "Question",
    left: (
      <div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ background: "var(--amber)", fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 600, padding: "4px 10px" }}>ML</span>
          <span style={{ background: "var(--cream)", fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 600, padding: "4px 10px" }}>MEDIUM</span>
        </div>
        <h2 style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "clamp(22px,3vw,32px)", lineHeight: 1.15, margin: "18px 0 0" }}>
          What is overfitting and how do you prevent it?
        </h2>
        <div style={{ fontWeight: 700, fontSize: "13px", margin: "20px 0 10px", fontFamily: "var(--mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--tone-medium)" }}>Key concepts to mention</div>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px" }}>
          {["overfitting","regularization","cross-validation","dropout","bias-variance"].map(k => (
            <span key={k} style={{ fontFamily: "var(--mono)", fontSize: "12px", border: "1px solid var(--line-strong)", padding: "5px 12px", borderRadius: "999px" }}>{k}</span>
          ))}
        </div>
        <div style={{ background: "var(--amber-bg)", border: "1px solid var(--amber-border)", padding: "14px 16px", marginTop: "22px" }}>
          <div style={{ fontWeight: 700, fontSize: "13px" }}>ⓘ Instructions</div>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink-soft)", lineHeight: 1.5, marginTop: "4px" }}>Answer clearly and concisely. You'll get feedback on content, accuracy, and delivery.</div>
        </div>
      </div>
    ),
    right: (
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
        <div style={{ fontWeight: 700, fontSize: "15px" }}>Speaking tips</div>
        <div style={{ display: "grid", gap: "10px", fontSize: "14px", fontWeight: 500, color: "var(--ink-soft)" }}>
          {["Define overfitting in your own words","Explain why it happens","Share techniques to prevent it","Give a real example"].map(t => (
            <div key={t} style={{ display: "flex", gap: "10px" }}><span style={{ color: "var(--green)", fontWeight: 700 }}>✓</span>{t}</div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid var(--line)", marginTop: "10px", paddingTop: "18px" }}>
          <div style={{ fontWeight: 700, fontSize: "15px" }}>Ready to answer?</div>
          <div style={{ fontSize: "14px", color: "var(--ink-soft)", marginTop: "5px", lineHeight: 1.5 }}>Take a breath and click when ready.</div>
        </div>
        <button className="btn" style={{ marginTop: "auto", width: "100%", justifyContent: "center", padding: "15px 20px" }}>
          <span style={{ color: "var(--amber)" }}>●</span> Start Speaking
        </button>
      </div>
    ),
  },
  {
    label: "Speak",
    left: (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "9px", fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, color: "var(--coral-dark)" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--coral-dark)", display: "inline-block", boxShadow: "0 0 0 3px rgba(196,69,28,0.2)" }} />
            Recording… 0:23
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: "13px", color: "var(--tone-medium)" }}>138 wpm</span>
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: "14px", lineHeight: 1.8, background: "var(--bg-alt)", padding: "18px", marginTop: "20px", color: "var(--ink-soft)", minHeight: "70px", borderLeft: "4px solid var(--amber-border)" }}>
          "Overfitting occurs when a model learns the training data too well, including the noise…"
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "46px", marginTop: "22px" }}>
          {[40,65,30,80,55,90,45,70,35,85,50,75].map((h, i) => (
            <div key={i} style={{ flex: 1, borderRadius: "3px", height: `${h}%`, background: i % 3 === 0 ? "var(--amber)" : i % 2 === 0 ? "var(--ink)" : "var(--coral-dark)" }} />
          ))}
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--tone-medium)", marginTop: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Live transcription</div>
      </div>
    ),
    right: (
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
        <div style={{ fontWeight: 700, fontSize: "15px" }}>While you speak</div>
        <div style={{ display: "grid", gap: "10px", fontSize: "14px", fontWeight: 500, color: "var(--ink-soft)" }}>
          {["Aim for 120–160 words per minute","Pause instead of saying 'um'","Structure: define → explain → example"].map(t => (
            <div key={t} style={{ display: "flex", gap: "10px" }}><span style={{ color: "var(--amber)", fontWeight: 700 }}>—</span>{t}</div>
          ))}
        </div>
        <button className="btn" style={{ marginTop: "auto", width: "100%", justifyContent: "center", background: "var(--coral-dark)", padding: "15px 20px" }}>
          ◼ Stop &amp; Get Feedback
        </button>
      </div>
    ),
  },
  {
    label: "Feedback",
    left: (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: "16px" }}>AI Feedback</span>
          <span style={{ background: "var(--ink)", color: "var(--amber)", fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 600, padding: "4px 12px" }}>CLAUDE</span>
        </div>
        <div style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
          {[
            { label: "CONCEPTS", text: "Covered overfitting, regularization, cross-validation ✓", border: "var(--green)" },
            { label: "MISSING",  text: "No mention of dropout or early stopping", border: "var(--coral)" },
            { label: "TIP",      text: "Add a real-world example like MNIST or spam detection", border: "var(--amber)" },
          ].map(r => (
            <div key={r.label} style={{ background: "var(--bg-alt)", borderLeft: `4px solid ${r.border}`, borderRadius: "6px", padding: "12px 14px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", color: r.border }}>{r.label}</div>
              <div style={{ fontSize: "14px", lineHeight: 1.5, marginTop: "4px", color: "var(--ink-soft)" }}>{r.text}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    right: (
      <div style={{ display: "flex", flexDirection: "column" as const }}>
        <div style={{ fontWeight: 700, fontSize: "15px" }}>How Claude grades</div>
        <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: "12px" }}>Not just right or wrong — it checks key concepts, spots what you missed, flags inaccuracies, and gives one concrete tip.</div>
        <button className="btn" style={{ marginTop: "auto", width: "100%", justifyContent: "center", padding: "15px 20px" }}>
          See Your Score <span style={{ color: "var(--amber)" }}>→</span>
        </button>
      </div>
    ),
  },
  {
    label: "Score",
    left: (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontWeight: 700, fontSize: "16px" }}>Session Score</span>
          <span style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "56px", lineHeight: 1, color: "var(--ink)" }}>84</span>
        </div>
        <div style={{ height: "8px", background: "var(--cream)", marginTop: "10px" }}>
          <div style={{ width: "84%", height: "100%", background: "var(--green)" }} />
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", color: "var(--tone-medium)", margin: "22px 0 10px" }}>KEYWORDS HIT</div>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px" }}>
          {["✓ overfitting","✓ regularization","✓ cross-validation"].map(k => (
            <span key={k} style={{ fontFamily: "var(--mono)", fontSize: "12px", border: "1px solid #9DBFA6", color: "var(--green)", padding: "5px 12px", borderRadius: "999px" }}>{k}</span>
          ))}
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", color: "var(--tone-medium)", margin: "16px 0 10px" }}>MISSED</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "12px", border: "1px solid #D6A18E", color: "var(--coral-dark)", padding: "5px 12px", borderRadius: "999px" }}>✗ dropout</span>
        </div>
      </div>
    ),
    right: (
      <div style={{ display: "flex", flexDirection: "column" as const }}>
        <div style={{ fontWeight: 700, fontSize: "15px" }}>How scoring works</div>
        <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: "12px" }}>Your transcript is compared against ideal answers using embedding similarity, then scaled 0–100. Keywords count — so does saying them in context.</div>
        <button className="btn" style={{ marginTop: "auto", width: "100%", justifyContent: "center", padding: "15px 20px" }}>
          View Voice Analytics <span style={{ color: "var(--amber)" }}>→</span>
        </button>
      </div>
    ),
  },
  {
    label: "Analytics",
    left: (
      <div>
        <div style={{ fontWeight: 700, fontSize: "16px" }}>Voice Analytics</div>
        <div style={{ marginTop: "14px" }}>
          {[
            { label: "Words / min", value: "138", note: "/ Ideal",    noteColor: "var(--green)" },
            { label: "Filler words", value: "2",   note: "/ Low",     noteColor: "var(--green)" },
            { label: "Confidence",   value: "94%", note: "/ High",    noteColor: "var(--green)" },
            { label: "Pauses",       value: "3",   note: "/ Natural", noteColor: "var(--tone-medium)" },
          ].map((m, i, arr) => (
            <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none" }}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink-soft)" }}>{m.label}</span>
              <span style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: "18px" }}>{m.value}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: "12px", color: m.noteColor }}>{m.note}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    right: (
      <div style={{ display: "flex", flexDirection: "column" as const }}>
        <div style={{ fontWeight: 700, fontSize: "15px" }}>Delivery matters</div>
        <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink-soft)", lineHeight: 1.6, marginTop: "12px" }}>Interviewers notice pace, filler words, and hesitation. Track these session over session and watch the filler count drop.</div>
        <button className="btn" style={{ marginTop: "auto", width: "100%", justifyContent: "center", padding: "15px 20px" }}>
          Next Question <span style={{ color: "var(--amber)" }}>→</span>
        </button>
      </div>
    ),
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  return (
    <section>
      {/* ── Hero: two-column ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "clamp(40px,6vw,80px) 40px clamp(60px,8vw,100px)", display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: "54px", alignItems: "center" }}>
        {/* Left: copy */}
        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-block", background: "var(--amber)", color: "var(--ink)", fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", padding: "7px 12px", textTransform: "uppercase" as const, marginBottom: "28px" }}>
            Voice practice. Real confidence.
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "clamp(2.8rem,5.5vw,4.5rem)", lineHeight: 1.02, letterSpacing: "-0.02em", margin: 0 }}>
            Ace your data science interview —{" "}
            <em style={{ color: "var(--amber-hover)", fontStyle: "italic" }}>out loud</em>
          </h1>
          <p style={{ fontSize: "18px", lineHeight: 1.55, fontWeight: 500, color: "var(--ink-soft)", margin: "26px 0 0", maxWidth: "480px" }}>
            Practice answering real interview questions with your voice. Get instant AI feedback on content, accuracy, and delivery.
          </p>
          <div style={{ display: "flex", gap: "14px", marginTop: "32px", flexWrap: "wrap" as const }}>
            <button className="btn" onClick={() => navigate("/register")} style={{ padding: "15px 36px 15px 24px", fontSize: "16px" }}>
              Start Practicing Free <span style={{ color: "var(--amber)" }}>→</span>
            </button>
            <a href="#how" className="btn btn--secondary" style={{ padding: "15px 24px", fontSize: "16px" }}>
              <span style={{ fontSize: "12px" }}>▶</span> See how it works
            </a>
          </div>

          {/* Stats bar */}
          <div style={{ display: "flex", marginTop: "40px", borderTop: "1px solid var(--line)", paddingTop: "22px", gap: 0 }}>
            {[
              { icon: "/icon-mic.png", label: "Voice-first practice", sub: "Speak naturally" },
              { icon: "/icon-sparkle.png", label: "AI feedback", sub: "Instant & actionable" },
              { icon: "/icon-chat.png", label: "Interview-ready", sub: "Real questions" },
            ].map((s, i) => (
              <div key={s.label} style={{ flex: 1, paddingLeft: i > 0 ? "20px" : 0, borderLeft: i > 0 ? "1px solid var(--line)" : "none", paddingRight: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--surface)", border: "2px solid var(--line-strong)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <img src={s.icon} alt={s.label} style={{ width: "26px", height: "26px", objectFit: "contain" }} />
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>{s.label}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--tone-medium)", marginTop: "4px" }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: hero image */}
        <div style={{ position: "relative" }}>
          <img src="/hero-woman.png" alt="Practice your data science interviews out loud" style={{ width: "100%", height: "auto", display: "block", borderRadius: "var(--radius-lg)" }} />
        </div>
      </div>

      {/* ── Practice demo panel ── */}
      <div id="practice" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px clamp(60px,8vw,100px)" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--line-strong)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {tabs.map((t, i) => (
                <button
                  key={t.label}
                  onClick={() => setActive(i)}
                  style={{
                    background: "none", border: "none", padding: "20px 16px 0",
                    fontSize: "15px", cursor: "pointer",
                    borderBottom: i === active ? "3px solid var(--ink)" : "3px solid transparent",
                    color: i === active ? "var(--ink)" : "var(--tone-medium)",
                    fontWeight: i === active ? 700 : 500,
                    marginBottom: i === active ? 0 : "3px",
                    paddingBottom: "17px",
                    transition: "color 0.15s ease",
                  }}
                >{t.label}</button>
              ))}
            </div>
            <button style={{ background: "none", border: "1px solid var(--line-strong)", color: "var(--coral-dark)", fontSize: "13px", fontWeight: 600, padding: "9px 16px", borderRadius: "var(--radius)", cursor: "pointer" }}>
              ◼ End Practice
            </button>
          </div>

          {/* Tab content: 2-column grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr" }}>
            <div style={{ padding: "32px 36px", borderRight: "1px solid var(--line)" }}>
              {tabs[active].left}
            </div>
            <div style={{ padding: "32px 30px", display: "flex", flexDirection: "column" }}>
              {tabs[active].right}
            </div>
          </div>

          {/* Footer bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 24px", borderTop: "1px solid var(--line)", fontSize: "13px", color: "var(--tone-medium)" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "12px" }}>Question ID: ML_000123</span>
            <span>Having trouble? <a href="#" style={{ color: "var(--amber-dark)", fontWeight: 600 }}>Skip this question →</a></span>
          </div>
        </div>
      </div>
    </section>
  );
}
