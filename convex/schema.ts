import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	goals: defineTable({
		description: v.string(),
	}),
});
