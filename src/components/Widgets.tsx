import { Async, Dead, Spark, Clock, Review } from "./Icons";

/* ─── DatalystLM widgets ───────────────────────────────────────── */

export function QuestionWidget() {
  return (
    <div className="widget inverted">
      <div className="widget-head">
        <span style={{ display: "inline-flex", gap: ".5rem", alignItems: "center" }}>
          <span className="pill sky" style={{ fontSize: ".7rem" }}>ML</span>
          <span className="pill purple" style={{ fontSize: ".7rem" }}>MEDIUM</span>
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: ".85rem", color: "var(--coral)" }}>⏱ 0:60</span>
      </div>
      <div style={{ marginTop: "1.1rem", fontWeight: 600, fontSize: "1rem", lineHeight: 1.35, color: "#fff" }}>
        What is overfitting and how do you prevent it?
      </div>
      <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
        {["overfitting", "regularization", "cross-validation", "dropout"].map(k => (
          <span key={k} style={{
            fontSize: ".72rem", padding: ".2rem .6rem", borderRadius: "999px",
            background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.75)",
            fontFamily: "var(--mono)"
          }}>{k}</span>
        ))}
      </div>
      <div className="widget-title" style={{ color: "rgba(255,255,255,.5)", fontSize: ".78rem", marginTop: ".9rem" }}>
        Key concepts to mention
      </div>
    </div>
  );
}

export function SpeakWidget() {
  return (
    <div className="widget inverted">
      <div className="widget-head">
        <span style={{ display: "inline-flex", gap: ".45rem", alignItems: "center" }}>
          <span style={{
            width: 9, height: 9, borderRadius: "50%",
            background: "var(--coral)", display: "inline-block",
            boxShadow: "0 0 0 3px rgba(237,116,114,.3)"
          }} />
          Recording... 0:23
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: ".8rem", color: "rgba(255,255,255,.5)" }}>138 wpm</span>
      </div>
      <div style={{
        marginTop: "1rem", fontFamily: "var(--mono)", fontSize: ".82rem",
        color: "rgba(255,255,255,.75)", lineHeight: 1.7,
        background: "rgba(255,255,255,.05)", borderRadius: 10, padding: ".75rem"
      }}>
        "Overfitting occurs when a model learns the training data too well, including the noise..."
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 36, marginTop: "1rem" }}>
        {[40, 65, 30, 80, 55, 90, 45, 70, 35, 85, 50, 75].map((h, i) => (
          <div key={i} style={{
            flex: 1, borderRadius: 4, height: `${h}%`,
            background: i % 3 === 0 ? "var(--coral)" : i % 3 === 1 ? "var(--cream)" : "var(--purple)",
            opacity: 0.8
          }} />
        ))}
      </div>
      <div className="widget-title" style={{ color: "rgba(255,255,255,.5)", fontSize: ".78rem", marginTop: ".9rem" }}>
        Live transcription
      </div>
    </div>
  );
}

export function FeedbackWidget() {
  return (
    <div className="widget inverted">
      <div className="widget-head">
        <span style={{ fontWeight: 600 }}>AI Feedback</span>
        <span className="pill" style={{ background: "var(--green)", color: "#17361f", fontSize: ".7rem" }}>Claude</span>
      </div>
      <div style={{ marginTop: "1rem", display: "grid", gap: ".65rem" }}>
        {[
          { label: "Concepts", text: "Covered overfitting, regularization, cross-validation ✓", color: "var(--green)" },
          { label: "Missing", text: "No mention of dropout or early stopping", color: "var(--coral)" },
          { label: "Tip", text: "Add a real-world example like MNIST or spam detection", color: "var(--cream)" },
        ].map(r => (
          <div key={r.label} style={{
            background: "rgba(255,255,255,.06)", borderRadius: 10, padding: ".65rem .75rem",
            borderLeft: `3px solid ${r.color}`
          }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, color: r.color, textTransform: "uppercase", letterSpacing: ".05em" }}>{r.label}</div>
            <div style={{ fontSize: ".82rem", color: "rgba(255,255,255,.75)", marginTop: ".2rem", lineHeight: 1.45 }}>{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScoreWidget() {
  return (
    <div className="widget inverted">
      <div className="widget-head">
        <span style={{ fontWeight: 600 }}>Session Score</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "1.4rem", fontWeight: 700, color: "var(--green)" }}>84</span>
      </div>
      <div style={{ marginTop: ".9rem" }}>
        <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: ".5rem" }}>Keywords Hit</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem" }}>
          {["overfitting", "regularization", "cross-validation"].map(k => (
            <span key={k} style={{
              fontSize: ".72rem", padding: ".2rem .55rem", borderRadius: "999px",
              background: "rgba(143,214,168,.15)", color: "var(--green)",
              fontFamily: "var(--mono)", border: "1px solid rgba(143,214,168,.25)"
            }}>✓ {k}</span>
          ))}
        </div>
        <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: ".06em", margin: ".65rem 0 .5rem" }}>Missed</div>
        <div style={{ display: "flex", gap: ".35rem" }}>
          <span style={{
            fontSize: ".72rem", padding: ".2rem .55rem", borderRadius: "999px",
            background: "rgba(237,116,114,.15)", color: "var(--coral)",
            fontFamily: "var(--mono)", border: "1px solid rgba(237,116,114,.25)"
          }}>✗ dropout</span>
        </div>
      </div>
      <div style={{ marginTop: "1rem", height: 4, borderRadius: 999, background: "rgba(255,255,255,.1)" }}>
        <div style={{ width: "84%", height: "100%", borderRadius: 999, background: "linear-gradient(90deg, var(--green), var(--cream))" }} />
      </div>
    </div>
  );
}

