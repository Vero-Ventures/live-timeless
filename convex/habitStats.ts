import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { GoalLog } from "./goalLogs";

// Define the HabitStat type for the backend
export type HabitStat = {
  _id: string;
  name: string;
  icon: string; // New field for selectedIcon
  iconColor: string; // New field for selectedIconColor
  duration: string;
  unit: string;
  longestStreak: number;
  total: number;
  dailyAverage: number;
  skipped: number;
  failed: number;
  dailyCompletionRates: { date: string; completionRate: number }[];
};

export const fetchHabitStats = query(async (ctx) => {
  // Fetch the authenticated user's ID directly
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    console.error("User not authenticated");
    throw new Error("User not authenticated");
  }

  // Fetch the habit stats based on the user ID
  const goals = await ctx.db
    .query("goals")
    .withIndex("by_user_id", (q) => q.eq("userId", userId))
    .collect();

  const stats: HabitStat[] = await Promise.all(
    goals.map(async (goal) => {
      // Retrieve logs for this goal
      const logs = await ctx.db
        .query("goalLogs")
        .withIndex("by_goal_id", (q) => q.eq("goalId", goal._id))
        .collect();

      const total = calculateTotal(logs);
      const dailyAverage = calculateDailyAverage(logs, new Date(goal.startDate), goal.unitValue);
      const longestStreak = calculateLongestStreak(logs);
      const skipped = calculateSkipped(logs, new Date(goal.startDate));
      const failed = calculateFailed(logs);
      const dailyCompletionRates = calculateDailyCompletionRates(
        logs,
        goal.unitValue
      );

      return {
        _id: goal._id,
        name: goal.name,
        icon: goal.selectedIcon, // Fetch selectedIcon from goal
        iconColor: goal.selectedIconColor, // Fetch selectedIconColor from goal
        duration: `${goal.unitValue} ${goal.unit} per day`,
        unit: goal.unit,
        longestStreak,
        total,
        dailyAverage,
        skipped,
        failed,
        dailyCompletionRates,
      };
    })
  );

  return stats;
});

// Calculate the longest streak of consecutive completed days
function calculateLongestStreak(logs: GoalLog[]): number {
  // Sort logs by date to ensure they are in consecutive order
  const sortedLogs = logs.sort((a, b) => a.date - b.date);
  let longestStreak = 0;
  let currentStreak = 0;
  let previousDate: Date | null = null;

  sortedLogs.forEach((log) => {
    if (log.isComplete) {
      const currentDate = new Date(log.date * 1000);
      if (
        previousDate &&
        currentDate.getTime() - previousDate.getTime() === 86400000 // 1 day in milliseconds
      ) {
        currentStreak++;
      } else {
        currentStreak = 1; // Start a new streak
      }
      longestStreak = Math.max(longestStreak, currentStreak);
      previousDate = currentDate;
    } else {
      currentStreak = 0; // Reset the streak on an incomplete day
    }
  });

  return longestStreak;
}

// Calculate the total units completed
function calculateTotal(logs: GoalLog[]): number {
  return logs.reduce((sum, log) => sum + log.unitsCompleted, 0);
}

// Calculate the daily average based on actual units completed and days with logged progress
function calculateDailyAverage(logs: GoalLog[], startDate: Date, goalUnitValue: number): number {
  if (logs.length === 0) return 0;

  // Sum the units completed from logs
  const totalUnitsCompleted = logs.reduce((sum, log) => sum + log.unitsCompleted, 0);

  // Determine the number of days between the start date and today where progress was logged
  const today = new Date();
  const totalDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate the daily average based on the total units completed and actual days with logs
  return totalUnitsCompleted / totalDays;
}

// Calculate skipped days based on the goal's start date up to yesterday
// Calculate skipped days based on the goal's start date up to yesterday
function calculateSkipped(logs: GoalLog[], startDate: Date): number {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Set to midnight UTC to avoid timezone discrepancies

  // If the goal starts today, return 0 skipped days since there's no possible skipped days yet
  if (startDate >= today) {
    return 0;
  }

  let skippedDays = 0;

  // Normalize log dates to a set in "YYYY-MM-DD" format for quick comparison
  const logDates = new Set(
    logs.map((log) => {
      const logDate = new Date(log.date * 1000); // Convert timestamp to date
      logDate.setUTCHours(0, 0, 0, 0); // Normalize to midnight UTC
      return logDate.toISOString().split("T")[0]; // Format as "YYYY-MM-DD"
    })
  );

  // Start counting from the day after the start date
  const countingStartDate = new Date(startDate);
  countingStartDate.setDate(startDate.getDate() + 1);

  // Iterate from the day after the start date up to, but not including, today
  for (
    let date = new Date(countingStartDate);
    date < today;
    date.setDate(date.getDate() + 1)
  ) {
    date.setUTCHours(0, 0, 0, 0); // Normalize each date to midnight UTC
    const dateString = date.toISOString().split("T")[0];

    if (!logDates.has(dateString)) {
      skippedDays++;
    }
  }

  return skippedDays;
}

// Calculate failed days where progress was started but goal wasn't completed
function calculateFailed(logs: GoalLog[]): number {
  return logs.filter((log) => log.unitsCompleted > 0 && !log.isComplete).length;
}

function calculateDailyCompletionRates(logs: GoalLog[], unitValue: number) {
  const dailyLogs = logs.reduce(
    (acc, log) => {
      // Convert log.date to a date string without the time component
      const date = new Date(log.date).toISOString().split("T")[0]; // Format as YYYY-MM-DD
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    },
    {} as Record<string, GoalLog[]>
  );

  const dailyCompletionRates = Object.keys(dailyLogs).map((date) => {
    const dayLogs = dailyLogs[date];
    const totalCompleted = dayLogs.reduce(
      (sum, log) => sum + log.unitsCompleted,
      0
    );
    const completionRate =
      (totalCompleted / (unitValue * dayLogs.length)) * 100;
    return { date, completionRate };
  });

  return dailyCompletionRates;
}
