import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { isAfter, isBefore } from "date-fns";

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

    const hasJoined = challengeParticipants
      .map((cp) => cp.userId)
      .includes(userId);

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

export const getChallengeByIdWithLogForCurrentDay = query({
  args: {
    challengeId: v.id("challenges"),
    month: v.number(),
    year: v.number(),
    day: v.number(),
  },
  handler: async (ctx, { challengeId, year, month, day }) => {
    const challenge = await ctx.db.get(challengeId);

    if (!challenge) {
      return null;
    }

    const log = await ctx.db
      .query("challengeLogs")
      .filter((q) =>
        q.and(
          q.eq(q.field("challengeId"), challenge._id),
          q.eq(q.field("year"), year),
          q.eq(q.field("month"), month),
          q.eq(q.field("day"), day)
        )
      )
      .first();

    return {
      ...challenge,
      log,
    };
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

export const listCurrentUsersChallenges = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not logged in");
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const joinedChallenges = await ctx.db
      .query("challengeParticipants")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const challenges = await Promise.all(
      joinedChallenges.map(async (c) => ctx.db.get(c.challengeId))
    );

    const selectedDate = new Date(date);

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();

    const onGoingChallenges = challenges
      .filter((c) => c != null)
      .filter((c) => {
        // For some reason type checker for convex is detecting these as nullable
        const startDate = new Date(c?.startDate ?? "");
        const endDate = new Date(c?.endDate ?? "");

        const isInBetweenStartDateAndEndDate =
          isAfter(selectedDate, startDate) && isBefore(selectedDate, endDate);

        return (
          selectedDate.toDateString() === startDate.toDateString() ||
          selectedDate.toDateString() === endDate.toDateString() ||
          isInBetweenStartDateAndEndDate
        );
      });

    const onGoingChallengesWithLogs = await Promise.all(
      onGoingChallenges.map(async (c) => {
        const log = await ctx.db
          .query("challengeLogs")
          .filter((q) =>
            q.and(
              q.eq(q.field("challengeId"), c?._id),
              q.eq(q.field("year"), selectedYear),
              q.eq(q.field("month"), selectedMonth),
              q.eq(q.field("day"), selectedDay)
            )
          )
          .first();
        return {
          ...c,
          log,
        };
      })
    );
    return onGoingChallengesWithLogs;
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
    startDateString: v.string(),
    endDateString: v.string(),
    tokens: v.number(),
  },
  handler: async (ctx, { startDateString, endDateString, ...args }) => {
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
      startDate: new Date(startDateString).getTime(),
      endDate: new Date(endDateString).getTime(),
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
    startDateString: v.string(),
    endDateString: v.string(),
    tokens: v.number(),
  },
  handler: async (
    ctx,
    { challengeId, startDateString, endDateString, ...args }
  ) => {
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

    await ctx.db.patch(challengeId, {
      ...args,
      startDate: new Date(startDateString).getTime(),
      endDate: new Date(endDateString).getTime(),
    });
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

    const challengeLogs = await ctx.db
      .query("challengeLogs")
      .filter((q) => q.eq(q.field("challengeId"), challenge._id))
      .collect();

    const challengeParticipants = await ctx.db
      .query("challengeParticipants")
      .filter((q) => q.eq(q.field("challengeId"), challenge._id))
      .collect();

    await Promise.all(
      challengeParticipants.map(async (c) => ctx.db.delete(c._id))
    );
    await Promise.all(challengeLogs.map(async (c) => ctx.db.delete(c._id)));
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
      totalUnitsCompleted: 0,
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

export const getChallengeParticipants = query({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, { challengeId }) => {
    const challengeParticipants = await ctx.db
      .query("challengeParticipants")
      .withIndex("by_challenge_id_user_id", (q) =>
        q.eq("challengeId", challengeId)
      )
      .collect();

    const participants = await Promise.all(
      challengeParticipants.map(async (participant) => {
        const profile = await ctx.db.get(participant.userId);
        return {
          ...participant,
          ...profile,
        };
      })
    );

    return participants;
  },
});
