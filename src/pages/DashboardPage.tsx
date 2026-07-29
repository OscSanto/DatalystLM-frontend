import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Topic, Difficulty } from "../types/types";

interface Props {
  username: string;
  onLogout: () => void;
}

type TopicCard = { value: Topic; label: string; desc: string; icon: React.ReactNode; bg: string };

const topicCards: TopicCard[] = [
  {
    value: "ML", label: "Machine Learning", bg: "#CFE3F2",
    desc: "Classification, regression, overfitting, neural nets",
    icon: (
      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#141414" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="5" r="2.1"/><circle cx="5" cy="12" r="2.1"/><circle cx="19" cy="12" r="2.1"/><circle cx="12" cy="19" r="2.1"/>
        <path d="M10.4 6.6 6.6 10.4M13.6 6.6l3.8 3.8M6.6 13.6l3.8 3.8M17.4 13.6l-3.8 3.8"/>
      </svg>
    ),
  },
  {
    value: "SQL", label: "SQL & Databases", bg: "#CBE7CE",
    desc: "Joins, indexes, window functions, query optimization",
    icon: (
      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#141414" strokeWidth="1.5" strokeLinecap="round">
        <ellipse cx="12" cy="5.5" rx="7" ry="2.8"/>
        <path d="M5 5.5v13c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-13"/>
        <path d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8"/>
      </svg>
    ),
  },
  {
    value: "STATISTICS", label: "Statistics", bg: "#D9CBEE",
    desc: "Distributions, hypothesis testing, A/B testing",
    icon: (
      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#141414" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 19h18"/><path d="M4 19c4 0 5-12 8-12s4 12 8 12"/>
      </svg>
    ),
  },
  {
    value: "PYTHON", label: "Python", bg: "#F6D4B8",
    desc: "Pandas, NumPy, data wrangling, OOP patterns",
    icon: (
      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#141414" strokeWidth="1.5" strokeLinecap="round">
        <path d="M8.5 7 4 12l4.5 5M15.5 7 20 12l-4.5 5"/>
      </svg>
    ),
  },
];

