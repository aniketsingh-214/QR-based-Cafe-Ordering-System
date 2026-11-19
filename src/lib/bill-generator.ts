import { Order, CafeConfig } from "@/types/order";
import { DEFAULT_CAFE_CONFIG } from "@/data/config";

export interface ItemizedBill {
  orderId: string;
  orderDate: string;
  tableId: string;
  customerName: string;
  customerMobile: string;
  cafe: CafeConfig;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    notes?: string;
  }[];
  subtotal: number;
  cgst: number;
  sgst: number;
  taxAmount: number;
  grandTotal: number;
  specialInstructions?: string;
}

export function generateItemizedBill(
  order: Order,
  cafeConfig: CafeConfig = DEFAULT_CAFE_CONFIG
): ItemizedBill {
  const cgst = Math.round(((order.subtotal * (order.taxPercent / 2)) / 100) * 100) / 100;
  const sgst = Math.round((order.taxAmount - cgst) * 100) / 100;

  return {
    orderId: order.orderId,
    orderDate: order.createdAt,
    tableId: order.tableId,
    customerName: order.customerName || "Valued Guest",
    customerMobile: order.customerMobile,
    cafe: cafeConfig,
    items: order.items.map((ci) => ({
      name: ci.item.name,
      quantity: ci.quantity,
      unitPrice: ci.item.price,
      total: ci.item.price * ci.quantity,
      notes: ci.notes,
    })),
    subtotal: order.subtotal,
    cgst,
    sgst,
    taxAmount: order.taxAmount,
    grandTotal: order.totalAmount,
    specialInstructions: order.specialInstructions,
  };
}

export function printBill(): void {
  if (typeof window !== "undefined") {
    window.print();
  }
}
