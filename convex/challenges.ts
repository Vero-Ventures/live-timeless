import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getChallengeById = query({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, { challengeId }) => {
    const challenge = await ctx.db.get(challengeId);
    if (!challenge) {
      throw new Error("Not found");
    }
    const challengeParticipants = await ctx.db
      .query("challengeParticipants")
      .filter((q) => q.eq(q.field("challengeId"), challenge._id))
      .collect();

    const participants = await Promise.all(
      challengeParticipants.map(async (participant) =>
        ctx.db.get(participant.userId)
      )
    );
    return { ...challenge, participants };
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

export const deleteChallenge = mutation({
  args: {
    challengeId: v.id("challenges"),
  },
  handler: async (ctx, { challengeId }) => {
    await ctx.db.delete(challengeId);
  },
});

// Get non invited users
export const getNonInivtedUsers = query({
  args: {},
  handler: async (ctx) => {
    //TODO: Make sure current logged in user's role is an 'admin'

    const users = await ctx.db.query("users").collect();

    const challengeParticipants = await ctx.db
      .query("challengeParticipants")
      .collect();
    const challengeParticipantsIds = challengeParticipants.map((p) => p.userId);

    const filteredUsers = users.filter(
      (user) => !challengeParticipantsIds.includes(user._id)
    );

    return filteredUsers;
  },
});

export const joinChallenge = mutation({
  args: {
    challengeId: v.id("challenges"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not logged in");
    }
    await ctx.db.insert("challengeParticipants", {
      challengeId: args.challengeId,
      userId,
    });
  },
});

export const leaveChallenge = mutation({
  args: {
    challengeId: v.id("challenges"),
  },
  handler: async (ctx, { challengeId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not logged in");
    }
    const challengeParticipant = await ctx.db
      .query("challengeParticipants")
      .filter((q) =>
        q.and(
          q.eq(q.field("challengeId"), challengeId),
          q.eq(q.field("userId"), userId)
        )
      )
      .collect()
      .then((res) => res.at(0));
    if (!challengeParticipant) {
      throw new Error("User is not in the challenge");
    }
    await ctx.db.delete(challengeParticipant._id);
  },
});
