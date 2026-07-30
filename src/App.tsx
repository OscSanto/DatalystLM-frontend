import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth }   from "./hooks/useAuth";

import LoginPage     from "./pages/LoginPage";
import RegisterPage  from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PracticePage  from "./pages/PracticePage";
import HistoryPage   from "./pages/HistoryPage";
import Navbar        from "./components/Navbar";
import Hero          from "./components/Hero";

export default function App() {
  const { token, username, isAuthenticated, saveAuth, logout } = useAuth();

  // Handle OAuth2 redirect: backend lands on / with ?token=xxx&username=yyy
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get("token");
    const oauthUser  = params.get("username");
    if (oauthToken && oauthUser) {
      saveAuth(oauthToken, decodeURIComponent(oauthUser));
      window.location.replace("/dashboard");
    }
  }, []);

  function handleAuth(t: string, u: string) {
    saveAuth(t, u);
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"        element={<><Navbar /><Hero /></>} />
        <Route path="/login"   element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <LoginPage onAuth={handleAuth} />
        } />
        <Route path="/register" element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <RegisterPage onAuth={handleAuth} />
        } />

        {/* Protected */}
        <Route path="/dashboard" element={
          isAuthenticated
            ? <DashboardPage username={username!} onLogout={logout} />
            : <Navigate to="/login" replace />
        } />
        <Route path="/practice" element={
          isAuthenticated
            ? <PracticePage token={token!} onLogout={logout} />
            : <Navigate to="/login" replace />
        } />
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
