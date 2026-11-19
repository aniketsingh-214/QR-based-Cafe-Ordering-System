import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_CAFE_CONFIG } from "@/data/config";

interface CustomerStoreState {
  name: string;
  mobile: string;
  tableId: string;
  notes: string;
  customOwnerWhatsApp: string;

  setName: (name: string) => void;
  setMobile: (mobile: string) => void;
  setTableId: (tableId: string) => void;
  setNotes: (notes: string) => void;
  setCustomOwnerWhatsApp: (phone: string) => void;
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
      customOwnerWhatsApp: DEFAULT_CAFE_CONFIG.ownerWhatsAppNumber,

      setName: (name) => set({ name }),
      setMobile: (mobile) => set({ mobile }),
      setTableId: (tableId) => set({ tableId: tableId.toUpperCase() }),
      setNotes: (notes) => set({ notes }),
      setCustomOwnerWhatsApp: (customOwnerWhatsApp) => set({ customOwnerWhatsApp }),
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
    }
  )
);
