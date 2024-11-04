import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { GoalLog } from "./goalLogs";

// Define the HabitStat type for the backend
export type HabitStat = {
  _id: string;
  name: string;
  duration: string;
  longestStreak: number;
  currentStreak: number;
  total: number;
  dailyAverage: number;
  weeklyAverage: number;
  monthlyAverage: number;
  skipped: number;
  failed: number;
  successfulDays: number;
  dailyCompletionRates: { date: string; completionRate: number }[];
};

export const fetchSingleHabitStats = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, { goalId }) => {
    // Fetch the authenticated user's ID directly
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }

    console.log("Authenticated User ID:", userId);

    // Fetch the goal based on the goal ID
    const goal = await ctx.db.get(goalId);
    if (!goal) {
      console.error("Goal not found");
      throw new Error("Goal not found");
    }

    // Retrieve logs for this goal
    const logs = await ctx.db
      .query("goalLogs")
      .withIndex("by_goal_id", (q) => q.eq("goalId", goal._id))
      .collect();

    console.log("logs", logs);

    const total = calculateTotal(logs);
    const dailyAverage = calculateDailyAverage(logs);
    const longestStreak = calculateLongestStreak(logs);
    const currentStreak = calculateCurrentStreak(logs);
    const skipped = calculateSkipped(logs);
    const failed = calculateFailed(logs);
    const successfulDays = calculateSuccessfulDays(logs);
    const weeklyAverage = calculateWeeklyAverage(logs);
    const monthlyAverage = calculateMonthlyAverage(logs);
    const dailyCompletionRates = calculateDailyCompletionRates(
      logs,
      goal.unitValue
    );

    return {
      _id: goal._id,
      name: goal.name,
      duration: `${goal.unitValue} mins per day`,
      longestStreak,
      currentStreak,
      total,
      dailyAverage,
      weeklyAverage,
      monthlyAverage,
      skipped,
      failed,
      successfulDays,
      dailyCompletionRates,
    };
  },
});

// Placeholder functions for calculations
function calculateLongestStreak(logs: GoalLog[]): number {
  let longestStreak = 0;
  let currentStreak = 0;

  logs.forEach((log) => {
    if (log.isComplete) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  });

  return longestStreak;
}

function calculateCurrentStreak(logs: GoalLog[]): number {
  let currentStreak = 0;

  for (let i = logs.length - 1; i >= 0; i--) {
    if (logs[i].isComplete) {
      currentStreak++;
    } else {
      break;
    }
  }

  return currentStreak;
}

function calculateTotal(logs: GoalLog[]): number {
  return logs.reduce((sum, log) => sum + log.unitsCompleted, 0);
}

function calculateDailyAverage(logs: GoalLog[]): number {
  if (logs.length === 0) return 0;

  // Filter logs with units completed
  const logsWithUnits = logs.filter((log) => log.unitsCompleted > 0);

  // Group logs by date
  const logsByDate = logsWithUnits.reduce(
    (acc, log) => {
      const date = new Date(log.date).toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    },
    {} as Record<string, GoalLog[]>
  );

  // Calculate the daily average units completed
  const totalUnits = Object.values(logsByDate).reduce((sum, dayLogs) => {
    const dailyTotal = dayLogs.reduce(
      (daySum, log) => daySum + log.unitsCompleted,
      0
    );
    return sum + dailyTotal;
  }, 0);

  const daysWithLogs = Object.keys(logsByDate).length;

  return totalUnits / daysWithLogs;
}

function calculateSkipped(logs: GoalLog[]): number {
  const today = new Date().setHours(0, 0, 0, 0);
  return logs.filter((log) => {
    const logDate = new Date(log.date).setHours(0, 0, 0, 0);
    return logDate < today && !log.isComplete && log.unitsCompleted === 0;
  }).length;
}

function calculateFailed(logs: GoalLog[]): number {
  return logs.filter((log) => !log.isComplete && log.unitsCompleted > 0).length;
}

function calculateSuccessfulDays(logs: GoalLog[]): number {
  return logs.filter((log) => log.isComplete).length;
}

function calculateWeeklyAverage(logs: GoalLog[]): number {
  if (logs.length === 0) return 0;

  // Filter logs with units completed
  const logsWithUnits = logs.filter((log) => log.unitsCompleted > 0);

  // Group logs by week
  const logsByWeek = logsWithUnits.reduce(
    (acc, log) => {
      const date = new Date(log.date);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
        .toISOString()
        .split("T")[0]; // Start of the week (Sunday)
      if (!acc[weekStart]) acc[weekStart] = [];
      acc[weekStart].push(log);
      return acc;
    },
    {} as Record<string, GoalLog[]>
  );

  // Calculate the total units completed for weeks with logs
  const totalUnits = Object.values(logsByWeek).reduce((sum, weekLogs) => {
    const weeklyTotal = weekLogs.reduce(
      (weekSum, log) => weekSum + log.unitsCompleted,
      0
    );
    return sum + weeklyTotal;
  }, 0);

  // Calculate the number of weeks with logs
  const weeksWithLogs = Object.keys(logsByWeek).length;

  // Calculate the weekly average units completed
  return totalUnits / weeksWithLogs;
}

function calculateMonthlyAverage(logs: GoalLog[]): number {
  if (logs.length === 0) return 0;

  // Filter logs with units completed
  const logsWithUnits = logs.filter((log) => log.unitsCompleted > 0);

  // Group logs by month
  const logsByMonth = logsWithUnits.reduce(
    (acc, log) => {
      const date = new Date(log.date);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
        .toISOString()
        .split("T")[0]; // Start of the month
      if (!acc[monthStart]) acc[monthStart] = [];
      acc[monthStart].push(log);
      return acc;
    },
    {} as Record<string, GoalLog[]>
  );

  // Calculate the total units completed for months with logs
  const totalUnits = Object.values(logsByMonth).reduce((sum, monthLogs) => {
    const monthlyTotal = monthLogs.reduce(
      (monthSum, log) => monthSum + log.unitsCompleted,
      0
    );
    return sum + monthlyTotal;
  }, 0);

  // Calculate the number of months with logs
  const monthsWithLogs = Object.keys(logsByMonth).length;

  // Calculate the monthly average units completed
  return totalUnits / monthsWithLogs;
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

  const dailyCompletionRates = Object.keys(dailyLogs).map((date) => {
    const dayLogs = dailyLogs[date];
    const totalCompleted = dayLogs.reduce(
      (sum: number, log: { unitsCompleted: number }) =>
        sum + log.unitsCompleted,
      0
    );
    const completionRate =
      (totalCompleted / (unitValue * dayLogs.length)) * 100;
    return { date, completionRate };
  });

  return dailyCompletionRates;
}
