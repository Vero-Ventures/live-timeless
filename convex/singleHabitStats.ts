import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { HabitLog } from "./habitLogs";
import { generateValidDates } from "./dateUtils";

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
  args: { habitId: v.id("habits") },
  handler: async (ctx, { habitId }) => {
    // Fetch the authenticated user's ID directly
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      console.error("User not authenticated");
      throw new Error("User not authenticated");
    }

    const habit = await ctx.db.get(habitId);
    if (!habit) {
      console.error("Goal not found");
      throw new Error("Goal not found");
    }

    // Retrieve logs for this goal
    const logs = await ctx.db
      .query("habitLogs")
      .withIndex("by_habit_id", (q) => q.eq("habitId", habit._id))
      .collect();

    const validDates = generateValidDates(habit);
    const total = calculateTotal(logs);
    const dailyAverage = calculateDailyAverage(logs);
    const longestStreak = calculateLongestStreak(logs);
    const currentStreak = calculateCurrentStreak(logs);
    const skipped = calculateSkipped(validDates, logs);
    const failed = calculateFailed(logs);
    const successfulDays = calculateSuccessfulDays(logs);
    const weeklyAverage = calculateWeeklyAverage(logs).average;
    const monthlyAverage = calculateMonthlyAverage(logs).average;
    const dailyCompletionRates = calculateDailyCompletion(
      validDates,
      logs,
      habit.unitValue
    ).rates;
    const dailyAverageData = calculateDailyCompletion(
      validDates,
      logs,
      habit.unitValue
    ).chartData;
    const weeklyAverageData = calculateWeeklyAverage(logs).chartData;
    const monthlyAverageData = calculateMonthlyAverage(logs).chartData;

    return {
      _id: habit._id,
      name: habit.name,
      duration: `${habit.unitValue} mins per day`,
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
      dailyAverageData,
      weeklyAverageData,
      monthlyAverageData,
    };
  },
});

