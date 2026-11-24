import { TableInfo } from "@/types/customer";
import { DEFAULT_CAFE_TABLES, useTablesStore } from "@/store/tables-store";

export const CAFE_TABLES: TableInfo[] = DEFAULT_CAFE_TABLES;

export function getTableById(tableId: string): TableInfo | undefined {
  if (!tableId) return undefined;
  const normalized = tableId.trim().toUpperCase();
  try {
    return useTablesStore.getState().getTableById(normalized);
  } catch {
    const found = CAFE_TABLES.find((t) => t.id.toUpperCase() === normalized);
    return (
      found || {
        id: normalized,
        name: `Table ${normalized}`,
        zone: "Dining Table",
        seats: 4,
      }
    );
  }
}
