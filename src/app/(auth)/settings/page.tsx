"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMyCouple } from "@/lib/api/couples";
import { setNotificationTime } from "@/lib/api/settings";

export default function SettingsPage() {
  const router = useRouter();
  const [time, setTime] = useState("08:00");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getMyCouple()
      .then((couple) => {
        if (couple?.notificationTime) {
          setTime(couple.notificationTime);
        }
      })
      .catch(() => {
        // Keep the default; the user can still set a new time
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await setNotificationTime(time);
      setSuccess(true);
    } catch {
      setError("Failed to save notification time. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            birdie69
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Settings</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label
                    htmlFor="notification-time"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Daily notification time
                  </label>
                  <input
                    id="notification-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                {success && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Notification time saved!
                  </p>
                )}

                <Button
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Button
          variant="ghost"
          className="w-full"
          onClick={() => router.push("/")}
        >
          ← Back to home
        </Button>
      </div>
    </main>
  );
}
