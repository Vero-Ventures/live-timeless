import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createChallengeHabit = mutation({
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
    rate: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const habitId = await ctx.db.insert("challengeHabits", {
      ...args,
      challengeId: args.challengeId,
    });

    return habitId;
  },
});

export const listChallengeHabits = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const habits = await ctx.db.query("challengeHabits").collect();

    return habits;
  },
});

export const listChallengeHabitsById = query({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, { challengeId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const habits = await ctx.db
      .query("challengeHabits")
      .filter((q) => q.eq(q.field("challengeId"), challengeId))
      .collect();

    return habits;
  },
});
