import { v } from "convex/values";
import { asyncSleep, asyncMap } from "modern-async";
import OpenAI from "openai";
import type { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";

import { internal } from "./_generated/api";
import type { ActionCtx } from "./_generated/server";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export const answer = internalAction({
  args: {
    existingThreadId: v.optional(v.string()),
    currentUserId: v.id("users"),
    message: v.string(),
  },
  handler: async (ctx, { existingThreadId, currentUserId, message }) => {
    const openai = new OpenAI();

    let threadId = existingThreadId;
    if (!threadId) {
      threadId = await createThreadId(ctx, openai, currentUserId);
    }

    // Add a message to the thread
    const { id: lastMessageId } = await openai.beta.threads.messages.create(
      threadId,
      {
        role: "user",
        content: message,
      }
    );

    const { id: runId } = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.ASSISTANT_ID!,
    });

    await pollForAnswer(ctx, { threadId, runId, lastMessageId });
  },
});

const createThreadId = async (
  ctx: ActionCtx,
  openai: OpenAI,
  currentUserId: Id<"users">
) => {
  const { id: newThreadId } = await openai.beta.threads.create();
  await ctx.runMutation(internal.serve.saveThread, {
    currentUserId,
    threadId: newThreadId,
  });
  return newThreadId;
};

export const getThread = internalQuery(
  async (ctx, { threadId }: { threadId: string }) => {
    return await ctx.db
      .query("threads")
      .withIndex("by_thread_id", (q) => q.eq("threadId", threadId))
      .unique();
  }
);

export const saveThread = internalMutation(
  async (
    ctx,
    {
      currentUserId,
      threadId,
    }: { currentUserId: Id<"users">; threadId: string }
  ) => {
    await ctx.db.insert("threads", {
      userId: currentUserId,
      threadId,
    });
  }
);

async function pollForAnswer(
  ctx: ActionCtx,
  args: { threadId: string; runId: string; lastMessageId: string }
) {
  const { threadId, runId, lastMessageId } = args;
  const openai = new OpenAI();
  while (true) {
    await asyncSleep(500);
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);
    switch (run.status) {
      case "failed":
      case "expired":
      case "cancelled":
        await ctx.runMutation(internal.serve.addMessage, {
          content:
            "I cannot reply at this time. Reach out to the team on Discord",
          threadId,
        });
        return;
      case "completed": {
        const { data: newMessages } = await openai.beta.threads.messages.list(
          threadId,
          { after: lastMessageId, order: "asc" }
        );
        await asyncMap(newMessages, async ({ content }) => {
          const text = content
            .filter((item): item is TextContentBlock => item.type === "text")
            .map(({ text }) => text.value)
            .join("\n\n");
          await ctx.runMutation(internal.serve.addMessage, {
            content: text,
            threadId,
          });
        });
        return;
      }
    }
  }
}

export const addMessage = internalMutation(
  async (ctx, { content, threadId }: { content: string; threadId: string }) => {
    await ctx.db.insert("messages", {
      role: "assistant",
      content,
      threadId,
    });
  }
);
