import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "../api/api";
import type { HistoryItem } from "../types/types";

interface Props { token: string; onLogout: () => void; }

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function topicBg(topic: string) {
  switch (topic) {
    case "ML":         return "#CFE3F2";
    case "SQL":        return "#CBE7CE";
    case "STATISTICS": return "#D9CBEE";
    case "PYTHON":     return "#F6D4B8";
    default:           return "#EAE3D2";
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

  const attempts = history.length;
  const scored   = history.filter(h => h.score !== null);
  const avgScore = scored.length > 0 ? Math.round(scored.reduce((s, h) => s + (h.score ?? 0), 0) / scored.length) : null;
  const bestScore = scored.length > 0 ? Math.round(Math.max(...scored.map(h => h.score ?? 0))) : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* ── Sticky header ── */}
      <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 40px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px" }}>
          <a href="/" style={{ display: "inline-flex", alignItems: "center" }}>
            <img src="/logo-datalystlm.png" alt="DatalystLM" style={{ height: "46px", display: "block" }} />
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <button className="btn btn--secondary btn--sm" onClick={() => navigate("/dashboard")}>← Dashboard</button>
            <button className="btn btn--secondary btn--sm" onClick={onLogout}>Sign out</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1360px", margin: "0 auto", padding: "64px 40px 100px" }}>
        {/* ── Page header ── */}
        <div style={{ display: "inline-block", background: "var(--amber)", color: "var(--ink)", fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", padding: "7px 12px", textTransform: "uppercase" as const, marginBottom: "28px" }}>
          Your progress
        </div>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "clamp(2.4rem,5vw,4rem)", lineHeight: 1.02, margin: 0 }}>
          Practice <em style={{ color: "var(--amber-hover)", fontStyle: "italic" }}>history</em>
        </h1>
        <div style={{ display: "flex", marginTop: "20px", width: "120px", height: "4px" }}>
          <span style={{ flex: "2.2", background: "var(--ink)" }} />
          <span style={{ flex: 1, background: "var(--amber)" }} />
        </div>

        {/* ── Summary cards ── */}
        {!loading && !error && history.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "40px" }}>
            {[
              { label: "Total Attempts", value: attempts, note: "sessions" },
              { label: "Average Score", value: avgScore ?? "—", note: "out of 100" },
              { label: "Best Score", value: bestScore ?? "—", note: "personal best" },
            ].map(s => (
              <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--line-strong)", borderRadius: "4px", boxShadow: "0 2px 0 rgba(20,20,20,0.05)", padding: "28px 32px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", color: "var(--tone-medium)", textTransform: "uppercase" as const }}>{s.label}</div>
                <div style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "52px", lineHeight: 1, marginTop: "12px" }}>{s.value}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--tone-medium)", marginTop: "8px" }}>{s.note}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Loading / Error ── */}
        {loading && (
          <div style={{ textAlign: "center" as const, padding: "5rem", color: "var(--tone-medium)", fontFamily: "var(--mono)" }}>Loading history…</div>
        )}
        {error && (
          <div style={{ background: "#FFF0EE", borderLeft: "4px solid var(--coral)", padding: "14px 18px", marginTop: "24px", fontSize: "14px", color: "var(--coral-dark)" }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && history.length === 0 && (
          <div style={{ textAlign: "center" as const, padding: "6rem 2rem" }}>
            <div style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "56px", color: "var(--line-strong)", lineHeight: 1 }}>"</div>
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "2rem", margin: "12px 0 8px" }}>No attempts yet</h2>
            <p style={{ color: "var(--ink-soft)", marginBottom: "32px" }}>Start your first practice session to build your history.</p>
            <button className="btn" onClick={() => navigate("/dashboard")} style={{ padding: "15px 36px 15px 24px", fontSize: "16px" }}>
              Start Practicing <span style={{ color: "var(--amber)" }}>→</span>
            </button>
          </div>
        )}

        {/* ── History list ── */}
        {!loading && history.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "24px" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "14px", fontWeight: 600, letterSpacing: "0.08em" }}>RECENT ATTEMPTS</span>
              <span style={{ flex: 1, height: "1.5px", background: "var(--line-strong)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "16px" }}>
              {history.map(item => {
                const score = item.isOutlier ? null : item.score;
                const scoreColor = score === null ? "var(--tone-medium)" : score >= 70 ? "var(--green)" : score >= 40 ? "var(--amber-hover)" : "var(--coral-dark)";
                const kwHits = item.keywordsHit ? item.keywordsHit.split(",").filter(Boolean).length : 0;
                return (
                  <div key={item.resultId} style={{ background: "var(--surface)", border: "1px solid var(--line-strong)", borderRadius: "4px", boxShadow: "0 2px 0 rgba(20,20,20,0.05)", padding: "24px 28px", display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", alignItems: "center" }}>
                    <div>
                      {/* Topic / difficulty / date */}
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" as const }}>
                        <span style={{ background: topicBg(item.topic), fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", padding: "4px 10px" }}>{item.topic}</span>
                        <span style={{ background: "var(--cream)", fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", padding: "4px 10px" }}>{item.difficulty}</span>
                        {item.isOutlier && <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--coral-dark)", fontWeight: 600 }}>OUTLIER</span>}
                        <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--tone-medium)", marginLeft: "auto" }}>{formatDate(item.createdAt)}</span>
                      </div>
                      {/* Question text */}
                      <p style={{ fontFamily: "var(--serif)", fontSize: "18px", fontWeight: 500, lineHeight: 1.35, margin: 0, color: "var(--ink)" }}>
                        {item.questionText}
                      </p>
                      {/* Metrics */}
                      <div style={{ display: "flex", gap: "24px", marginTop: "14px", flexWrap: "wrap" as const }}>
                        {item.wordsPerMinute != null && (
                          <span style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--tone-medium)" }}>
                            <strong style={{ color: "var(--ink)", fontFamily: "var(--serif)" }}>{item.wordsPerMinute}</strong> wpm
                          </span>
                        )}
                        {kwHits > 0 && (
                          <span style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--tone-medium)" }}>
                            <strong style={{ color: "var(--green)", fontFamily: "var(--serif)" }}>{kwHits}</strong> keyword{kwHits !== 1 ? "s" : ""} hit
                          </span>
                        )}
                        {item.durationSeconds != null && (
                          <span style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--tone-medium)" }}>
                            <strong style={{ color: "var(--ink)", fontFamily: "var(--serif)" }}>{item.durationSeconds}s</strong>
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Score badge */}
                    <div style={{ textAlign: "center" as const, flexShrink: 0 }}>
                      <div style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: "48px", lineHeight: 1, color: scoreColor }}>
                        {score !== null ? Math.round(score) : "—"}
                      </div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--tone-medium)", marginTop: "4px", letterSpacing: "0.06em" }}>SCORE</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
