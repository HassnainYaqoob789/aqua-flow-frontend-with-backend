import { createStoreFactory } from "./storeFactory";
import { Order, CreateOrderPayload } from "@/lib/types/auth";

interface OrderState {
  orders: Order[];
}

export const useOrderStore = createStoreFactory<OrderState>({
  orders: [],
});

// Set the entire list of orders
export const setOrders = (list: Order[]) =>
  useOrderStore.getState().setState({ orders: list });

// Add a new order
export const addOrder = (order: Order) =>
  useOrderStore.getState().setState({
    orders: [...useOrderStore.getState().state.orders, order],
  });

// Update an existing order
export const updateOrder = (updatedOrder: Order) => {
  const currentOrders = useOrderStore.getState().state.orders;
  const updatedOrders = currentOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order
  );
  useOrderStore.getState().setState({ orders: updatedOrders });
};

// Clear all orders
export const clearOrders = () => useOrderStore.getState().resetState();
