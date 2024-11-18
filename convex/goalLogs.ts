import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { format } from "date-fns";

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
    targetDate: v.optional(v.number()), // Make targetDate optional
    goalId: v.optional(v.id("goals")),
    unitsCompleted: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { goalLogId, targetDate, date, ...updateData } = args;
    const existingGoalLog = await ctx.db.get(goalLogId);

    if (existingGoalLog === null) {
      throw new Error("Goal log not found");
    }

    // Format the existing date once and use it for both date checks
    const existingDate = new Date(existingGoalLog.date);
    const existingDateFormatted = format(existingDate, "MM/dd/yyyy");

    if (targetDate !== undefined) {
      const targetDateFormatted = format(new Date(targetDate), "MM/dd/yyyy");

      if (targetDateFormatted !== existingDateFormatted) {
        throw new Error(
          "Date mismatch: Cannot update goal log for a different date"
        );
      }
    }

    // If date is provided, make sure it matches the existing date
    if (date !== undefined) {
      const newDate = new Date(date);
      const newDateString = format(newDate, "MM/dd/yyyy");

      if (existingDateFormatted !== newDateString) {
        throw new Error(
          "Date mismatch: Cannot update goal log with a different date"
        );
      }
    }

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

    const { dailyRepeat, startDate } = goal;
    const goalStartDate = new Date(startDate);
    const maxDate = new Date(goalStartDate);
    maxDate.setDate(maxDate.getDate() + 7);

    let currentDate = new Date(goalStartDate);
    while (currentDate <= maxDate) {
      const dayName = currentDate.toLocaleString("en-US", { weekday: "long" });
      if (dailyRepeat.includes(dayName)) {
        await ctx.db.insert("goalLogs", {
          goalId: args.goalId,
          isComplete: false,
          date: currentDate.getTime(),
          unitsCompleted: 0,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  },
});

export const checkAndCreateWeeklyLogs = mutation({
  handler: async (ctx) => {
    const BATCH_SIZE = 50;
    let lastUserId: string | null = null;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

    const endRange = new Date(dayAfterTomorrow);
    endRange.setDate(endRange.getDate() + 6);

    while (true) {
      const users = await ctx.db
        .query("users")
        .filter((q) => (lastUserId ? q.gt(q.field("_id"), lastUserId) : true))
        .order("asc")
        .take(BATCH_SIZE);

      if (users.length === 0) {
        break;
      }

      for (const user of users) {
        const userId = user._id;
        const goals = await ctx.db
          .query("goals")
          .filter((q) => q.eq(q.field("userId"), userId))
          .collect();

        const newGoalLogs = [];

        for (const goal of goals) {
          const existingLogs = await ctx.db
            .query("goalLogs")
            .filter((q) =>
              q.and(
                q.eq(q.field("goalId"), goal._id),
                q.gte(q.field("date"), dayAfterTomorrow.getTime()),
                q.lt(q.field("date"), dayAfterTomorrow.getTime() + 7 * 86400000)
              )
            )
            .collect();

          if (existingLogs.length === 0) {
            const {
              dailyRepeat,
              startDate,
              repeatType,
              intervalRepeat,
              monthlyRepeat,
            } = goal;

            // let currentDate = new Date(dayAfterTomorrow);
            // while (currentDate <= endRange) {
            //   const dayName = currentDate.toLocaleString("en-US", {
            //     weekday: "long",
            //   });

            const startDateObject = new Date(dayAfterTomorrow);
            const adjustedDate = new Date(
              Math.max(tomorrow.getTime(), startDateObject.getTime())
            );

            let today = adjustedDate;
            while (today <= endRange) {
              const dayName = today.toLocaleString("en-US", {
                weekday: "long",
              });

              const shouldCreateLog = (() => {
                switch (repeatType) {
                  case "daily":
                    return dailyRepeat.includes(dayName);
                  case "interval":
                    const diffInDays = Math.floor(
                      (today.getTime() - new Date(startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return diffInDays >= 0 && diffInDays % intervalRepeat === 0;
                  case "monthly":
                    return monthlyRepeat.includes(today.getDate());
                  default:
                    return false;
                }
              })();

              // if (shouldCreateLog) {
              //   await ctx.db.insert("goalLogs", {
              //     goalId: goal._id,
              //     isComplete: false,
              //     date: today.getTime(),
              //     unitsCompleted: 0,
              //   });
              // }

              if (shouldCreateLog) {
                newGoalLogs.push({
                  goalId: goal._id,
                  isComplete: false,
                  date: today.getTime(),
                  unitsCompleted: 0,
                });
              }

              today.setDate(today.getDate() + 1);
            }
          }

          if (newGoalLogs.length > 0) {
            await Promise.all(
              newGoalLogs.map(async (log) => {
                await ctx.db.insert("goalLogs", log);
              })
            );
          }
        }

        lastUserId = users[users.length - 1]._id;
      }
    }
  },
});
