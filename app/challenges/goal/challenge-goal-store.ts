import { create } from "zustand";

interface FormState {
  rate: string;
}

interface FormActions {
  setRate: (referenceDate: string) => void;
}

export const initialFormState: FormState = {
  rate: "",
};

export const useChallengeGoalFormStore = create<FormState & FormActions>()((set) => ({
  rate: initialFormState.rate,
  setRate: (rate) => set({ rate }),
}));
