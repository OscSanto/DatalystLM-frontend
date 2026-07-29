import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [bannerOpen, setBannerOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <header>
      {bannerOpen && (
        <div style={{
          background: "var(--ink)", color: "var(--amber)",
          fontFamily: "var(--mono)", fontSize: "12px", letterSpacing: "0.08em",
          textAlign: "center", padding: "9px 20px", textTransform: "uppercase",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem",
          position: "relative",
        }}>
          Free during beta — every topic, every question. No credit card.
          <button
            onClick={() => setBannerOpen(false)}
            style={{ position: "absolute", right: "16px", background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "16px", lineHeight: 1 }}
            aria-label="Dismiss"
          >×</button>
        </div>
      )}

      <nav style={{
        background: "var(--surface)", borderBottom: "1px solid var(--line)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: "1240px", margin: "0 auto", padding: "0 40px",
          height: "72px", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "32px",
        }}>
          {/* Logo */}
          <a href="/" style={{ display: "inline-flex", alignItems: "center" }}>
            <img src="/logo-datalystlm.png" alt="DatalystLM — Voice. Insight. Impact." style={{ height: "46px", display: "block" }} />
          </a>

          {/* Nav links */}
          <div style={{ display: "flex", gap: "34px", fontSize: "15px", fontWeight: 500 }}>
            <a href="#topics" style={{ color: "var(--ink)" }}>Topics</a>
            <a href="#how" style={{ color: "var(--ink)" }}>How It Works</a>
            <a href="#pricing" style={{ color: "var(--ink)" }}>Pricing</a>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => navigate("/login")}
            >Sign in</button>
            <button
              className="btn btn--sm"
              onClick={() => navigate("/register")}
              style={{ padding: "11px 28px 11px 20px" }}
            >
              Start Practicing <span style={{ color: "var(--amber)" }}>→</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
