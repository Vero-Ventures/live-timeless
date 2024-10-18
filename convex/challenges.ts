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
// export const getNonInivtedUsers = query({
//   args: {},
//   handler: async (ctx) => {
//     //TODO: Make sure current logged in user's role is an 'admin'

//     const users = await ctx.db.query("users").collect();

//     const challengeParticipants = await ctx.db
//       .query("challengeParticipants")
//       .collect();
//     const challengeParticipantsIds = challengeParticipants.map((p) => p.userId);

//     const filteredUsers = users.filter(
//       (user) => !challengeParticipantsIds.includes(user._id)
//     );

//     return filteredUsers;
//   },
// });
