import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth }   from "./hooks/useAuth";

import LoginPage   from "./pages/LoginPage";
import HistoryPage from "./pages/HistoryPage";

// After login/register, land on the DC-HTML dashboard
const DASHBOARD = "/Selection.dc.html";

export default function App() {
  const { token, isAuthenticated, saveAuth, logout } = useAuth();

  // Handle OAuth2 redirect: backend lands on / with ?token=xxx&username=yyy
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get("token");
    const oauthUser  = params.get("username");
    if (oauthToken && oauthUser) {
      saveAuth(oauthToken, decodeURIComponent(oauthUser));
      window.location.replace(DASHBOARD);
    }
  }, []);

  function handleAuth(t: string, u: string) {
    saveAuth(t, u);
    window.location.replace(DASHBOARD);
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* "/" — nginx serves Front.dc.html directly (see nginx.conf location = /) */}
        {/* OAuth2 callbacks arrive as /?token=xxx — nginx passes those to index.html */}
        <Route path="/" element={null} />

        {/* Login / Register */}
        <Route path="/login" element={
          isAuthenticated
            ? <Navigate to={DASHBOARD} replace />
            : <LoginPage onAuth={handleAuth} />
        } />
        <Route path="/register" element={
          isAuthenticated
            ? <Navigate to={DASHBOARD} replace />
            : <LoginPage onAuth={handleAuth} initialTab="register" />
        } />

        {/* History — only React page remaining for protected routes */}
        <Route path="/history" element={
          isAuthenticated
            ? <HistoryPage token={token!} onLogout={logout} />
            : <Navigate to="/login" replace />
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
