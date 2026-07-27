// POST /api/ask — proxy to Gemini API, keeping the API key server-side
// POST /api/ask — Gemini API'ye proxy, API anahtarı sunucuda kalır

import { NextRequest, NextResponse } from "next/server";
import { askTriFaith } from "@/lib/gemini";
import type { TriFaithAnswer, ApiError } from "@/lib/types";

export const runtime = "nodejs";
// Always run dynamically — never cache the response
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { question?: unknown };
  try {
    body = await req.json();
  } catch {
    const err: ApiError = {
      kind: "parse",
      message: "İstek gövdesi JSON değil.",
    };
    return NextResponse.json(err, { status: 400 });
  }

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
    const answer: TriFaithAnswer = await askTriFaith(q);
    return NextResponse.json(answer, { status: 200 });
  } catch (e) {
    const err = e as ApiError;
    // If it's already a classified ApiError, use it; otherwise wrap
    if (err && typeof err === "object" && "kind" in err && "message" in err) {
      return NextResponse.json(err, { status: 500 });
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
  return NextResponse.json({ ok: true, service: "holy-book-assistant" });
}
