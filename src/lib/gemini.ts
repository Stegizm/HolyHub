// Gemini API client — server-side only
// Gemini API istemcisi — yalnızca sunucu tarafı

import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "./constants";
import type { TriFaithAnswer, ApiError, ErrorKind } from "./types";

/**
 * Initialize the Gemini client.
 * Throws if GEMINI_API_KEY is missing — caller should handle gracefully.
 */
function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err: ApiError = {
      kind: "unknown",
      message:
        "GEMINI_API_KEY ortam değişkeni tanımlı değil. Lütfen .env.local dosyasına API anahtarınızı ekleyin.",
    };
    throw err;
  }
  return new GoogleGenAI({ apiKey });
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
 */
function classifyError(err: unknown): ApiError {
  const msg = err instanceof Error ? err.message : String(err);

  // Safety / harmful content
  if (
    msg.toLowerCase().includes("safety") ||
    msg.toLowerCase().includes("blocked") ||
    msg.toLowerCase().includes("prohibited")
  ) {
    return {
      kind: "safety",
      message:
        "Bu soru güvenlik filtrelerimize takıldı. Lütfen daha saygılı veya tarafsız bir şekilde yeniden ifade edin.",
    };
  }

  // Rate limit / quota
  if (
    msg.toLowerCase().includes("rate") ||
    msg.toLowerCase().includes("quota") ||
    msg.toLowerCase().includes("429") ||
    msg.toLowerCase().includes("resource")
  ) {
    return {
      kind: "api-limit",
      message:
        "Şu an çok yoğunuz, lütfen birkaç dakika sonra tekrar deneyin. API istek limitine ulaşıldı.",
    };
  }

  // Network
  if (
    msg.toLowerCase().includes("fetch") ||
    msg.toLowerCase().includes("network") ||
    msg.toLowerCase().includes("econnrefused") ||
    msg.toLowerCase().includes("timeout")
  ) {
    return {
      kind: "network",
      message:
        "İnternet bağlantınızı kontrol edin. Gemini API'ye ulaşılamıyor.",
    };
  }

  // API key
  if (
    msg.toLowerCase().includes("api key") ||
    msg.toLowerCase().includes("api_key") ||
    msg.toLowerCase().includes("unauthorized") ||
    msg.toLowerCase().includes("401") ||
    msg.toLowerCase().includes("403")
  ) {
    return {
      kind: "unknown",
      message:
        "Gemini API anahtarı geçersiz veya yetkisiz. Lütfen .env.local dosyanızı kontrol edin.",
    };
  }

  return {
    kind: "unknown",
    message: "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.",
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
export async function askTriFaith(question: string): Promise<TriFaithAnswer> {
  let client: GoogleGenAI;
  try {
    client = getClient();
  } catch (e) {
    // Re-throw ApiError directly, otherwise classify
    if (e && typeof e === "object" && "kind" in e) throw e;
    throw classifyError(e);
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
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
