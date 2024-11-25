import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

console.log("Setting up cron jobs...");

crons.interval(
  "check and create weekly goal logs", // A unique identifier for the cron job
  { minutes: 10 },
  api.goalLogs.checkAndCreateWeeklyLogs // The function to execute
);

console.log("Cron job registered.");

export default crons;
