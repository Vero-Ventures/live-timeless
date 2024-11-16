import { create } from "zustand";
import type { RECURRENCE } from "./target/constants";


interface FormState {
  name: string;
}

interface FormActions {
  setName: (name: string) => void;
}

export const initialFormState: FormState = {
  name: "",
};

export const useChallengeFormStore = create<FormState & FormActions>()((set) => ({
  name: initialFormState.name,
  setName: (name) => set({ name }),
}));
