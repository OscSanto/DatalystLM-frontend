import { useState, useEffect, useRef, useCallback } from "react";
import { login, register } from "../api/api";

// ─── Google Fonts ─────────────────────────────────────────────────────────────
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap";
const MSI_HREF =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

function useFonts() {
  useEffect(() => {
    [FONT_HREF, MSI_HREF].forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = href;
        document.head.appendChild(l);
      }
    });
  }, []);
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Mode = "in" | "up";

interface Props {
  onAuth: (token: string, username: string) => void;
  initialTab?: "signin" | "register";
}

// ─── Question deck ────────────────────────────────────────────────────────────
const DECK = [
  { topic: "ML",     level: "Medium", question: "What is overfitting and how do you prevent it?",             tags: ["overfitting","regularization","dropout"] },
  { topic: "SQL",    level: "Hard",   question: "When would a window function beat a self-join?",             tags: ["window functions","joins","indexes"] },
  { topic: "Stats",  level: "Medium", question: "How do you size and read an A/B test?",                      tags: ["power","p-values","significance"] },
  { topic: "Python", level: "Easy",   question: "Explain how you would clean a messy dataset in pandas.",     tags: ["pandas","imputation","dtypes"] },
];

const LEVEL_BG: Record<string, string> = {
  Easy:   "rgba(113,141,62,0.9)",
  Medium: "rgba(196,138,26,0.95)",
  Hard:   "rgba(186,26,26,0.95)",
};

// ─── Material Symbol icon helper ──────────────────────────────────────────────
function Msi({ icon, size = 20, style }: { icon: string; size?: number; style?: React.CSSProperties }) {
  return (
    <span style={{
      fontFamily: "'Material Symbols Outlined'",
      fontWeight: "normal",
      fontStyle: "normal",
      fontVariationSettings: "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24",
      display: "inline-block",
      lineHeight: 1,
      letterSpacing: "normal",
      whiteSpace: "nowrap",
      direction: "ltr",
      fontSize: size,
      ...style,
    }}>
      {icon}
    </span>
  );
}

// ─── Inline styles ────────────────────────────────────────────────────────────
const FIELD_BASE = {
  width: "100%", height: 48,
  padding: "0 16px 0 48px",
  fontFamily: "Inter,sans-serif", fontSize: 16, color: "#0b1c30",
  outline: "none", boxSizing: "border-box" as const,
  borderRadius: 12, border: "none",
  transition: "background 0.2s,box-shadow 0.2s",
  background: "#eff4ff",
};

function field(err?: string): React.CSSProperties {
  return {
    ...FIELD_BASE,
    background: err ? "#fff3f2" : "#eff4ff",
    boxShadow: err ? "0 0 0 2px #ba1a1a" : "none",
  };
}

function pillBtn(primary: boolean): React.CSSProperties {
  return {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "100%", height: 48,
    background: primary ? "#000000" : "#ffffff",
    color: primary ? "#ffffff" : "#0b1c30",
    border: primary ? "none" : "1px solid #c6c6cd",
    borderRadius: 9999,
    fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 500,
    letterSpacing: "0.01em",
    boxShadow: primary ? "0 4px 12px rgba(15,23,42,0.08)" : "none",
    cursor: "pointer",
    boxSizing: "border-box" as const,
  };
}

// ─── Slide panel helper ───────────────────────────────────────────────────────
function slideStyle(active: boolean, dir: number): React.CSSProperties {
  // dir: negative = slide from left (sign-in), positive = slide from right
  return {
    width: "100%", maxWidth: 440,
    position: active ? "relative" : "absolute",
    opacity: active ? 1 : 0,
    transform: `translateX(${active ? 0 : dir * 48}px)`,
    visibility: active ? "visible" : "hidden",
    pointerEvents: active ? "auto" : "none",
    transition: "opacity 0.45s cubic-bezier(0.4,0,0.2,1),transform 0.45s cubic-bezier(0.4,0,0.2,1),visibility 0.45s",
    zIndex: 10,
  };
}

// ─── Error inline message ─────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#ba1a1a", margin: 0 }}>
      <Msi icon="error" size={16} /> {msg}
    </p>
  );
}

