# birdie69-web

> Status: **Scaffold complete (Day 5)** · [birdie69](https://github.com/birdie69)

Next.js 14 App Router frontend for the birdie69 couples app. Targets web, iOS, and Android via Capacitor.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | MSAL (`@azure/msal-browser` / `@azure/msal-react`) — Azure AD B2C stub |
| Server state | TanStack Query |
| Client state | Zustand |
| Mobile | Capacitor (iOS + Android) |
| Testing | Vitest + Testing Library |

---

## Getting started

```bash
# Prerequisites: Node 20 (use nvm)
nvm use

cp .env.local.example .env.local
# Edit .env.local with your credentials

npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production static export (`out/`) |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |

---

## Mobile Development

The web app runs as a native iOS/Android app via Capacitor.

### Prerequisites

- iOS: Xcode 15+ (macOS only) — ensure `xcode-select` points to Xcode:
  ```bash
  sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
  ```
- Android: Android Studio with an AVD configured (Pixel 8, API 34 recommended)
- Both: Node.js 20+ (use `nvm use` in the repo root)

### Build and sync

```bash
npm run build        # creates out/ directory (static export)
npx cap sync         # copies out/ to native projects + runs pod install
```

> **Note:** If `npx cap sync` fails with an `xcode-select` error, set
> `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer` in your shell
> or run `sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer`.

### Run in simulator / emulator

```bash
npx cap open ios           # opens Xcode → select simulator → Cmd+R
npx cap open android       # opens Android Studio → select AVD → Run
```

### Verified builds (Sprint 3)

- iOS: iPhone 16 Simulator, iOS 18.x ✅
- Android: Pixel 8 Emulator, API 34 ✅

### Live reload (development)

Update `capacitor.config.ts` `server.url` to `http://localhost:3000`, then:

```bash
npx cap run ios --livereload
```

---

## Environment variables

See `.env.local.example` for all required variables.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_MSAL_CLIENT_ID` | Azure AD B2C application (client) ID |
| `NEXT_PUBLIC_MSAL_AUTHORITY` | B2C authority URL |
| `NEXT_PUBLIC_MSAL_REDIRECT_URI` | OAuth redirect URI |
| `NEXT_PUBLIC_API_BASE_URL` | birdie69-api base URL |

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (AuthProvider)
│   ├── page.tsx            # Home — Today's Question
│   ├── login/page.tsx      # Login page (MSAL)
│   └── (auth)/layout.tsx   # Protected layout (redirect if unauthenticated)
├── lib/auth/
│   ├── msalConfig.ts       # MSAL PublicClientApplication config
│   ├── msalInstance.ts     # Singleton MSAL instance
│   └── AuthProvider.tsx    # MsalProvider + QueryClientProvider
├── components/ui/          # shadcn/ui components
└── __tests__/
    └── HomePage.test.tsx   # Vitest unit tests
```
