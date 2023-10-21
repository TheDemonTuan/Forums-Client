import { create } from "zustand";

export type AccountPrivateStore = {
  isFormHandle: boolean;
  setIsFormHandle: (status: boolean) => void;
};

export const useAccountPrivateStore = create<AccountPrivateStore>()((set) => ({
  isFormHandle: false,
  setIsFormHandle: (status: boolean) => set({ isFormHandle: status }),
}));


export type AccountSessionsStore = {
  isTableHandle: boolean;
  setTableHandle: (status: boolean) => void;
};

export const useAccountSessionsStore = create<AccountSessionsStore>()((set) => ({
  isTableHandle: false,
  setTableHandle: (status: boolean) => set({ isTableHandle: status }),
}));

