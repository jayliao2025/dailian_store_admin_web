import { clearAuthState, loadAuthState, saveAuthState } from "../stores/auth.js";

function fallbackApiBase() {
  return window.__APP_CONFIG__?.defaultApiBase || "http://localhost:3000";
}

export function getSession() {
  return loadAuthState() || {
    apiBase: fallbackApiBase(),
    token: "",
    username: "",
  };
}

export async function request(path, options = {}) {
  const session = getSession();
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (session.token) {
    headers["X-Admin-Token"] = session.token;
  }

  const response = await fetch(`${session.apiBase}${path}`, {
    ...options,
    headers,
  });

  const body = await response.json().catch(() => ({}));

  if (response.status === 401) {
    clearAuthState();
  }

  if (!response.ok) {
    throw new Error(body.message || `HTTP ${response.status}`);
  }

  return body;
}

export async function login(payload) {
  const apiBase = payload.apiBase || fallbackApiBase();
  const response = await fetch(`${apiBase}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: payload.username,
      password: payload.password,
    }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || `HTTP ${response.status}`);
  }

  const session = {
    apiBase,
    token: body.token,
    username: body.user?.username || payload.username,
  };

  saveAuthState(session);
  return session;
}

export function logout() {
  clearAuthState();
}
