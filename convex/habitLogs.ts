import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { format } from "date-fns";

export type HabitLog = {
  habitId: string;
  isComplete: boolean;
  date: number;
  unitsCompleted: number;
};

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
    date: v.number(),
    unitsCompleted: v.number(),
  },
  handler: async (ctx, { date, habitId, isComplete, unitsCompleted }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("User not found");
    }

    const existingLog = await ctx.db
      .query("habitLogs")
      .withIndex("by_habit_id", (q) => q.eq("habitId", habitId))
      .filter((q) => q.eq(q.field("date"), date))
      .first();

    if (existingLog) {
      throw new Error("A habit log already exists for this habit and date.");
    }
    const newLogId = await ctx.db.insert("habitLogs", {
      date,
      habitId,
      isComplete,
      unitsCompleted,
    });
    return newLogId;
  },
});

export const updateHabitLog = mutation({
  args: {
    habitLogId: v.id("habitLogs"),
    isComplete: v.optional(v.boolean()),
    date: v.optional(v.number()),
    targetDate: v.optional(v.number()),
    habitId: v.optional(v.id("habits")),
    unitsCompleted: v.optional(v.number()),
  },
  handler: async (ctx, { habitLogId, targetDate, date, ...updateData }) => {
    const existingHabitLog = await ctx.db.get(habitLogId);

    if (existingHabitLog === null) {
      throw new Error("Habit log not found");
    }

    // Format the existing date once and use it for both date checks
    const existingDate = new Date(existingHabitLog.date);
    const existingDateFormatted = format(existingDate, "MM/dd/yyyy");

    if (targetDate !== undefined) {
      const targetDateFormatted = format(new Date(targetDate), "MM/dd/yyyy");

      if (targetDateFormatted !== existingDateFormatted) {
        throw new Error(
          "Date mismatch: Cannot update habit log for a different date"
        );
      }
    }

    // If date is provided, make sure it matches the existing date
    if (date !== undefined) {
      const newDate = new Date(date);
      const newDateString = format(newDate, "MM/dd/yyyy");

      if (existingDateFormatted !== newDateString) {
        throw new Error(
          "Date mismatch: Cannot update habit log with a different date"
        );
      }
    }

    await ctx.db.patch(habitLogId, updateData);
  },
});

export const deleteHabitLog = mutation({
  args: {
    habitLogId: v.id("habitLogs"),
  },
  handler: async (ctx, { habitLogId }) => {
    await ctx.db.delete(habitLogId);
  },
});

export const getHabitLogByDate = query({
  args: {
    habitId: v.id("habits"),
    date: v.number(),
  },
  handler: async (ctx, { habitId, date }) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0); // Normalize the date to midnight local
    const startOfDay = normalizedDate.getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;

    const habitLog = await ctx.db
      .query("habitLogs")
      .withIndex("by_habit_id", (q) => q.eq("habitId", habitId))
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), startOfDay),
          q.lte(q.field("date"), endOfDay)
        )
      )
      .first();

    return habitLog;
  },
});
