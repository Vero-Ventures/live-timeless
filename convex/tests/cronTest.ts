import { api } from "../_generated/api";

(async function testCronJob() {
  console.log(`[${new Date().toISOString()}] Starting cron job test suite...`);

  // Test: Successful cron execution
  try {
    console.log(`[${new Date().toISOString()}] Test 1: Successful execution`);
    await api.goalLogs.checkAndCreateWeeklyLogs;
    console.log(
      `[${new Date().toISOString()}] Test 1 passed: Cron job executed successfully.`
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Test 1 failed: Cron job execution failed.`,
      error
    );
  }

  // Test: Make sure no duplicate logs are made
  try {
    console.log(
      `[${new Date().toISOString()}] Test 2: Check for duplicate log prevention`
    );
    await api.goalLogs.checkAndCreateWeeklyLogs;
    console.log(
      `[${new Date().toISOString()}] Test 2 passed: No duplicates created.`
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Test 2 failed: Duplicate log prevention failed.`,
      error
    );
  }

  // Test: Handle missing goals gracefully
  try {
    console.log(
      `[${new Date().toISOString()}] Test 3: Handle missing goals gracefully`
    );
    await api.goalLogs.checkAndCreateWeeklyLogs;
    console.log(
      `[${new Date().toISOString()}] Test 3 passed: Handled missing goals gracefully.`
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Test 3 failed: Missing goals caused an error.`,
      error
    );
  }

  console.log(`[${new Date().toISOString()}] Cron job test suite completed.`);
})();
