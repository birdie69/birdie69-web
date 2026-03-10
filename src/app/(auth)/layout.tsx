"use client";

import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { InteractionStatus } from "@azure/msal-browser";

/**
 * Protected layout: redirects unauthenticated users to /login.
 * Waits for MSAL to finish any pending interaction before deciding.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const router = useRouter();

  useEffect(() => {
    if (
      !isAuthenticated &&
      inProgress === InteractionStatus.None
    ) {
      router.replace("/login");
    }
  }, [isAuthenticated, inProgress, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
