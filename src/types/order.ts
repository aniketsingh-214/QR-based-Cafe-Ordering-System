import { MenuItem } from "./menu";

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Order {
  orderId: string;
  createdAt: string;
  tableId: string;
  customerName?: string;
  customerMobile: string;
  items: CartItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  totalAmount: number;
  specialInstructions?: string;
  status: "placed" | "preparing" | "served" | "completed";
}

export interface CafeConfig {
  cafeName: string;
  cafeTagline: string;
  address: string;
  gstNumber?: string;
  fssaiNumber?: string;
  ownerWhatsAppNumber: string; // international format without + or spaces e.g., '919876543210'
  taxPercent: number; // e.g. 5
  currencySymbol: string;
  supportPhone: string;
}
