import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getGoalById = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, { goalId }) => {
    return await ctx.db.get(goalId); // Fetch the goal by ID
  },
});

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
    name: v.string(),
    selectedIcon: v.string(),
    selectedIconColor: v.string(),
    timeOfDay: v.array(v.string()),
    timeReminder: v.string(),
    repeatType: v.string(),
    dailyRepeat: v.array(v.string()),
    monthlyRepeat: v.array(v.float64()),
    intervalRepeat: v.float64(),
  },
  handler: async (ctx, { goalId, ...updates }) => {
    await ctx.db.patch(goalId, updates); // Patch the goal in the database
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
