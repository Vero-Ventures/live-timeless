import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getChallengeById = query({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, { challengeId }) => {
    return await ctx.db.get(challengeId);
  },
});

export const listChallenges = query({
  handler: async (ctx) => {
    const challenges = await ctx.db.query("challenges").collect();
    return challenges;
  },
});

export const createChallenge = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    repeat: v.array(v.string()),
    unitType: v.string(),
    unitValue: v.number(),
    unit: v.string(),
    recurrence: v.string(),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("challenges", args);
  },
});
