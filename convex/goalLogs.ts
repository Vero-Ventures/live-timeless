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
        await ctx.db.insert("goalLogs", args);
    },
});

export const updateGoalLog = mutation({
    args: {
        goalLogId: v.id("goalLogs"),
        isComplete: v.boolean(),
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
  