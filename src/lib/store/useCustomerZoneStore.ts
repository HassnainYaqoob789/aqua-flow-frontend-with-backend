// useCustomerStore.ts
import { createStoreFactory } from "./storeFactory";
import { Customer } from "@/lib/types/auth";

interface CustomerZoneState {
  customers: Customer[];
}

export const useCustomerStore = createStoreFactory<CustomerZoneState>({
  customers: [],
});

export const setCustomers = (list: Customer[]) =>
  useCustomerStore.getState().setState({ customers: list });

export const clearCustomers = () =>
  useCustomerStore.getState().resetState();
