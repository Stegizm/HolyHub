"use client";

import { useState } from "react";
import { Share2, Printer, Copy, Check, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReligionCard } from "./religion-card";
import { RELIGION_ORDER, RELIGION_META } from "@/lib/constants";
import type { TriFaithAnswer } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ResultsViewProps {
  question: string;
  answer: TriFaithAnswer;
  onAskNew: () => void;
  onGoHome: () => void;
}

export function ResultsView({ question, answer, onAskNew, onGoHome }: ResultsViewProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const { toast } = useToast();

  const handleCopyAll = async () => {
    let text = `Soru: ${question}\n\n`;
    for (const key of RELIGION_ORDER) {
      const meta = RELIGION_META[key];
      const a = answer[key];
      text += `${meta.symbol} ${meta.name}\n${a.cevap}\nKaynak: ${a.kaynak}\n\n`;
    }
    try {
      await navigator.clipboard.writeText(text.trim());
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1800);
      toast({ title: "Kopyalandı", description: "Tüm cevaplar panoya kopyalandı." });
    } catch {
      toast({ title: "Hata", description: "Kopyalama başarısız.", variant: "destructive" });
    }
  };

  const handleShare = async () => {
    let text = `Soru: ${question}\n\n`;
    for (const key of RELIGION_ORDER) {
      const meta = RELIGION_META[key];
      const a = answer[key];
      text += `${meta.symbol} ${meta.name}\n${a.cevap}\nKaynak: ${a.kaynak}\n\n`;
    }
    const shareData = {
      title: "Kutsal Kitap Asistanı — Üç Dinin Cevabı",
      text: text.trim(),
    };
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(text.trim());
        toast({ title: "Paylaşım desteklenmiyor", description: "İçerik panoya kopyalandı." });
      }
    } catch {
      // user cancelled or error
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Question banner — sticky, visible during scroll */}
      <div className="no-print sticky top-16 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-background/90 backdrop-blur-sm border-b border-border/60">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest text-gold font-medium mb-0.5">
              Sorulan Soru
            </p>
            <p className="font-display text-base sm:text-lg text-foreground italic leading-snug line-clamp-2">
              “{question}”
            </p>
          </div>
        </div>
      </div>

      {/* Print-only header — shows the question full, no truncation */}
      <div className="hidden print-block print:mb-4">
        <h1 className="font-display text-2xl">Soru: {question}</h1>
        <p className="text-sm text-muted-foreground">
          Üç dinin kutsal kitaplarından cevaplar — {new Date().toLocaleDateString("tr-TR")}
        </p>
      </div>

      {/* Action toolbar */}
      <div className="no-print flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyAll}
          className="rounded-full gap-2 border-border hover:bg-gold-soft hover:text-foreground"
        >
          {copiedAll ? <Check className="h-4 w-4 text-islam" /> : <Copy className="h-4 w-4" />}
          <span className="hidden sm:inline">Tümünü Kopyala</span>
          <span className="sm:hidden">Kopyala</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="rounded-full gap-2 border-border hover:bg-gold-soft hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Paylaş</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="rounded-full gap-2 border-border hover:bg-gold-soft hover:text-foreground"
        >
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">Yazdır / PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onAskNew}
          className="rounded-full gap-2 border-border hover:bg-gold-soft hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Yeni Soru</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onGoHome}
          className="rounded-full gap-2 hover:bg-gold-soft hover:text-foreground"
        >
          <Home className="h-4 w-4" />
        </Button>
      </div>

      {/* ============================================
          MOBILE: Tabs (one religion at a time)
          DESKTOP (md+): 3-column grid
          ============================================ */}
      {/* Mobile tabs */}
      <div className="md:hidden">
        <Tabs defaultValue="islam" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted p-1 h-auto">
            {RELIGION_ORDER.map((key) => {
              const meta = RELIGION_META[key];
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="rounded-full py-2 text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5"
                >
                  <span aria-hidden className="text-base leading-none">
                    {meta.symbol}
                  </span>
                  <span>{meta.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {RELIGION_ORDER.map((key) => (
            <TabsContent key={key} value={key} className="mt-4">
              <ReligionCard religionKey={key} answer={answer[key]} />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Desktop 3-column grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-5">
        {RELIGION_ORDER.map((key, i) => (
          <ReligionCard
            key={key}
            religionKey={key}
            answer={answer[key]}
            index={i}
          />
        ))}
      </div>

      {/* Ornamental divider */}
      <div className="ornament-divider py-4 no-print">
        <span className="text-gold text-sm" aria-hidden>
          ❧
        </span>
      </div>

      {/* Footer actions */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-center gap-3 pb-4">
        <Button
          onClick={onAskNew}
          size="lg"
          className="rounded-full bg-gradient-to-r from-primary to-gold text-primary-foreground hover:opacity-90 shadow-md px-6 gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Yeni Bir Soru Sor
        </Button>
      </div>
    </div>
  );
}
