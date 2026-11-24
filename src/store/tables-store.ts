import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TableInfo } from "@/types/customer";

export const DEFAULT_CAFE_TABLES: TableInfo[] = [
  { id: "T01", name: "Table 01", zone: "Indoor Window", seats: 2 },
  { id: "T02", name: "Table 02", zone: "Indoor Main Hall", seats: 4 },
  { id: "T03", name: "Table 03", zone: "Indoor Main Hall", seats: 4 },
  { id: "T04", name: "Table 04", zone: "Cozy Corner Lounge", seats: 6 },
  { id: "T05", name: "Table 05", zone: "Patio Terrace", seats: 2 },
  { id: "T06", name: "Table 06", zone: "Patio Terrace", seats: 4 },
  { id: "T07", name: "Table 07", zone: "Garden Gazebo", seats: 4 },
  { id: "T08", name: "Table 08", zone: "Garden Gazebo", seats: 6 },
  { id: "T09", name: "Table 09", zone: "Mezzanine Quiet Study", seats: 2 },
  { id: "T10", name: "Table 10", zone: "Mezzanine Quiet Study", seats: 2 },
  { id: "T11", name: "Table 11", zone: "Outdoor Bar Counter", seats: 1 },
  { id: "T12", name: "Table 12", zone: "Outdoor Bar Counter", seats: 1 },
];

interface TablesStoreState {
  tables: TableInfo[];
  addTable: (table: TableInfo) => boolean;
  removeTable: (id: string) => void;
  resetDefaultTables: () => void;
  getTableById: (id: string) => TableInfo;
  isExistingTable: (id: string) => boolean;
}

export const useTablesStore = create<TablesStoreState>()(
  persist(
    (set, get) => ({
      tables: DEFAULT_CAFE_TABLES,

      isExistingTable: (id: string) => {
        if (!id) return false;
        const cleanId = id.trim().toUpperCase();
        return get().tables.some((t) => t.id.toUpperCase() === cleanId);
      },

      addTable: (table) => {
        const cleanId = table.id.trim().toUpperCase();
        if (!cleanId) return false;
        if (get().isExistingTable(cleanId)) {
          return false;
        }

        const newTable: TableInfo = {
          id: cleanId,
          name: table.name?.trim() || `Table ${cleanId}`,
          zone: table.zone?.trim() || "Main Dining Area",
          seats: table.seats || 4,
        };

        set((state) => ({ tables: [...state.tables, newTable] }));
        return true;
      },

      removeTable: (id) => {
        const cleanId = id.trim().toUpperCase();
        set((state) => ({
          tables: state.tables.filter((t) => t.id.toUpperCase() !== cleanId),
        }));
      },

      resetDefaultTables: () => {
        set({ tables: DEFAULT_CAFE_TABLES });
      },

      getTableById: (id) => {
        if (!id) {
          return { id: "T01", name: "Table 01", zone: "Indoor Dining", seats: 4 };
        }
        const cleanId = id.trim().toUpperCase();
        const found = get().tables.find((t) => t.id.toUpperCase() === cleanId);
        if (found) return found;

        // Automatically synthesize a dynamic table object for any scanned or entered table
        return {
          id: cleanId,
          name: `Table ${cleanId}`,
          zone: "Dining Table",
          seats: 4,
        };
      },
    }),
    {
      name: "cafe-dynamic-tables-store",
    }
  )
);
