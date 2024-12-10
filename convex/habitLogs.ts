import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getHabitLogById = query({
  args: { habitLogId: v.id("habitLogs") },
  handler: async (ctx, { habitLogId }) => {
    return await ctx.db.get(habitLogId);
  },
});

export const getHabitLogsbyHabitId = query({
  args: { habitId: v.id("habits") },
  handler: async (ctx, { habitId }) => {
    const habitLogs = await ctx.db
      .query("habitLogs")
      .withIndex("by_habit_id", (q) => q.eq("habitId", habitId))
      .collect();

    const habitLogsWithHabits = await Promise.all(
      habitLogs.map(async (h) => {
        const habit = await ctx.db.get(h.habitId);
        return {
          ...h,
          habit,
        };
      })
    );
    return habitLogsWithHabits;
  },
});

export const listHabitLogs = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const habits = await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const habitIds = habits.map((habit) => habit._id);

    if (habitIds.length === 0) {
      return [];
    }

    const habitLogs = await ctx.db
      .query("habitLogs")
      .filter((q) =>
        q.or(...habitIds.map((habitId) => q.eq(q.field("habitId"), habitId)))
      )
      .collect();

    return habitLogs;
  },
});

export const createHabitLog = mutation({
  args: {
    habitId: v.id("habits"),
    isComplete: v.boolean(),
    year: v.string(),
    month: v.string(),
    day: v.string(),
    unitsCompleted: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User not found");
    }

    const existingLog = await ctx.db
      .query("habitLogs")
      .withIndex("by_habit_id", (q) => q.eq("habitId", args.habitId))
      .filter((q) => q.eq(q.field("year"), args.year))
      .filter((q) => q.eq(q.field("month"), args.month))
      .filter((q) => q.eq(q.field("day"), args.day))
      .first();

    if (existingLog) {
      throw new Error("A habit log already exists for this habit and date.");
    }
    const newLogId = await ctx.db.insert("habitLogs", args);
    return newLogId;
  },
});

export const updateHabitLog = mutation({
  args: {
    habitLogId: v.id("habitLogs"),
    isComplete: v.optional(v.boolean()),
    unitsCompleted: v.optional(v.number()),
  },
  handler: async (ctx, { habitLogId, ...updateData }) => {
    const existingHabitLog = await ctx.db.get(habitLogId);

    if (existingHabitLog === null) {
      throw new Error("Habit log not found");
    }

    await ctx.db.patch(habitLogId, updateData);
  },
});

export const getHabitLogByDate = query({
  args: {
    habitId: v.id("habits"),
    year: v.string(),
    month: v.string(),
    day: v.string(),
  },
  handler: async (ctx, { habitId, year, month, day }) => {
    const habitLog = await ctx.db
      .query("habitLogs")
      .withIndex("by_habit_id", (q) => q.eq("habitId", habitId))
      .filter((q) =>
        q.and(
          q.eq(q.field("year"), year),
          q.eq(q.field("month"), month),
          q.eq(q.field("day"), day)
        )
      )
      .first();

    return habitLog;
  },
});
