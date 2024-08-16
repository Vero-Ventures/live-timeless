import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { action, mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

export const generateHabitPlan = action({
  args: { goalId: v.id("goals") },
  handler: async (ctx, args) => {
    const goal = await ctx.runQuery(api.goals.get, args);
    const result = await streamText({
      model: openai("gpt-4-turbo"),
      system:
        "You are a helpful ai health and wellness coach. Generate a habit plan based on the name & description of the goal",
      prompt: `Name: ${goal?.name} Description: ${goal?.description}`,
    });
    let fullResponse = "";
    for await (const delta of result.textStream) {
      fullResponse += delta;
      await ctx.runMutation(api.ai.updatePlan, {
        goalId: args.goalId,
        fullResponse,
      });
    }
  },
});

export const updatePlan = mutation({
  args: { goalId: v.id("goals"), fullResponse: v.string() },
  handler: async (ctx, args) => {
    const habitPlan = await ctx.db
      .query("habitPlans")
      .filter((q) => q.eq(q.field("goalId"), args.goalId))
      .first();

    if (!habitPlan) {
      throw new Error("Could not find habit plan");
    }
    await ctx.db.patch(habitPlan._id, {
      plan: args.fullResponse,
    });
  },
});
