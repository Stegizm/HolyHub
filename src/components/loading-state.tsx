"use client";

import { RELIGION_ORDER, RELIGION_META } from "@/lib/constants";

/**
 * Loading state — three pulsing gold dots over the question,
 * with each religion's name as a "searching" label.
 */
export function LoadingState({ question }: { question: string }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center space-y-8">
        {/* The question being processed */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-gold font-medium">
            Sorgulanıyor
          </p>
          <p className="font-display text-xl sm:text-2xl text-foreground italic leading-snug">
            “{question}”
          </p>
        </div>

        {/* Three pulsing dots */}
        <div className="flex items-center justify-center gap-3">
          <span className="loading-dot w-3 h-3 rounded-full bg-gold" style={{ animationDelay: "0s" }} />
          <span className="loading-dot w-3 h-3 rounded-full bg-gold" style={{ animationDelay: "0.2s" }} />
          <span className="loading-dot w-3 h-3 rounded-full bg-gold" style={{ animationDelay: "0.4s" }} />
        </div>

        {/* Per-religion searching indicator */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          {RELIGION_ORDER.map((key) => {
            const meta = RELIGION_META[key];
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-muted-foreground"
              >
                <span className={`${meta.accentClass} text-base leading-none`}>{meta.symbol}</span>
                <span className="italic">{meta.name} kaynaklarında aranıyor…</span>
              </span>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground italic max-w-md mx-auto">
          Üç kutsal kitap taranıyor, ilgili ayetler toplanıyor. Bu birkaç saniye sürebilir.
        </p>
      </div>
    </div>
  );
}
