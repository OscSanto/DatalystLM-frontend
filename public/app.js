// DatalystLM backend wiring — shared config & helpers.
// DC files in /public are served from the same origin as the API.
(function () {
  window.DL = {
    API:          "/api/v1",
    LOGIN_URL:    "./Login.dc.html",
    REGISTER_URL: "./Login.dc.html",
    TOKEN_KEY:    "datalystlm_token",

    token: function () {
      try { return window.localStorage.getItem(this.TOKEN_KEY); } catch (e) { return null; }
    },

    // Decode the JWT payload and verify the exp claim client-side.
    // The server still verifies the signature — this just avoids sending
    // a token we already know is dead.  Returns the payload object when
    // valid, null when absent / malformed / expired.
    _payload: function (token) {
      try {
        var parts = (token || '').split('.');
        if (parts.length !== 3) return null;
        // Handle URL-safe base64 (replace - with + and _ with /)
        var b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        var payload = JSON.parse(atob(b64));
        // exp is in seconds — return null (treat as expired) if in the past
        return (payload.exp && payload.exp * 1000 > Date.now()) ? payload : null;
      } catch (e) { return null; }
    },

    clearToken: function () {
      try {
        window.localStorage.removeItem(this.TOKEN_KEY);
        window.localStorage.removeItem("datalystlm_user");
      } catch (e) { /* ignore */ }
    },

    // Clear the stale token before redirecting so the login page starts clean
    // and isAuthenticated() immediately returns false on the next page load.
    goLogin: function () {
      this.clearToken();
      window.location.href = this.LOGIN_URL;
    },

    // Checks expiry before every request.  If the token is missing or expired,
    // redirects to login immediately — no point making a call we know will 401.
    authHeaders: function () {
      var t = this.token();
      if (!t || !this._payload(t)) {
        this.goLogin();
        return { "Content-Type": "application/json" };
      }
      return { "Content-Type": "application/json", "Authorization": "Bearer " + t };
    },

    // Save token + username after login / OAuth
    saveAuth: function (token, username) {
      try {
        window.localStorage.setItem(this.TOKEN_KEY, token);
        window.localStorage.setItem("datalystlm_user", username || "");
      } catch (e) { /* ignore */ }
    },

    // Returns stored username (or empty string)
    getUser: function () {
      try { return window.localStorage.getItem("datalystlm_user") || ""; } catch (e) { return ""; }
    },

    // True only when a non-expired token is present (checked via JWT exp claim)
    isAuthenticated: function () {
      return !!this._payload(this.token());
    }
  };
})();
