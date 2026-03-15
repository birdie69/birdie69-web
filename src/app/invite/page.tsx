"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsAuth } from "@/lib/auth/useIsAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createInvite, leaveCouple } from "@/lib/api/couples";

export default function InvitePage() {
  const isAuthenticated = useIsAuth();
  const router = useRouter();

  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  // Fetch (or generate) invite code on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    createInvite()
      .then(({ inviteCode: code }) => {
        setInviteCode(code);
      })
      .catch(() => setError("Failed to generate invite code. Please try again."))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleCopy = async () => {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const { inviteCode: code } = await createInvite();
      setInviteCode(code);
      setCopied(false);
    } catch {
      setError("Failed to regenerate code. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await leaveCouple();
      router.push("/");
    } catch {
      setError("Failed to cancel invite. Please try again.");
      setActionLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            Invite your partner
          </CardTitle>
          <CardDescription>
            Share this code — it expires when your partner joins
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="text-center space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Your invite code
                </p>
                <p className="text-4xl font-mono tracking-widest font-bold text-rose-600 dark:text-rose-400 select-all">
                  {inviteCode ?? "———"}
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleCopy}
                disabled={!inviteCode}
              >
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
                  {actionLoading ? "Regenerating…" : "Regenerate"}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-gray-500"
                  onClick={handleCancel}
                  disabled={actionLoading}
                >
                  Cancel &amp; go back
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
