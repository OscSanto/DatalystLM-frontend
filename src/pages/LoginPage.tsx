import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/api";
import { QuestionWidget } from "../components/Widgets";

interface Props {
  onAuth: (token: string, username: string) => void;
}

export default function LoginPage({ onAuth }: Props) {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({ email, password });
      onAuth(res.token, res.username);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-split">
      {/* ── Left: branded panel ── */}
      <div className="auth-brand">
        <a href="/" className="nav-logo" style={{ color: "#fff" }}>
          Datalyst<b style={{ color: "var(--coral)" }}>LM</b>
        </a>
        <div className="auth-brand-copy">
          <h2 style={{ color: "#fff", fontSize: "clamp(1.6rem,3vw,2.4rem)" }}>
            Practice out loud.<br />Land the role.
          </h2>
          <p style={{ color: "rgba(255,255,255,.6)", marginTop: ".75rem", lineHeight: 1.65 }}>
            Real interview questions. Voice analysis. AI feedback from Claude.
          </p>
        </div>
        <div style={{ marginTop: "auto", width: "100%", maxWidth: 340 }}>
          <QuestionWidget />
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2rem)", marginBottom: ".35rem" }}>
            Welcome back :)
          </h2>
          <p style={{ color: "var(--tone-medium)", marginBottom: "2rem", fontSize: ".95rem" }}>
            Sign in with your email and password to continue.
          </p>

          {error && (
            <div className="form-error" role="alert">{error}</div>
          )}

          {/* OAuth buttons */}
          <div style={{ display: "grid", gap: ".75rem", marginBottom: "1.5rem" }}>
            <a
              href="/oauth2/authorization/google"
              className="btn btn--secondary"
              style={{ width: "100%", justifyContent: "center", gap: ".6rem", textDecoration: "none" }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.34-8.16 2.34-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Continue with Google
            </a>
            <a
              href="/oauth2/authorization/github"
              className="btn btn--secondary"
              style={{ width: "100%", justifyContent: "center", gap: ".6rem", textDecoration: "none" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              Continue with GitHub
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
            <span style={{ fontSize: ".82rem", color: "var(--tone-subtle)" }}>or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.1rem" }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <svg className="input-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <svg className="input-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <a href="#" style={{ fontSize: ".85rem", color: "var(--coral)" }}>Forgot password?</a>
            </div>

            <button className="btn" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: ".25rem" }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <button
              type="button"
              className="btn btn--secondary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.75rem", fontSize: ".85rem", color: "var(--tone-medium)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--coral)", fontWeight: 600 }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
