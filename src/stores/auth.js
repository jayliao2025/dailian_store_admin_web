const STORAGE_KEY = "dailian-admin-auth";

export function loadAuthState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveAuthState(payload) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearAuthState() {
  localStorage.removeItem(STORAGE_KEY);
}
