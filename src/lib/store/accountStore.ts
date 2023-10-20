import { create } from "zustand";

export type AccountStore = {
  isFormHandle: boolean;
  setIsFormHandle: (status: boolean) => void;
};

export const useAccountStore = create<AccountStore>()((set) => ({
  isFormHandle: false,
  setIsFormHandle: (status: boolean) => set({ isFormHandle: status }),
}));
