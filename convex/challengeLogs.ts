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
    const challengeLog = await ctx.db.insert("challengeLogs", {
      ...args,
      userId,
    });

    if (!challengeLog) {
      throw new Error("Error creating challenge log");
    }

    const challengeParticipant = await ctx.db
      .query("challengeParticipants")
      .filter((q) =>
        q.and(
          q.eq(q.field("challengeId"), args.challengeId),
          q.eq(q.field("userId"), userId)
        )
      )
      .first();

    if (!challengeParticipant) {
      throw new Error("You have not joined the challenge");
    }

    await ctx.db.patch(challengeParticipant._id, {
      totalUnitsCompleted:
        challengeParticipant.totalUnitsCompleted + args.unitsCompleted,
    });

    return challengeLog;
  },
});

export const updateChallengeLog = mutation({
  args: {
    challengeLogId: v.id("challengeLogs"),
    isComplete: v.optional(v.boolean()),
    unitsCompleted: v.number(),
  },
  handler: async (ctx, { challengeLogId, ...updateData }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const challengeLog = await ctx.db
      .query("challengeLogs")
      .filter((q) => q.eq(q.field("_id"), challengeLogId))
      .first();

    if (!challengeLog) {
      throw new Error("There is no log for this challenge yet.");
    }

    const challengeParticipant = await ctx.db
      .query("challengeParticipants")
      .filter((q) =>
        q.and(
          q.eq(q.field("challengeId"), challengeLog.challengeId),
          q.eq(q.field("userId"), userId)
        )
      )
      .first();

    if (!challengeParticipant) {
      throw new Error("You have not joined the challenge");
    }

    await ctx.db.patch(challengeParticipant._id, {
      totalUnitsCompleted:
        challengeParticipant.totalUnitsCompleted +
        updateData.unitsCompleted -
        challengeLog.unitsCompleted,
    });

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
