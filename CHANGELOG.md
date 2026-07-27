# Changelog

All notable changes to HolyHub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Markdown render for clickable source references
- Multi-language UI (TR / EN / AR)
- Question categories (ethics / existential / moral)

---

## [1.1.1] — 2026-07-28

### 🐛 Bug Fixes

#### Fixed: Misclassification of API-key errors as "rate limit"
- **Root cause**: The `classifyError()` function checked the rate-limit branch before the API-key branch, and the rate-limit matcher accepted any error containing the word `"resource"`. Google's invalid-API-key errors often contain phrases like `"Resource not found"` or `"API key not valid"` — these were misclassified as `api-limit`, showing "Sunucu Yoğun" when the real problem was an invalid key.
- **Fix**:
  - Reordered checks — API-key branch is now evaluated BEFORE rate-limit branch.
  - Tightened rate-limit matcher to only catch specific signals: `rate_limit`, `quota`, `429`, `resource_exhausted`, `too many requests`. Generic `"resource"` substring no longer matches.
  - Expanded API-key matcher to also catch `404`, `permission`, `forbidden`, `invalid_api_key`, and `apikey` variants.
- **Effect**: When a user enters an invalid API key, they now correctly see `"Geçersiz API Anahtarı"` with a "API Anahtarını Düzenle" button instead of the misleading "Sunucu Yoğun" message.

#### Improved: Error messages now include raw error detail
- All classified error messages now append the original error text (truncated to 120 chars) inside `(Detay: ...)` so users and devs can see the actual cause without opening browser dev tools.

#### Added: "API Anahtarını Düzenle" button on API-key errors
- The error screen now shows a gold "API Anahtarını Düzenle" button when the error is `no-api-key` or `invalid-api-key`, opening the API key dialog directly.

#### Improved: Rate-limit message now explains the actual free-tier limits
- Updated text mentions "15 istek/dakika ve 1500 istek/gün" so users know the exact quota and how long to wait.

---

## [1.1.0] — 2026-07-28

### 🔑 User-Provided API Key (Client-Side Mode)

#### Changed
- **Breaking change to API key handling**: The server no longer holds a long-lived `GEMINI_API_KEY` environment variable. Instead, each user supplies their own Gemini API key via a secure in-app dialog.
- The key is stored **only** in the user's browser `localStorage` and is forwarded per-request to `/api/ask`, which proxies it to Gemini and discards it immediately.

#### Added
- **API Key dialog** (`src/components/api-key-dialog.tsx`) — modal with:
  - Password-style masked input with show/hide toggle
  - Direct link to Google AI Studio for free key generation
  - Save / Clear / Replace actions
  - Validation feedback
- **Key icon in header** — green when a key is set, orange (with pulsing dot) when missing
- **Friendly warning banner** on home screen when no key is set
- **New error categories**: `no-api-key` and `invalid-api-key` with dedicated Turkish messages
- **Health-check version field** — `GET /api/ask` now returns `{ version: "1.1.0" }`

#### Removed
- Dependency on `GEMINI_API_KEY` server environment variable for normal operation

#### Migration from v1.0
- If you previously deployed with `GEMINI_API_KEY` in your Vercel env vars, you can safely delete it — it is no longer used at runtime.
- On first visit, users will be prompted to enter their own key. A link to Google AI Studio is provided in the dialog.

---

## [1.0.0] — 2026-07-28

### 🎉 Initial Release

#### Added
- **Tri-faith answering system** — simultaneous answers from Islam (Quran & Hadith), Christianity (Bible), and Judaism (Torah & Talmud) perspectives
- **Gemini 2.0 Flash integration** with neutral, academic, respectful system prompt
- **Structured JSON output** via `responseSchema` for reliable parsing
- **Safety filters** at `BLOCK_MEDIUM_AND_ABOVE` threshold
- **Warm Spiritual theme** — cream/gold light mode + warm coffee dark mode
- **Responsive result display**:
  - Mobile: 3-tab interface (Islam · Christianity · Judaism)
  - Desktop: 3-column grid layout
- **Question input** with auto-resize textarea, 1000-char limit, Ctrl+Enter submit
- **10 sample existential/philosophical questions**
- **History panel** — last 10 questions stored in localStorage, reload without API calls
- **Error handling** — 6 categories (network / api-limit / safety / parse / empty / unknown)
- **Copy** — single answer or all answers to clipboard
- **Share** — Web Share API for mobile native sharing, desktop clipboard fallback
- **Print / PDF** — browser print dialog integration
- **Theme toggle** — light/dark mode with `next-themes`
- **Loading animation** — 3 pulsing gold dots with per-religion "searching" indicators

#### Technical
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5 (strict)
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York style)
- **AI**: Google Gemini (`@google/genai` v2.12)
- **Fonts**: Playfair Display (headings) · Noto Serif (body) · Inter (UI)
- **State**: React hooks (`useState`, `useCallback`)
- **Storage**: Browser `localStorage` for history
- **Architecture**: MVVM-inspired with `lib/` for business logic, `components/` for UI

#### Security
- API key kept server-side only (`/api/ask` route)
- Runtime JSON validation catches malformed Gemini responses
- Low temperature (0.4) for consistent, fact-based answers
- No user tracking, no analytics, no cookies

#### Documentation
- Bilingual README (English + Türkçe)
- CONTRIBUTING.md with contribution guidelines
- RELEASING.md with build & distribution guide
- GitHub issue templates (bug report, feature request)
- GitHub pull request template

---

## Version Naming Convention

- `v1.0.0` — Major release
- `v1.0.1` — Bug fix
- `v1.1.0` — New feature (backward compatible)
- `v2.0.0` — Breaking change
- `v1.0.0-beta1` — Pre-release beta
- `v1.0.0-rc1` — Release candidate

---

[Unreleased]: https://github.com/stegizm/HolyHub/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/stegizm/HolyHub/releases/tag/v1.1.1
[1.1.0]: https://github.com/stegizm/HolyHub/releases/tag/v1.1.0
[1.0.0]: https://github.com/stegizm/HolyHub/releases/tag/v1.0.0
