import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createChallengeLog = mutation({
  args: {
    challengeId: v.id("challenges"),
    isComplete: v.boolean(),
    unitsCompleted: v.number(),
    year: v.number(),
    month: v.number(),
    day: v.number(),
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

export const updateChallengeLog = mutation({
  args: {
    challengeLogId: v.id("challengeLogs"),
    isComplete: v.optional(v.boolean()),
    unitsCompleted: v.optional(v.number()),
  },
  handler: async (ctx, { challengeLogId, ...updateData }) => {
    await ctx.db.patch(challengeLogId, updateData);
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
