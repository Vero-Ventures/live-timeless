import type { FunctionReturnType } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listGoals = query({
	handler: async (ctx) => {
		const goals = await ctx.db.query("goals").order("desc").collect();
		return goals;
	},
});

export const createGoal = mutation({
	args: { description: v.string() },
	handler: async (ctx, args) => {
		const goalId = await ctx.db.insert("goals", args);
		return goalId;
	},
});

export const deleteGoal = mutation({
	args: { id: v.id("goals") },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
	},
});
