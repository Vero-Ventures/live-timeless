import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createChallengeGoal = mutation({
  args: {
    dailyRepeat: v.array(v.string()),
    intervalRepeat: v.float64(),
    monthlyRepeat: v.array(v.float64()),
    name: v.string(),
    repeatType: v.string(),
    selectedIcon: v.string(),
    selectedIconColor: v.string(),
    timeOfDay: v.array(v.string()),
    timeReminder: v.number(),
    startDate: v.number(),
    unitType: v.string(),
    unitValue: v.number(),
    unit: v.string(),
    recurrence: v.string(),
    weeks: v.number(),
},
handler: async (ctx, args) => {
  const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const goalId = await ctx.db.insert("goals", {
      ...args,
      userId,
    });

    return goalId;
  },
});
