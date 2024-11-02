import { query } from "./_generated/server";
import { v } from "convex/values";

// Define the type alias for the return data structure
export type HabitStat = {
  _id: string;
  name: string;
  duration: string;
  longestStreak: number;
  total: number;
  dailyAverage: number;
  skipped: number;
  failed: number;
};

export const getHabitStats = query({
  args: {
    userId: v.id("users"),
  },
  handler: async ({ db }, { userId }): Promise<HabitStat[]> => {
    const goals = await db
      .query("goals")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const stats = await Promise.all(
      goals.map(async (goal) => {
        const logs = await db
          .query("goalLogs")
          .withIndex("by_goal_id", (q) => q.eq("goalId", goal._id))
          .collect();

        const total = logs.reduce((sum, log) => sum + log.unitsCompleted, 0);
        const daysTracked = new Set(logs.map((log) => log.date)).size;
        const dailyAverage = daysTracked ? total / daysTracked : 0;

        const skipped = logs.filter((log) => !log.isComplete).length;
        const failed = logs.filter(
          (log) => !log.isComplete && log.unitsCompleted < goal.unitValue
        ).length;

        let longestStreak = 0;
        let currentStreak = 0;
        logs.forEach((log) => {
          if (log.isComplete) {
            currentStreak += 1;
            longestStreak = Math.max(longestStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        });

        return {
          _id: goal._id,
          name: goal.name,
          duration: `${goal.unitValue} mins per day`,
          longestStreak,
          total,
          dailyAverage,
          skipped,
          failed,
        };
      })
    );

    return stats;
  },
});
