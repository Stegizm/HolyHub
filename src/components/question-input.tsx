"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SampleQuestions } from "./sample-questions";

interface QuestionInputProps {
  onSubmit: (q: string) => void;
  disabled?: boolean;
  initialValue?: string;
}

const PLACEHOLDER = "Merak ettiğini sor... Örneğin: Affedilmenin yolu nedir?";
const MAX_LEN = 1000;

export function QuestionInput({ onSubmit, disabled, initialValue = "" }: QuestionInputProps) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync external initialValue (e.g. when user picks a sample question)
  // into local state. The lint rule flags this, but it is the simplest
  // correct pattern for "controlled-from-parent" text inputs.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialValue) setValue(initialValue);
  }, [initialValue]);

  // Auto-resize the textarea up to a max height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [value]);

  const trimmed = value.trim();
  const canSubmit = trimmed.length > 0 && !disabled;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_LEN))}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          disabled={disabled}
          rows={3}
          className="min-h-[120px] resize-none rounded-2xl border-border bg-card text-base leading-relaxed font-serif placeholder:text-muted-foreground/70 placeholder:italic focus-visible:ring-gold focus-visible:border-gold pr-12"
          aria-label="Soru metni"
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={() => setValue("")}
            aria-label="Soruyu temizle"
            className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Eraser className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {value.length}/{MAX_LEN} · <span className="hidden sm:inline">Ctrl+Enter ile gönder</span>
          <span className="sm:hidden">Enter'a bas</span>
        </span>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          size="lg"
          className="rounded-full bg-gradient-to-r from-primary to-gold text-primary-foreground hover:opacity-90 shadow-md px-6 gap-2 font-medium"
        >
          Cevapları Getir
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <SampleQuestions onPick={(q) => setValue(q)} disabled={disabled} />
    </div>
  );
}
