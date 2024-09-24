// convex/goals.ts
import { query } from "./_generated/server";

// Define the listGoals query
export const listGoals = query(async ({ db }) => {
  const goals = await db.query("goals").collect();
  return goals;
});
