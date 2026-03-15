"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsAuth } from "@/lib/auth/useIsAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { joinCouple } from "@/lib/api/couples";
import { ApiError } from "@/lib/api/client";

export default function JoinPage() {
  const isAuthenticated = useIsAuth();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 8) return;

    setLoading(true);
    setError(null);

    try {
      await joinCouple(code);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          setError("Code not found or already used.");
        } else if (err.status === 409) {
          setError("You're already in a couple.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            Join your partner
          </CardTitle>
          <CardDescription>
            Enter the 8-character code your partner shared
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 8))}
              placeholder="ABCD1234"
              maxLength={8}
              className="w-full rounded-lg border border-input bg-background px-3 py-3 text-center text-2xl font-mono tracking-widest uppercase ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              autoComplete="off"
              autoCapitalize="characters"
            />

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || code.length !== 8}
            >
              {loading ? "Joining…" : "Join"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-gray-500"
              onClick={() => router.push("/")}
            >
              Back
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
