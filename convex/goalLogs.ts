import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export type GoalLog = {
  goalId: string;
  isComplete: boolean;
  date: number;
  unitsCompleted: number;
};

export const getGoalLogById = query({
  args: { goalLogId: v.id("goalLogs") },
  handler: async (ctx, { goalLogId }) => {
    return await ctx.db.get(goalLogId);
  },
});

export const getGoalLogsbyGoalId = query({
  args: { goalId: v.id("goals") },
  handler: async (ctx, { goalId }) => {
    const goalLogs = await ctx.db
      .query("goalLogs")
      .withIndex("by_goal_id", (q) => q.eq("goalId", goalId))
      .collect();

    const goalLogsWithGoals = await Promise.all(
      goalLogs.map(async (g) => {
        const goal = await ctx.db.get(g.goalId);
        return {
          ...g,
          goal,
        };
      })
    );
    return goalLogsWithGoals;
  },
});

export const listGoalLogs = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const goals = await ctx.db
      .query("goals")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const goalIds = goals.map((goal) => goal._id);

    if (goalIds.length === 0) {
      return [];
    }

    const goalLogs = await ctx.db
      .query("goalLogs")
      .filter((q) =>
        q.or(...goalIds.map((goalId) => q.eq(q.field("goalId"), goalId)))
      )
      .collect();

    return goalLogs;
  },
});

export const createGoalLog = mutation({
  args: {
    goalId: v.id("goals"),
    isComplete: v.boolean(),
    date: v.number(),
    unitsCompleted: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    await ctx.db.insert("goalLogs", args);
  },
});

export const updateGoalLog = mutation({
  args: {
    goalLogId: v.id("goalLogs"),
    isComplete: v.optional(v.boolean()),
    date: v.optional(v.number()),
    goalId: v.optional(v.id("goals")),
    unitsCompleted: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { goalLogId, ...updateData } = args;
    await ctx.db.patch(goalLogId, updateData);
  },
});

export const deleteGoalLog = mutation({
  args: {
    goalLogId: v.id("goalLogs"),
  },
  handler: async (ctx, { goalLogId }) => {
    await ctx.db.delete(goalLogId);
  },
});

export const createGoalLogsFromGoal = mutation({
  args: {
    goalId: v.id("goals"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User not found");
    }
    if (args.goalId === null) {
      throw new Error("Goal Id not found");
    }
    const goal = await ctx.db.get(args.goalId);
    if (goal === null) {
      throw new Error("Goal not found");
    }
    const { weeks, dailyRepeat } = goal;
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const dayOfWeekMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const createGoalsWithDate = async () => {
      for (let week = 0; week < weeks; week++) {
        for (let day of dailyRepeat) {
          const targetDay = dayOfWeekMap[day as keyof typeof dayOfWeekMap];
          const goalDate = new Date(currentDate);
          const dayOffset = (targetDay - currentDayOfWeek + 7) % 7;
          goalDate.setDate(currentDate.getDate() + week * 7 + dayOffset);
          await ctx.db.insert("goalLogs", {
            goalId: args.goalId,
            isComplete: false,
            date: goalDate.getTime(),
            unitsCompleted: 0,
          });
        }
      }
    };

    await createGoalsWithDate();
  },
});
