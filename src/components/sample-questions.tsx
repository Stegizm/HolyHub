"use client";

import { Sparkles } from "lucide-react";
import { SAMPLE_QUESTIONS } from "@/lib/constants";

interface SampleQuestionsProps {
  onPick: (q: string) => void;
  disabled?: boolean;
}

export function SampleQuestions({ onPick, disabled }: SampleQuestionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-gold" />
        <span className="text-xs font-medium uppercase tracking-wider">
          İlham veren sorular
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={disabled}
            onClick={() => onPick(q)}
            className="px-3 py-1.5 text-sm rounded-full border border-border bg-card hover:bg-gold-soft hover:border-gold hover:text-foreground text-foreground/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
