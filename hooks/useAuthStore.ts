import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  token: null,
  setToken: (value) => set({ token: value }),
}))