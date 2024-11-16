import { create } from "zustand";
import type { RECURRENCE } from "./target/constants";


interface FormState {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  points: string;
}

interface FormActions {
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setStartDate: (startDate: Date) => void;
  setEndDate: (endDate: Date) => void;
  setPoints: (points: string) => void;
}

export const initialFormState: FormState = {
  name: "",
  description: "",
  startDate: new Date(),
  endDate: new Date(),
  points: "",
};

export const useChallengeFormStore = create<FormState & FormActions>()((set) => ({
  name: initialFormState.name,
  setName: (name) => set({ name }),
  description: initialFormState.description,
  setDescription: (description) => set({ description }),
  startDate: new Date(),
  setStartDate: (startDate) => set({ startDate }),
  endDate: new Date(),
  setEndDate: (endDate) => set({ endDate }),
  points: initialFormState.points,
  setPoints: (points) => set({ points }),
}));
