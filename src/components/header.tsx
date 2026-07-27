"use client";

import { useEffect, useState } from "react";
import { BookOpenText, History, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { ApiKeyDialog } from "./api-key-dialog";
import { hasApiKey } from "@/lib/api-key";

interface HeaderProps {
  onOpenHistory: () => void;
  historyCount: number;
  /** Notify parent when the API key was saved/removed so the home view can react. */
  onApiKeyChange?: (hasKey: boolean) => void;
}

export function Header({
  onOpenHistory,
  historyCount,
  onApiKeyChange,
}: HeaderProps) {
  const [apiOpen, setApiOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  // Sync localStorage presence into local state on mount and when dialog closes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasKey(hasApiKey());
  }, [apiOpen]);

  const handleSaved = () => {
    const next = hasApiKey();
    setHasKey(next);
    onApiKeyChange?.(next);
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/60 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-primary flex items-center justify-center shadow-sm">
            <BookOpenText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base sm:text-lg font-semibold text-foreground">
              Kutsal Kitap Asistanı
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground italic">
              Üç dinin bilgeliigi · Tarafsız rehber
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setApiOpen(true)}
            className="rounded-full hover:bg-gold-soft hover:text-gold relative"
            aria-label="Gemini API anahtarı"
            title={
              hasKey
                ? "API anahtarı kayıtlı — değiştirmek için tıklayın"
                : "API anahtarı gerekli — eklemek için tıklayın"
            }
          >
            <KeyRound
              className={`h-4 w-4 ${hasKey ? "text-green-500" : "text-orange-500"}`}
            />
            {!hasKey && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-gold-soft hover:text-gold gap-2"
            onClick={onOpenHistory}
            aria-label="Geçmiş sorgular"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Geçmiş</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-medium">
                {historyCount}
              </span>
            )}
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <ApiKeyDialog
        open={apiOpen}
        onOpenChange={setApiOpen}
        onSaved={handleSaved}
      />
    </header>
  );
}
