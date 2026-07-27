"use client";

import { BookOpenText, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  onOpenHistory: () => void;
  historyCount: number;
}

export function Header({ onOpenHistory, historyCount }: HeaderProps) {
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
              Üç dinin bilgeliği · Tarafsız rehber
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
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
    </header>
  );
}
