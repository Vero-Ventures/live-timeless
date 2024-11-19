import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createChallengeGoal = mutation({
  args: {
    challengeId: v.id("challenges"),
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
    rate: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const goalId = await ctx.db.insert("challengeGoals", {
      ...args,
      challengeId: args.challengeId,
    });

    return goalId;
  },
});

export const listChallengeGoals = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const goals = await ctx.db.query("challengeGoals").collect();

    return goals;
  },
});

export const listChallengeGoalsById = query({
  args: { goalId: v.id("challenges") },
  handler: async (ctx, { goalId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const goals = await ctx.db
      .query("challengeGoals")
      .filter((q) => q.eq(q.field("challengeId"), goalId))
      .collect();

    return goals;
  },
});
