"use client";

import { useIsAuthenticated } from "@azure/msal-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            birdie69
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Daily questions for couples
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">{"Today's Question"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAuthenticated ? (
              <p className="text-gray-500 text-sm">
                Loading today&apos;s question…
              </p>
            ) : (
              <>
                <p className="text-gray-500 text-sm">
                  Sign in to see today&apos;s question and share your answer
                  with your partner.
                </p>
                <Button
                  className="w-full"
                  onClick={() => router.push("/login")}
                >
                  Sign in to continue
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
