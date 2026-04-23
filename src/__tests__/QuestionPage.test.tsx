import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import QuestionPage from "@/app/(auth)/question/page";
import { ApiError } from "@/lib/api/client";
import type { QuestionDto, AnswerRevealDto } from "@/lib/api/types";

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/lib/api/questions", () => ({
  getTodayQuestion: vi.fn(),
  getAnswers: vi.fn(),
}));

vi.mock("@/lib/api/answers", () => ({
  submitAnswer: vi.fn(),
}));

vi.mock("@/lib/api/streaks", () => ({
  getMyStreak: vi.fn(),
}));

// Re-import mocked modules so we can configure them per-test
import { getTodayQuestion, getAnswers } from "@/lib/api/questions";
import { submitAnswer } from "@/lib/api/answers";
import { getMyStreak } from "@/lib/api/streaks";

// ── Fixtures ───────────────────────────────────────────────────────────────

const mockQuestion: QuestionDto = {
  id: "q-1",
  documentId: "doc-1",
  title: "What made you laugh today?",
  body: "Share a funny moment from your day.",
  category: "fun",
  scheduledDate: "2026-03-15",
  tags: ["fun", "daily"],
};

const noAnswerReveal: AnswerRevealDto = {
  isRevealed: false,
  myAnswer: null,
  partnerAnswer: null,
};

const waitingReveal: AnswerRevealDto = {
  isRevealed: false,
  myAnswer: {
    id: "a-1",
    userId: "user-alice",
    text: "I dropped my coffee and it splashed everywhere!",
    submittedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  partnerAnswer: null,
};

const revealedReveal: AnswerRevealDto = {
  isRevealed: true,
  myAnswer: {
    id: "a-1",
    userId: "user-alice",
    text: "I dropped my coffee and it splashed everywhere!",
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  partnerAnswer: {
    id: "a-2",
    userId: "user-bob",
    text: "The cat knocked over my plant.",
    submittedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe("QuestionPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: streak resolves to 0 so it doesn't affect other tests
    vi.mocked(getMyStreak).mockResolvedValue({
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
    });
  });

  it("renders the loading spinner on mount", () => {
    vi.mocked(getTodayQuestion).mockReturnValue(new Promise(() => {}));
    render(<QuestionPage />);
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });

  it('shows "No question for today" when getTodayQuestion returns null (404)', async () => {
    vi.mocked(getTodayQuestion).mockResolvedValue(null);
    render(<QuestionPage />);
    await waitFor(() => {
      expect(screen.getByText(/no question for today/i)).toBeInTheDocument();
    });
  });

  it('shows "Connect with your partner first" when getTodayQuestion throws 403', async () => {
    vi.mocked(getTodayQuestion).mockRejectedValue(new ApiError(403, "Forbidden"));
    render(<QuestionPage />);
    await waitFor(() => {
      expect(
        screen.getByText(/connect with your partner first/i),
      ).toBeInTheDocument();
    });
  });

  it("shows question title and textarea when question loaded and myAnswer is null", async () => {
    vi.mocked(getTodayQuestion).mockResolvedValue(mockQuestion);
    vi.mocked(getAnswers).mockResolvedValue(noAnswerReveal);
    render(<QuestionPage />);
    await waitFor(() => {
      expect(
        screen.getByText("What made you laugh today?"),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByPlaceholderText("Write your answer…"),
    ).toBeInTheDocument();
  });

  it("calls submitAnswer with correct questionId and text on form submit", async () => {
    vi.mocked(getTodayQuestion).mockResolvedValue(mockQuestion);
    vi.mocked(getAnswers)
      .mockResolvedValueOnce(noAnswerReveal)
      .mockResolvedValueOnce(waitingReveal);
    vi.mocked(submitAnswer).mockResolvedValue({ id: "a-1" });

    render(<QuestionPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Write your answer…")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText("Write your answer…"), {
      target: { value: "My funny answer" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /submit answer/i }));
    });

    await waitFor(() => {
      expect(vi.mocked(submitAnswer)).toHaveBeenCalledWith("q-1", "My funny answer");
    });
  });

  it('shows "Waiting for your partner" when myAnswer exists and isRevealed is false', async () => {
    vi.mocked(getTodayQuestion).mockResolvedValue(mockQuestion);
    vi.mocked(getAnswers).mockResolvedValue(waitingReveal);
    render(<QuestionPage />);
    await waitFor(() => {
      expect(
        screen.getByText(/waiting for your partner/i),
      ).toBeInTheDocument();
    });
  });

  it("shows both answers when isRevealed is true", async () => {
    vi.mocked(getTodayQuestion).mockResolvedValue(mockQuestion);
    vi.mocked(getAnswers).mockResolvedValue(revealedReveal);
    render(<QuestionPage />);
    await waitFor(() => {
      expect(
        screen.getByText("I dropped my coffee and it splashed everywhere!"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("The cat knocked over my plant."),
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/your answer/i)).toBeInTheDocument();
    expect(screen.getByText(/partner.*answer/i)).toBeInTheDocument();
  });

  it("renders streak badge when currentStreak >= 7", async () => {
    vi.mocked(getTodayQuestion).mockResolvedValue(mockQuestion);
    vi.mocked(getAnswers).mockResolvedValue(noAnswerReveal);
    vi.mocked(getMyStreak).mockResolvedValue({
      currentStreak: 7,
      longestStreak: 7,
      lastActivityDate: "2026-04-23",
    });
    render(<QuestionPage />);
    await waitFor(() => {
      expect(screen.getAllByText(/7-day streak/i).length).toBeGreaterThan(0);
    });
  });

  it("does not render streak badge when currentStreak === 0", async () => {
    vi.mocked(getTodayQuestion).mockResolvedValue(mockQuestion);
    vi.mocked(getAnswers).mockResolvedValue(noAnswerReveal);
    vi.mocked(getMyStreak).mockResolvedValue({
      currentStreak: 0,
      longestStreak: 5,
      lastActivityDate: null,
    });
    render(<QuestionPage />);
    await waitFor(() => {
      expect(
        screen.getByText("What made you laugh today?"),
      ).toBeInTheDocument();
    });
    expect(screen.queryByText(/streak/i)).not.toBeInTheDocument();
  });

  it("still renders question when getMyStreak fails", async () => {
    vi.mocked(getTodayQuestion).mockResolvedValue(mockQuestion);
    vi.mocked(getAnswers).mockResolvedValue(noAnswerReveal);
    vi.mocked(getMyStreak).mockRejectedValue(new Error("network error"));
    render(<QuestionPage />);
    await waitFor(() => {
      expect(
        screen.getByText("What made you laugh today?"),
      ).toBeInTheDocument();
    });
  });
});
