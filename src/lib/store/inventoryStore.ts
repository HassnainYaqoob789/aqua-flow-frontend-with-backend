import { createStoreFactory } from "./storeFactory";
import { InventoryResponse } from "@/lib/types/auth";

interface InventoryState {
  inventory: InventoryResponse | null;
}

export const useInventoryStore = createStoreFactory<InventoryState>({
  inventory: null,
});

// Set full inventory response
export const setInventory = (data: InventoryResponse) =>
  useInventoryStore.getState().setState({ inventory: data });

// Patch/merge inventory (useful for partial updates)
export const updateInventory = (partial: Partial<InventoryResponse>) => {
  const { inventory } = useInventoryStore.getState().state;
  if (!inventory) return;

  useInventoryStore.getState().setState({
    inventory: { ...inventory, ...partial },
  });
};

// Clear inventory (reset)
export const clearInventory = () =>
  useInventoryStore.getState().resetState();
