"use client";

import { useState } from "react";
import { Copy, Check, BookMarked, Quote } from "lucide-react";
import type { ReligionKey, ReligionAnswer } from "@/lib/types";
import { RELIGION_META } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ReligionCardProps {
  religionKey: ReligionKey;
  answer: ReligionAnswer;
  index?: number; // for stagger animation
}

/**
 * A single religion's answer card.
 * Shows: symbol + name header, answer text (rendered with paragraph breaks),
 * and a distinctively styled source citation.
 */
export function ReligionCard({ religionKey, answer, index = 0 }: ReligionCardProps) {
  const meta = RELIGION_META[religionKey];
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `${meta.name} — ${meta.scripture}\n\n${answer.cevap}\n\nKaynak: ${answer.kaynak}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard not available
    }
  };

  // Split answer by newlines into paragraphs
  const paragraphs = answer.cevap
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article
      className={cn(
        "religion-card fade-in-up relative rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow",
        meta.borderClass,
      )}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Top accent bar — religion color */}
      <div className={cn("h-1.5 w-full", meta.bgClass)} aria-hidden />

      <div className="p-5 sm:p-6 space-y-4">
        {/* Header: symbol + name + scripture */}
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0",
                meta.softBgClass,
                meta.accentClass,
              )}
              aria-hidden
            >
              {meta.symbol}
            </div>
            <div>
              <h3 className={cn("font-display text-lg font-semibold leading-tight", meta.accentClass)}>
                {meta.name}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <BookMarked className="h-3 w-3" />
                {meta.scripture}
                {meta.scriptureExtra && (
                  <span className="text-muted-foreground/70">· {meta.scriptureExtra}</span>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            aria-label={`${meta.name} cevabını kopyala`}
            className="shrink-0 p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-islam" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </header>

        {/* Answer text */}
        <div className="text-sm sm:text-[0.95rem] leading-relaxed text-foreground/90 font-serif space-y-3">
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))
          ) : (
            <p className="text-muted-foreground italic">Bu din için cevap alınamadı.</p>
          )}
        </div>

        {/* Source citation — distinctly styled */}
        {answer.kaynak && (
          <div
            className={cn(
              "rounded-lg px-4 py-3 border-l-4 flex items-start gap-2.5",
              meta.softBgClass,
              "border-l-current",
              meta.accentClass,
            )}
          >
            <Quote className={cn("h-4 w-4 mt-0.5 shrink-0", meta.accentClass)} aria-hidden />
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-0.5">
                Kutsal Referans
              </div>
              <p className={cn("text-sm font-medium leading-snug", meta.accentClass)}>
                {answer.kaynak}
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
