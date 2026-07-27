// Gemini API client — server-side only
// Gemini API istemcisi — yalnızca sunucu tarafı

import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "./constants";
import type { TriFaithAnswer, ApiError, ErrorKind } from "./types";

/**
 * Initialize the Gemini client with a user-provided API key.
 * The key is supplied per-request from the client (localStorage)
 * so the server never holds a long-lived secret.
 */
function getClient(apiKey: string): GoogleGenAI {
  if (!apiKey || !apiKey.trim()) {
    const err: ApiError = {
      kind: "no-api-key",
      message:
        "Gemini API anahtarı gerekli. Lütfen ayarlar simgesinden kendi API anahtarınızı girin.",
    };
    throw err;
  }
  return new GoogleGenAI({ apiKey: apiKey.trim() });
}

/**
 * JSON schema for the structured response.
 * Used with Gemini's responseSchema / responseMimeType to force valid JSON.
 */
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    islam: {
      type: Type.OBJECT,
      properties: {
        cevap: { type: Type.STRING },
        kaynak: { type: Type.STRING },
      },
      required: ["cevap", "kaynak"],
    },
    hristiyanlik: {
      type: Type.OBJECT,
      properties: {
        cevap: { type: Type.STRING },
        kaynak: { type: Type.STRING },
      },
      required: ["cevap", "kaynak"],
    },
    yahudilik: {
      type: Type.OBJECT,
      properties: {
        cevap: { type: Type.STRING },
        kaynak: { type: Type.STRING },
      },
      required: ["cevap", "kaynak"],
    },
  },
  required: ["islam", "hristiyanlik", "yahudilik"],
};

/**
 * Map a thrown error to a user-friendly ApiError.
 * Categorizes network issues, rate limits, safety filter triggers, and parse errors.
 *
 * IMPORTANT: The order of checks matters! API-key errors often contain words like
 * "resource" (e.g. "Resource not found" on invalid key) which would otherwise
 * misclassify as a rate limit. So we check API-key BEFORE rate-limit.
 */
function classifyError(err: unknown): ApiError {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();

  // Safety / harmful content
  if (
    lower.includes("safety") ||
    lower.includes("blocked") ||
    lower.includes("prohibited")
  ) {
    return {
      kind: "safety",
      message:
        "Bu soru güvenlik filtrelerimize takıldı. Lütfen daha saygılı veya tarafsız bir şekilde yeniden ifade edin.",
    };
  }

  // API key — check this BEFORE rate limit because some invalid-key errors
  // contain the word "resource" (e.g. "Resource not found" or "API key not valid").
  if (
    lower.includes("api key") ||
    lower.includes("api_key") ||
    lower.includes("apikey") ||
    lower.includes("unauthorized") ||
    lower.includes("401") ||
    lower.includes("403") ||
    lower.includes("404") ||
    lower.includes("permission") ||
    lower.includes("forbidden") ||
    lower.includes("invalid_api_key") ||
    (lower.includes("invalid") && lower.includes("key"))
  ) {
    return {
      kind: "invalid-api-key",
      message:
        "Gemini API anahtarı geçersiz veya yetkisiz. Lütfen sağ üstteki 🔑 simgesinden API anahtarınızı kontrol edin. (Detay: " +
        msg.slice(0, 120) +
        ")",
    };
  }

  // Rate limit / quota — be specific to avoid matching "resource not found" above
  if (
    lower.includes("rate limit") ||
    lower.includes("rate_limit") ||
    lower.includes("quota") ||
    lower.includes("429") ||
    lower.includes("resource_exhausted") ||
    lower.includes("resourceexhausted") ||
    lower.includes("too many requests")
  ) {
    return {
      kind: "api-limit",
      message:
        "Gemini API istek limitine ulaşıldı. Ücretsiz tierda 15 istek/dakika ve 1500 istek/gün limiti vardır. Lütfen birkaç dakika bekleyin veya daha kısa bir soru deneyin. (Detay: " +
        msg.slice(0, 120) +
        ")",
    };
  }

  // Network
  if (
    lower.includes("fetch") ||
    lower.includes("network") ||
    lower.includes("econnrefused") ||
    lower.includes("timeout") ||
    lower.includes("enotfound") ||
    lower.includes("socket hang up")
  ) {
    return {
      kind: "network",
      message:
        "İnternet bağlantınızı kontrol edin. Gemini API'ye ulaşılamıyor. (Detay: " +
        msg.slice(0, 120) +
        ")",
    };
  }

  return {
    kind: "unknown",
    message:
      "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin. (Detay: " +
      msg.slice(0, 120) +
      ")",
  };
}

