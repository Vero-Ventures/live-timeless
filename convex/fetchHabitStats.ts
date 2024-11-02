import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

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

  const stats: HabitStat[] = goals.map((goal) => {
    // Assume some predefined logic for calculating habit stats
    return {
      _id: goal._id,
      name: goal.name,
      duration: `${goal.unitValue} mins per day`,
      longestStreak: calculateLongestStreak(goal), // Replace with actual calculation
      total: calculateTotal(goal), // Replace with actual calculation
      dailyAverage: calculateDailyAverage(goal), // Replace with actual calculation
      skipped: calculateSkipped(goal), // Replace with actual calculation
      failed: calculateFailed(goal), // Replace with actual calculation
    };
  });

  return stats;
});

// Placeholder functions for calculations
function calculateLongestStreak(goal: any): number {
  return 0; // Implement actual logic
}

function calculateTotal(goal: any): number {
  return 0; // Implement actual logic
}

function calculateDailyAverage(goal: any): number {
  return 0;// Implement actual logic
}

function calculateSkipped(goal: any): number {
  return 0; // Implement actual logic
}

function calculateFailed(goal: any): number {
  return 0; // Implement actual logic
}
