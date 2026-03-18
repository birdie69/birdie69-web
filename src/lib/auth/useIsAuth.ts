"use client";

import { useIsAuthenticated } from "@azure/msal-react";

/**
 * Auth state hook with dev-mode bypass.
 *
 * In NEXT_PUBLIC_DEV_MODE=true the API accepts "dev" as a bearer token
 * (no real Azure B2C tenant needed). This hook returns true unconditionally
 * so every component that gates on authentication works without MSAL.
 *
 * In production, delegates to the real MSAL useIsAuthenticated().
 */
export function useIsAuth(): boolean {
  const msalAuth = useIsAuthenticated();
  if (process.env.NEXT_PUBLIC_DEV_MODE === "true") return true;
  return msalAuth;
}
