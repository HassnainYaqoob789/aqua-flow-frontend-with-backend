// src/lib/store/createStoreFactory.ts
import { create } from "zustand";

export function createStoreFactory<T extends object>(initialState: T) {
  return create<{
    state: T;
    setState: (partial: Partial<T>) => void;
    resetState: () => void;
  }>((set) => ({
    state: initialState,
    setState: (partial) =>
      set((s) => ({ state: { ...s.state, ...partial } })),

    resetState: () => set({ state: initialState }),
  }));
}