// ─── SVGs ─────────────────────────────────────────────────────────────────────
const GoogleSVG = () => (
  <svg width={20} height={20} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const GitHubSVG = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function LoginPage({ onAuth, initialTab = "signin" }: Props) {
  useFonts();

  // Redirect already-authenticated users straight to the app.
  // Validates the JWT expiry — don't redirect on a dead token.
  useEffect(() => {
    const t = localStorage.getItem("datalystlm_token");
    if (!t) return;
    try {
      const parts = t.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          window.location.replace("/Selection.dc.html");
          return;
        }
      }
    } catch (_) {}
    // Token exists but is invalid/expired — clear it so the form shows cleanly
    localStorage.removeItem("datalystlm_token");
    localStorage.removeItem("datalystlm_user");
  }, []);

  const [mode, setMode] = useState<Mode>(initialTab === "register" ? "up" : "in");

  // Card carousel
  const [cardIdx, setCardIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const armTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCardIdx(i => (i + 1) % DECK.length), 5000);
  }, []);

  useEffect(() => {
    armTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [armTimer]);

  function goCard(n: number) {
    setCardIdx((n + DECK.length) % DECK.length);
    armTimer();
  }

  // Sign-in state
  const [siEmail, setSiEmail]     = useState("");
  const [siPass, setSiPass]       = useState("");
  const [siErrEmail, setSiErrEmail] = useState("");
  const [siErrPass, setSiErrPass]   = useState("");
  const [remember, setRemember]   = useState(true);

  // Sign-up state
  const [suFirstName, setSuFirstName] = useState("");
  const [suInitial, setSuInitial]     = useState("");
  const [suEmail, setSuEmail]         = useState("");
  const [suPass, setSuPass]           = useState("");
  const [suPass2, setSuPass2]         = useState("");
  const [suErrFirstName, setSuErrFirstName] = useState("");
  const [suErrEmail, setSuErrEmail]   = useState("");
  const [suErrPass, setSuErrPass]     = useState("");
  const [suErrPass2, setSuErrPass2]   = useState("");

  const [globalErr, setGlobalErr] = useState("");
  const [loading, setLoading]     = useState(false);

  function switchMode(m: Mode) {
    setMode(m);
    setGlobalErr("");
    setSiErrEmail(""); setSiErrPass("");
    setSuErrFirstName(""); setSuErrEmail(""); setSuErrPass(""); setSuErrPass2("");
  }

  // ── Sign In ──
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;
    if (!siEmail) { setSiErrEmail("Enter your email address."); valid = false; }
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(siEmail)) { setSiErrEmail("That doesn't look like a valid email."); valid = false; }
    else setSiErrEmail("");
    if (!siPass) { setSiErrPass("Enter your password."); valid = false; }
    else setSiErrPass("");
    if (!valid) return;

    setLoading(true); setGlobalErr("");
    try {
      const res = await login({ email: siEmail, password: siPass });
      onAuth(res.token, res.username);
    } catch (err: any) {
      setGlobalErr(err.message ?? "Sign in failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  // ── Register ──
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;
    if (!suFirstName) { setSuErrFirstName("Enter your first name."); valid = false; }
    else if (!/^[a-zA-Z0-9_]+$/.test(suFirstName.trim())) { setSuErrFirstName("Letters, numbers, and underscores only."); valid = false; }
    else setSuErrFirstName("");
    if (!suEmail) { setSuErrEmail("Enter your email address."); valid = false; }
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(suEmail)) { setSuErrEmail("That doesn't look like a valid email."); valid = false; }
    else setSuErrEmail("");
    if (!suPass) { setSuErrPass("Choose a password."); valid = false; }
    else if (suPass.length < 8) { setSuErrPass("Use at least 8 characters."); valid = false; }
    else setSuErrPass("");
    if (!suPass2) { setSuErrPass2("Re-enter your password."); valid = false; }
    else if (suPass && suPass2 && suPass !== suPass2) { setSuErrPass2("Passwords don't match."); valid = false; }
    else setSuErrPass2("");
    if (!valid) return;

    // Generate a unique username: first+initial (lowercased) + random 4-digit suffix
    // e.g. "Rob" + "S" → "robs4721"  — same pattern as OAuth2 sign-up.
    // Truncate base to 20 chars so the 4-digit suffix fits within the 25-char DB limit.
    const suffix = Math.floor(Math.random() * 9000 + 1000);
    const base   = (suFirstName.trim().slice(0, 20) + suInitial.trim().slice(0, 1)).toLowerCase();
    const username = base + suffix;

    setLoading(true); setGlobalErr("");
    try {
      const res = await register({ username, email: suEmail, password: suPass });
      // Persist the display name so Selection.dc.html doesn't show the welcome modal again.
      try {
        localStorage.setItem("datalystlm_first",       suFirstName.trim());
        localStorage.setItem("datalystlm_last",        suInitial.trim().slice(0, 1));
        localStorage.setItem("datalystlm_profile_set", "1");
      } catch (_) {}
      onAuth(res.token, res.username);
    } catch (err: any) {
      setGlobalErr(err.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", display: "flex", margin: 0, fontFamily: "Inter,sans-serif", WebkitFontSmoothing: "antialiased" }}>

      {/* ══ Left: brand + carousel ══ */}
      <aside style={{
        position: "relative", width: "50%", background: "#131b2e",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        overflow: "hidden", padding: 64, boxSizing: "border-box",
      }}>
        <div style={{ position: "relative", zIndex: 10, maxWidth: 512, color: "#ffffff", width: "100%" }}>

          {/* Logo */}
          <a href="/" style={{ display: "inline-block", marginBottom: 48 }}>
            <img
              alt="DatalystLM"
              src="/assets/logo-datalystlm.png"
              style={{ height: 40, width: "auto", display: "block", filter: "brightness(0) invert(1)" }}
            />
          </a>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Hanken Grotesk',sans-serif",
            fontSize: 48, lineHeight: "56px", fontWeight: 600,
            letterSpacing: "-0.01em", color: "#ffffff", margin: "0 0 24px",
          }}>
            Practice out loud.<br />Land the role.
          </h1>

          {/* Sub */}
          <p style={{ fontSize: 18, lineHeight: "28px", color: "#bec6e0", margin: 0, maxWidth: 448 }}>
            Real-world interview simulations powered by voice analysis and specialized AI feedback.
            Master your pitch, refine your technical answers, and gain institutional confidence.
          </p>

          {/* Card carousel */}
          <div style={{ marginTop: 64 }}>
            <div style={{ position: "relative", height: 196, overflow: "hidden", borderRadius: 12 }}>

              {/* Prev */}
              <button
                aria-label="Previous question"
                onClick={() => goCard(cardIdx - 1)}
                style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  zIndex: 20, width: 36, height: 36, borderRadius: 9999,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(19,27,46,0.7)", backdropFilter: "blur(8px)",
                  color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", padding: 0,
                }}
              >
                <Msi icon="chevron_left" size={20} />
              </button>

              {/* Next */}
              <button
                aria-label="Next question"
                onClick={() => goCard(cardIdx + 1)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  zIndex: 20, width: 36, height: 36, borderRadius: 9999,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(19,27,46,0.7)", backdropFilter: "blur(8px)",
                  color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", padding: 0,
                }}
              >
                <Msi icon="chevron_right" size={20} />
              </button>

              {/* Cards */}
              {DECK.map((c, n) => (
                <div key={n} style={{
                  position: "absolute", inset: 0, padding: "24px 56px", boxSizing: "border-box",
                  background: "rgba(211,228,254,0.1)", backdropFilter: "blur(12px)",
                  borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
                  opacity: n === cardIdx ? 1 : 0,
                  transform: `translateX(${(n - cardIdx) * 100}%)`,
                  pointerEvents: n === cardIdx ? "auto" : "none",
                  transition: "opacity 0.6s cubic-bezier(0.4,0,0.2,1),transform 0.6s cubic-bezier(0.4,0,0.2,1)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <span style={{
                      background: "#316bf3", color: "#fefcff",
                      padding: "2px 8px", borderRadius: 4,
                      fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em",
                    }}>{c.topic}</span>
                    <span style={{
                      background: LEVEL_BG[c.level] ?? "rgba(255,255,255,0.15)",
                      color: "#ffffff", padding: "2px 8px", borderRadius: 4,
                      fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em",
                    }}>{c.level}</span>
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, color: "#bec6e0" }}>
                      <Msi icon="timer" size={18} />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>0:60</span>
                    </div>
                  </div>
                  <h3 style={{
                    fontFamily: "'Hanken Grotesk',sans-serif",
                    fontSize: 24, lineHeight: "32px", fontWeight: 500,
                    color: "#ffffff", margin: "0 0 16px",
                  }}>{c.question}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {c.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: 12, fontWeight: 600, color: "#bec6e0",
                        background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: 4,
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              {DECK.map((_, n) => (
                <button
                  key={n}
                  onClick={() => goCard(n)}
                  style={{
                    height: 4, width: n === cardIdx ? 32 : 16,
                    borderRadius: 9999, border: "none", padding: 0, cursor: "pointer",
                    background: n === cardIdx ? "#0051d5" : "rgba(255,255,255,0.25)",
                    transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ══ Right: forms ══ */}
      <main style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 64, background: "#f8f9ff",
        position: "relative", boxSizing: "border-box", overflow: "hidden",
      }}>
        {/* radial glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 50% 0%, rgba(0,81,213,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Global error (API) */}
        {globalErr && (
          <div style={{
            position: "absolute", top: 24,
            width: "100%", maxWidth: 440, zIndex: 20,
            background: "#fff3f2", border: "1px solid #ba1a1a",
            borderRadius: 12, padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 14, fontWeight: 600, color: "#ba1a1a",
          }}>
            <Msi icon="error" size={18} /> {globalErr}
          </div>
        )}

        {/* ── Sign-In panel ── */}
        <div style={slideStyle(mode === "in", -48)}>
          <div style={{ textAlign: "left", marginBottom: 48 }}>
            <h2 style={{
              fontFamily: "'Hanken Grotesk',sans-serif",
              fontSize: 32, lineHeight: "40px", fontWeight: 600,
              letterSpacing: "-0.01em", margin: "0 0 8px",
            }}>Welcome back :)</h2>
            <p style={{ fontSize: 16, lineHeight: "24px", color: "#45464d", margin: 0 }}>
              Sign in with your email and password to continue.
            </p>
          </div>

          {/* OAuth buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
            <a
              href="/oauth2/authorization/google"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%", height: 48,
                background: "#ffffff", border: "1px solid #c6c6cd", borderRadius: 9999,
                fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 500,
                letterSpacing: "0.01em", color: "#0b1c30", textDecoration: "none",
                boxSizing: "border-box" as const,
              }}
            >
              <GoogleSVG /> Continue with Google
            </a>
            <a
              href="/oauth2/authorization/github"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%", height: 48,
                background: "#ffffff", border: "1px solid #c6c6cd", borderRadius: 9999,
                fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 500,
                letterSpacing: "0.01em", color: "#0b1c30", textDecoration: "none",
                boxSizing: "border-box" as const,
              }}
            >
              <GitHubSVG /> Continue with GitHub
            </a>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: "#c6c6cd" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#76777d", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              or sign in with email
            </span>
            <div style={{ flex: 1, height: 1, background: "#c6c6cd" }} />
          </div>

          {/* Sign-in form */}
          <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label htmlFor="si-email" style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.01em" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Msi icon="mail" size={20} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#c6c6cd" }} />
                <input
                  id="si-email" type="email" placeholder="you@example.com"
                  autoComplete="email" required
                  value={siEmail} onChange={e => { setSiEmail(e.target.value); setSiErrEmail(""); }}
                  style={field(siErrEmail)}
                />
              </div>
              <FieldError msg={siErrEmail} />
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="si-pass" style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.01em" }}>Password</label>
                <button type="button" style={{ background: "none", border: "none", padding: 0, fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: 600, color: "#0051d5", cursor: "pointer" }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <Msi icon="lock" size={20} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#c6c6cd" }} />
                <input
                  id="si-pass" type="password" placeholder="••••••••"
                  autoComplete="current-password" required
                  value={siPass} onChange={e => { setSiPass(e.target.value); setSiErrPass(""); }}
                  style={field(siErrPass)}
                />
              </div>
              <FieldError msg={siErrPass} />
            </div>

            {/* Remember */}
            <button
              type="button"
              role="checkbox"
              aria-checked={remember}
              onClick={() => setRemember(r => !r)}
              style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "Inter,sans-serif", fontSize: 14, fontWeight: 500, letterSpacing: "0.01em", color: "#45464d", textAlign: "left" }}
            >
              <span style={{
                width: 20, height: 20, flexShrink: 0, borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: remember ? "#0051d5" : "#ffffff",
                border: `1px solid ${remember ? "#0051d5" : "#c6c6cd"}`,
                transition: "all 0.2s",
              }}>
                {remember && <Msi icon="check" size={16} style={{ color: "#ffffff" }} />}
              </span>
              Keep me signed in for 30 days
            </button>

            {/* Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 16 }}>
              <button type="submit" disabled={loading} style={pillBtn(true)}>
                {loading ? "Signing in…" : "Sign In"}
              </button>
              <button type="button" onClick={() => switchMode("up")} style={pillBtn(false)}>
                Create Account
              </button>
            </div>
          </form>

          {/* Footer */}
          <footer style={{ marginTop: 48, textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.01em", color: "#45464d", margin: 0 }}>
              Don't have an account?{" "}
              <button onClick={() => switchMode("up")} style={{ background: "none", border: "none", padding: 0, fontFamily: "Inter,sans-serif", fontSize: 14, color: "#0051d5", fontWeight: 700, cursor: "pointer" }}>
                Sign up free
              </button>
            </p>
          </footer>
        </div>

        {/* ── Sign-Up panel ── */}
        <div style={slideStyle(mode === "up", 48)}>
          {/* Back */}
          <button
            onClick={() => switchMode("in")}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, marginBottom: 24, fontFamily: "Inter,sans-serif", fontSize: 13, fontWeight: 600, color: "#45464d", cursor: "pointer" }}
          >
            <Msi icon="arrow_back" size={18} /> Back to sign in
          </button>

          <div style={{ textAlign: "left", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 32, lineHeight: "40px", fontWeight: 600, letterSpacing: "-0.01em", margin: "0 0 8px" }}>
              Create your account
            </h2>
            <p style={{ fontSize: 16, lineHeight: "24px", color: "#45464d", margin: 0 }}>
              Free plan — unlimited practice questions, no card required.
            </p>
          </div>

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* First Name + Initial */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 96px", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label htmlFor="su-fname" style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.01em" }}>First Name</label>
                <input
                  id="su-fname" type="text" placeholder="John"
                  autoComplete="given-name" required maxLength={20}
                  value={suFirstName} onChange={e => { setSuFirstName(e.target.value); setSuErrFirstName(""); }}
                  style={{ ...FIELD_BASE, padding: "0 16px", boxShadow: suErrFirstName ? "0 0 0 2px #ba1a1a" : "none", background: suErrFirstName ? "#fff3f2" : "#eff4ff" }}
                />
                <FieldError msg={suErrFirstName} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label htmlFor="su-minit" style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.01em" }}>Initial</label>
                <input
                  id="su-minit" type="text" placeholder="S" maxLength={1}
                  autoComplete="off"
                  value={suInitial} onChange={e => setSuInitial(e.target.value)}
                  style={{ ...FIELD_BASE, padding: "0 16px", textAlign: "center" }}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label htmlFor="su-email" style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.01em" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Msi icon="mail" size={20} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#c6c6cd" }} />
                <input
                  id="su-email" type="email" placeholder="you@example.com"
                  autoComplete="email" required
                  value={suEmail} onChange={e => { setSuEmail(e.target.value); setSuErrEmail(""); }}
                  style={field(suErrEmail)}
                />
              </div>
              <FieldError msg={suErrEmail} />
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label htmlFor="su-pass" style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.01em" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Msi icon="lock" size={20} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#c6c6cd" }} />
                <input
                  id="su-pass" type="password" placeholder="At least 8 characters"
                  autoComplete="new-password" required
                  value={suPass} onChange={e => { setSuPass(e.target.value); setSuErrPass(""); }}
                  style={field(suErrPass)}
                />
              </div>
              <FieldError msg={suErrPass} />
            </div>

            {/* Confirm Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label htmlFor="su-pass2" style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.01em" }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <Msi icon="lock_reset" size={20} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#c6c6cd" }} />
                <input
                  id="su-pass2" type="password" placeholder="Re-enter your password"
                  autoComplete="new-password" required
                  value={suPass2} onChange={e => { setSuPass2(e.target.value); setSuErrPass2(""); }}
                  style={field(suErrPass2)}
                />
              </div>
              <FieldError msg={suErrPass2} />
            </div>

            <div style={{ paddingTop: 8 }}>
              <button type="submit" disabled={loading} style={pillBtn(true)}>
                {loading ? "Creating account…" : "Create Free Account"}
              </button>
            </div>

            <p style={{ fontSize: 12, lineHeight: "18px", color: "#76777d", margin: 0, textAlign: "center" }}>
              By creating an account you agree to the{" "}
              <a href="#" style={{ color: "#0051d5" }}>Terms</a> and{" "}
              <a href="#" style={{ color: "#0051d5" }}>Privacy Policy</a>.
            </p>
          </form>
        </div>

      </main>
    </div>
  );
}
