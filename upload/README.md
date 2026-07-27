<div align="center">

# ☪ ✝ ✡ Kutsal Kitap Asistanı

### Dinlerarası Bilgelik — Üç Semavi Dinin Kutsal Kitaplarından Tarafsız Cevaplar

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## 📖 Hakkında

**Kutsal Kitap Asistanı**, kullanıcıların sordukları sorulara **İslam** (Kuran-ı Kerim & Hadisler), **Hristiyanlık** (İncil) ve **Yahudilik** (Tevrat & Talmud) perspektiflerinden eş zamanlı cevap alabilecekleri tarafsız, akademik ve saygılı bir web uygulamasıdır.

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
| 🤖 **Gemini Entegrasyonu** | Tarafsız Türkçe sistem promptu, structured JSON output (responseSchema) |
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
bun run dev        # Geliştirme sunucusu (http://localhost:3000)
bun run build      # Production build
bun run start      # Production sunucusu
bun run lint       # ESLint kontrolü
bun run db:push    # Prisma schema'yı veritabanına uygula
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

[Report Bug](https://github.com/stegizm/HolyHub/issues) · [Request Feature](https://github.com/stegizm/HolyHub/issues) · [Read Docs](https://github.com/stegizm/HolyHub/wiki)

</div>
