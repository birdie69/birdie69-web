import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import JoinPage from "@/app/join/page";
import { joinCouple } from "@/lib/api/couples";
import { ApiError } from "@/lib/api/client";

vi.mock("@azure/msal-react", () => ({
  useIsAuthenticated: () => true,
  useMsal: () => ({ instance: {}, inProgress: "none" }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("@/lib/api/couples", () => ({
  joinCouple: vi.fn(),
}));

describe("JoinPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the invite code input", () => {
    render(<JoinPage />);
    expect(screen.getByPlaceholderText("ABCD1234")).toBeInTheDocument();
  });

  it("renders the Join button (initially disabled)", () => {
    render(<JoinPage />);
    expect(screen.getByRole("button", { name: /^join$/i })).toBeDisabled();
  });

  it("enables the Join button when 8 characters are entered", () => {
    render(<JoinPage />);
    fireEvent.change(screen.getByPlaceholderText("ABCD1234"), {
      target: { value: "ABCD1234" },
    });
    expect(screen.getByRole("button", { name: /^join$/i })).not.toBeDisabled();
  });

  it("shows 'Code not found' error message when joinCouple rejects with 404", async () => {
    vi.mocked(joinCouple).mockRejectedValueOnce(
      new ApiError(404, "Invite code not found"),
    );

    render(<JoinPage />);

    fireEvent.change(screen.getByPlaceholderText("ABCD1234"), {
      target: { value: "ABCD1234" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^join$/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Code not found or already used."),
      ).toBeInTheDocument();
    });
  });

  it("shows 'already in a couple' error when joinCouple rejects with 409", async () => {
    vi.mocked(joinCouple).mockRejectedValueOnce(
      new ApiError(409, "Already in couple"),
    );

    render(<JoinPage />);

    fireEvent.change(screen.getByPlaceholderText("ABCD1234"), {
      target: { value: "XYZW5678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^join$/i }));

    await waitFor(() => {
      expect(
        screen.getByText("You're already in a couple."),
      ).toBeInTheDocument();
    });
  });
});
