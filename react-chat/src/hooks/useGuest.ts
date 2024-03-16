import { create } from "zustand";
type Guest = {
  id: string | null;
  name: string | null;
};
interface useGuestStore {
  guest: Guest;
  setGuest: (id: string, name: string) => void;
}

export const useGuest = create<useGuestStore>((set) => ({
  guest: {
    id: null,
    name: null,
  },
  setGuest: (id, name) => set({ guest: { id, name } }),
}));
