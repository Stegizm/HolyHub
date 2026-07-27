"use client";

import { AlertTriangle, RefreshCw, Home, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApiError, ErrorKind } from "@/lib/types";

interface ErrorStateProps {
  error: ApiError;
  question?: string;
  onRetry?: () => void;
  onHome: () => void;
  onOpenApiKey?: () => void;
}

const ERROR_ICONS: Record<ErrorKind, string> = {
  network: "📡",
  "api-limit": "⏳",
  safety: "🛡️",
  parse: "⚙️",
  empty: "✍️",
  "no-api-key": "🔑",
  "invalid-api-key": "🚫",
  unknown: "❓",
};

const ERROR_TITLES: Record<ErrorKind, string> = {
  network: "Bağlantı Sorunu",
  "api-limit": "API Limiti Aşıldı",
  safety: "Güvenlik Filtresi",
  parse: "Yanıt Hatası",
  empty: "Soru Eksik",
  "no-api-key": "API Anahtarı Gerekli",
  "invalid-api-key": "Geçersiz API Anahtarı",
  unknown: "Beklenmedik Hata",
};

export function ErrorState({
  error,
  question,
  onRetry,
  onHome,
  onOpenApiKey,
}: ErrorStateProps) {
  // Show an "API anahtarını düzenle" button if this is an API key problem
  const isApiKeyError =
    error.kind === "no-api-key" || error.kind === "invalid-api-key";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 sm:p-8 space-y-5 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-xl font-semibold text-foreground flex items-center justify-center gap-2">
            <span aria-hidden>{ERROR_ICONS[error.kind]}</span>
            {ERROR_TITLES[error.kind]}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line break-words">
            {error.message}
          </p>
        </div>

        {question && (
          <div className="text-xs text-muted-foreground italic border-l-2 border-border pl-3 text-left">
            Soru: “{question}”
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="rounded-full bg-primary text-primary-foreground hover:opacity-90 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Tekrar Dene
            </Button>
          )}
          {isApiKeyError && onOpenApiKey && (
            <Button
              onClick={onOpenApiKey}
              className="rounded-full bg-gold text-white hover:bg-gold/90 gap-2"
            >
              <KeyRound className="h-4 w-4" />
              API Anahtarını Düzenle
            </Button>
          )}
          <Button
            onClick={onHome}
            variant="outline"
            className="rounded-full gap-2 border-border hover:bg-gold-soft hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            Ana Sayfa
          </Button>
        </div>
      </div>
    </div>
  );
}
