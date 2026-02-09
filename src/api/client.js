// ── Base URL for all API calls ──
const API_BASE = "https://yash-task-manager-baq2.onrender.com";

/**
 * Helper: builds headers with JWT token attached.
 * Every authenticated request uses this.
 */
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Generic fetch wrapper.
 * - Attaches auth header automatically
 * - Throws a readable error on non-2xx responses
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      ...authHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }

  // Some endpoints (DELETE) may return no body
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return null;
}

/**
 * Login helper – uses form-data (URLSearchParams) as required by FastAPI OAuth2.
 * Returns the parsed JSON (contains access_token).
*/
export async function loginUser(email, password) {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);
 
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Login failed");
  }

  return res.json();
}