function calculateLongestStreak(logs: HabitLog[]): number {
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

function calculateTotal(logs: HabitLog[]): number {
  return logs.reduce((sum, log) => sum + log.unitsCompleted, 0);
}

function calculateDailyAverage(logs: HabitLog[]): number {
  if (logs.length === 0) return 0;

  const logsWithUnits = logs.filter((log) => log.unitsCompleted > 0);

  const logsByDate = logsWithUnits.reduce(
    (acc, log) => {
      const date = new Date(log.date).toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    },
    {} as Record<string, HabitLog[]>
  );

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

/**
 * Calculates the number of skipped dates for a goal.
 *
 * @param goal - The Goal object containing recurrence details.
 * @param logs - The array of GoalLogs already retrieved for the goal.
 * @returns The total number of skipped dates.
 */
export function calculateSkipped(validDates: Date[], logs: HabitLog[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to midnight

  const skippedDates = validDates.filter((validDate) => {
    const log = logs.find((log) => {
      const logDate = new Date(log.date);
      return (
        logDate.toISOString().split("T")[0] ===
        validDate.toISOString().split("T")[0]
      );
    });

    // Check if the validDate is today
    const isToday =
      validDate.toISOString().split("T")[0] ===
      today.toISOString().split("T")[0];

    // Skipped if no log exists or unitsCompleted is 0, and today is not over
    return (!log || log.unitsCompleted === 0) && !isToday;
  });

  return skippedDates.length;
}

/**
 * Calculates the number of failed logs for a goal.
 *
 * @param logs - The array of GoalLogs for the goal.
 * @returns The total number of failed logs.
 */
export function calculateFailed(logs: HabitLog[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight
  // Filter logs where unitsCompleted is non-zero but isComplete is false
  const failedLogs = logs.filter(
    (log) =>
      log.unitsCompleted > 0 && !log.isComplete && log.date < today.getTime()
  );

  return failedLogs.length;
}

function calculateSuccessfulDays(logs: HabitLog[]): number {
  return logs.filter((log) => log.isComplete).length;
}

function calculateDailyCompletion(
  validDates: Date[],
  logs: HabitLog[],
  unitValue: number
) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dailyCompletionRates = Array(daysInMonth).fill(null);

  const dailyCompletionData = {
    labels: Array(daysInMonth).fill(""),
    data: Array(daysInMonth).fill(null),
  };

  // Filter logs to include only those in the current month
  const filteredLogs = logs.filter((log) => {
    const date = new Date(log.date);
    return (
      date.getFullYear() === currentYear && date.getMonth() === currentMonth
    );
  });

  const dailyLogs = filteredLogs.reduce(
    (acc, log) => {
      const date = new Date(log.date);
      const day = date.getDate() - 1;
      if (!acc[day]) acc[day] = [];
      acc[day].push(log);
      return acc;
    },
    {} as Record<number, HabitLog[]>
  );

  const filteredValidDates = validDates.filter(
    (date) =>
      date.getFullYear() === currentYear && date.getMonth() === currentMonth
  );

  filteredValidDates.forEach((validDate) => {
    const day = validDate.getDate() - 1;
    const dayLogs = dailyLogs[day] || [];
    const totalCompleted = dayLogs.reduce(
      (sum: number, log: { unitsCompleted: number }) =>
        sum + log.unitsCompleted,
      0
    );
    const completionRate =
      dayLogs.length > 0
        ? (totalCompleted / (unitValue * dayLogs.length)) * 100
        : 0;
    dailyCompletionRates[day] = completionRate;
    dailyCompletionData.data[day] = totalCompleted;
  });

  // Set labels for the first of the month and days divisible by 5
  for (let i = 0; i < daysInMonth; i++) {
    if ((i + 1) % 5 === 0) {
      dailyCompletionData.labels[i] = (i + 1).toString();
    }
  }

  return { rates: dailyCompletionRates, chartData: dailyCompletionData };
}

function calculateWeeklyAverage(logs: HabitLog[]): {
  average: number;
  chartData: { data: number[]; labels: string[] };
} {
  if (logs.length === 0)
    return { average: 0, chartData: { data: [], labels: [] } };

  // Filter logs with units completed
  const logsWithUnits = logs.filter((log) => log.unitsCompleted > 0);

  // Group logs by week
  const logsByWeek = logsWithUnits.reduce(
    (acc, log) => {
      const date = new Date(log.date);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      weekStart.setHours(0, 0, 0, 0); // Ensure the time is set to midnight
      const weekStartStr = weekStart.toISOString().split("T")[0]; // Start of the week (Sunday)
      if (!acc[weekStartStr]) acc[weekStartStr] = [];
      acc[weekStartStr].push(log);
      return acc;
    },
    {} as Record<string, HabitLog[]>
  );

  // Calculate the total units completed for weeks with logs
  const totalUnits = Object.values(logsByWeek).reduce((sum, weekLogs) => {
    const weeklyTotal = weekLogs.reduce(
      (weekSum, log) => weekSum + log.unitsCompleted,
      0
    );
    return sum + weeklyTotal;
  }, 0);

  const weeksWithLogs = Object.keys(logsByWeek).length;
  const average = totalUnits / weeksWithLogs;

  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);

  const last4Weeks = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(startOfWeek);
    weekStart.setDate(startOfWeek.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekStartStr = weekStart.toISOString().split("T")[0];
    last4Weeks.push(weekStartStr);
  }
  last4Weeks.reverse();

  const weeklyData = last4Weeks.map((weekStart) => {
    const weekLogs = logsByWeek[weekStart] || [];
    const totalCompleted = weekLogs.reduce(
      (sum, log) => sum + log.unitsCompleted,
      0
    );
    const completionRate = weekLogs.length > 0 ? totalCompleted : 0;
    return completionRate;
  });

  const weeklyLabels = last4Weeks.map((weekStart) => {
    const date = new Date(weekStart);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  });

  return { average, chartData: { data: weeklyData, labels: weeklyLabels } };
}

function calculateMonthlyAverage(logs: HabitLog[]): {
  average: number;
  chartData: { data: number[]; labels: string[] };
} {
  const monthlyLogs = logs.reduce(
    (acc, log) => {
      const date = new Date(log.date);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      if (!acc[monthStart]) acc[monthStart] = [];
      acc[monthStart].push(log);
      return acc;
    },
    {} as Record<string, HabitLog[]>
  );

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const last4Months = [];
  for (let i = 0; i < 4; i++) {
    const monthStart = new Date(startOfMonth);
    monthStart.setMonth(startOfMonth.getMonth() - i);
    monthStart.setHours(0, 0, 0, 0); // Ensure the time is set to midnight
    const monthStartStr = monthStart.toISOString().split("T")[0];
    last4Months.push(monthStartStr);
  }

  const monthlyData = last4Months
    .map((monthStart) => {
      const monthLogs = monthlyLogs[monthStart] || [];
      const totalCompleted = monthLogs.reduce(
        (sum, log) => sum + log.unitsCompleted,
        0
      );
      return totalCompleted;
    })
    .filter((totalCompleted) => totalCompleted > 0);

  const monthlyLabels = last4Months
    .map((monthStart) => {
      const date = new Date(monthStart);
      return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear()}`;
    })
    .filter((_, index) => monthlyData[index] > 0);

  const totalUnits = monthlyData.reduce((sum, units) => sum + units, 0);
  const average = monthlyData.length > 0 ? totalUnits / monthlyData.length : 0;

  return { average, chartData: { data: monthlyData, labels: monthlyLabels } };
}
