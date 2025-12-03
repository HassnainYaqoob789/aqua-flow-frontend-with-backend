// useDriverStore.ts
import { createStoreFactory } from "./storeFactory";
import { Customer, Driver } from "@/lib/types/auth";
import { useCustomerStore } from "./useCustomerZoneStore";

interface DriverState {
  drivers: Driver[];
}

export const useDriverStore = createStoreFactory<DriverState>({
  drivers: [],
});

export const setDrivers = (list: Driver[]) =>
  useDriverStore.getState().setState({ drivers: list });

export const addDriver = (driver: Driver) =>
  useDriverStore.getState().setState({
    drivers: [...useDriverStore.getState().state.drivers, driver],
  });

export const status_Driver = (driver: Driver) => {
  const { state, setState } = useDriverStore.getState();

  setState({
    drivers: state.drivers.map((d) =>
      d.id === driver.id ? driver : d
    ),
  });
};

export const update_Driver = (driver: Driver) => {
  const { state, setState } = useDriverStore.getState();
  setState({
    drivers: state.drivers.map((c) =>
      c.id === driver.id ? driver : c
    ),
  });
};


export const status_update_Driver = (driver: Driver) => {
  const { state, setState } = useDriverStore.getState();
  setState({
    drivers: state.drivers.map((d) =>
      d.id === driver.id ? driver : d
    ),
  });
};


export const clearDrivers = () =>
  useDriverStore.getState().resetState();
