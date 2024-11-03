import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { GoalLog } from "./goalLogs";

// Define the HabitStat type for the backend
export type HabitStat = {
  _id: string;
  name: string;
  duration: string;
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

  console.log("Authenticated User ID:", userId);

  // Fetch the habit stats based on the user ID
  const goals = await ctx.db
    .query("goals")
    .withIndex("by_user_id", (q) => q.eq("userId", userId))
    .collect();

  console.log("Goals found for user:", goals);

  const stats: HabitStat[] = await Promise.all(
    goals.map(async (goal) => {
      // Retrieve logs for this goal
      const logs = await ctx.db
        .query("goalLogs")
        .withIndex("by_goal_id", (q) => q.eq("goalId", goal._id))
        .collect();

      const total = calculateTotal();
      const dailyAverage = calculateDailyAverage(logs);
      const longestStreak = calculateLongestStreak();
      const skipped = calculateSkipped();
      const failed = calculateFailed();
      const dailyCompletionRates = calculateDailyCompletionRates(
        logs,
        goal.unitValue
      );

      return {
        _id: goal._id,
        name: goal.name,
        duration: `${goal.unitValue} mins per day`,
        longestStreak,
        total,
        dailyAverage, // Now represents completion rate for the goal
        skipped,
        failed,
        dailyCompletionRates,
      };
    })
  );

  return stats;
});

// Placeholder functions for calculations
function calculateLongestStreak(): number {
  return 0; // Implement actual logic
}

function calculateTotal(): number {
  return 0; // Implement actual logic
}

// Calculate the overall completion rate of each individual goal
function calculateDailyAverage(logs: GoalLog[]): number {
  if (logs.length === 0) return 0;

  const completedLogs = logs.filter((log) => log.isComplete).length;
  return (completedLogs / logs.length) * 100; // Return as percentage
}

function calculateSkipped(): number {
  return 0; // Implement actual logic
}

function calculateFailed(): number {
  return 0; // Implement actual logic
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
