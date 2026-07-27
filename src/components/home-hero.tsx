"use client";

import { ReligionCard } from "./religion-card";

interface HomeHeroProps {
  onPick: (q: string) => void;
}

const PREVIEW_QUESTIONS = [
  "Affedilmenin yolu nedir?",
  "İnsanın amacı nedir?",
  "Adalet ne demektir?",
];

export function HomeHero({ onPick }: HomeHeroProps) {
  return (
    <div className="text-center space-y-5">
      {/* Decorative symbol row */}
      <div className="flex items-center justify-center gap-6 text-3xl sm:text-4xl">
        <span className="text-islam" aria-hidden>☪</span>
        <span className="text-gold/60 text-sm" aria-hidden>❧</span>
        <span className="text-christianity" aria-hidden>✝</span>
        <span className="text-gold/60 text-sm" aria-hidden>❧</span>
        <span className="text-judaism" aria-hidden>✡</span>
      </div>

      <div className="space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground leading-tight">
          Üç Dinin
          <span className="block bg-gradient-to-r from-islam via-gold to-christianity bg-clip-text text-transparent">
            Bilgelik Hazinesi
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed font-serif">
          Aklınızdaki soruyu yazın; İslam, Hristiyanlık ve Yahudilik kutsal
          kitaplarından tarafsız, saygılı ve akademik cevaplar eş zamanlı
          karşınızda.
        </p>
      </div>

      {/* Mini preview — what to expect */}
      <div className="hidden sm:flex items-center justify-center gap-2 text-xs text-muted-foreground italic">
        <span>Üç kutsal kitap</span>
        <span className="text-gold">·</span>
        <span>tek soru</span>
        <span className="text-gold">·</span>
        <span>karşılaştırmalı cevap</span>
      </div>
    </div>
  );
}
