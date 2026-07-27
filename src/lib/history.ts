// LocalStorage-based history — keeps the last 10 questions and their answers
// Yerel depolama tabanlı geçmiş — son 10 soru ve cevaplarını tutar

import { HISTORY_STORAGE_KEY, MAX_HISTORY } from "./constants";
import type { HistoryEntry, TriFaithAnswer } from "./types";

/** Generate a unique ID — uses crypto if available, falls back to timestamp */
function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Read all history entries (newest first). Returns [] on any error. */
export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as HistoryEntry[];
  } catch {
    return [];
  }
}

/** Save a new question+answer to history. Trims to MAX_HISTORY (newest). */
export function addToHistory(question: string, answer: TriFaithAnswer): HistoryEntry {
  if (typeof window === "undefined") {
    return { id: makeId(), question, answer, createdAt: Date.now() };
  }
  const entry: HistoryEntry = {
    id: makeId(),
    question: question.trim(),
    answer,
    createdAt: Date.now(),
  };

  const existing = getHistory();
  const next = [entry, ...existing].slice(0, MAX_HISTORY);

  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage full or disabled — silently ignore
  }
  return entry;
}

/** Remove a single entry by ID. Returns the remaining list. */
export function removeFromHistory(id: string): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  const next = getHistory().filter((e) => e.id !== id);
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

/** Clear all history */
export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Format a timestamp as a short Turkish date string */
export function formatHistoryDate(epochMs: number): string {
  try {
    const d = new Date(epochMs);
    return d.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}
