<div align="center">

# ☪ ✝ ✡ HolyHub

### Interfaith Wisdom — Neutral Answers from the Holy Books of Three Abrahamic Faiths
### Dinlerarası Bilgelik — Üç Semavi Dinin Kutsal Kitaplarından Tarafsız Cevaplar

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**📖 [English](#english)** · **📖 [Türkçe](#türkçe)**

</div>

---

# English

## 📖 About

**HolyHub** is a neutral, academic, and respectful web application that lets users ask questions and receive simultaneous answers from the perspectives of **Islam** (Quran & Hadith), **Christianity** (Bible), and **Judaism** (Torah & Talmud).

Google Gemini AI generates three separate answers based on each religion's own scriptures, displaying them side-by-side with the relevant verse/hadith references.

### 🎯 Why?

- Neutral guidance for those calmly researching their own faith
- An academic source for those who want to objectively learn about different beliefs
- A single screen with three perspectives for interfaith comparison
- For curious users seeking Abrahamic perspectives on existential/philosophical questions

> ⚠️ **Important:** This application is for educational and research purposes. It does not favor, compare, or criticize any religion. Answers are AI-generated; for definitive references, consult the original scriptures.

---

## ✨ Features

### 🎯 MVP Scope

| Feature | Description |
|---------|-------------|
| 🔍 **Question Input** | Auto-resize textarea, 1000-char limit, Ctrl+Enter quick submit |
| 🤖 **Gemini Integration** | Neutral system prompt, structured JSON output (responseSchema) |
| 📱 **Responsive Results** | Mobile: 3 tabs · Desktop: 3-column grid (auto-switch) |
| 📚 **History** | Last 10 questions stored on-device (localStorage), reload without API calls |
| ⚠️ **Error Handling** | 6 categories (network / api-limit / safety / parse / empty / unknown) |

### 🎁 Extra Features

- 📋 **Copy** — Copy a single answer or all answers to clipboard
- 📤 **Share** — Web Share API (mobile native) + desktop fallback
- 🖨️ **Print / PDF** — Browser print dialog for PDF export
- 🌗 **Theme Toggle** — Warm Spiritual (cream/gold) ↔ Dark (warm coffee)
- 💡 **Sample Questions** — 10 existential/philosophical question chips

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/) 1.0+
- [Google Gemini API Key](https://aistudio.google.com/app/apikey) (free)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/stegizm/HolyHub.git
cd HolyHub

# 2. Install dependencies
bun install
# or: npm install / pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Open .env.local and add your GEMINI_API_KEY

# 4. Start the dev server
bun run dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
# Google Gemini API Key (required)
# Get one for free at https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Prisma database (local file)
DATABASE_URL=file:./dev.db
```

---

## 🎨 Design

### Warm Spiritual Theme

The app uses a custom **Warm Spiritual** theme designed to create a religious-artistic atmosphere:

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Background | Cream (#faf6ef) | Warm coffee (#1a1410) |
| Accent | Gold (#c5a572) | Bright gold (#d4b681) |
| Heading font | Playfair Display | Playfair Display |
| Body font | Noto Serif | Noto Serif |
| UI font | Inter | Inter |

### Religion Colors

| Religion | Color | Hex | Symbol |
|----------|-------|-----|--------|
| Islam | Green | `#2d6b5f` | ☪ |
| Christianity | Burgundy | `#8b3a3a` | ✝ |
| Judaism | Navy | `#2c3e5c` | ✡ |
| Accent | Gold | `#c5a572` | ❧ |

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── api/ask/route.ts        # Gemini API proxy (server-side)
│   ├── layout.tsx              # Font + ThemeProvider
│   ├── page.tsx                # Home page (state management)
│   └── globals.css             # Warm Spiritual theme (light + dark)
│
├── components/
│   ├── header.tsx              # Sticky header (logo + history + theme)
│   ├── home-hero.tsx           # Welcome screen
│   ├── question-input.tsx      # Auto-resize textarea + sample questions
│   ├── loading-state.tsx       # 3-dot loading animation
│   ├── error-state.tsx         # Category-based error messages
│   ├── results-view.tsx        # Responsive (mobile tabs / desktop grid)
│   ├── religion-card.tsx       # Single religion card (symbol + answer + source)
│   ├── history-panel.tsx       # Slide-in history panel
│   ├── theme-provider.tsx      # next-themes wrapper
│   └── theme-toggle.tsx        # Dark/light toggle
│
├── lib/
│   ├── types.ts                # TypeScript type definitions
│   ├── constants.ts            # System prompt + religion metadata + samples
│   ├── gemini.ts               # Gemini client + safety + JSON validation
│   └── history.ts              # localStorage CRUD (last 10 entries)
│
└── hooks/
    └── use-toast.ts            # Toast notification hook
```

### Data Flow

```
User submits a question
        ↓
   POST /api/ask  (Next.js API route)
        ↓
   Gemini 2.0 Flash (system prompt + structured JSON)
        ↓
   JSON parse + runtime validation
        ↓
   TriFaithAnswer { islam, hristiyanlik, yahudilik }
        ↓
   Client: render 3 cards + save to localStorage
```

---

## 🤖 System Prompt

The system prompt that guarantees the app's neutrality:

```text
You are a neutral, academic, and respectful history-of-religions assistant.
You must answer the user's question from the perspectives of Islam (Quran & Hadith),
Christianity (Bible), and Judaism (Torah & Talmud) separately.

Rules:
1. Do not approach any religion with bias. Do not prefer or compare religions.
2. Each answer must be based SOLELY on that religion's own scriptures. No personal commentary.
3. In the "source" field, provide the relevant verse, surah, chapter, or hadith reference.
4. Answers should be concise, clear, and 3-6 sentences long.
5. If the question is not explicitly addressed in a religion's scriptures, state so respectfully.
6. Do not answer questions that are overly political, aggressive, or disparaging to any religion.

Output format MUST be this JSON:
{
  "islam":        { "cevap": "...", "kaynak": "..." },
  "hristiyanlik": { "cevap": "...", "kaynak": "..." },
  "yahudilik":    { "cevap": "...", "kaynak": "..." }
}
```

---

## 🛡️ Security & Ethics

### Technical Security
- 🔐 API key is kept only on the server (`/api/ask`), never sent to the client
- 🚫 Gemini's `BLOCK_MEDIUM_AND_ABOVE` safety settings enabled
- 🌡️ Low temperature (0.4) for consistent, fact-based answers
- 📋 Structured JSON output (`responseSchema`) for parse safety
- ✅ Runtime validation catches unexpected formats

### Ethical Principles
- ❌ Does not favor, compare, or criticize any religion
- ✅ Each answer is based solely on that religion's scriptures
- 🛡️ Overly political/aggressive questions are caught by safety filters
- 🔒 History stays only on your device (localStorage), never sent to the server

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) | 16 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | 4 |
| **AI** | [Google Gemini](https://ai.google.dev/) (`@google/genai`) | 2.0 Flash |
| **Theme** | [next-themes](https://github.com/pacocoursey/next-themes) | 0.4 |
| **Fonts** | Playfair Display · Noto Serif · Inter | — |
| **State** | React hooks (`useState` / `useCallback`) | — |
| **Storage** | Browser `localStorage` (for history) | — |

---

## 📱 Usage

### Main Flow

1. On the **home screen**, type your question (or click a sample question)
2. Press **"Cevapları Getir"** (Get Answers)
3. A **loading animation** appears (3 gold dots + "searching in sources" message)
4. The **results screen** opens:
   - Mobile: 3 tabs at the top (Islam · Christianity · Judaism)
   - Desktop: 3 columns side-by-side grid
5. Each card shows: **Religion symbol + name** → **Answer text** → **Sacred Reference** (colored)
6. Use the **toolbar** at the top: Copy All · Share · Print/PDF · New Question

### History

- Click the **History** icon in the top-right
- Your last 10 questions are listed (with date + 3 religion symbols)
- Click a question → answers load without an API call
- Delete individually or all at once

---

## 📜 Scripts

```bash
bun run dev         # Dev server (http://localhost:3000)
bun run build       # Production build
bun run start       # Production server
bun run lint        # ESLint check
bun run db:push     # Push Prisma schema to database
bun run db:generate # Generate Prisma client
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork this repo
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'feat: add new feature'`)
4. Push your branch (`git push origin feature/new-feature`)
5. Open a [Pull Request](https://github.com/stegizm/HolyHub/pulls)

### Contribution Guidelines

- ✅ Maintain the principle of neutrality — do not favor any religion
- ✅ Follow TypeScript and existing code style
- ✅ Add tests for new features
- ✅ Run `bun run lint` before opening a PR
- ✅ Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages

---

## 🗺️ Roadmap

### v1.1 (Soon)
- [ ] Markdown render (clickable source links)
- [ ] Multi-language UI (TR / EN / AR)
- [ ] Question categories (ethics / existential / moral)

### v1.2
- [ ] Voice question input (STT)
- [ ] Text-to-speech (TTS)
- [ ] Favorite answers

### v2.0 (Planned)
- [ ] React Native / Expo Android app
- [ ] Offline scripture mode
- [ ] User accounts and cloud sync

---

## ⚖️ License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Google Gemini](https://ai.google.dev/) — AI model
- [Next.js](https://nextjs.org/) — Framework
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [Tailwind CSS](https://tailwindcss.com/) — Styling system
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) & [Noto Serif](https://fonts.google.com/specimen/Noto+Serif) — Fonts

---

## ⚠️ Disclaimer

This application is for educational and research purposes. AI-generated answers may not always be 100% accurate. For definitive information on religious matters:

- Consult authoritative religious scholars
- Read the original scriptures
- Check academic sources

This app does not favor, compare, or criticize any religion. Its sole purpose is to make relevant references from the scriptures of the three Abrahamic faiths accessible.

---

<br>
<br>

---

# Türkçe

## 📖 Hakkında

**HolyHub**, kullanıcıların sordukları sorulara **İslam** (Kuran-ı Kerim & Hadisler), **Hristiyanlık** (İncil) ve **Yahudilik** (Tevrat & Talmud) perspektiflerinden eş zamanlı cevap alabilecekleri tarafsız, akademik ve saygılı bir web uygulamasıdır.

Google Gemini AI, her bir dinin kendi kutsal metinlerine dayanarak 3 ayrı cevap üretir; cevaplar karşılaştırmalı olarak, ilgili ayet/hadis referanslarıyla birlikte gösterilir.

### 🎯 Neden?

- Dinini serinkanlılıkla araştırmak isteyenler için tarafsız rehberlik
- Farklı inançları objektif şekilde öğrenmek isteyenler için akademik kaynak
- Dinler arası karşılaştırma yapmak isteyenler için tek ekranda 3 perspektif
- Varoluşsal/felsefi sorulara semavi perspektifler arayan meraklı kullanıcılar için

> ⚠️ **Önemli:** Bu uygulama eğitim ve araştırma amaçlıdır. Hiçbir dini tercih etmez, kıyaslamaz veya eleştirmez. Cevaplar AI tarafından üretilir; kesin referans için orijinal kutsal metinlere başvurunuz.

---

## ✨ Özellikler

### 🎯 MVP Kapsamı

| Özellik | Açıklama |
|---------|----------|
| 🔍 **Soru Sorma** | Auto-resize textarea, 1000 karakter limiti, Ctrl+Enter ile hızlı gönderim |
| 🤖 **Gemini Entegrasyonu** | Tarafsız sistem promptu, structured JSON output (responseSchema) |
| 📱 **Responsive Sonuçlar** | Mobilde 3 sekme · Masaüstünde 3 sütun grid (otomatik geçiş) |
| 📚 **Geçmiş Sorgular** | Son 10 soru cihazda (localStorage) saklanır, API çağrısı yapmadan yeniden görüntülenir |
| ⚠️ **Hata Yönetimi** | 6 kategori (network / api-limit / safety / parse / empty / unknown) için ayrı mesajlar |

### 🎁 Ek Özellikler

- 📋 **Kopyala** — Tek din veya tüm cevapları panoya kopyalama
- 📤 **Paylaş** — Web Share API (mobil native paylaşım) + desktop fallback
- 🖨️ **Yazdır / PDF** — Tarayıcı yazdırma diyaloğu ile PDF çıktısı
- 🌗 **Tema Toggle** — Spiritüel Sıcak (krem/altın) ↔ Karanlık (sıcak kahve)
- 💡 **Örnek Sorular** — 10 varoluşsal/felsefi soru kartı

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

- [Node.js](https://nodejs.org/) 18+ veya [Bun](https://bun.sh/) 1.0+
- [Google Gemini API Anahtarı](https://aistudio.google.com/app/apikey) (ücretsiz)

### Kurulum

```bash
# 1. Repoyu klonlayın
git clone https://github.com/stegizm/HolyHub.git
cd HolyHub

# 2. Bağımlılıkları yükleyin
bun install
# veya: npm install / pnpm install

# 3. Ortam değişkenlerini ayarlayın
cp .env.example .env.local
# .env.local dosyasını açın ve GEMINI_API_KEY ekleyin

# 4. Geliştirme sunucusunu başlatın
bun run dev
# veya: npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

### Ortam Değişkenleri

`.env.local` dosyasını oluşturun:

```env
# Google Gemini API Anahtarı (zorunlu)
# https://aistudio.google.com/app/apikey adresinden ücretsiz alın
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Prisma veritabanı (yerel dosya)
DATABASE_URL=file:./dev.db
```

---

## 🎨 Tasarım

### Spiritüel Sıcak Tema

Uygulama, dini-sanatsal bir atmosfer yaratmak için özel olarak tasarlanmış **Spiritüel Sıcak** tema kullanır:

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Arka plan | Krem (#faf6ef) | Sıcak kahve (#1a1410) |
| Vurgu | Altın (#c5a572) | Parlak altın (#d4b681) |
| Başlık fontu | Playfair Display | Playfair Display |
| Gövde fontu | Noto Serif | Noto Serif |
| UI fontu | Inter | Inter |

### Din Renkleri

| Din | Renk | Hex | Sembol |
|-----|------|-----|--------|
| İslam | Yeşil | `#2d6b5f` | ☪ |
| Hristiyanlık | Bordo | `#8b3a3a` | ✝ |
| Yahudilik | Lacivert | `#2c3e5c` | ✡ |
| Vurgu | Altın | `#c5a572` | ❧ |

---

## 🏗️ Mimari

```
src/
├── app/
│   ├── api/ask/route.ts        # Gemini API proxy (server-side)
│   ├── layout.tsx              # Font + ThemeProvider
│   ├── page.tsx                # Ana sayfa (state yönetimi)
│   └── globals.css             # Spiritüel Sıcak tema (light + dark)
│
├── components/
│   ├── header.tsx              # Sticky header (logo + geçmiş + tema)
│   ├── home-hero.tsx           # Karşılama ekranı
│   ├── question-input.tsx      # Auto-resize textarea + örnek sorular
│   ├── loading-state.tsx       # 3 noktalı loading animasyonu
│   ├── error-state.tsx         # Hata kategorisine göre mesaj
│   ├── results-view.tsx        # Responsive (mobil sekme / desktop grid)
│   ├── religion-card.tsx       # Tek din kartı (sembol + cevap + kaynak)
│   ├── history-panel.tsx       # Sağdan açılan geçmiş paneli
│   ├── theme-provider.tsx      # next-themes wrapper
│   └── theme-toggle.tsx        # Dark/light toggle
│
├── lib/
│   ├── types.ts                # TypeScript tip tanımları
│   ├── constants.ts            # System prompt + din meta verisi + örnek sorular
│   ├── gemini.ts               # Gemini client + güvenlik + JSON validation
│   └── history.ts              # localStorage CRUD (son 10 kayıt)
│
└── hooks/
    └── use-toast.ts            # Bildirim hook'u
```

### Veri Akışı

```
Kullanıcı soru girer
        ↓
   POST /api/ask  (Next.js API route)
        ↓
   Gemini 2.0 Flash (system prompt + structured JSON)
        ↓
   JSON parse + runtime validation
        ↓
   TriFaithAnswer { islam, hristiyanlik, yahudilik }
        ↓
   İstemci: 3 kart render + localStorage'a kaydet
```

---

## 🤖 Sistem Promptu

Uygulamanın tarafsızlığını garanti altına alan sistem promptu:

```text
Sen tarafsız, akademik ve saygılı bir dinler tarihi asistanısın.
Sana sorulan soruya İslam (Kuran-ı Kerim ve Hadisler), Hristiyanlık (İncil)
ve Yahudilik (Tevrat ve Talmud) perspektiflerinden ayrı ayrı cevap vermelisin.

Kurallar:
1. Hiçbir dine önyargılı yaklaşma. Bir dini diğerine tercih etme, kıyaslama yapma.
2. Her cevap SADECE o dinin kutsal metinlerine dayanmalıdır. Kişisel yorum ekleme.
3. "kaynak" alanında ilgili ayet, sure, bölüm veya hadis referansını ver.
4. Cevaplar sade, anlaşılır ve 3-6 cümle olmalı.
5. Eğer soru bir dinin kutsal metinlerinde açıkça ele alınmıyorsa, saygılı şekilde belirt.
6. Soru aşırı politik, saldırgan veya bir dini aşağılayıcıysa cevap verme.

Çıktı formatı KESİNLİKLE şu JSON olmalıdır:
{
  "islam":       { "cevap": "...", "kaynak": "..." },
  "hristiyanlik":{ "cevap": "...", "kaynak": "..." },
  "yahudilik":   { "cevap": "...", "kaynak": "..." }
}
```

---

## 🛡️ Güvenlik & Etik

### Teknik Güvenlik
- 🔐 API anahtarı yalnızca sunucuda (`/api/ask`) tutulur, istemciye gönderilmez
- 🚫 Gemini'nin `BLOCK_MEDIUM_AND_ABOVE` güvenlik ayarları etkin
- 🌡️ Düşük sıcaklık (0.4) ile tutarlı, gerçeklere bağlı cevaplar
- 📋 Structured JSON output (`responseSchema`) ile parse güvenliği
- ✅ Runtime validasyon ile beklenmeyen formatlar yakalanır

### Etik İlkeler
- ❌ Hiçbir dini tercih etmez, kıyaslamaz veya eleştirmez
- ✅ Her cevap yalnızca o dinin kutsal metinlerine dayanır
- 🛡️ Aşırı politik/saldırgan sorular güvenlik filtresine takılır
- 🔒 Geçmiş sorgular yalnızca cihazınızda (localStorage), sunucuya gönderilmez

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji | Sürüm |
|--------|-----------|-------|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) | 16 |
| **Dil** | [TypeScript](https://www.typescriptlang.org/) | 5 |
| **Stil** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | 4 |
| **AI** | [Google Gemini](https://ai.google.dev/) (`@google/genai`) | 2.0 Flash |
| **Tema** | [next-themes](https://github.com/pacocoursey/next-themes) | 0.4 |
| **Fontlar** | Playfair Display · Noto Serif · Inter | — |
| **State** | React hooks (`useState` / `useCallback`) | — |
| **Storage** | Browser `localStorage` (geçmiş için) | — |

---

## 📱 Kullanım

### Ana Akış

1. **Ana ekranda** merak ettiğiniz soruyu yazın (veya örnek sorulardan birine tıklayın)
2. **"Cevapları Getir"** butonuna basın
3. **Loading animasyonu** görünür (3 altın nokta + "kaynaklarda aranıyor" mesajı)
4. **Sonuç ekranı** açılır:
   - Mobilde: Üstte 3 sekme (İslam · Hristiyanlık · Yahudilik)
   - Masaüstünde: 3 sütun yan yana grid
5. Her kartta: **Din sembolü + isim** → **Cevap metni** → **Kutsal Referans** (renkli vurgu)
6. Üstteki **araç çubuğu** ile: Tümünü Kopyala · Paylaş · Yazdır/PDF · Yeni Soru

### Geçmiş

- Sağ üstteki **Geçmiş** ikonuna tıklayın
- Son 10 sorunuz listelenir (tarih + 3 din sembolü ile)
- Bir soruya tıklayın → cevaplar API çağrısı yapmadan yüklenir
- Tek tek veya toplu silebilirsiniz

---

## 📜 Scripts

```bash
bun run dev         # Geliştirme sunucusu (http://localhost:3000)
bun run build       # Production build
bun run start       # Production sunucusu
bun run lint        # ESLint kontrolü
bun run db:push     # Prisma schema'yı veritabanına uygula
bun run db:generate # Prisma client oluştur
```

---

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Lütfen aşağıdaki adımları izleyin:

1. Bu repoyu fork'layın
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. [Pull Request](https://github.com/stegizm/HolyHub/pulls) açın

### Katkı Kuralları

- ✅ Tarafsızlık ilkesini koruyun — hiçbir dini tercih etmeyin
- ✅ TypeScript ve mevcut kod stilini takip edin
- ✅ Yeni özellikler için test ekleyin
- ✅ PR açmadan önce `bun run lint` çalıştırın
- ✅ Commit mesajları için [Conventional Commits](https://www.conventionalcommits.org/) kullanın

---

## 🗺️ Yol Haritası

### v1.1 (Yakında)
- [ ] Markdown render (kaynak linkleri tıklanabilir)
- [ ] Çok-dilli UI (TR / EN / AR)
- [ ] Soru kategorileri (etik / varoluşsal / ahlaki)

### v1.2
- [ ] Sesli soru sorma (STT)
- [ ] Metin okuma (TTS)
- [ ] Cevap favorilerme

### v2.0 (Planlı)
- [ ] React Native / Expo ile Android uygulaması
- [ ] Offline kutsal kitap modu
- [ ] Kullanıcı hesapları ve bulut senkronizasyonu

---

## ⚖️ Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

---

## 🙏 Teşekkürler

- [Google Gemini](https://ai.google.dev/) — AI modeli
- [Next.js](https://nextjs.org/) — Framework
- [shadcn/ui](https://ui.shadcn.com/) — UI bileşenleri
- [Tailwind CSS](https://tailwindcss.com/) — Stil sistemi
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) & [Noto Serif](https://fonts.google.com/specimen/Noto+Serif) — Fontlar

---

## ⚠️ Sorumluluk Reddi

Bu uygulama eğitim ve araştırma amaçlıdır. AI tarafından üretilen cevaplar her zaman %100 doğru olmayabilir. Dini konularda kesin bilgi için:

- Yetkili din adamlarına başvurun
- Orijinal kutsal metinleri okuyun
- Akademik kaynakları kontrol edin

Bu uygulama herhangi bir dini taraf tutmaz, kıyaslamaz veya eleştirmez. Amacı yalnızca üç semavi dinin kutsal metinlerindeki ilgili referansları erişilebilir kılmaktır.

---

<div align="center">

**☪ ✝ ✡**

Made with care for those who seek wisdom across faiths.
İnançlar arası bilgeliği arayanlar için özenle yapıldı.

[Report Bug](https://github.com/stegizm/HolyHub/issues) · [Request Feature](https://github.com/stegizm/HolyHub/issues) · [Read Docs](https://github.com/stegizm/HolyHub/wiki)

</div>
