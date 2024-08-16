import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
<<<<<<< HEAD
  goals: defineTable({
    description: v.string(),
  }),
  users: defineTable({
    kindeId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
  }).index("by_kinde_id", ["kindeId"]),
  processedWebhooks: defineTable({
    webhookId: v.string(),
    processedAt: v.number(),
  }).index("by_webhook_id", ["webhookId"]),
=======
	goals: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
	}),
>>>>>>> af83702da02c38546cd114f24b35bf5cd93aeeb0
});
