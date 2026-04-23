import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StreakBadge from "@/components/StreakBadge";

describe("StreakBadge", () => {
  it("renders nothing when currentStreak is 0", () => {
    const { container } = render(<StreakBadge currentStreak={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows "🔥 3" with no milestone banner when currentStreak is 3', () => {
    render(<StreakBadge currentStreak={3} />);
    expect(screen.getByText("🔥 3")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows 7-day milestone banner when currentStreak is 7", () => {
    render(<StreakBadge currentStreak={7} />);
    expect(
      screen.getByText(/you've kept a 7-day streak/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/🔥 7-day streak!/i)).toBeInTheDocument();
  });

  it("shows 14-day milestone banner when currentStreak is 14", () => {
    render(<StreakBadge currentStreak={14} />);
    expect(
      screen.getByText(/you've kept a 14-day streak/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/🔥 14-day streak!/i)).toBeInTheDocument();
  });

  it("shows 30-day milestone banner when currentStreak is 30", () => {
    render(<StreakBadge currentStreak={30} />);
    expect(
      screen.getByText(/you've kept a 30-day streak/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/🔥 30-day streak!/i)).toBeInTheDocument();
  });

  it("shows 30-day milestone when currentStreak exceeds 30", () => {
    render(<StreakBadge currentStreak={45} />);
    expect(
      screen.getByText(/you've kept a 30-day streak/i),
    ).toBeInTheDocument();
  });

  it("shows 14-day milestone when currentStreak is between 14 and 29", () => {
    render(<StreakBadge currentStreak={20} />);
    expect(
      screen.getByText(/you've kept a 14-day streak/i),
    ).toBeInTheDocument();
  });
});
