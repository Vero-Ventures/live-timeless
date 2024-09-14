import type MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { create } from "zustand";
import { FREQUENCY } from "./frequency/constants";

type TimeOfDay = "Morning" | "Afternoon" | "Evening";

export type RepeatType = "daily" | "monthly" | "interval";
export type DailyRepeat =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type UnitType = keyof typeof FREQUENCY;
export type Unit = {
  [K in UnitType]: keyof (typeof FREQUENCY)[K]["units"];
}[UnitType];
export type Recurrence = (typeof FREQUENCY)[UnitType]["recurrence"][number];
export type MaterialCommunityIcon = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

interface CreateGoalFormState {
  name: string;
  setName: (name: string) => void;
  timeOfDay: TimeOfDay[];
  setTimeOfDay: (timeOfDay: TimeOfDay[]) => void;
  repeatType: RepeatType;
  setRepeatType: (repeatType: RepeatType) => void;
  dailyRepeat: DailyRepeat[];
  setDailyRepeat: (dailyRepeat: DailyRepeat[]) => void;
  resetDailyRepeat: () => void;
  monthlyRepeat: number[];
  setMonthlyRepeat: (monthlyRepeat: number[]) => void;
  resetMonthlyRepeat: () => void;
  intervalRepeat: number;
  setIntervalRepeat: (intervalRepeat: number) => void;
  resetIntervalRepeat: () => void;
  timeReminder: Date;
  setTimeReminder: (timeReminder: Date) => void;

  // Updated goal-related fields
  unitType: UnitType;
  setUnitType: (unitType: UnitType) => void;
  unitValue: number;
  setUnitValue: (value: number) => void;
  unit: Unit;
  setUnit: (unit: Unit) => void;
  recurrence: Recurrence;
  setRecurrence: (recurrence: Recurrence) => void;
  selectedIconColor: string;
  setSelectedIconColor: (selectedIconColor: string) => void;
  selectedIcon: MaterialCommunityIcon | null;
  setSelectedIcon: (selectedIcon: MaterialCommunityIcon) => void;
}

export const initialDailyRepeat: DailyRepeat[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const initialMonthlyRepeat: number[] = [1];

const initialIntervalRepeat = 2;

const initialUnitType: UnitType = "general";
const initialUnitValue = 1;
const initialUnit: Unit = "times";
const initialRecurrence: Recurrence = "per day";

export const useCreateGoalFormStore = create<CreateGoalFormState>()((set) => ({
  name: "",
  setName: (name) => set({ name }),
  timeOfDay: ["Morning", "Afternoon", "Evening"],
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  repeatType: "daily",
  setRepeatType: (repeatType) => set({ repeatType }),
  dailyRepeat: initialDailyRepeat,
  setDailyRepeat: (dailyRepeat) => set({ dailyRepeat }),
  resetDailyRepeat: () => set({ dailyRepeat: initialDailyRepeat }),
  monthlyRepeat: initialMonthlyRepeat,
  setMonthlyRepeat: (monthlyRepeat) => set({ monthlyRepeat }),
  resetMonthlyRepeat: () => set({ monthlyRepeat: initialMonthlyRepeat }),
  intervalRepeat: initialIntervalRepeat,
  setIntervalRepeat: (intervalRepeat) => set({ intervalRepeat }),
  resetIntervalRepeat: () => set({ intervalRepeat: initialIntervalRepeat }),
  timeReminder: new Date(),
  setTimeReminder: (timeReminder) => set({ timeReminder }),

  // Updated goal-related fields
  unitType: initialUnitType,
  setUnitType: (unitType) => set({ unitType }),
  unitValue: initialUnitValue,
  setUnitValue: (unitValue) => set({ unitValue }),
  unit: initialUnit,
  setUnit: (unit) => set({ unit }),
  recurrence: initialRecurrence,
  setRecurrence: (recurrence) => set({ recurrence }),
  selectedIconColor: "#2AA8CF",
  setSelectedIconColor: (selectedIconColor) => set({ selectedIconColor }),
  selectedIcon: null,
  setSelectedIcon: (selectedIcon) => set({ selectedIcon }),
}));
