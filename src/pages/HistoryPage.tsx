import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "../api/api";
import type { HistoryItem, Topic } from "../types/types";

interface Props { token: string; onLogout: () => void; }

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function topicChipClass(topic: Topic | string) {
  switch (topic) {
    case "ML":         return "ml";
    case "SQL":        return "sql";
    case "STATISTICS": return "stat";
    case "PYTHON":     return "py";
    default:           return "ml";
  }
}

export default function HistoryPage({ token, onLogout }: Props) {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getHistory(token)
      .then(setHistory)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const scored    = history.filter(h => h.score !== null && !h.isOutlier);
  const avgScore  = scored.length > 0 ? Math.round(scored.reduce((s, h) => s + (h.score ?? 0), 0) / scored.length) : null;
  const bestScore = scored.length > 0 ? Math.round(Math.max(...scored.map(h => h.score ?? 0))) : null;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingBottom: "80px" }}>

      {/* ── Header ── */}
      <header style={{ background: "#fff", borderBottom: "1px solid var(--outline-variant)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/"><img src="/logo-datalystlm.png" alt="DatalystLM" style={{ height: "36px" }} /></a>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn btn--secondary btn--sm" onClick={() => navigate("/dashboard")}>Practice</button>
            <button className="btn btn--secondary btn--sm" onClick={onLogout}>Sign out</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 24px 40px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "var(--surface-container)", borderRadius: "9999px", padding: "5px 12px", marginBottom: "16px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--ink-soft)" }}>history</span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Your progress</span>
          </div>
          <h1 style={{ fontFamily: "var(--head)", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.8rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--ink)", margin: 0 }}>
            Practice History
          </h1>
        </div>

        {/* Summary stats */}
        {!loading && !error && history.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
            {([
              { label: "Total Sessions", value: history.length, sub: "attempts" },
              { label: "Avg Score",  value: avgScore  ?? "—", sub: "out of 100" },
              { label: "Best Score", value: bestScore ?? "—", sub: "personal best" },
            ]).map(s => (
              <div key={s.label} className="card" style={{ padding: "24px 28px" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink-soft)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>{s.label}</p>
                <div style={{ fontFamily: "var(--head)", fontWeight: 800, fontSize: "40px", lineHeight: 1, color: "var(--ink)" }}>{s.value}</div>
                <p style={{ fontSize: "12px", color: "var(--ink-soft)", marginTop: "4px" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "5rem", color: "var(--ink-soft)", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div className="spinner" />
            <span style={{ fontSize: "14px" }}>Loading history…</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "8px", padding: "14px 18px", fontSize: "14px", color: "var(--error)" }}>
            ⚠ {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && history.length === 0 && (
          <div style={{ textAlign: "center", padding: "6rem 2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--surface-container)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "var(--ink-soft)" }}>mic_none</span>
            </div>
            <h2 style={{ fontFamily: "var(--head)", fontWeight: 700, fontSize: "1.5rem", margin: "0 0 8px" }}>No attempts yet</h2>
            <p style={{ color: "var(--ink-soft)", marginBottom: "32px" }}>Start your first practice session to build your history.</p>
            <button className="btn" onClick={() => navigate("/dashboard")}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>mic_none</span>
              Start Practicing
            </button>
          </div>
        )}

        {/* History list */}
        {!loading && history.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {history.map(item => {
              const score = item.isOutlier ? null : item.score;
              const scoreColor = score === null ? "var(--ink-soft)"
                : score >= 70 ? "#386a20"
                : score >= 40 ? "#7a5900"
                : "var(--error)";
              const kwHits = item.keywordsHit ? item.keywordsHit.split(",").filter(Boolean).length : 0;
              return (
                <div key={item.resultId} className="card" style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px", flexWrap: "wrap" }}>
                      <span className={`topic-chip ${topicChipClass(item.topic)}`}>{item.topic}</span>
                      <span style={{ background: "var(--surface-container)", color: "var(--ink-soft)", borderRadius: "9999px", padding: "3px 10px", fontSize: "11px", fontWeight: 600 }}>{item.difficulty}</span>
                      {item.isOutlier && <span style={{ fontSize: "11px", color: "var(--error)", fontWeight: 600 }}>OUTLIER</span>}
                      <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--ink-soft)" }}>{formatDate(item.createdAt)}</span>
                    </div>
                    <p style={{ fontFamily: "var(--head)", fontSize: "16px", fontWeight: 500, lineHeight: 1.4, margin: "0 0 10px", color: "var(--ink)" }}>
                      {item.questionText}
                    </p>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                      {item.wordsPerMinute != null && (
                        <span style={{ fontSize: "12px", color: "var(--ink-soft)" }}>
                          <strong style={{ color: "var(--ink)", fontFamily: "var(--head)", fontWeight: 700 }}>{item.wordsPerMinute}</strong> wpm
                        </span>
                      )}
                      {kwHits > 0 && (
                        <span style={{ fontSize: "12px", color: "var(--ink-soft)" }}>
                          <strong style={{ color: "#386a20", fontFamily: "var(--head)", fontWeight: 700 }}>{kwHits}</strong> keyword{kwHits !== 1 ? "s" : ""} hit
                        </span>
                      )}
                      {item.durationSeconds != null && (
                        <span style={{ fontSize: "12px", color: "var(--ink-soft)" }}>
                          <strong style={{ color: "var(--ink)", fontFamily: "var(--head)", fontWeight: 700 }}>{item.durationSeconds}s</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--head)", fontWeight: 800, fontSize: "40px", lineHeight: 1, color: scoreColor }}>
                      {score !== null ? Math.round(score) : "—"}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--ink-soft)", marginTop: "4px", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Score</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="bottom-nav">
        <button className="bottom-nav-item" onClick={() => navigate("/dashboard")}>
          <span className="material-symbols-outlined">mic_none</span>
          Practice
        </button>
        <div className="bottom-nav-item">
          <span className="material-symbols-outlined">psychology</span>
          Coach
        </div>
        <div className="bottom-nav-item">
          <span className="material-symbols-outlined">analytics</span>
          Insights
        </div>
        <button className="bottom-nav-item active">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
          History
        </button>
      </nav>
    </div>
  );
}
