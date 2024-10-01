import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    _id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    dob: v.optional(v.string()),
    image: v.optional(v.string()),
    gender: v.optional(v.string()),
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),
  goals: defineTable({
    _id: v.id("goals"),
    userId: v.id("users"),
    dailyRepeat: v.array(v.string()),
    intervalRepeat: v.float64(),
    monthlyRepeat: v.array(v.float64()),
    name: v.string(),
    repeatType: v.string(),
    selectedIcon: v.string(),
    selectedIconColor: v.string(),
    timeOfDay: v.array(v.string()),
    timeReminder: v.string(),
  }).index("by_user_id", ["userId"]),
});
