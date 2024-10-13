import { create } from "zustand";
import type { RECURRENCE } from "./target/constants";

export type TimeOfDay = "Morning" | "Afternoon" | "Evening";

export type RepeatType = "daily" | "monthly" | "interval";
export type DailyRepeat =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type UnitType =
  | "General"
  | "Scalar"
  | "Mass"
  | "Volume"
  | "Duration"
  | "Energy"
  | "Length";

export type Recurrence = (typeof RECURRENCE)[number];

interface FormState {
  name: string;
  timeOfDay: TimeOfDay[];
  repeatType: RepeatType;
  dailyRepeat: DailyRepeat[];
  monthlyRepeat: number[];
  intervalRepeat: number;
  timeReminder: Date;
  startDate: Date;
  unitType: UnitType;
  unitValue: number;
  unit: string;
  recurrence: Recurrence;
  selectedIconColor: string;
  selectedIcon: string | null;
  weeks: number;
}

interface FormActions {
  setName: (name: string) => void;
  setTimeOfDay: (timeOfDay: TimeOfDay[]) => void;
  setRepeatType: (repeatType: RepeatType) => void;
  setDailyRepeat: (dailyRepeat: DailyRepeat[]) => void;
  resetDailyRepeat: () => void;
  setMonthlyRepeat: (monthlyRepeat: number[]) => void;
  resetMonthlyRepeat: () => void;
  setIntervalRepeat: (intervalRepeat: number) => void;
  resetIntervalRepeat: () => void;
  setTimeReminder: (timeReminder: Date) => void;
  setStartDate: (startDate: Date) => void;
  setUnitType: (unitType: UnitType) => void;
  setUnitValue: (unitValue: number) => void;
  setUnit: (unit: string) => void;
  setRecurrence: (recurrence: Recurrence) => void;
  setSelectedIconColor: (selectedIconColor: string) => void;
  setSelectedIcon: (selectedIcon: string) => void;
  setWeeks: (weeks: number) => void;
  resetForm: () => void;
}

export const initialFormState: FormState = {
  name: "",
  timeOfDay: ["Morning", "Afternoon", "Evening"],
  repeatType: "daily",
  dailyRepeat: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  monthlyRepeat: [1],
  intervalRepeat: 2,
  timeReminder: new Date(),
  startDate: new Date(),
  unitType: "General",
  unitValue: 1,
  unit: "times",
  recurrence: "per day",
  selectedIconColor: "#2AA8CF",
  selectedIcon: null,
  weeks: 1,
};

export const useGoalFormStore = create<FormState & FormActions>()((set) => ({
  name: initialFormState.name,
  setName: (name) => set({ name }),
  timeOfDay: initialFormState.timeOfDay,
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  repeatType: initialFormState.repeatType,
  setRepeatType: (repeatType) => set({ repeatType }),
  dailyRepeat: initialFormState.dailyRepeat,
  setDailyRepeat: (dailyRepeat) => set({ dailyRepeat }),
  resetDailyRepeat: () => set({ dailyRepeat: initialFormState.dailyRepeat }),
  monthlyRepeat: initialFormState.monthlyRepeat,
  setMonthlyRepeat: (monthlyRepeat) => set({ monthlyRepeat }),
  resetMonthlyRepeat: () =>
    set({ monthlyRepeat: initialFormState.monthlyRepeat }),
  intervalRepeat: initialFormState.intervalRepeat,
  setIntervalRepeat: (intervalRepeat) => set({ intervalRepeat }),
  resetIntervalRepeat: () =>
    set({ intervalRepeat: initialFormState.intervalRepeat }),
  timeReminder: new Date(),
  setTimeReminder: (timeReminder) => set({ timeReminder }),
  startDate: new Date(),
  setStartDate: (startDate) => set({ startDate }),
  unitType: initialFormState.unitType,
  setUnitType: (unitType) => set({ unitType }),
  unitValue: initialFormState.unitValue,
  setUnitValue: (unitValue) => set({ unitValue }),
  unit: initialFormState.unit,
  setUnit: (unit) => set({ unit }),
  recurrence: initialFormState.recurrence,
  setRecurrence: (recurrence) => set({ recurrence }),
  selectedIconColor: initialFormState.selectedIconColor,
  setSelectedIconColor: (selectedIconColor) => set({ selectedIconColor }),
  selectedIcon: initialFormState.selectedIcon,
  setSelectedIcon: (selectedIcon) => set({ selectedIcon }),
  weeks: initialFormState.weeks,
  setWeeks: (weeks) => set({ weeks }),
  resetForm: () => set(initialFormState),
}));
