"use client";

import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginRequest } from "@/lib/auth/msalConfig";
import { useIsAuth } from "@/lib/auth/useIsAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

export default function LoginPage() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const handleLogin = () => {
    if (DEV_MODE) {
      router.replace("/");
      return;
    }
    instance.loginRedirect(loginRequest).catch(console.error);
  };

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
          <Button className="w-full" size="lg" onClick={handleLogin}>
            Sign in with birdie69
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
