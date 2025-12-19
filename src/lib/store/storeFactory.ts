// // src/lib/store/createStoreFactory.ts
// import { create } from "zustand";

// export function createStoreFactory<T extends object>(initialState: T) {
//   return create<{
//     state: T;
//     setState: (partial: Partial<T>) => void;
//     resetState: () => void;
//   }>((set) => ({
//     state: initialState,
//     setState: (partial) =>
//       set((s) => ({ state: { ...s.state, ...partial } })),

//     resetState: () => set({ state: initialState }),
//   }));
// }


// src/lib/store/createStoreFactory.ts
import { create } from "zustand";

export function createStoreFactory<T extends object>(initialState: T) {
  return create<{
    state: T;
    setState: (
      updater: Partial<T> | ((state: T) => Partial<T>)
    ) => void;
    resetState: () => void;
  }>((set) => ({
    state: initialState,
    setState: (updater) =>
      set((current) => ({
        state:
          typeof updater === "function"
            ? { ...current.state, ...(updater as any)(current.state) }
            : { ...current.state, ...updater },
      })),
    resetState: () => set({ state: initialState }),
  }));
}