import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    kindeId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
  }).index("by_kinde_id", ["kindeId"]),
  goals: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
  }),
  habitPlans: defineTable({
    plan: v.string(),
    goalId: v.string(),
    userId: v.string(),
  }).index("by_goal_id", ["goalId"]),
});
