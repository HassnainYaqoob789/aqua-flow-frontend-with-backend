import { createStoreFactory } from "./storeFactory";
import { Customer } from "@/lib/types/auth";

interface CustomerState {
  customers: Customer[];
}

export const useCustomerStore = createStoreFactory<CustomerState>({
  customers: [],
});

export const setCustomers = (customers: Customer[]) =>
  useCustomerStore.getState().setState({ customers });

export const addCustomer = (customer: Customer) =>
  useCustomerStore.getState().setState({
    customers: [...useCustomerStore.getState().state.customers, customer],
  });

  export const update_Customer = (customer: Customer) =>
  useCustomerStore.getState().setState({
    customers: [...useCustomerStore.getState().state.customers, customer],
  });

export const status_Customer = (customer: Customer) => {
  const state = useCustomerStore.getState();
  useCustomerStore.getState().setState({
    customers: state.state.customers.map((c) =>
      c.id === customer.id ? customer : c
    ),
  });
};




export const clearCustomers = () =>
  useCustomerStore.getState().resetState();
