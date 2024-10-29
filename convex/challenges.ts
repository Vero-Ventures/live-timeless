import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getChallengeByIdWthHasJoined = query({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, { challengeId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not logged in");
    }

    const challenge = await ctx.db.get(challengeId);
    if (!challenge) {
      throw new Error("Not found");
    }
    const challengeParticipants = await ctx.db
      .query("challengeParticipants")
      .withIndex("by_challenge_id_user_id", (q) =>
        q.eq("challengeId", challengeId)
      )
      .collect();

    const challengeParticipantsUserIds = challengeParticipants.map(
      (cp) => cp.userId
    );

    const hasJoined = challengeParticipantsUserIds.includes(userId);

    const participants = await Promise.all(
      challengeParticipants.map(async (participant) =>
        ctx.db.get(participant.userId)
      )
    );
    return { ...challenge, participants, hasJoined };
  },
});

export const getChallengeById = query({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, { challengeId }) => {
    const challenge = await ctx.db.get(challengeId);
    if (!challenge) {
      throw new Error("Not found");
    }
    const challengeParticipants = await ctx.db
      .query("challengeParticipants")
      .withIndex("by_challenge_id_user_id", (q) =>
        q.eq("challengeId", challengeId)
      )
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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not logged in");
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const challenges = await ctx.db
      .query("challenges")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", user.organizationId)
      )
      .collect();

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
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not logged in");
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "user") {
      throw new Error("Forbidden action");
    }
    await ctx.db.insert("challenges", {
      ...args,
      organizationId: user.organizationId,
    });
  },
});

export const updateChallenge = mutation({
  args: {
    challengeId: v.id("challenges"),
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
  handler: async (ctx, { challengeId, ...args }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not logged in");
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "user") {
      throw new Error("Forbidden action");
    }
    const challenge = await ctx.db.get(challengeId);

    if (!challenge) {
      throw new Error("Challenge not found");
    }

    if (challenge.organizationId !== user.organizationId) {
      throw new Error("User doesn't belong in the organization");
    }
    await ctx.db.patch(challengeId, args);
  },
});

export const deleteChallenge = mutation({
  args: {
    challengeId: v.id("challenges"),
  },
  handler: async (ctx, { challengeId }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Not logged in");
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "user") {
      throw new Error("Forbidden action");
    }
    const challenge = await ctx.db.get(challengeId);

    if (!challenge) {
      throw new Error("Challenge not found");
    }

    if (challenge.organizationId !== user.organizationId) {
      throw new Error("User doesn't belong in the organization");
    }
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
  handler: async (ctx, { challengeId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not logged in");
    }
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const challenge = await ctx.db.get(challengeId);

    if (!challenge) {
      throw new Error("Challenge not found");
    }

    if (challenge.organizationId !== user.organizationId) {
      throw new Error("User doesn't belong in the organization");
    }

    await ctx.db.insert("challengeParticipants", {
      challengeId,
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
      .withIndex("by_challenge_id_user_id", (q) =>
        q.eq("challengeId", challengeId).eq("userId", userId)
      )
      .unique();
    if (!challengeParticipant) {
      throw new Error("User is not in the challenge");
    }

    await ctx.db.delete(challengeParticipant._id);
  },
});

export const removeFromChallenge = mutation({
  args: {
    userId: v.id("users"),
    challengeId: v.id("challenges"),
  },
  handler: async (ctx, { challengeId, userId }) => {
    const currentUserId = await getAuthUserId(ctx);
    if (currentUserId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "user") {
      throw new Error("Not the owner or admin of the organization");
    }

    const challenge = await ctx.db.get(challengeId);

    if (!challenge) {
      throw new Error("Challenge not found");
    }

    if (challenge.organizationId === user.organizationId) {
      throw new Error("User doesn't belong to the organization");
    }

    const challengeParticipant = await ctx.db
      .query("challengeParticipants")
      .withIndex("by_challenge_id_user_id", (q) =>
        q.eq("challengeId", challengeId).eq("userId", userId)
      )
      .unique();

    if (!challengeParticipant) {
      throw new Error("User is not in the challenge");
    }

    await ctx.db.delete(challengeParticipant._id);
  },
});
