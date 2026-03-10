"use client";

import { MsalProvider } from "@azure/msal-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { msalInstance } from "./msalInstance";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Root provider combining MSAL (Azure AD B2C) and TanStack Query.
 * Used in the root layout so every page has access to auth and server state.
 * Falls back to QueryClientProvider only if msalInstance is null (SSR/static).
 */
export function AuthProvider({ children }: AuthProviderProps) {
  if (!msalInstance) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return (
    <MsalProvider instance={msalInstance}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MsalProvider>
  );
}