export function VoiceWidget() {
  const metrics = [
    { label: "Words / min", value: "138", note: "✓ Ideal", color: "var(--green)" },
    { label: "Filler words", value: "2", note: "um, like", color: "var(--peach)" },
    { label: "Confidence", value: "94%", note: "✓ High", color: "var(--green)" },
    { label: "Pauses", value: "3", note: "natural", color: "rgba(255,255,255,.6)" },
  ];
  return (
    <div className="widget inverted">
      <div className="widget-head">
        <span style={{ fontWeight: 600 }}>Voice Analytics</span>
      </div>
      <div style={{ marginTop: "1rem", display: "grid", gap: ".6rem" }}>
        {metrics.map(m => (
          <div key={m.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: ".82rem", color: "rgba(255,255,255,.55)" }}>{m.label}</span>
            <span style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <span style={{ fontFamily: "var(--mono)", fontWeight: 700, color: "#fff" }}>{m.value}</span>
              <span style={{ fontSize: ".72rem", color: m.color }}>{m.note}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="widget-title" style={{ color: "rgba(255,255,255,.5)", fontSize: ".78rem", marginTop: ".9rem" }}>
        Improve delivery over time
      </div>
    </div>
  );
}

/* ─── Original Nerdstack widgets (kept for CSS compatibility) ─── */

export function ErrorTimeline({ inverted }: { inverted?: boolean }) {
  return (
    <div className={`widget${inverted ? " inverted" : ""}`}>
      <div className="widget-head">
        <span>37 <span className="tone-medium">issues</span></span>
      </div>
      <div className="linechart">
        <svg viewBox="0 0 330 110" preserveAspectRatio="none">
          <path d="M1 55C126 162 104 1 181 1c92 0 79 117 148 101" fill="none" stroke="var(--coral)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M1 107C49 -3 110 75 182 75c88-3 69-117 145-56" fill="none" stroke="var(--cream)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M1 2c97-5 67 91 142 91 91-3 15-158 193-60" fill="none" stroke="var(--faint)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="legend">
        <span><i className="dotc" /> Critical</span>
        <span><i className="dotc peach" /> Warning</span>
        <span><i className="dotc faint" /> Deprecated</span>
      </div>
      <div className="widget-title">Error Timeline</div>
    </div>
  );
}

const rows = [
  ["AuthService.ts", "Issue found", "purple", "Nerdstack Debug"],
  ["CheckoutFlow.tsx", "Pass", "", "Nerdstack Optimize"],
  ["UserResolver.js", "Cleanup", "sky", "Nerdstack Review"],
  ["NotificationQueue.go", "Pass", "", "Nerdstack Debug"],
];
export function StatusTable({ compact }: { compact?: boolean }) {
  return (
    <div className="widget">
      <table className="tbl">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            {!compact && <th>Detected by</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, status, cls, by]) => (
            <tr key={name}>
              <td style={{ fontWeight: 600 }}>{name}</td>
              <td><span className={`pill ${cls}`}>{status}</span></td>
              {!compact && <td className="tone-medium">{by}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const insights = [
  [<Async />, "", "Async pitfalls", "Common mistake: un-awaited promises inside conditionals."],
  [<Dead />, "yellow", "Dead code hints", "3 unreachable branches detected in UserResolver.js."],
  [<Spark />, "purple", "Render cost spikes", "CheckoutFlow.tsx re-renders 11× more than necessary."],
] as const;
export function InsightList({ inverted }: { inverted?: boolean }) {
  return (
    <div className={`widget${inverted ? " inverted" : ""}`}>
      <div className="ilist">
        {insights.map(([ico, cls, title, sub]) => (
          <div className="row" key={title}>
            <span className={`ico ${cls}`}>{ico}</span>
            <div>
              <div className="r-title">{title}</div>
              <div className="r-sub">{sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="widget-title">Suggested insights</div>
    </div>
  );
}

export function TimeWidget() {
  return (
    <div className="widget inverted">
      <div className="widget-head">
        <span style={{ display: "inline-flex", gap: ".4rem", alignItems: "center" }}>
          <Clock className="" /> Time Distribution
        </span>
      </div>
      <div style={{ marginTop: "1rem", fontWeight: 600 }}>24 <span className="tone-subtle">total cycles</span></div>
      <div className="bars"><i /><i /><i /><i /></div>
      <div className="legend">
        <span><i className="dotc green" /> Explain</span>
        <span><i className="dotc faint" /> Debug</span>
        <span><i className="dotc purple" /> Review</span>
        <span><i className="dotc peach" /> Docs</span>
      </div>
    </div>
  );
}

export function AuthCard() {
  return (
    <div className="widget authcard">
      <p>Summarizes authentication logic, token lifecycle rules, and edge cases — in plain engineering language, not autogenerated boilerplate.</p>
      <div style={{ marginTop: "1rem" }}><span className="pill">Pass</span></div>
      <div className="foot">
        <span className="ico"><Review className="" /></span>
        <div>
          <div style={{ fontWeight: 600 }}>AuthService.ts</div>
          <div className="tone-medium" style={{ fontSize: ".8rem" }}>Module</div>
        </div>
      </div>
    </div>
  );
}
