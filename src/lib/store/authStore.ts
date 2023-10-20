import { create } from "zustand";

export type AuthStore = {
  cardDisableStatus: boolean;
  setCardDisableStatus: (status: boolean) => void;
  authTitle: string;
  setAuthTitle: (title: string) => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  cardDisableStatus: false,
  setCardDisableStatus: (status: boolean) => set({ cardDisableStatus: status }),
  authTitle: "",
  setAuthTitle: (title: string) => set({ authTitle: title }),
}));
