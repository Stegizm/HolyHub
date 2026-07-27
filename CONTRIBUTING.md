# Contributing to Kutsal Kitap Asistanı

Katkılarınız için teşekkürler! 🙏 Bu rehber, sorunsuz bir katkı süreci için hazırlanmıştır.

## 🌟 Temel İlkeler

Bu proje **tarafsızlık** ilkesine bağlıdır. Lütfen katkınızın şu ilkelere uygun olduğundan emin olun:

- ❌ Hiçbir dini tercih etmeyin, kıyaslamayın veya eleştirmeyin
- ✅ Tüm cevaplar yalnızca ilgili dinin kutsal metinlerine dayanmalıdır
- 🛡️ Saygılı ve akademik bir dil kullanın
- 🔒 Kullanıcı verileri (geçmiş) cihazda kalmalıdır, sunucuya gönderilmemelidir

## 🚀 Başlangıç

```bash
# Repoyu fork'layın ve klonlayın
git clone https://github.com/KULLANICI_ADINIZ/holy-book-assistant.git
cd holy-book-assistant

# Bağımlılıkları yükleyin
bun install

# Ortam değişkenlerini ayarlayın
cp .env.example .env.local
# GEMINI_API_KEY ekleyin

# Geliştirme sunucusunu başlatın
bun run dev
```

## 🛠️ Geliştirme Süreci

### 1. Branch Oluşturun

```bash
git checkout -b feature/yeni-ozellik
# veya
git checkout -b fix/bug-adi
```

### 2. Kod Yazın

- **TypeScript** kullanın (strict mode)
- **shadcn/ui** bileşenlerini tercih edin
- **Tailwind CSS** ile stil yapın
- Mevcut dosya yapısını takip edin

### 3. Kontrol Edin

```bash
# Lint kontrolü
bun run lint

# Type kontrolü
bun run build
```

### 4. Commit & Push

[Conventional Commits](https://www.conventionalcommits.org/) formatını kullanın:

```
feat: yeni özellik
fix: hata düzeltmesi
docs: dokümantasyon
style: format/değişiklik
refactor: kod yeniden düzenleme
test: test ekleme
chore: bakım
```

Örnek:
```bash
git commit -m "feat: cevap metinlerinde markdown render eklendi"
git push origin feature/yeni-ozellik
```

### 5. Pull Request Açın

PR açıklamasında şunları belirtin:
- 📌 Bu PR ne yapıyor?
- 🤔 Neden bu değişiklik gerekli?
- 📸 Ekran görüntüsü (UI değişikliği varsa)
- ✅ Test edildi mi?

## 📋 Kod Standartları

### TypeScript
- Strict mode aktif
- Tüm değişkenler tipli olmalı
- `any` kullanmayın
- Interface'leri `lib/types.ts` içinde tanımlayın

### React
- Function components + hooks
- `'use client'` direktifini sadece gerekli dosyalarda kullanın
- Server-side kod (API route, DB) ile client-side kodu ayırın

### Stil
- Tailwind CSS class'ları kullanın
- Custom CSS yerine Tailwind utility'leri tercih edin
- Renkler için CSS değişkenlerini (`bg-primary`, `text-foreground` vb.) kullanın
- Indigo/mavi renkleri kullanmayın (mevcut tema ile uyumsuz)

## 🧪 Test

Şu anda otomatik test yok, ancak PR göndermeden önce manuel test yapın:

- [ ] Ana sayfa render oluyor mu?
- [ ] Soru gönderilebiliyor mu?
- [ ] Loading durumu çalışıyor mu?
- [ ] Sonuç ekranı (mobil + desktop) doğru render oluyor mu?
- [ ] Geçmiş paneli açılıyor/kapanıyor mu?
- [ ] Tema toggle çalışıyor mu?
- [ ] Hata durumu düzgün gösteriliyor mu?

## 🐛 Bug Report

Bug bulduysanız, [issue açın](../../issues/new?labels=bug&template=bug_report.md) ve şunları ekleyin:

- **Açıklama**: Bug nedir?
- **Yeniden üretme adımları**: 1, 2, 3...
- **Beklenen davranış**: Ne olmalıydı?
- **Gerçek davranış**: Ne oldu?
- **Ekran görüntüsü**: Varsa
- **Ortam**: OS, tarayıcı, cihaz

## 💡 Feature Request

Yeni özellik önermek için [issue açın](../../issues/new?labels=enhancement&template=feature_request.md):

- **Özellik**: Ne öneriyorsunuz?
- **Motivasyon**: Neden gerekli?
- **Alternatifler**: Başka çözüm yolu var mı?

## 📞 İletişim

Soru sormak için issue açmaktan çekinmeyin. Dini hassasiyet içeren konularda lütfen özellikle saygılı bir dil kullanın.

---

Teşekkürler! ☪ ✝ ✡
