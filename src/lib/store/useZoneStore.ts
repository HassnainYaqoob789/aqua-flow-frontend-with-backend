import { createStoreFactory } from "./storeFactory";
import { Zone } from "@/lib/types/auth";

interface CustomerState {
  zone: Zone[];
}

export const useZoneStore = createStoreFactory<CustomerState>({
  zone: [],
});

export const setZone = (zone: Zone[]) =>
  useZoneStore.getState().setState({ zone });

export const addZone = (zone: Zone) =>
  useZoneStore.getState().setState({
    zone: [...useZoneStore.getState().state.zone, zone],
  });



export const clearZone = () =>
  useZoneStore.getState().resetState();
