import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const goals = await ctx.db
      .query("goals")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();
    return goals;
  },
});

export const get = query({
  args: { goalId: v.id("goals"), userId: v.string() },
  handler: async (ctx, args) => {
    const goal = await ctx.db
      .query("goals")
      .filter((q) =>
        q.and(
          q.eq(q.field("_id"), args.goalId),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .order("desc")
      .first();
    if (!goal) {
      return null;
    }
    const habitPlan = await ctx.db
      .query("habitPlans")
      .filter((q) =>
        q.and(
          q.eq(q.field("goalId"), args.goalId),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .first();
    return { ...goal, plan: habitPlan?.plan };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const goalId = await ctx.db.insert("goals", args);
    await ctx.db.insert("habitPlans", {
      goalId,
      plan: "",
      userId: args.userId,
    });
    return goalId;
  },
});

export const remove = mutation({
  args: { id: v.id("goals"), userId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    const habitPlan = await ctx.db
      .query("habitPlans")
      .filter((q) =>
        q.and(
          q.eq(q.field("goalId"), args.id),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .first();
    if (habitPlan) {
      await ctx.db.delete(habitPlan._id);
    }
  },
});
