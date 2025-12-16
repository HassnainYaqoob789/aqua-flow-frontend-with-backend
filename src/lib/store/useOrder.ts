// import { createStoreFactory } from "./storeFactory";
// import { Order, CreateOrderPayload } from "@/lib/types/auth";

// interface OrderState {
//   orders: Order[];
// }

// export const useOrderStore = createStoreFactory<OrderState>({
//   orders: [],
// });

// // Set the entire list of orders
// export const setOrders = (list: Order[]) =>
//   useOrderStore.getState().setState({ orders: list });

// // Add a new order
// export const addOrder = (order: Order) =>
//   useOrderStore.getState().setState({
//     orders: [...useOrderStore.getState().state.orders, order],
//   });

// // Update an existing order
// export const updateOrder = (updatedOrder: Order) => {
//   const currentOrders = useOrderStore.getState().state.orders;
//   const updatedOrders = currentOrders.map((order) =>
//     order.id === updatedOrder.id ? updatedOrder : order
//   );
//   useOrderStore.getState().setState({ orders: updatedOrders });
// };

// // Clear all orders
// export const clearOrders = () => useOrderStore.getState().resetState();
// Updated useOrder store (Zustand) - Simplified since we're not storing the full list anymore
// With pagination, we rely on TanStack Query for the list data. Keep Zustand for mutations/single-order state if needed.
// src/lib/store/useOrder.ts
import { createStoreFactory } from "./storeFactory";
import { Order } from "@/lib/types/typeInterfaces"; // Adjust path

interface OrderState {
  // Remove 'orders' array since it's now managed by TanStack Query
  // Add single-order state if needed for editing/modals
  currentOrder?: Order | null;
}

export const useOrderStore = createStoreFactory<OrderState>({
  currentOrder: null,
});

// Set current order (e.g., for editing)
export const setCurrentOrder = (order: Order | null) =>
  useOrderStore.getState().setState({ currentOrder: order });

// Clear current order
export const clearCurrentOrder = () => useOrderStore.getState().setState({ currentOrder: null });


// Mutations (add, update) now invalidate TanStack Query instead of mutating local state
// Use these in mutation hooks (see below for example)
export const invalidateOrders = () => {
  // This would be called in onSuccess of mutations
  // import { useQueryClient } from "@tanstack/react-query";
  // const queryClient = useQueryClient();
  // queryClient.invalidateQueries({ queryKey: ["orders"] });
};