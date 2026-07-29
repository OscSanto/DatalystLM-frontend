// DatalystLM backend wiring — shared config & helpers. No UI/structure changes.
// Serve these pages from the nerdstack dev server (vite, port 5173) so the
// /api proxy and the login token (localStorage "datalystlm_token") are shared.
(function () {
  var onVite = window.location.port === "5173";

  window.DL = {
    // Same-origin via the vite /api proxy when served from nerdstack,
    // otherwise talk to Spring Boot directly (CORS allows :5173 and :3000).
    API: onVite ? "/api/v1" : "http://localhost:8080/api/v1",
    LOGIN_URL: onVite ? "/login" : "http://localhost:5173/login",
    REGISTER_URL: onVite ? "/register" : "http://localhost:5173/register",
    TOKEN_KEY: "datalystlm_token",

    token: function () {
      try { return window.localStorage.getItem(this.TOKEN_KEY); } catch (e) { return null; }
    },

    clearToken: function () {
      try {
        window.localStorage.removeItem(this.TOKEN_KEY);
        window.localStorage.removeItem("datalystlm_user");
      } catch (e) { /* ignore */ }
    },

    goLogin: function () { window.location.href = this.LOGIN_URL; },

    authHeaders: function () {
      var h = { "Content-Type": "application/json" };
      var t = this.token();
      if (t) h["Authorization"] = "Bearer " + t;
      return h;
    }
  };

  // The static pages link to "/login" / "/register" (nerdstack routes).
  // If the pages are served from any other origin, rewrite those clicks
  // to the nerdstack app so Sign in / Create account still work.
  document.addEventListener("click", function (e) {
    if (onVite || !e.target || !e.target.closest) return;
    var a = e.target.closest('a[href="/login"],a[href="/register"]');
    if (a) {
      e.preventDefault();
      window.location.href = "http://localhost:5173" + a.getAttribute("href");
    }
  }, true);
})();
