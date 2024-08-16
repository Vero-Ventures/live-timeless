import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    const goals = await ctx.db.query("goals").order("desc").collect();
    return goals;
  },
});

export const get = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, args) => {
    const goal = await ctx.db.get(args.goalId);
    if (!goal) {
      return null;
    }
    const habitPlan = await ctx.db
      .query("habitPlans")
      .filter((q) => q.eq(q.field("goalId"), args.goalId))
      .first();
    return { ...goal, plan: habitPlan?.plan };
  },
});

export const create = mutation({
  args: { name: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const goalId = await ctx.db.insert("goals", args);
    await ctx.db.insert("habitPlans", { goalId, plan: "" });
    return goalId;
  },
});

export const remove = mutation({
  args: { id: v.id("goals") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
