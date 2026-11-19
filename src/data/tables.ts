import { TableInfo } from "@/types/customer";

export const CAFE_TABLES: TableInfo[] = [
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

export function getTableById(tableId: string): TableInfo | undefined {
  if (!tableId) return undefined;
  const normalized = tableId.trim().toUpperCase();
  return CAFE_TABLES.find((t) => t.id.toUpperCase() === normalized);
}
