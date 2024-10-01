import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getGoalById = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, { goalId }) => {
    return await ctx.db.get(goalId); // Fetch the goal by ID
  },
});

export const listGoals = query({
  args: { userId: v.union(v.id("users"), v.null()) },
  handler: async ({ db }, { userId }) => {
    if (!userId) {
      return [];
    }
    const goals = await db
      .query("goals")
      .filter((q) => q.eq(q.field("accountId"), userId))
      .collect();
    return goals;
  },
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
    goalId: v.id("goals"),
    name: v.string(),
    timeOfDay: v.array(v.string()),
    selectedIcon: v.string(),
    selectedIconColor: v.string(),
    repeatType: v.string(),
    dailyRepeat: v.array(v.string()),
    monthlyRepeat: v.array(v.float64()),
    intervalRepeat: v.float64(),
    timeReminder: v.string(),
    createdAt: v.float64(),
  },
  handler: async (
    ctx,
    {
      goalId,
      name,
      timeOfDay,
      selectedIcon,
      selectedIconColor,
      repeatType,
      dailyRepeat,
      monthlyRepeat,
      intervalRepeat,
      timeReminder,
      createdAt,
    }
  ) => {
    await ctx.db.patch(goalId, {
      name,
      timeOfDay,
      selectedIcon,
      selectedIconColor,
      repeatType,
      dailyRepeat,
      monthlyRepeat,
      intervalRepeat,
      timeReminder,
      createdAt,
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
