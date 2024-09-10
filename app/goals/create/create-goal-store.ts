import { create } from "zustand";

interface CreateGoalFormState {
  name: string;
  setName: (name: string) => void;
}

export const useCreateGoalFormStore = create<CreateGoalFormState>()((set) => ({
  name: "",
  setName: (name: string) => set({ name }),
}));
