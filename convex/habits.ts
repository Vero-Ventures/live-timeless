import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

// TODO: Replace placeholder multipliers with real values
const unitRates: Record<string, number> = {
  // Multipliers for each unit
  steps: 0.5,
  kilojoules: 0.5,
  calories: 0.5,
  minutes: 0.5,
  milliliters: 0.5,
  feet: 0.5,
  kilometers: 0.5,
  miles: 0.5,
  litres: 0.5,
  times: 0.5,
  hours: 0.5,
  joules: 0.5,
  cups: 0.5,
  kilocalories: 0.5,
  yards: 0.5,
  "fluid ounce": 0.5,
  metres: 0.5,
};

export const getRate = (unit: string): number => {
  return unitRates[unit] || 0; // Return the rate or default to 0
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
              q.gte(q.field("_creationTime"), selectedDateMilliseconds)
            )
          )
          .first();

        return {
          ...h,
          log,
        };
      })
    );

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

    const rate = args.rate !== undefined ? args.rate : getRate(args.unit);

    const habitId = await ctx.db.insert("habits", {
      ...args,
      rate,
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
    rate: v.optional(v.number()),
  },
  handler: async (ctx, { habitId, unit, rate, ...updateData }) => {
    const updatedRate = rate !== undefined ? rate : getRate(unit);

    await ctx.db.patch(habitId, { ...updateData, rate: updatedRate });
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
