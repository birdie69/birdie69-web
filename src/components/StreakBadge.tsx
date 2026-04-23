"use client";

interface StreakBadgeProps {
  currentStreak: number;
}

interface MilestoneConfig {
  days: number;
  label: string;
  bannerText: string;
  badgeClass: string;
  bannerClass: string;
}

const MILESTONES: MilestoneConfig[] = [
  {
    days: 30,
    label: "🔥 30-day streak!",
    bannerText: "🎉 You've kept a 30-day streak! Keep it up!",
    badgeClass:
      "bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700",
    bannerClass:
      "bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-700 dark:text-yellow-200",
  },
  {
    days: 14,
    label: "🔥 14-day streak!",
    bannerText: "🎉 You've kept a 14-day streak! Keep it up!",
    badgeClass:
      "bg-gray-100 text-gray-700 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600",
    bannerClass:
      "bg-gray-50 border border-gray-200 text-gray-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300",
  },
  {
    days: 7,
    label: "🔥 7-day streak!",
    bannerText: "🎉 You've kept a 7-day streak! Keep it up!",
    badgeClass:
      "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700",
    bannerClass:
      "bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-200",
  },
];

export default function StreakBadge({ currentStreak }: StreakBadgeProps) {
  if (currentStreak === 0) return null;

  const milestone = MILESTONES.find((m) => currentStreak >= m.days);

  if (!milestone) {
    return (
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800">
          🔥 {currentStreak}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={`w-full rounded-lg px-4 py-3 text-sm font-medium text-center ${milestone.bannerClass}`}
        role="status"
        aria-live="polite"
      >
        {milestone.bannerText}
      </div>
      <div className="flex justify-center">
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${milestone.badgeClass}`}
        >
          {milestone.label}
        </span>
      </div>
    </div>
  );
}
