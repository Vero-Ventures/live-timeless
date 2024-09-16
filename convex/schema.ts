import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    kindeId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
  }).index("by_kinde_id", ["kindeId"]),
});
