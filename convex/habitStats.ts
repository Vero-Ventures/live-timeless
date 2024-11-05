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
  longestStreak: number;
  total: number;
  dailyAverage: number;
  skipped: number;
  failed: GoalLog[];
  dailyCompletionRates: { date: string; completionRate: number }[];
  totalLog: GoalLog[];
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
      const dailyAverage = calculateDailyAverage(logs);
      const longestStreak = calculateLongestStreak(logs);
      const skipped = calculateSkipped(logs);
      const failed = calculateFailed(logs);
      const dailyCompletionRates = calculateDailyCompletionRates(
        logs,
        goal.unitValue
      );
      const totalLog = calculateTotalLog(logs);

      return {
        _id: goal._id,
        name: goal.name,
        icon: goal.selectedIcon, // Fetch selectedIcon from goal
        iconColor: goal.selectedIconColor, // Fetch selectedIconColor from goal
        duration: `${goal.unitValue} mins per day`,
        longestStreak,
        total,
        dailyAverage,
        skipped,
        failed,
        dailyCompletionRates,
        totalLog,
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

const calculateTotalLog = (logs: GoalLog[]): GoalLog[] => {
  return logs.filter((log) => log.unitsCompleted != 0);
}

// Calculate the overall completion rate of each individual goal
function calculateDailyAverage(logs: GoalLog[]): number {
  if (logs.length === 0) return 0;

  const completedLogs = logs.filter((log) => log.isComplete).length;
  return (completedLogs / logs.length) * 100; // Return as percentage
}

// Calculate the number of skipped days in the past 30 days
function calculateSkipped(logs: GoalLog[]): number {
  const today = new Date();
  let skippedDays = 0;

  for (let i = 0; i < 30; i++) {
    const dateToCheck = new Date(today);
    dateToCheck.setDate(today.getDate() - i);
    const formattedDate = dateToCheck.toISOString().split("T")[0];

    const logForDate = logs.find((log) => {
      const logDate = new Date(log.date * 1000).toISOString().split("T")[0];
      return logDate === formattedDate;
    });

    if (!logForDate) {
      skippedDays++;
    }
  }

  return skippedDays;
}

// Return GoalLog of failed days 
function calculateFailed(logs: GoalLog[]): GoalLog[] {
  return logs.filter((log) => !log.isComplete);
}

function calculateDailyCompletionRates(logs: GoalLog[], unitValue: number) {
  // Group logs by date
  const dailyLogs = logs.reduce(
    (acc, log) => {
      const date = new Date(log.date).toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    },
    {} as Record<string, GoalLog[]>
  );

  // Calculate daily completion rates
  const dailyCompletionRates = Object.keys(dailyLogs).map((date) => {
    const dayLogs = dailyLogs[date];
    const totalCompleted = dayLogs.reduce(
      (sum: any, log: { unitsCompleted: any }) => sum + log.unitsCompleted,
      0
    );
    const completionRate =
      (totalCompleted / (unitValue * dayLogs.length)) * 100;
    return { date, completionRate };
  });

  return dailyCompletionRates;
}
