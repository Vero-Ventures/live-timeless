import { create } from "zustand";

interface FormState {
  name: string;
  email: string;
  dob: Date;
  weight: string;
  height: string;
}

interface FormActions {
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setDob: (dob: Date) => void;
  setWeight: (weight: string) => void;
  setHeight: (height: string) => void;
}

export const useProfileFormStore = create<FormState & FormActions>()((set) => ({
  name: "",
  email: "",
  dob: new Date(),
  weight: "",
  height: "",
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setDob: (dob) => set({ dob }),
  setWeight: (weight) => set({ weight }),
  setHeight: (height) => set({ height }),
}));
