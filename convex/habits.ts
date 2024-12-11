import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { endOfToday, getDate } from "date-fns";

export const getHabitById = query({
  args: { habitId: v.id("habits"), month: v.number(), year: v.number() },
  handler: async (ctx, { habitId, year, month }) => {
    const habit = await ctx.db.get(habitId);

    if (!habit) {
      return null;
    }

    const logs = await ctx.db
      .query("habitLogs")
      .filter((q) =>
        q.and(
          q.eq(q.field("habitId"), habit._id),
          q.eq(q.field("year"), year),
          q.eq(q.field("month"), month)
        )
      )
      .collect();

    return {
      ...habit,
      logs,
    };
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

    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = getDate(selectedDate);

    const habits = await ctx.db
      .query("habits")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.lte(q.field("startDate"), endOfToday().getTime())
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

    return habitsWithLogs.sort((a, b) => {
      // Handle cases with no logs or undefined isComplete
      if (!a.log) return -1;
      if (!b.log) return 1;

      // Sort by completion status: not completed first, completed last
      return a.log.isComplete === b.log.isComplete
        ? 0
        : a.log.isComplete
          ? 1
          : -1;
    });
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
    const logs = await ctx.db
      .query("habitLogs")
      .filter((q) => q.eq(q.field("habitId"), habitId))
      .collect();

    await Promise.all(logs.map(async (log) => ctx.db.delete(log._id)));
    await ctx.db.delete(habitId);
  },
});
