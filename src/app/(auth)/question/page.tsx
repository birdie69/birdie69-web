"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTodayQuestion, getAnswers } from "@/lib/api/questions";
import { submitAnswer } from "@/lib/api/answers";
import { ApiError } from "@/lib/api/client";
import type { QuestionDto, AnswerRevealDto } from "@/lib/api/types";

type PageState =
  | { kind: "loading" }
  | { kind: "no-question-403" }
  | { kind: "no-question-404"; scheduledDate?: string }
  | { kind: "unanswered"; question: QuestionDto }
  | { kind: "waiting"; question: QuestionDto; reveal: AnswerRevealDto }
  | { kind: "revealed"; question: QuestionDto; reveal: AnswerRevealDto };

const CATEGORY_COLORS: Record<string, string> = {
  fun: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  deep: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  memory: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  future: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  values: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  daily: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
};

function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function QuestionHeader({ question }: { question: QuestionDto }) {
  const colorClass =
    CATEGORY_COLORS[question.category.toLowerCase()] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

  return (
    <div className="space-y-3">
      <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${colorClass}`}
      >
        {question.category}
      </span>
      <h2 className="text-xl font-semibold leading-snug">{question.title}</h2>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {question.body}
      </p>
    </div>
  );
}

export default function QuestionPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>({ kind: "loading" });
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadPage = useCallback(async () => {
    setState({ kind: "loading" });

    let question: QuestionDto | null;
    try {
      question = await getTodayQuestion();
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        setState({ kind: "no-question-403" });
      } else {
        setState({ kind: "no-question-404" });
      }
      return;
    }

    if (question === null) {
      setState({ kind: "no-question-404" });
      return;
    }

    let reveal: AnswerRevealDto;
    try {
      reveal = await getAnswers(question.id);
    } catch {
      // Answers endpoint failed — treat question as unanswered to unblock user.
      setState({ kind: "unanswered", question });
      return;
    }

    if (reveal.myAnswer === null) {
      setState({ kind: "unanswered", question });
    } else if (!reveal.isRevealed) {
      setState({ kind: "waiting", question, reveal });
    } else {
      setState({ kind: "revealed", question, reveal });
    }
  }, []);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const handleSubmit = async () => {
    if (state.kind !== "unanswered") return;
    const trimmed = answerText.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitAnswer(state.question.id, trimmed);
      await loadPage();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setSubmitError("Already answered — reloading…");
        await loadPage();
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (state.kind === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  // ── No question (403 / 404) ────────────────────────────────────────────────
  if (state.kind === "no-question-403") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Connect with your partner first</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              You need to be in an active couple before you can answer daily questions.
            </p>
            <Button className="w-full" onClick={() => router.push("/")}>
              Go to home
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (state.kind === "no-question-404") {
    const today = new Date().toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">No question for today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Check back tomorrow — a new question will be waiting for you.
            </p>
            <p className="text-xs text-gray-400">{today}</p>
            <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
              Go to home
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // ── Unanswered ─────────────────────────────────────────────────────────────
  if (state.kind === "unanswered") {
    const remaining = 1000 - answerText.length;
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md space-y-4">
          <Card className="shadow-lg">
            <CardContent className="pt-6 space-y-4">
              <QuestionHeader question={state.question} />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6 space-y-3">
              <textarea
                className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                placeholder="Write your answer…"
                maxLength={1000}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs ${remaining <= 50 ? "text-destructive" : "text-gray-400"}`}
                >
                  {remaining} characters remaining
                </span>
              </div>

              {submitError && (
                <p className="text-sm text-destructive">{submitError}</p>
              )}

              <Button
                className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                onClick={handleSubmit}
                disabled={submitting || answerText.trim().length === 0}
              >
                {submitting ? "Submitting…" : "Submit answer"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // ── Waiting ────────────────────────────────────────────────────────────────
  if (state.kind === "waiting") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="w-full max-w-md space-y-4">
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <QuestionHeader question={state.question} />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="pt-6 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Your answer
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {state.reveal.myAnswer?.text}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-rose-200 dark:border-rose-800">
            <CardContent className="pt-6 flex flex-col items-center gap-3 text-center">
              <div className="w-6 h-6 border-4 border-rose-400 border-t-transparent rounded-full animate-pulse" />
              <p className="font-semibold text-rose-600 dark:text-rose-400">
                Waiting for your partner&apos;s answer…
              </p>
              <p className="text-xs text-gray-400">
                You&apos;ll see both answers once they reply.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // ── Revealed ───────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-2xl space-y-4">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <QuestionHeader question={state.question} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Your answer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {state.reveal.myAnswer?.text}
              </p>
              {state.reveal.myAnswer?.submittedAt && (
                <p className="text-xs text-gray-400">
                  {relativeTime(state.reveal.myAnswer.submittedAt)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md border-rose-200 dark:border-rose-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-rose-500 uppercase tracking-wider">
                Partner&apos;s answer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {state.reveal.partnerAnswer?.text}
              </p>
              {state.reveal.partnerAnswer?.submittedAt && (
                <p className="text-xs text-gray-400">
                  {relativeTime(state.reveal.partnerAnswer.submittedAt)}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
