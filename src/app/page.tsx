"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/header";
import { HomeHero } from "@/components/home-hero";
import { QuestionInput } from "@/components/question-input";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { ResultsView } from "@/components/results-view";
import { HistoryPanel } from "@/components/history-panel";
import {
  addToHistory,
  getHistory,
  removeFromHistory,
  clearHistory,
} from "@/lib/history";
import type {
  AppView,
  HistoryEntry,
  TriFaithAnswer,
  ApiError,
} from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [view, setView] = useState<AppView>("home");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<TriFaithAnswer | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  // Load history on mount — localStorage is an external system,
  // so syncing into state via effect is the correct pattern here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(getHistory());
  }, []);

  const handleSubmit = useCallback(
    async (q: string) => {
      setQuestion(q);
      setView("loading");
      setError(null);
      setAnswer(null);

      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q }),
        });

        const data = await res.json();

        if (!res.ok) {
          // data is an ApiError
          setError(data as ApiError);
          setView("error");
          return;
        }

        // data is TriFaithAnswer
        const ans = data as TriFaithAnswer;
        setAnswer(ans);
        setView("results");

        // Save to history
        const entry = addToHistory(q, ans);
        setHistory((prev) => [entry, ...prev].slice(0, 10));

        toast({
          title: "Cevaplar hazır",
          description: "Üç dinin perspektifi başarıyla getirildi.",
        });
      } catch (e) {
        // Network / unexpected
        const err: ApiError = {
          kind: "network",
          message:
            "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin ve tekrar deneyin.",
        };
        setError(err);
        setView("error");
      }
    },
    [toast],
  );

  const handleRetry = useCallback(() => {
    if (question) handleSubmit(question);
  }, [question, handleSubmit]);

  const handleAskNew = useCallback(() => {
    setView("home");
    setAnswer(null);
    setError(null);
    setInputValue("");
  }, []);

  const handleGoHome = useCallback(() => {
    setView("home");
    setAnswer(null);
    setError(null);
    setQuestion("");
    setInputValue("");
  }, []);

  const handleSelectHistory = useCallback((entry: HistoryEntry) => {
    setQuestion(entry.question);
    setAnswer(entry.answer);
    setError(null);
    setView("results");
    // Scroll to top for fresh view
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const handleRemoveHistory = useCallback((id: string) => {
    const next = removeFromHistory(id);
    setHistory(next);
    toast({ title: "Silindi", description: "Soru geçmişten kaldırıldı." });
  }, [toast]);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
    toast({ title: "Geçmiş temizlendi", description: "Tüm sorgular silindi." });
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Header
        onOpenHistory={() => setHistoryOpen(true)}
        historyCount={history.length}
      />

      <main className="flex-1">
        {view === "home" && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
            <HomeHero onPick={(q) => setInputValue(q)} />

            <div className="ornament-divider">
              <span className="text-gold text-sm" aria-hidden>❧</span>
            </div>

            <QuestionInput
              onSubmit={handleSubmit}
              initialValue={inputValue}
            />

            {/* Trust footer */}
            <div className="pt-4 text-center space-y-2">
              <p className="text-xs text-muted-foreground italic max-w-md mx-auto leading-relaxed">
                Tüm cevaplar Gemini AI tarafından ilgili dinin kutsal
                metinlerine dayanarak üretilir. Tarafsız ve saygılı bir
                rehberlik sunmayı hedefler; herhangi bir dini tercih etmez.
              </p>
            </div>
          </div>
        )}

        {view === "loading" && <LoadingState question={question} />}

        {view === "error" && error && (
          <ErrorState
            error={error}
            question={question}
            onRetry={handleRetry}
            onHome={handleGoHome}
          />
        )}

        {view === "results" && answer && (
          <ResultsView
            question={question}
            answer={answer}
            onAskNew={handleAskNew}
            onGoHome={handleGoHome}
          />
        )}
      </main>

      <footer className="mt-auto border-t border-border/60 bg-card/30 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center">
          <p className="text-[11px] text-muted-foreground">
            Kutsal Kitap Asistanı · Tarafsız · Akademik · Saygılı
          </p>
          <p className="text-[10px] text-muted-foreground/70 mt-0.5 italic">
            Bu uygulama eğitim ve araştırma amaçlıdır; herhangi bir dini
            taraf tutmaz.
          </p>
        </div>
      </footer>

      <HistoryPanel
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        entries={history}
        onSelect={handleSelectHistory}
        onRemove={handleRemoveHistory}
        onClearAll={handleClearHistory}
      />
    </div>
  );
}
