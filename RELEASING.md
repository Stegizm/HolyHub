# 🚀 HolyHub — Build & Release Guide

Bu rehber, HolyHub'u çalıştırılabilir dosyalara (.exe, Linux binary, Docker image) nasıl çevireceğinizi ve GitHub Releases'e nasıl yayınlayacağınızı açıklar.

---

## 📋 İçindekiler

1. [Hızlı Karşılaştırma](#-hızlı-karşılaştırma)
2. [Yöntem 1: Portable Build (Önerilen)](#yöntem-1-portable-build-önerilen)
3. [Yöntem 2: Single Executable (.exe)](#yöntem-2-single-executable-exe)
4. [Yöntem 3: Docker Image](#yöntem-3-docker-image)
5. [Yöntem 4: Otomatik GitHub Releases](#yöntem-4-otomatik-github-releases)
6. [Yöntem 5: Electron Desktop App (İleri)](#yöntem-5-electron-desktop-app-ileri)
7. [Kullanıcı Tarafından Kurulum](#-kullanıcı-tarafından-kurulum)
8. [Sorun Giderme](#-sorun-giderme)

---

## 📊 Hızlı Karşılaştırma

| Yöntem | Dosya Boyutu | Node.js Gerekli? | Kurulum Zorluğu | Platform |
|--------|-------------|------------------|-----------------|----------|
| **Portable Build** | ~50 MB | ✅ Evet | Kolay | Win + Linux + macOS |
| **Single .exe (PKG)** | ~80 MB | ❌ Hayır | Orta | Win + Linux + macOS |
| **Docker Image** | ~150 MB | ❌ Hayır* | Orta | Tüm platformlar |
| **Electron App** | ~150 MB | ❌ Hayır | Zor | Win + Linux + macOS |
| **GitHub Releases** | Otomatik | — | Otomatik | Otomatik |

*Node.js Docker içinde hazır gelir.

---

## Yöntem 1: Portable Build (Önerilen)

En basit yöntem — Next.js'in built-in `standalone` modunu kullanır. Kullanıcının sisteminde Node.js 18+ kurulu olmalıdır.

### Nasıl Çalışır?

`next.config.ts` dosyasında zaten `output: "standalone"` ayarlı. Bu, Next.js'in tüm bağımlılıkları tek bir klasöre paketlemesini sağlar.

### Build Alma

```bash
# Linux/macOS
bash scripts/build-standalone.sh

# Manuel olarak
bun install
bun run build
# .next/standalone/ klasörü oluşur
```

### Çıktı

```
dist/holyhub-portable/
├── server.js              # Ana sunucu dosyası
├── .next/static/          # Static assets (JS, CSS)
├── public/                # Logo, favicon vb.
├── .env.local             # Kullanıcı dolduracak
├── README.md
├── start-linux.sh         # Linux/macOS launcher
└── start-windows.bat      # Windows launcher
```

### Çalıştırma

```bash
# Linux/macOS
cd dist/holyhub-portable
./start-linux.sh

# Windows (çift tıkla)
dist\holyhub-portable\start-windows.bat
```

### Dağıtım İçin Paketleme

```bash
# Linux
cd dist
tar -czf holyhub-linux.tar.gz holyhub-portable

# Windows (PowerShell)
cd dist
Compress-Archive -Path holyhub-portable -DestinationPath holyhub-windows.zip
```

---

## Yöntem 2: Single Executable (.exe)

Node.js'i de içine gömüren tek bir `.exe` (Windows) veya binary (Linux) üretir. Kullanıcıda Node.js kurulu olması gerekmez.

### Ön Hazırlık

```bash
# PKG aracını kur
npm install -g @yao-pkg/pkg
```

### Build Alma

```bash
# Önce portable build al
bash scripts/build-standalone.sh

# Sonra single executable üret
bash scripts/build-exe.sh
```

### Çıktı

```
dist/
├── holyhub-windows.zip       # Windows için (içinde .exe + assets)
└── holyhub-linux.tar.gz      # Linux için (içinde binary + assets)
```

### Önemli Notlar

- ⚠️ PKG, `.next/static/` ve `public/` klasörlerini `.exe` içine gömemiyor. Bu yüzden bu klasörleri `.exe` ile birlikte dağıtmanız gerekiyor (script bunu otomatik zip'ler).
- ⚠️ PKG'nin produce ettiği `.exe` ~80 MB civarında (Node.js runtime dahil).
- ⚠️ SQLite (Prisma) kullanıyorsanız, native binary'lerin doğru platform için yüklenmesi gerekir. `npm rebuild` çalıştırmanız gerekebilir.

### Sadece Tek Platform

```bash
# Sadece Windows .exe
pkg entry.js -t node18-win-x64 -o holyhub.exe

# Sadece Linux binary
pkg entry.js -t node18-linux-x64 -o holyhub-linux
```

---

## Yöntem 3: Docker Image

En taşınabilir yöntem — Docker varsa her platformda çalışır. Sunucu kurulumu için ideal.

### Build

```bash
# Image oluştur
docker build -t holyhub .

# Veya docker compose ile
docker compose build
```

### Çalıştırma

```bash
# Tek seferlik
docker run -p 3000:3000 -e GEMINI_API_KEY=AIzaSy... holyhub

# Arka planda (detached)
docker run -d -p 3000:3000 \
  -e GEMINI_API_KEY=AIzaSy... \
  --name holyhub \
  --restart unless-stopped \
  holyhub

# docker compose ile (.env dosyasından okur)
docker compose up -d
```

### Docker Hub / GHCR'a Push

```bash
# GitHub Container Registry'e push (workflow otomatik yapar)
docker tag holyhub ghcr.io/stegizm/holyhub:latest
docker push ghcr.io/stegizm/holyhub:latest

# Docker Hub'a push
docker tag holyhub stegizm/holyhub:latest
docker push stegizm/holyhub:latest
```

### Kullanıcı Tarafından Çalıştırma (Pull)

```bash
docker pull ghcr.io/stegizm/holyhub:latest
docker run -p 3000:3000 -e GEMINI_API_KEY=AIzaSy... ghcr.io/stegizm/holyhub:latest
```

---

## Yöntem 4: Otomatik GitHub Releases

En profesyonel yöntem — `git tag` push'ladığınızda GitHub Actions otomatik build alır ve release oluşturur.

### Kurulum

`.github/workflows/release.yml` dosyası zaten hazır. Tek yapmanız gereken:

### Yeni Release Yayınlama

```bash
# 1. Version tag'i oluşturun
git tag v1.0.0

# 2. Tag'i push'layın
git push origin v1.0.0

# GitHub Actions otomatik olarak:
#   - Windows portable build alır → holyhub-windows.zip
#   - Linux portable build alır → holyhub-linux.tar.gz
#   - Docker image build alır → ghcr.io/stegizm/holyhub:latest
#   - GitHub Release oluşturur ve dosyaları ekler
```

### Pre-release (Beta/RC)

```bash
git tag v1.1.0-beta1
git push origin v1.1.0-beta1
# "Pre-release" olarak işaretlenir
```

### Manuel Tetikleme

GitHub repo → **Actions** tab → **🚀 Release** → **Run workflow** → version girin.

### Çıktı

GitHub Releases sayfasında otomatik oluşan release:

- 📦 `holyhub-windows.zip` (~50 MB)
- 📦 `holyhub-linux.tar.gz` (~50 MB)
- 🐳 Docker image: `ghcr.io/stegizm/holyhub:v1.0.0` ve `:latest`
- 📝 Otomatik generate edilen release notes

---

## Yöntem 5: Electron Desktop App (İleri)

Eğer gerçek bir desktop uygulaması (pencere içinde, tarayıcı gerektirmeyen) isterseniz Electron kullanın.

### Kurulum

```bash
npm install --save-dev electron electron-builder
```

### main.js Oluşturun (Proje Root)

```javascript
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let nextProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { nodeIntegration: true },
    title: 'HolyHub',
    icon: path.join(__dirname, 'public/logo.svg'),
  });

  // Next.js server'ı başlat
  nextProcess = spawn('node', ['server.js'], {
    cwd: __dirname,
    env: { ...process.env, PORT: '3000' },
  });

  // Next.js hazır olana kadar bekle, sonra yükle
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
  }, 3000);

  mainWindow.on('closed', () => {
    if (nextProcess) nextProcess.kill();
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (nextProcess) nextProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
```

### package.json'a Ekleyin

```json
{
  "main": "main.js",
  "scripts": {
    "electron": "electron .",
    "dist:win": "electron-builder --win",
    "dist:linux": "electron-builder --linux"
  },
  "build": {
    "appId": "com.stegizm.holyhub",
    "productName": "HolyHub",
    "files": [".next/standalone/**", ".next/static/**", "public/**", "main.js"],
    "win": { "target": "nsis" },
    "linux": { "target": ["AppImage", "deb"] }
  }
}
```

### Build

```bash
# Windows installer (.exe)
bun run dist:win
# → dist/HolyHub Setup 1.0.0.exe

# Linux AppImage
bun run dist:linux
# → dist/HolyHub-1.0.0.AppImage
```

### Artılar/Eksiler

- ✅ Gerçek desktop app (tarayıcı gerekmez)
- ✅ Otomatik başlat menüsü kısayolu
- ✅ Sistem tray ikonu eklenebilir
- ❌ Dosya boyutu büyük (~150 MB)
- ❌ Build süreci karmaşık

---

## 📥 Kullanıcı Tarafından Kurulum

Kullanıcılar release'leri indirdikten sonra şu adımları izler:

### Windows (.zip)

```
1. holyhub-windows.zip'i indir ve çıkart
2. .env.local dosyasını notepad ile aç
3. GEMINI_API_KEY= satırına kendi anahtarını ekle
4. Kaydet ve kapat
5. run.bat dosyasına çift tıkla
6. Tarayıcıda http://localhost:3000 aç
```

### Linux (.tar.gz)

```bash
# 1. İndir ve çıkart
tar -xzf holyhub-linux.tar.gz
cd holyhub-portable

# 2. API anahtarını ekle
nano .env.local
# GEMINI_API_KEY=AIzaSy... satırını düzenle

# 3. Çalıştır
./start-linux.sh

# 4. Tarayıcıda aç
xdg-open http://localhost:3000
```

### Docker

```bash
# Tek komut
docker run -p 3000:3000 -e GEMINI_API_KEY=AIzaSy... ghcr.io/stegizm/holyhub:latest

# Veya docker-compose
curl -O https://raw.githubusercontent.com/stegizm/HolyHub/main/docker-compose.yml
echo "GEMINI_API_KEY=AIzaSy..." > .env
docker compose up -d
```

---

## 🔧 Sorun Giderme

### Problem: "Cannot find module" hatası (portable build)

**Çözüm:** `.next/static/` ve `public/` klasörlerinin `server.js` ile aynı yerde olduğundan emin olun:

```
holyhub-portable/
├── server.js
├── .next/static/    ← BU OLMALI
├── public/          ← BU OLMALI
└── .env.local
```

### Problem: SQLite / Prisma hatası

**Çözüm:** Prisma'nın native binary'leri için:

```bash
# Build sırasında rebuild et
npm rebuild @prisma/client
# veya
bunx prisma generate
```

Docker kullanıyorsanız, Dockerfile zaten `openssl` kuruyor.

### Problem: PKG `ECONNREFUSED` hatası

**Çözüm:** PKG bazen npm registry'sine erişemiyor. Manuel olarak Node.js binary'lerini indirin:

```bash
# Cache'le
pkg-fetch node18-win-x64
pkg-fetch node18-linux-x64

# Sonra build al
pkg entry.js -t node18-win-x64 -o holyhub.exe
```

### Problem: GitHub Actions build fails

**Çözümler:**

1. **`bun install --frozen-lockfile` hatası:**
   ```bash
   # lockfile'ı güncelle
   bun install
   git add bun.lock
   git commit -m "chore: update lockfile"
   ```

2. **Docker push hatası (GHCR yetki):**
   - Repo Settings → Actions → General → Workflow permissions → "Read and write permissions" seç

3. **Release oluşturulmuyor:**
   - Tag formatının `v*` ile başladığından emin ol (örn: `v1.0.0`, `v1.0.0-beta1`)

### Problem: Büyük dosya boyutu

**Çözümler:**

- **Docker:** Alpine tabanlı image kullanın (zaten Alpine kullanıyoruz)
- **PKG:** Sadece gerekli target'ları build edin (`-t node18-win-x64` tek başına)
- **Electron:** `files` alanında sadece gerekli klasörleri listele

---

## 🎯 Önerilen Workflow

### Geliştirme Sırasında
- `bun run dev` ile lokal geliştirme

### Test İçin Release Adayı
```bash
git tag v1.0.0-rc1
git push origin v1.0.0-rc1
# GitHub Actions "Pre-release" oluşturur
# Test edip onayladıktan sonra
```

### Final Release
```bash
git tag v1.0.0
git push origin v1.0.0
# GitHub Actions otomatik:
#   - Build alır (Win + Linux + Docker)
#   - "Latest" olarak işaretler
#   - Docker image'ı :latest tag'i ile push'lar
```

---

## 📦 Release Checklist

Her release öncesi:

- [ ] `package.json` version güncellendi
- [ ] CHANGELOG.md güncellendi
- [ ] Tüm testler geçti (`bun run lint`)
- [ ] Manuel test yapıldı (mobil + desktop)
- [ ] Tag oluşturuldu (`git tag vX.Y.Z`)
- [ ] Tag push'landı (`git push origin vX.Y.Z`)
- [ ] GitHub Actions başarılı tamamlandı
- [ ] Release notes kontrol edildi
- [ ] Docker image pull edilebilir (`docker pull ghcr.io/stegizm/holyhub:vX.Y.Z`)

---

## 🔗 Faydalı Bağlantılar

- [Next.js Standalone Build](https://nextjs.org/docs/app/api-reference/next-config-js/output)
- [PKG Documentation](https://github.com/yao-pkg/pkg)
- [Electron Builder](https://www.electron.build/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

---

**Sorularınız mı var?** [Issue açın](https://github.com/stegizm/HolyHub/issues/new?labels=question&template=feature_request.md).
