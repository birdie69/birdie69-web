"use client";

import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InteractionStatus } from "@azure/msal-browser";
import { getMe } from "@/lib/api/users";

type ProfileState = "loading" | "ready" | "missing";

/**
 * Protected layout:
 * 1. Waits for MSAL to settle — redirects to /login if not authenticated.
 * 2. Checks whether the user has a profile in our DB:
 *    - 404 → redirects to /onboarding (first time setup)
 *    - 200 → renders children
 * Shows a spinner during both checks to prevent flash of content.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const router = useRouter();
  const [profileState, setProfileState] = useState<ProfileState>("loading");

  // Redirect to /login if MSAL finishes and user is not authenticated
  useEffect(() => {
    if (!isAuthenticated && inProgress === InteractionStatus.None) {
      router.replace("/login");
    }
  }, [isAuthenticated, inProgress, router]);

  // Once authenticated, check whether a DB profile exists
  useEffect(() => {
    if (!isAuthenticated || inProgress !== InteractionStatus.None) return;

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
        // Network / unexpected error — show content anyway (graceful degradation)
        setProfileState("ready");
      });
  }, [isAuthenticated, inProgress, router]);

  if (!isAuthenticated || profileState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (profileState === "missing") {
    return null;
  }

  return <>{children}</>;
}
