// Type definitions for the Holy Book Assistant app
// Tip tanımları — Kutsal Kitap Asistanı uygulaması

/** A single religion's answer with text and source reference */
export interface ReligionAnswer {
  /** The explanatory answer text */
  cevap: string;
  /** The holy book / hadith / scripture reference */
  kaynak: string;
}

/** The full structured response from Gemini, one entry per religion */
export interface TriFaithAnswer {
  islam: ReligionAnswer;
  hristiyanlik: ReligionAnswer;
  yahudilik: ReligionAnswer;
}

/** Religion identifiers — used as keys throughout the app */
export type ReligionKey = "islam" | "hristiyanlik" | "yahudilik";

/** A saved history entry stored in localStorage */
export interface HistoryEntry {
  id: string;
  question: string;
  answer: TriFaithAnswer;
  createdAt: number; // epoch ms
}

/** View states for the single-page app */
export type AppView = "home" | "loading" | "results" | "error";

/** Error categories for tailored user messages */
export type ErrorKind =
  | "network"
  | "api-limit"
  | "safety"
  | "parse"
  | "empty"
  | "unknown";

/** Standard error payload returned by /api/ask */
export interface ApiError {
  kind: ErrorKind;
  message: string;
}
