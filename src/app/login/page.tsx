"use client";

import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginRequest } from "@/lib/auth/msalConfig";
import {
  setDevIdentity,
  hasDevIdentity,
  DEV_IDENTITIES,
  type DevIdentity,
} from "@/lib/auth/devIdentity";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

const DEV_IDENTITY_LABELS: Record<DevIdentity, string> = {
  dev: "dev (neutral)",
  alice: "alice",
  bob: "bob",
};

export default function LoginPage() {
  const { instance } = useMsal();
  const msalAuthenticated = useIsAuthenticated();
  const router = useRouter();

  /**
   * In dev mode: check localStorage on mount.
   *   - Identity already chosen → redirect to /  (ready = false while checking)
   *   - No identity yet        → show picker     (ready = true after check)
   * In prod: show the page immediately (ready = true), MSAL effect handles redirect.
   */
  const [ready, setReady] = useState(!DEV_MODE);

  useEffect(() => {
    if (!DEV_MODE) return;
    if (hasDevIdentity()) {
      router.replace("/");
    } else {
      setReady(true);
    }
  }, [router]);

  // Production: redirect if MSAL already has a valid session.
  useEffect(() => {
    if (DEV_MODE) return;
    if (msalAuthenticated) router.replace("/");
  }, [msalAuthenticated, router]);

  const handleDevLogin = (identity: DevIdentity) => {
    setDevIdentity(identity);
    router.replace("/");
  };

  const handleProdLogin = () => {
    instance.loginRedirect(loginRequest).catch(console.error);
  };

  // Show spinner while we check localStorage (dev) or wait for MSAL (prod).
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (DEV_MODE) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-sm shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-rose-600 dark:text-rose-400">
              birdie69
            </CardTitle>
            <CardDescription>Dev mode — pick an identity to sign in as</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {DEV_IDENTITIES.map((id) => (
              <Button
                key={id}
                className="w-full font-mono"
                variant={id === "dev" ? "outline" : "default"}
                size="lg"
                onClick={() => handleDevLogin(id)}
              >
                Sign in as{" "}
                <span className="ml-1 font-bold">{DEV_IDENTITY_LABELS[id]}</span>
              </Button>
            ))}
            <p className="text-center text-xs text-gray-400 pt-1">
              Each identity maps to a separate user in the local DB
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-rose-600 dark:text-rose-400">
            birdie69
          </CardTitle>
          <CardDescription>Sign in to connect with your partner</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" size="lg" onClick={handleProdLogin}>
            Sign in with birdie69
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