const difficulties: { value: Difficulty | null; label: string }[] = [
  { value: null, label: "Random" },
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

export default function DashboardPage({ username, onLogout }: Props) {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  function handleStart() {
    if (!selectedTopic) return;
    navigate("/practice", { state: { topic: selectedTopic, difficulty: selectedDifficulty } });
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* ── Sticky header ── */}
      <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 40px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px" }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center" }}>
            <img src="/logo-datalystlm.png" alt="DatalystLM" style={{ height: "46px", display: "block" }} />
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "13px", color: "var(--tone-medium)" }}>
              Hey, <strong style={{ color: "var(--ink)" }}>{username}</strong>
            </span>
            <button className="btn btn--secondary btn--sm" onClick={() => navigate("/history")}>📋 History</button>
            <button className="btn btn--secondary btn--sm" onClick={onLogout}>Sign out</button>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ maxWidth: "1360px", margin: "0 auto", padding: "64px 40px 150px", display: "grid", gridTemplateColumns: "1fr 1.35fr", gap: "70px", alignItems: "start" }}>
        {/* Left: heading */}
        <div>
          <div style={{ display: "inline-block", background: "var(--amber)", color: "var(--ink)", fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", padding: "7px 12px", textTransform: "uppercase" as const }}>
            Voice practice. Real confidence.
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "clamp(2.6rem,5vw,4.2rem)", lineHeight: 1.02, letterSpacing: "-0.02em", margin: "28px 0 0" }}>
            What do you want to{" "}
            <em style={{ color: "var(--amber-hover)", fontStyle: "italic" }}>practice?</em>
          </h1>
          <div style={{ display: "flex", marginTop: "34px", width: "160px", height: "4px" }}>
            <span style={{ flex: "2.2", background: "var(--ink)" }} />
            <span style={{ flex: 1, background: "var(--amber)" }} />
          </div>
          <p style={{ fontSize: "18px", lineHeight: 1.55, fontWeight: 500, color: "var(--ink-soft)", margin: "28px 0 0", maxWidth: "380px" }}>
            Pick a topic, choose a difficulty, and start speaking with confidence.
          </p>
        </div>

        {/* Right: topic cards + difficulty + CTA */}
        <div style={{ display: "flex", flexDirection: "column" as const }}>
          {/* 2×2 topic grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px" }}>
            {topicCards.map((t) => {
              const sel = selectedTopic === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setSelectedTopic(t.value)}
                  style={{
                    background: sel ? "var(--ink)" : "var(--surface)",
                    color: sel ? "var(--surface)" : "var(--ink)",
                    border: sel ? "1px solid var(--ink)" : "1px solid var(--line-strong)",
                    borderRadius: "12px",
                    padding: "26px 26px 20px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column" as const,
                    boxShadow: sel ? "0 6px 18px rgba(20,20,20,0.18)" : "0 2px 0 rgba(20,20,20,0.04)",
                    transition: "all 0.2s ease",
                    textAlign: "left" as const,
                  }}
                >
                  <div style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
                    <span style={{ width: "72px", height: "72px", borderRadius: "50%", background: t.bg, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {t.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "19px", letterSpacing: "-0.01em" }}>{t.label}</div>
                      <div style={{ fontSize: "14.5px", lineHeight: 1.5, fontWeight: 500, marginTop: "8px", color: sel ? "rgba(255,253,247,0.7)" : "var(--ink-soft)" }}>{t.desc}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" as const, fontSize: "20px", marginTop: "6px", color: sel ? "var(--amber)" : "var(--ink)", fontWeight: 700 }}>→</div>
                  {sel && (
                    <div style={{ height: "5px", background: "#3A3A3A", borderRadius: "99px", marginTop: "10px", overflow: "hidden" }}>
                      <div style={{ width: "42%", height: "100%", background: "var(--amber)" }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Difficulty */}
          <div style={{ display: "flex", alignItems: "center", gap: "18px", marginTop: "38px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "14px", fontWeight: 600, letterSpacing: "0.08em", whiteSpace: "nowrap" as const }}>DIFFICULTY</span>
            <span style={{ flex: 1, height: "1.5px", background: "var(--line-strong)" }} />
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "18px", flexWrap: "wrap" as const }}>
            {difficulties.map((d) => {
              const sel = selectedDifficulty === d.value;
              return (
                <button
                  key={d.label}
                  onClick={() => setSelectedDifficulty(d.value)}
                  style={{
                    background: sel ? "var(--ink)" : "var(--surface)",
                    color: sel ? "var(--surface)" : "var(--ink)",
                    border: sel ? "1px solid var(--ink)" : "1px solid var(--line-strong)",
                    borderRadius: "10px",
                    padding: "14px 34px",
                    fontSize: "16px",
                    fontWeight: sel ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >{d.label}</button>
              );
            })}
          </div>

          {/* CTA */}
          <button
            onClick={handleStart}
            disabled={!selectedTopic}
            style={{
              marginTop: "34px",
              background: selectedTopic ? "var(--ink)" : "var(--line-strong)",
              color: selectedTopic ? "var(--surface)" : "var(--tone-medium)",
              border: "none",
              borderRadius: "12px",
              padding: "22px 32px",
              fontSize: "22px",
              fontWeight: 700,
              fontFamily: "var(--font)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              cursor: selectedTopic ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
            }}
          >
            Start Practice Session <span style={{ color: selectedTopic ? "var(--amber)" : "var(--tone-medium)" }}>→</span>
          </button>
          {!selectedTopic && (
            <p style={{ fontSize: "13px", color: "var(--tone-medium)", marginTop: "8px", textAlign: "center" as const, fontFamily: "var(--mono)" }}>
              Select a topic to continue
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
