import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const updateTask = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const { id } = args;

    console.log(await ctx.db.get(id));

    // Add `tag` and overwrite `status`:
    // await ctx.db.patch(id, { tag: "bar", status: { archived: true } });
    // console.log(await ctx.db.get(id));
    // { text: "foo", tag: "bar", status: { archived: true }, _id: ... }
  },
});