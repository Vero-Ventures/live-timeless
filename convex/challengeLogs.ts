import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createChallengeLog = mutation({
  args: {
    challengeId: v.id("challenges"),
    isComplete: v.boolean(),
    unitsCompleted: v.number(),
    year: v.string(),
    month: v.string(),
    day: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const habitId = await ctx.db.insert("challengeLogs", args);

    return habitId;
  },
});

export const getChallengeLogsById = query({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, { challengeId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const challengeLogs = await ctx.db
      .query("challengeLogs")
      .filter((q) => q.eq(q.field("challengeId"), challengeId))
      .collect();

    return challengeLogs;
  },
});
