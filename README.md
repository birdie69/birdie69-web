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

## Capacitor (mobile)

After `npm run build`, the static output is in `out/`. Add native platforms:

```bash
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios      # opens Xcode
npx cap open android  # opens Android Studio
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
