export interface CustomerDetails {
  name: string;
  mobile: string;
  tableId: string;
  notes?: string;
}

export interface TableInfo {
  id: string; // e.g., 'T01'
  name: string; // e.g., 'Table 01'
  zone: string; // e.g., 'Indoor Ground', 'Patio', 'Rooftop'
  seats: number;
}
