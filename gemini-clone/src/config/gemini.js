// Frontend should call our backend instead of using Google SDK directly in the browser.
// This avoids exposing the API key and prevents CORS/auth issues.

// Use env var in production; default to localhost in development
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000"; // e.g., https://your-backend.onrender.com

export default async function runChat(prompt) {
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    throw new Error("Valid prompt is required.");
  }

  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: prompt.trim() }),
  });

  if (!res.ok) {
    let msg = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch (_) {}
    throw new Error(msg);
  }

  const data = await res.json();
  return data.reply;
}