import { create } from "zustand";

type TimeOfDay = "Morning" | "Afternoon" | "Evening";
export type DailyRepeat =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

interface CreateGoalFormState {
  name: string;
  setName: (name: string) => void;
  timeOfDay: TimeOfDay[];
  setTimeOfDay: (timeOfDay: TimeOfDay[]) => void;
  dailyRepeat: DailyRepeat[];
  setDailyRepeat: (dailyRepeat: DailyRepeat[]) => void;
  monthlyRepeat: number[];
  setMonthlyRepeat: (monthlyRepeat: number[]) => void;
}

export const useCreateGoalFormStore = create<CreateGoalFormState>()((set) => ({
  name: "",
  setName: (name) => set({ name }),
  timeOfDay: ["Morning", "Afternoon", "Evening"],
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  dailyRepeat: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  setDailyRepeat: (dailyRepeat) => set({ dailyRepeat }),
  monthlyRepeat: Array.from({ length: 31 }, (_, index) => index + 1),
  setMonthlyRepeat: (monthlyRepeat) => set({ monthlyRepeat }),
}));
