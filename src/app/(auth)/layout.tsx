"use client";

import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InteractionStatus } from "@azure/msal-browser";
import { getMe } from "@/lib/api/users";
import { useIsAuth } from "@/lib/auth/useIsAuth";

type ProfileState = "loading" | "ready" | "missing";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

/**
 * Protected layout — wraps /, /invite, /join, /question.
 *
 * 1. Auth gate: redirects to /login when the user is not authenticated.
 *    In dev mode: useIsAuth() returns true (bypasses MSAL entirely).
 * 2. Profile gate: fetches GET /v1/users/me.
 *    404 → first-time user → redirect to /onboarding.
 *    200 → render children.
 *
 * Shows a spinner until both checks complete so there is no flash of content.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuth();
  const msalIsAuthenticated = useIsAuthenticated(); // used for prod redirect effect only
  const { inProgress } = useMsal();
  const router = useRouter();
  const [profileState, setProfileState] = useState<ProfileState>("loading");

  // Production-only: redirect to /login when MSAL confirms the user is not signed in.
  useEffect(() => {
    if (DEV_MODE) return;
    if (!msalIsAuthenticated && inProgress === InteractionStatus.None) {
      router.replace("/login");
    }
  }, [msalIsAuthenticated, inProgress, router]);

  // Profile check — runs once we know the user is (or is treated as) authenticated.
  useEffect(() => {
    if (profileState !== "loading") return;
    if (!DEV_MODE && (!msalIsAuthenticated || inProgress !== InteractionStatus.None)) return;

    getMe()
      .then((profile) => {
        if (profile === null) {
          setProfileState("missing");
          router.replace("/onboarding");
        } else {
          setProfileState("ready");
        }
      })
      .catch(() => {
        // Network / unexpected error — let the page render; it can handle its own errors.
        setProfileState("ready");
      });
  }, [msalIsAuthenticated, inProgress, router, profileState]);

  if (!isAuthenticated || profileState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (profileState === "missing") return null;

  return <>{children}</>;
}
