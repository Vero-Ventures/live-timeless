import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

export const generateHabitPlan = httpAction(async (ctx, req) => {
  const { goalId } = await req.json();
  const goal = await ctx.runQuery(api.goals.get, { goalId });
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    system:
      "You are a helpful ai health and wellness coach. Generate a habit plan based on the name & description of the goal",
    prompt: `Name: ${goal?.name} Description: ${goal?.description}`,
  });
  return result.toAIStreamResponse();
});
