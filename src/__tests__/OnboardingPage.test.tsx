import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import OnboardingPage from "@/app/onboarding/page";
import { upsertMe } from "@/lib/api/users";

vi.mock("@/lib/api/users", () => ({
  upsertMe: vi.fn().mockResolvedValue({ id: "user-123" }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

describe("OnboardingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the display name input", () => {
    render(<OnboardingPage />);
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
  });

  it("renders the Continue button", () => {
    render(<OnboardingPage />);
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });

  it("calls upsertMe with the entered display name on submit", async () => {
    render(<OnboardingPage />);

    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "Alice" },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(vi.mocked(upsertMe)).toHaveBeenCalledWith("Alice");
    });
  });

  it("does not submit if the name is too short (< 2 chars)", async () => {
    render(<OnboardingPage />);

    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "A" },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(vi.mocked(upsertMe)).not.toHaveBeenCalled();
    });
  });
});
