import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { GoalLog } from "./goalLogs";

// Define the HabitStat type for the backend
export type HabitStat = {
  _id: string;
  name: string;
  icon: string;
  iconColor: string;
  duration: string;
  unit: string;
  longestStreak: number;
  currentStreak: number;
  total: number;
  dailyAverage: number;
  skipped: number;
  failed: number;
  dailyCompletionRates: { date: string; completionRate: number }[];
};

export const fetchHabitStats = query({
  args: { goalId: v.optional(v.id("goals")) },
  handler: async (ctx, { goalId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }

    // Fetch all goals or a single goal if goalId is provided
    const goals = goalId
      ? [await ctx.db.get(goalId)]
      : await ctx.db
          .query("goals")
          .withIndex("by_user_id", (q) => q.eq("userId", userId))
          .collect();

    const stats: HabitStat[] = await Promise.all(
      goals.map(async (goal) => {
        if (!goal) {
          console.error("Goal not found");
          throw new Error("Goal not found");
        }

        const logs = await ctx.db
          .query("goalLogs")
          .withIndex("by_goal_id", (q) => q.eq("goalId", goal._id))
          .collect();

        const total = calculateTotal(logs);
        const dailyAverage = calculateDailyAverage(logs);
        const longestStreak = calculateLongestStreak(logs);
        const currentStreak = calculateCurrentStreak(logs);
        const skipped = calculateSkipped(logs);
        const failed = calculateFailed(logs);
        const dailyCompletionRates = calculateDailyCompletion(
          logs,
          goal.unitValue
        ).rates;

        return {
          _id: goal._id,
          name: goal.name,
          icon: goal.selectedIcon, // Fetch selectedIcon from goal
          iconColor: goal.selectedIconColor, // Fetch selectedIconColor from goal
          duration: `${goal.unitValue} ${goal.unit} per day`,
          unit: goal.unit,
          longestStreak,
          currentStreak,
          total,
          dailyAverage,
          skipped,
          failed,
          dailyCompletionRates,
        };
      })
    );

    return stats;
  },
});

function calculateLongestStreak(logs: GoalLog[]): number {
  let longestStreak = 0;
  let currentStreak = 0;

  logs.forEach((log) => {
    if (log.isComplete) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
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

// Calculate the total units completed
function calculateTotal(logs: GoalLog[]): number {
  return logs.reduce((sum, log) => sum + log.unitsCompleted, 0);
}

function calculateDailyAverage(logs: GoalLog[]): number {
  const logsWithUnits = logs.filter((log) => log.unitsCompleted > 0);
  const logsByDate = logsWithUnits.reduce(
    (acc, log) => {
      const date = new Date(log.date).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    },
    {} as Record<string, GoalLog[]>
  );

  const totalUnits = Object.values(logsByDate).reduce(
    (sum, dayLogs) =>
      sum + dayLogs.reduce((daySum, log) => daySum + log.unitsCompleted, 0),
    0
  );

  return Object.keys(logsByDate).length > 0
    ? totalUnits / Object.keys(logsByDate).length
    : 0;
}

function calculateSkipped(logs: GoalLog[]): number {
  const today = new Date().setHours(0, 0, 0, 0);
  return logs.filter((log) => {
    const logDate = new Date(log.date).setHours(0, 0, 0, 0);
    return logDate < today && !log.isComplete && log.unitsCompleted === 0;
  }).length;
}

// Calculate failed days where progress was started but goal wasn't completed
function calculateFailed(logs: GoalLog[]): number {
  return logs.filter((log) => log.unitsCompleted > 0 && !log.isComplete).length;
}

function calculateDailyCompletion(logs: GoalLog[], unitValue: number) {
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();
  const dailyCompletionRates = Array(daysInMonth).fill(0);
  const dailyCompletionData = {
    labels: Array(daysInMonth).fill(""),
    data: Array(daysInMonth).fill(0),
  };

  const dailyLogs = logs.reduce(
    (acc, log) => {
      const date = new Date(log.date);
      const day = date.getDate() - 1;
      if (!acc[day]) acc[day] = [];
      acc[day].push(log);
      return acc;
    },
    {} as Record<number, GoalLog[]>
  );

  Object.keys(dailyLogs).forEach((day) => {
    const dayLogs = dailyLogs[parseInt(day)];
    const totalCompleted = dayLogs.reduce(
      (sum, log) => sum + log.unitsCompleted,
      0
    );
    dailyCompletionRates[parseInt(day)] =
      (totalCompleted / (unitValue * dayLogs.length)) * 100;
    dailyCompletionData.data[parseInt(day)] = totalCompleted;
  });

  for (let i = 0; i < daysInMonth; i++) {
    if ((i + 1) % 5 === 0) {
      dailyCompletionData.labels[i] = (i + 1).toString();
    }
  }

  return { rates: dailyCompletionRates, chartData: dailyCompletionData };
}
