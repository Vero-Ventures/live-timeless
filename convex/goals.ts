import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// TODO: Replace placeholder multipliers with real values
const unitRates: Record<string, number> = {
  // Multipliers for each unit
  steps: 0.5,
  kilojoules: 0.5,
  calories: 0.5,
  minutes: 0.5,
  milliliters: 0.5,
  feet: 0.5,
  kilometers: 0.5,
  miles: 0.5,
  litres: 0.5,
  times: 0.5,
  hours: 0.5,
  joules: 0.5,
  cups: 0.5,
  kilocalories: 0.5,
  yards: 0.5,
  "fluid ounce": 0.5,
  metres: 0.5,
};

export const getRate = query({
  args: { unit: v.string() },
  handler: async (ctx, { unit }) => {
    return unitRates[unit] || 0;
  },
});

export const getGoalById = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, { goalId }) => {
    return await ctx.db.get(goalId);
  },
});

export const listGoals = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const goals = await ctx.db
      .query("goals")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return goals;
  },
});

export const createGoal = mutation({
  args: {
    challengeId: v.optional(v.id("challenges")),
    dailyRepeat: v.array(v.string()),
    intervalRepeat: v.float64(),
    monthlyRepeat: v.array(v.float64()),
    name: v.string(),
    repeatType: v.string(),
    selectedIcon: v.string(),
    selectedIconColor: v.string(),
    timeOfDay: v.array(v.string()),
    timeReminder: v.number(),
    startDate: v.number(),
    unitType: v.string(),
    unitValue: v.number(),
    unit: v.string(),
    recurrence: v.string(),
    weeks: v.optional(v.number()),
    rate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const rate = await getRate(ctx, { unit: args.unit });

    const goalId = await ctx.db.insert("goals", {
      ...args,
      rate,
      userId,
    });

    return goalId;
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
    timeReminder: v.number(),
    startDate: v.number(),
    unitType: v.string(),
    unitValue: v.float64(),
    unit: v.string(),
    recurrence: v.string(),
    rate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { goalId, unit, ...updateData } = args;
    const rate = await getRate(ctx, { unit });
    updateData.rate = rate;
    
    await ctx.db.patch(goalId, updateData);
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

export const deleteGoalAndGoalLogs = mutation({
  args: {
    goalId: v.id("goals"),
  },
  handler: async (ctx, { goalId }) => {
    const goalLogs = await ctx.db
      .query("goalLogs")
      .filter((q) => q.eq(q.field("goalId"), goalId))
      .collect();

    for (const goalLog of goalLogs) {
      await ctx.db.delete(goalLog._id);
    }
    await ctx.db.delete(goalId);
  },
});
