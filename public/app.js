// DatalystLM backend wiring — shared config & helpers.
// nginx serves all routes (landing, React SPA, API) from the same origin,
// so all URLs are relative — no localhost fallbacks needed.
(function () {
  window.DL = {
    API:          "/api/v1",
    LOGIN_URL:    "/login",
    REGISTER_URL: "/register",
    TOKEN_KEY:    "datalystlm_token",

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
})();
