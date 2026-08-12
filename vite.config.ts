import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Serve the Vox-style redesign landing page (public/DatalystLM v2.dc.html)
// at the site root, so http://localhost:5173/ shows the new landing page.
// IMPORTANT: requests with a query string are left alone — the Spring OAuth2
// success handler redirects to "/?token=...&username=...", which must reach
// the React app so it can store the token.
function voxLanding(): Plugin {
  return {
    name: "vox-landing",
    configureServer(server) {
      server.middlewares.use((req: any, _res, next) => {
        // Only rewrite the root path so SPA routes (/login, /dashboard, etc.)
        // still reach the React app via Vite's normal index.html fallback.
        if (req.url === "/") {
          req.url = "/Front.dc.html";
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), voxLanding()],
  server: {
    proxy: {
      // Any request starting with /api gets forwarded to the Spring Boot backend.
      // This means frontend code can call "/api/v1/auth/login" instead of
      // "http://localhost:8080/api/v1/auth/login" — cleaner and avoids CORS in dev.
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
