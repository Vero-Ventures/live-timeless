import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getDate } from "date-fns";

export type Habit = {
  _id: string;
  userId: string;
  challengeId?: string;
  dailyRepeat: string[];
  intervalRepeat: number;
  monthlyRepeat: number[];
  name: string;
  repeatType: string;
  selectedIcon: string;
  selectedIconColor: string;
  timeOfDay: string[];
  timeReminder: number;
  startDate: number;
  unitType: string;
  unitValue: number;
  unit: string;
  recurrence: string;
  weeks?: number;
  rate?: number;
};

export const getHabitById = query({
  args: { habitId: v.id("habits") },
  handler: async (ctx, { habitId: habitId }) => {
    return await ctx.db.get(habitId);
  },
});

export const listHabits = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const selectedDate = new Date(date);

    const selectedDateMilliseconds = selectedDate.getTime();

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = getDate(selectedDate);

    // Query habits within the date range
    const habits = await ctx.db
      .query("habits")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.lte(q.field("startDate"), selectedDateMilliseconds)
        )
      )
      .collect();

    const habitsWithLogs = await Promise.all(
      habits.map(async (h) => {
        const log = await ctx.db
          .query("habitLogs")
          .filter((q) =>
            q.and(
              q.eq(q.field("habitId"), h._id),
              q.eq(q.field("year"), selectedYear),
              q.eq(q.field("month"), selectedMonth),
              q.eq(q.field("day"), selectedDay)
            )
          )
          .first();
        return {
          ...h,
          log,
        };
      })
    );
    console.log(habitsWithLogs);
    console.log({
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
    });

    return habitsWithLogs;
  },
});

export const createHabit = mutation({
  args: {
    challengeId: v.optional(v.id("challenges")),
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
    rate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const habitId = await ctx.db.insert("habits", {
      ...args,
      userId,
    });

    return habitId;
  },
});

export const updateHabit = mutation({
  args: {
    habitId: v.id("habits"),
    name: v.string(),
    timeOfDay: v.array(v.string()),
    selectedIcon: v.string(),
    selectedIconColor: v.string(),
    repeatType: v.string(),
    dailyRepeat: v.array(v.string()),
    monthlyRepeat: v.array(v.float64()),
    intervalRepeat: v.float64(),
    timeReminder: v.number(),
    startDate: v.number(),
    unitType: v.string(),
    unitValue: v.float64(),
    unit: v.string(),
    recurrence: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.habitId, args);
  },
});

export const deleteHabit = mutation({
  args: {
    habitId: v.id("habits"),
  },
  handler: async (ctx, { habitId }) => {
    await ctx.db.delete(habitId);
  },
});

export const deleteHabitAndHabitLogs = mutation({
  args: {
    habitId: v.id("habits"),
  },
  handler: async (ctx, { habitId }) => {
    const habitLogs = await ctx.db
      .query("habitLogs")
      .filter((q) => q.eq(q.field("habitId"), habitId))
      .collect();

    for (const habitLog of habitLogs) {
      await ctx.db.delete(habitLog._id);
    }
    await ctx.db.delete(habitId);
  },
});
