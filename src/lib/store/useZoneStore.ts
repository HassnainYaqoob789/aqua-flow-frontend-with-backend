import { createStoreFactory } from "./storeFactory";
import { Zone } from "@/lib/types/auth";

interface ZoneState {
  zone: Zone[];
  selectedZoneId: string;  // Add this; use string | null if it can be unset
}

export const useZoneStore = createStoreFactory<ZoneState>({
  zone: [],
  selectedZoneId: "",  // Initialize as empty string (or null)
});

export const setZone = (zone: Zone[]) =>
  useZoneStore.getState().setState({ zone });

export const addZone = (zone: Zone) =>
  useZoneStore.getState().setState({
    zone: [...useZoneStore.getState().state.zone, zone],
  });

export const update_Zone = (zone: Zone) => {
  const { state, setState } = useZoneStore.getState();
  setState({
    zone: state.zone.map((c) =>
      c.id === zone.id ? zone : c
    ),
  });
};

export const delete_Zone = (zone: Zone) => {
  const { state, setState } = useZoneStore.getState();
  setState({
    zone: state.zone.filter((c) =>  // Fixed: Filter to remove, not map to same
      c.id !== zone.id
    ),
  });
};


export const status_Zone = (zone: Zone) => {
  const { state, setState } = useZoneStore.getState();
  setState({
    zone: state.zone.map((c) =>
      c.id === zone.id ? zone : c
    ),
  });
};

// Optional: Add a helper to update selectedZoneId (matches your component's usage pattern)
export const setSelectedZoneId = (zoneId: string) =>
  useZoneStore.getState().setState({ selectedZoneId: zoneId });

export const clearZone = () =>
  useZoneStore.getState().resetState();