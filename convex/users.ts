import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

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
