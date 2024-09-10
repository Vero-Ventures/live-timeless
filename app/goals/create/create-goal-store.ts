import { create } from "zustand";

type TimeOfDay = "Morning" | "Afternoon" | "Evening";

interface CreateGoalFormState {
  name: string;
  setName: (name: string) => void;
  timeOfDay: TimeOfDay[];
  setTimeOfDay: (timeOfDay: TimeOfDay[]) => void;
}

export const useCreateGoalFormStore = create<CreateGoalFormState>()((set) => ({
  name: "",
  setName: (name) => set({ name }),
  timeOfDay: ["Morning", "Afternoon", "Evening"],
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
}));
