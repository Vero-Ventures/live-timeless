import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getGoalById = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, { goalId }) => {
    return await ctx.db.get(goalId); // Fetch the goal by ID
  },
});

// TODO: Only retrieve goals for current user rather than all
export const listGoals = query(async ({ db }) => {
  const goals = await db.query("goals").collect();
  return goals;
});

export const createGoal = mutation({
  args: {
    accountId: v.id("users"),
    createdAt: v.float64(),
    dailyRepeat: v.array(v.string()),
    intervalRepeat: v.float64(),
    monthlyRepeat: v.array(v.float64()),
    name: v.string(),
    repeatType: v.string(),
    selectedIcon: v.string(),
    selectedIconColor: v.string(),
    timeOfDay: v.array(v.string()),
    timeReminder: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("goals", args);
  },
});

export const updateGoal = mutation({
  args: {
    goalId: v.id("goals"),  // ID of the goal to update
    name: v.string(),       // Name of the goal
    timeOfDay: v.array(v.string()),  // Array of times of day
    selectedIcon: v.string(),  // Icon for the goal
    selectedIconColor: v.string(),  // Color of the selected icon
    repeatType: v.string(),  // Type of repetition (daily, monthly, etc.)
    dailyRepeat: v.array(v.string()),  // Array of days for daily repetition
    monthlyRepeat: v.array(v.float64()),  // Array of days for monthly repetition
    intervalRepeat: v.float64(),  // Interval for repetition
    timeReminder: v.string(),  // Time for reminders
    createdAt: v.float64(),  // Creation time
  },
  handler: async (ctx, { goalId, name, timeOfDay, selectedIcon, selectedIconColor, repeatType, dailyRepeat, monthlyRepeat, intervalRepeat, timeReminder, createdAt }) => {
    await ctx.db.patch(goalId, {
      name, timeOfDay, selectedIcon, selectedIconColor, repeatType, dailyRepeat, monthlyRepeat, intervalRepeat, timeReminder, createdAt
    });
  },
});


export const deleteGoal = mutation({
  args: {
    goalId: v.id("goals"),
  },
  handler: async (ctx, { goalId }) => {
    await ctx.db.delete(goalId);
  },
});
