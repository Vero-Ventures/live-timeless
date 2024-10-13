import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getGoalLogById = query({
    args: { goalLogId: v.id("goalLogs") },
    handler: async (ctx, { goalLogId }) => {
        return await ctx.db.get(goalLogId);
    },
});

export const createGoalLog = mutation({
    args: {
        goalId: v.id("goals"),
        isComplete: v.boolean(),
        date: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            return null;
        }
        await ctx.db.insert("goalLogs", { 
            ...args,
            userId,
        });
    },
});

export const updateGoalLog = mutation({
    args: {
        goalLogId: v.id("goalLogs"),
        isComplete: v.optional(v.boolean()),
        date: v.optional(v.number()),
        goalId: v.optional(v.id("goals")),
    },
    handler: async (ctx, args) => {
        const { goalLogId, ...updateData } = args;
        await ctx.db.patch(goalLogId, updateData);
      },
});

export const deleteGoal = mutation({
    args: {
      goalLogId: v.id("goalLogs"),
    },
    handler: async (ctx, { goalLogId }) => {
      await ctx.db.delete(goalLogId);
    },
});
  