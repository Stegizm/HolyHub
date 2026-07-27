// Client-side Gemini API key management.
// The key is stored in localStorage ONLY — never sent to our server
// beyond the proxy request to Gemini.
//
// İstemci tarafı Gemini API anahtarı yönetimi.
// Anahtar yalnızca localStorage'da saklanır — sunucumuza gönderilmez,
// yalnızca Gemini'ye proxy isteklerinde kullanılır.

const STORAGE_KEY = "holyhub_gemini_key";

/**
 * Returns the user's stored Gemini API key, or null if not set.
 */
export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * Persists the API key to localStorage. Trims whitespace.
 */
export function setApiKey(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, key.trim());
}

/**
 * Removes the API key from localStorage.
 */
export function clearApiKey(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Quick check whether a key is present.
 */
export function hasApiKey(): boolean {
  return !!getApiKey();
}
