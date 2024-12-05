import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { HabitLog } from "./habitLogs";

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
  skipped: HabitLog[];
  failed: HabitLog[];
  dailyCompletionRates: { date: string; completionRate: number }[];
};

export const fetchHabitStats = query({
  args: { habitId: v.optional(v.id("habits")) },
  handler: async (ctx, { habitId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }

    // Fetch all habits or a single habit if habitId is provided
    const habits = habitId
      ? [await ctx.db.get(habitId)]
      : await ctx.db
          .query("habits")
          .withIndex("by_user_id", (q) => q.eq("userId", userId))
          .collect();

    const stats: HabitStat[] = await Promise.all(
      habits.map(async (habit) => {
        if (!habit) {
          console.error("Habit not found");
          throw new Error("Habit not found");
        }

        const logs = await ctx.db
          .query("habitLogs")
          .withIndex("by_habit_id", (q) => q.eq("habitId", habit._id))
          .collect();

        const total = calculateTotal(logs);
        const dailyAverage = calculateDailyAverage(logs);
        const longestStreak = calculateLongestStreak(logs);
        const currentStreak = calculateCurrentStreak(logs);
        const skipped = returnSkippedLogs(logs);
        const failed = returnFailedLogs(logs);
        const dailyCompletionRates = calculateDailyCompletion(
          logs,
          habit.unitValue
        ).rates;

        return {
          _id: habit._id,
          name: habit.name,
          icon: habit.selectedIcon, // Fetch selectedIcon from goal
          iconColor: habit.selectedIconColor, // Fetch selectedIconColor from goal
          duration: `${habit.unitValue} ${habit.unit} per day`,
          unit: habit.unit,
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

function calculateLongestStreak(logs: HabitLog[]): number {
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

function calculateCurrentStreak(logs: HabitLog[]): number {
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
function calculateTotal(logs: HabitLog[]): number {
  return logs.reduce((sum, log) => sum + log.unitsCompleted, 0);
}

function calculateDailyAverage(logs: HabitLog[]): number {
  const logsWithUnits = logs.filter((log) => log.unitsCompleted > 0);
  const logsByDate = logsWithUnits.reduce(
    (acc, log) => {
      const date = new Date(log.date).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    },
    {} as Record<string, HabitLog[]>
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

function returnSkippedLogs(logs: HabitLog[]): HabitLog[] {
  const today = new Date().setHours(0, 0, 0, 0);
  return logs.filter((log) => {
    const logDate = new Date(log.date).setHours(0, 0, 0, 0);
    return logDate < today && !log.isComplete && log.unitsCompleted === 0;
  });
}

// Calculate failed days where progress was started but goal wasn't completed
function returnFailedLogs(logs: HabitLog[]): HabitLog[] {
  return logs.filter((log) => log.unitsCompleted > 0 && !log.isComplete);
}

function calculateDailyCompletion(logs: HabitLog[], unitValue: number) {
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
    {} as Record<number, HabitLog[]>
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
