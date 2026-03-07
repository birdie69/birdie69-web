# birdie69-web

> Next.js 14+ web application + Capacitor mobile wrapper for **birdie69**.

**Status:** Scaffold pending (Day 5)

---

## Overview

Single codebase serving:
- **Web:** Deployed as Next.js app (Azure Static Web Apps or Container App)
- **iOS:** Capacitor wraps the Next.js build into a native iOS app shell
- **Android:** Capacitor wraps the Next.js build into a native Android app shell

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Mobile | Capacitor 6+ |
| Auth | MSAL (Azure AD B2C) |
| State | React Query (server state) + Zustand (client state) |
| Testing | Vitest + Testing Library + Playwright |

## Architecture

See [ADR-001: Mobile Capacitor](https://github.com/learn-claude/birdie69-docs/blob/main/adrs/ADR-001-mobile-capacitor.md)

## Prerequisites

- Node.js 20+
- Xcode (for iOS build)
- Android Studio (for Android build)

## Development

```bash
npm install

# Web dev server
npm run dev

# Build for Capacitor
npm run build
npx cap sync

# Open in Xcode
npx cap open ios

# Open in Android Studio
npx cap open android
```

## Jira

[B69 Project](https://narwhal.atlassian.net/projects/B69) — Ticket: B69-4
