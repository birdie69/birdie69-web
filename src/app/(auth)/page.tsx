"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMyCouple, createInvite, leaveCouple } from "@/lib/api/couples";
import { getDevIdentity } from "@/lib/auth/devIdentity";
import type { CoupleDto } from "@/lib/api/types";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

type CoupleState = "loading" | "none" | "pending" | "active";

export default function HomePage() {
  const router = useRouter();

  const [couple, setCouple] = useState<CoupleDto | null>(null);
  const [coupleState, setCoupleState] = useState<CoupleState>("loading");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getMyCouple()
      .then((data) => {
        setCouple(data);
        if (!data) {
          setCoupleState("none");
        } else if (data.status === "Pending" || data.status === 0) {
          setCoupleState("pending");
        } else if (data.status === "Active" || data.status === 1) {
          setCoupleState("active");
        } else {
          setCoupleState("none");
        }
      })
      .catch(() => setCoupleState("none"));
  }, []);

  const handleCopy = async () => {
    if (!couple?.inviteCode) return;
    await navigator.clipboard.writeText(couple.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const { inviteCode } = await createInvite();
      setCouple((prev) => (prev ? { ...prev, inviteCode } : prev));
    } catch {
      setError("Failed to regenerate code. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this couple?")) return;
    setActionLoading(true);
    setError(null);
    try {
      await leaveCouple();
      setCouple(null);
      setCoupleState("none");
    } catch {
      setError("Failed to leave couple. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

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
          {DEV_MODE && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs text-gray-400"
              onClick={() => router.push("/login")}
            >
              dev: signed in as{" "}
              <span className="font-mono font-semibold ml-1">{getDevIdentity()}</span>
              <span className="ml-1">· switch</span>
            </Button>
          )}
        </div>

        {/* ── Loading ──────────────────────────────────────────────────────── */}
        {coupleState === "loading" && (
          <Card className="shadow-lg">
            <CardContent className="py-8 flex justify-center">
              <div className="w-6 h-6 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </CardContent>
          </Card>
        )}

        {/* ── No couple ─────────────────────────────────────────────────── */}
        {coupleState === "none" && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Connect with your partner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={() => router.push("/invite")}>
                Invite my partner
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/join")}
              >
                Join with a code
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Pending ──────────────────────────────────────────────────────── */}
        {coupleState === "pending" && couple && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Waiting for your partner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Your invite code
                </p>
                <p className="text-4xl font-mono tracking-widest font-bold text-rose-600 dark:text-rose-400 select-all">
                  {couple.inviteCode}
                </p>
              </div>

              <Button variant="outline" className="w-full" onClick={handleCopy}>
                {copied ? "✓ Copied!" : "Copy to clipboard"}
              </Button>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleRegenerate}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Regenerating…" : "Regenerate code"}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={handleLeave}
                  disabled={actionLoading}
                >
                  Cancel invite
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Active couple ─────────────────────────────────────────────── */}
        {coupleState === "active" && couple && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-rose-600 dark:text-rose-400">
                {"You're connected! 🐦"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Connected with{" "}
                <span className="font-medium text-foreground">Your partner</span>
              </p>

              <Button
                className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                onClick={() => router.push("/question")}
              >
                {"Today's Question"}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/settings")}
              >
                ⚙ Settings
              </Button>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
                onClick={handleLeave}
                disabled={actionLoading}
              >
                {actionLoading ? "Leaving…" : "Leave couple"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
