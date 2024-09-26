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
    const user = await ctx.db.get(userId);
    return {
      name: user?.name,
      phone: user?.phone,
      email: user?.email,
      dob: user?.dob,
      image: user?.image,
      gender: user?.gender,
      height: user?.height,
      weight: user?.weight,
    };
  },
});

export const updateUserProfile = mutation({
  args: { 
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()), 
  },
  handler: async (ctx, args) => {
    const { id, name, email } = args;
    const user = await ctx.db.get(id);
    if (!user) {
      throw new Error("User not found");
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    await ctx.db.patch(id, updateData);

    console.log(await ctx.db.get(id));
   },
});