/**
 * Ask Gemini for a tri-faith answer to the given question.
 *
 * Uses structured JSON output mode (responseMimeType + responseSchema)
 * to guarantee the response matches our TriFaithAnswer shape.
 *
 * Safety settings are set to BLOCK_MEDIUM_AND_ABOVE per PRD spec.
 */
export async function askTriFaith(
  question: string,
  apiKey: string,
): Promise<TriFaithAnswer> {
  let client: GoogleGenAI;
  try {
    client = getClient(apiKey);
  } catch (e) {
    // Re-throw ApiError directly, otherwise classify
    if (e && typeof e === "object" && "kind" in e) throw e;
    throw classifyError(e);
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema,
        // Medium safety threshold per PRD — blocks clearly harmful content
        // while allowing genuine religious inquiry
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
        temperature: 0.4, // lower temperature for more consistent, factual answers
      },
    });

    const text = response.text;
    if (!text) {
      // Could be a safety block with no candidates
      const fb = response.candidates?.[0]?.finishReason;
      if (fb === "SAFETY" || fb === "PROHIBITED_CONTENT") {
        const err: ApiError = {
          kind: "safety",
          message:
            "Bu soru güvenlik filtrelerimize takıldı. Lütfen daha saygılı veya tarafsız bir şekilde yeniden ifade edin.",
        };
        throw err;
      }
      const err: ApiError = {
        kind: "empty",
        message: "Gemini boş bir yanıt döndürdü. Lütfen soruyu yeniden deneyin.",
      };
      throw err;
    }

    // Parse and validate
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      const err: ApiError = {
        kind: "parse",
        message: "Yanıt JSON formatında değil. Lütfen tekrar deneyin.",
      };
      throw err;
    }

    const validation = validateTriFaith(parsed);
    if (!validation.ok) {
      const err: ApiError = {
        kind: "parse",
        message: validation.message,
      };
      throw err;
    }

    return validation.value;
  } catch (e) {
    // Already classified
    if (e && typeof e === "object" && "kind" in e && "message" in e) {
      throw e;
    }
    throw classifyError(e);
  }
}

/** Runtime validation that the parsed object matches TriFaithAnswer */
function validateTriFaith(
  v: unknown,
): { ok: true; value: TriFaithAnswer } | { ok: false; message: string } {
  if (typeof v !== "object" || v === null) {
    return { ok: false, message: "Yanıt bir nesne değil." };
  }
  const obj = v as Record<string, unknown>;
  const required: Array<"islam" | "hristiyanlik" | "yahudilik"> = [
    "islam",
    "hristiyanlik",
    "yahudilik",
  ];
  for (const key of required) {
    const sub = obj[key];
    if (typeof sub !== "object" || sub === null) {
      return { ok: false, message: `'${key}' alanı eksik veya hatalı.` };
    }
    const subObj = sub as Record<string, unknown>;
    if (typeof subObj.cevap !== "string" || typeof subObj.kaynak !== "string") {
      return {
        ok: false,
        message: `'${key}' cevap/kaynak alanları metin değil.`,
      };
    }
  }
  return { ok: true, value: obj as unknown as TriFaithAnswer };
}
