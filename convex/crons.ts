import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "check and create weekly goal logs", // A unique identifier for the cron job
  { hourUTC: 8, minuteUTC: 0 }, // Run daily at midnight PST (8 AM UTC)
  api.goalLogs.checkAndCreateWeeklyLogs // The function to execute
);

export default crons;
