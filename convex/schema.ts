import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	goals: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
	}),
});
