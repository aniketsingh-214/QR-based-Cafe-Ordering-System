import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CustomerStoreState {
  name: string;
  mobile: string;
  tableId: string;
  notes: string;

  setName: (name: string) => void;
  setMobile: (mobile: string) => void;
  setTableId: (tableId: string) => void;
  setNotes: (notes: string) => void;
  setCustomerDetails: (details: { name?: string; mobile?: string; tableId?: string; notes?: string }) => void;
  clearCustomer: () => void;
}

export const useCustomerStore = create<CustomerStoreState>()(
  persist(
    (set) => ({
      name: "",
      mobile: "",
      tableId: "",
      notes: "",

      setName: (name) => set({ name }),
      setMobile: (mobile) => set({ mobile }),
      setTableId: (tableId) => set({ tableId: tableId.toUpperCase() }),
      setNotes: (notes) => set({ notes }),
      setCustomerDetails: (details) =>
        set((state) => ({
          ...state,
          name: details.name !== undefined ? details.name : state.name,
          mobile: details.mobile !== undefined ? details.mobile : state.mobile,
          tableId: details.tableId !== undefined ? details.tableId.toUpperCase() : state.tableId,
          notes: details.notes !== undefined ? details.notes : state.notes,
        })),
      clearCustomer: () => set({ name: "", mobile: "", tableId: "", notes: "" }),
    }),
    {
      name: "cafe-customer-store",
      // v1: the owner's WhatsApp number is no longer stored on the customer's device.
      // Devices that already persisted the old placeholder number (919876543210) are migrated here,
      // otherwise returning customers would keep sending orders to the wrong number.
      version: 1,
      migrate: (persisted) => {
        const { customOwnerWhatsApp: _removed, ...rest } = (persisted ?? {}) as Record<string, unknown>;
        return rest as unknown as CustomerStoreState;
      },
    }
  )
);
