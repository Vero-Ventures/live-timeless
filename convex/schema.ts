import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    _id: v.id("users"),
    email: v.string(),
    name: v.optional(v.string()),
    dob: v.optional(v.number()),
    image: v.optional(v.string()),
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    organizationId: v.id("organizations"),
    role: v.string(),
    hasOnboarded: v.optional(v.boolean()),
    tokens: v.number(),
  }).index("email", ["email"]),
  organizations: defineTable({
    _id: v.id("organizations"),
    name: v.string(),
    slug: v.string(),
    logo: v.optional(v.string()),
    metadata: v.optional(v.string()),
  }).index("by_slug", ["slug"]),
  invitations: defineTable({
    _id: v.id("invitations"),
    email: v.string(),
    organizationId: v.id("organizations"),
    role: v.string(),
    status: v.string(),
    expiresAt: v.number(),
  }).index("by_organization_id", ["organizationId"]),
  habits: defineTable({
    _id: v.id("habits"),
    userId: v.id("users"),
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
  }).index("by_user_id", ["userId"]),
  habitLogs: defineTable({
    _id: v.id("habitLogs"),
    habitId: v.id("habits"),
    isComplete: v.boolean(),
    unitsCompleted: v.number(),
    year: v.string(),
    month: v.string(),
    day: v.string(),
  }).index("by_habit_id", ["habitId"]),
  challenges: defineTable({
    _id: v.id("challenges"),
    name: v.string(),
    description: v.string(),
    repeat: v.array(v.string()),
    unitType: v.string(),
    unitValue: v.number(),
    unit: v.string(),
    recurrence: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    organizationId: v.id("organizations"),
    tokens: v.number(),
  }).index("by_organization_id", ["organizationId"]),
  challengeParticipants: defineTable({
    _id: v.id("challengeParticipants"),
    userId: v.id("users"),
    challengeId: v.id("challenges"),
    totalUnitsCompleted: v.number(),
  }).index("by_challenge_id_user_id", ["challengeId", "userId"]),
  challengeLogs: defineTable({
    _id: v.id("challengeLogs"),
    challengeId: v.id("challenges"),
    isComplete: v.boolean(),
    unitsCompleted: v.number(),
    year: v.string(),
    month: v.string(),
    day: v.string(),
  }).index("by_challenge_id", ["challengeId"]),
  messages: defineTable({
    _id: v.id("messages"),
    role: v.string(),
    content: v.string(),
    threadId: v.string(),
  }).index("by_thread_id", ["threadId"]),
  threads: defineTable({
    _id: v.id("threads"),
    userId: v.id("users"),
    threadId: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_thread_id", ["threadId"]),
});
