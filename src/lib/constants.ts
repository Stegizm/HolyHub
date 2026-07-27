// Application constants — system prompt, sample questions, religion metadata
// Uygulama sabitleri — sistem promptu, örnek sorular, din meta verileri

import type { ReligionKey } from "./types";

/**
 * The system prompt sent to Gemini.
 *
 * Design goals:
 *  - Neutral, academic, respectful tone
 *  - Each religion answered from its own scripture only
 *  - Forces JSON output for reliable parsing
 *  - Turkish language (matches UI)
 */
export const SYSTEM_PROMPT = `Sen tarafsız, akademik ve saygılı bir dinler tarihi asistanısın. Sana sorulan soruya İslam (Kuran-ı Kerim ve Hadisler), Hristiyanlık (İncil) ve Yahudilik (Tevrat ve Talmud) perspektiflerinden ayrı ayrı cevap vermelisin.

Kurallar:
1. Hiçbir dine önyargılı yaklaşma. Bir dini diğerine tercih etme, kıyaslama yapma veya eleştirme.
2. Her cevap SADECE o dinin kutsal metinlerine dayanmalıdır. Kişisel yorum ekleme.
3. "kaynak" alanında ilgili ayet, sure, bölüm veya hadis referansını ver (örn: "Bakara 2:255", "Matta 5:9", "Tevrat Çıkış 20:13").
4. Cevaplar sade, anlaşılır ve 3-6 cümle olmalı. Akademik ama erişilebilir bir dil kullan.
5. Eğer soru bir dinin kutsal metinlerinde açıkça ele alınmıyorsa, bunu saygılı bir şekilde belirt: "Bu konuda [Din] kutsal metinlerinde doğrudan bir referans bulunmamaktadır."
6. Soru aşırı politik, saldırgan veya bir dini aşağılayıcıysa cevap verme.

Çıktı formatı KESİNLİKLE şu JSON olmalıdır (başka metin ekleme, markdown kullanma):
{
  "islam": {
    "cevap": "İslam perspektifinden cevap metni",
    "kaynak": "İlgili ayet/hadis referansı"
  },
  "hristiyanlik": {
    "cevap": "Hristiyanlık perspektifinden cevap metni",
    "kaynak": "İlgili ayet referansı"
  },
  "yahudilik": {
    "cevap": "Yahudilik perspektifinden cevap metni",
    "kaynak": "İlgili ayet referansı"
  }
}`;

/** Sample existential / philosophical questions shown as chips */
export const SAMPLE_QUESTIONS: string[] = [
  "Ölümden sonra hayat var mı?",
  "Affedilmenin yolu nedir?",
  "Tanrı'yı nasıl tanırız?",
  "Adalet ne demektir?",
  "İnsanın amacı nedir?",
  "Kötülük neden var?",
  "Sabır ve direnmek neden değerlidir?",
  "Komşuya karşı sorumluluklarımız nelerdir?",
  "Bilgelik nasıl kazanılır?",
  "Anne-babaya karşı görevlerimiz nelerdir?",
];

/** Religion metadata — display names, symbols, descriptions */
export const RELIGION_META: Record<
  ReligionKey,
  {
    key: ReligionKey;
    name: string;
    englishName: string;
    symbol: string; // unicode symbol
    scripture: string; // primary scripture
    scriptureExtra: string; // secondary sources
    description: string;
    accentClass: string; // tailwind text color
    bgClass: string; // tailwind bg color
    borderClass: string;
    badgeClass: string; // badge bg + text
    softBgClass: string;
  }
> = {
  islam: {
    key: "islam",
    name: "İslam",
    englishName: "Islam",
    symbol: "☪",
    scripture: "Kuran-ı Kerim",
    scriptureExtra: "Hadisler",
    description: "Allah'ın son vahyi, Hz. Muhammed aracılığıyla",
    accentClass: "text-islam",
    bgClass: "bg-islam",
    borderClass: "border-islam/30",
    badgeClass: "bg-islam text-islam-foreground",
    softBgClass: "bg-islam-soft",
  },
  hristiyanlik: {
    key: "hristiyanlik",
    name: "Hristiyanlık",
    englishName: "Christianity",
    symbol: "✝",
    scripture: "İncil",
    scriptureExtra: "Eski & Yeni Antlaşma",
    description: "İsa Mesih'in öğretileri ve öğrencileri",
    accentClass: "text-christianity",
    bgClass: "bg-christianity",
    borderClass: "border-christianity/30",
    badgeClass: "bg-christianity text-christianity-foreground",
    softBgClass: "bg-christianity-soft",
  },
  yahudilik: {
    key: "yahudilik",
    name: "Yahudilik",
    englishName: "Judaism",
    symbol: "✡",
    scripture: "Tevrat",
    scriptureExtra: "Talmud & Midraş",
    description: "Musa'ya verilen Torah ve rabbinik geleneği",
    accentClass: "text-judaism",
    bgClass: "bg-judaism",
    borderClass: "border-judaism/30",
    badgeClass: "bg-judaism text-judaism-foreground",
    softBgClass: "bg-judaism-soft",
  },
};

/** Ordered list of religion keys — useful for iteration */
export const RELIGION_ORDER: ReligionKey[] = ["islam", "hristiyanlik", "yahudilik"];

/** LocalStorage key for history entries */
export const HISTORY_STORAGE_KEY = "holy-book-assistant-history";
/** Maximum number of history entries to keep */
export const MAX_HISTORY = 10;
