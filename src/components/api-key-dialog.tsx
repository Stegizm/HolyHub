"use client";

/**
 * API Key dialog — lets the user paste their own Gemini API key.
 * The key is persisted to localStorage ONLY; it is never stored server-side.
 *
 * API Anahtarı penceresi — kullanıcı kendi Gemini API anahtarını girer.
 * Anahtar yalnızca localStorage'da saklanır; sunucuda tutulmaz.
 */

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Trash2,
} from "lucide-react";
import { clearApiKey, getApiKey, setApiKey } from "@/lib/api-key";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

export function ApiKeyDialog({
  open,
  onOpenChange,
  onSaved,
}: ApiKeyDialogProps) {
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    if (open) {
      const existing = getApiKey();
      setKey(existing ?? "");
      setHasExisting(!!existing);
      setSaved(false);
      setShow(false);
    }
  }, [open]);

  const handleSave = () => {
    if (!key.trim()) return;
    setApiKey(key);
    setSaved(true);
    setHasExisting(true);
    onSaved?.();
    setTimeout(() => onOpenChange(false), 700);
  };

  const handleClear = () => {
    clearApiKey();
    setKey("");
    setHasExisting(false);
    setSaved(false);
    onSaved?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <KeyRound className="h-5 w-5 text-gold" />
            Gemini API Anahtarı
          </DialogTitle>
          <DialogDescription>
            Cevapları almak için kendi Google Gemini API anahtarınızı girin.
            Anahtarınız yalnızca bu tarayıcıda saklanır; sunucumuza
            kaydedilmez.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={show ? "text" : "password"}
                placeholder="AIzaSy..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && key.trim()) handleSave();
                }}
                className="pr-10 font-mono text-sm"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={show ? "Gizle" : "Göster"}
              >
                {show ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gold hover:underline inline-flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            Google AI Studio'dan ücretsiz API anahtarı alın
          </a>

          {hasExisting && (
            <p className="text-[11px] text-muted-foreground italic">
              Kayıtlı bir anahtar bulunuyor. Yeni bir anahtar girip
              kaydederseniz eskisi değiştirilir.
            </p>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          {hasExisting && (
            <Button
              variant="ghost"
              onClick={handleClear}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Temizle
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={!key.trim() || saved}
            className="bg-gold text-white hover:bg-gold/90"
          >
            {saved ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Kaydedildi
              </>
            ) : (
              "Kaydet"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
