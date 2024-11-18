import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

console.log("Setting up cron jobs...");

crons.weekly(
  "check and create weekly goal logs",
  { dayOfWeek: "monday", hourUTC: 8, minuteUTC: 0 },
  api.goalLogs.checkAndCreateWeeklyLogs
);

console.log("Cron job registered.");

export default crons;
