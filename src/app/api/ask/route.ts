// POST /api/ask — proxy to Gemini API using the user-supplied API key.
// POST /api/ask — Kullanıcının gönderdiği API anahtarı ile Gemini'ye proxy.
//
// v1.1+: The server no longer holds a long-lived GEMINI_API_KEY in env.
// Each request carries the user's key in the JSON body; we forward it to
// Gemini and discard it immediately after the response.

import { NextRequest, NextResponse } from "next/server";
import { askTriFaith } from "@/lib/gemini";
import type { TriFaithAnswer, ApiError } from "@/lib/types";

export const runtime = "nodejs";
// Always run dynamically — never cache the response
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { question?: unknown; apiKey?: unknown };
  try {
    body = await req.json();
  } catch {
    const err: ApiError = {
      kind: "parse",
      message: "İstek gövdesi JSON değil.",
    };
    return NextResponse.json(err, { status: 400 });
  }

  // API key
  const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
  if (!apiKey) {
    const err: ApiError = {
      kind: "no-api-key",
      message:
        "Gemini API anahtarı gerekli. Lütfen ayarlar simgesinden kendi API anahtarınızı girin.",
    };
    return NextResponse.json(err, { status: 401 });
  }

  // Question
  const q = typeof body.question === "string" ? body.question.trim() : "";
  if (!q) {
    const err: ApiError = {
      kind: "empty",
      message: "Soru boş olamaz. Lütfen bir soru girin.",
    };
    return NextResponse.json(err, { status: 400 });
  }
  if (q.length > 1000) {
    const err: ApiError = {
      kind: "empty",
      message: "Soru çok uzun. Lütfen 1000 karakteri geçmeyin.",
    };
    return NextResponse.json(err, { status: 400 });
  }

  try {
    const answer: TriFaithAnswer = await askTriFaith(q, apiKey);
    return NextResponse.json(answer, { status: 200 });
  } catch (e) {
    const err = e as ApiError;
    // If it's already a classified ApiError, use it; otherwise wrap
    if (err && typeof err === "object" && "kind" in err && "message" in err) {
      const status =
        err.kind === "no-api-key" || err.kind === "invalid-api-key"
          ? 401
          : err.kind === "api-limit"
            ? 429
            : 500;
      return NextResponse.json(err, { status });
    }
    const fallback: ApiError = {
      kind: "unknown",
      message: "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.",
    };
    return NextResponse.json(fallback, { status: 500 });
  }
}

/** Health check */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "holy-book-assistant",
    version: "1.1.0",
  });
}
