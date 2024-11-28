import type { Goal } from "./goals";

/**
  Generates valid dates up to current date.
  
  @param goal - The Goal object containing recurrence details.
  @returns - Valid dates for Goal Logs to generate on.
*/
export function generateValidDates(goal: Goal): Date[] {
  const { startDate, repeatType, dailyRepeat, intervalRepeat, monthlyRepeat } =
    goal;
  const validDates: Date[] = [];

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Normalize currentDate to midnight

  let pointer = new Date(startDate);
  pointer.setHours(0, 0, 0, 0); // Normalize startDate to midnight

  while (pointer < currentDate) {
    const dayName = pointer.toLocaleString("en-US", { weekday: "long" });

    let isValid = false;

    if (repeatType === "daily" && dailyRepeat.includes(dayName)) {
      // Daily recurrence: Match days of the week
      isValid = true;
    } else if (repeatType === "interval") {
      // Interval recurrence: Match intervals from the start date
      const daysSinceStart = Math.floor(
        (pointer.getTime() - new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      isValid = daysSinceStart % intervalRepeat === 0;
    } else if (
      repeatType === "monthly" &&
      monthlyRepeat.includes(pointer.getDate())
    ) {
      // Monthly recurrence: Match days of the month
      isValid = true;
    }

    if (isValid) {
      validDates.push(new Date(pointer));
    }

    pointer.setDate(pointer.getDate() + 1); // Move to the next day
  }

  return validDates;
}
