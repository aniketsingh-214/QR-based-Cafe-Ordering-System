import { CartItem, Order } from "@/types/order";
import { CustomerDetails } from "@/types/customer";

export function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // Get sequence counter or random 3-digit padded number
  let counter = 1;
  try {
    const key = `cafe_order_seq_${year}${month}${day}`;
    const stored = localStorage.getItem(key);
    counter = stored ? parseInt(stored, 10) + 1 : 1;
    localStorage.setItem(key, counter.toString());
  } catch {
    counter = Math.floor(Math.random() * 900) + 100;
  }

  const paddedSeq = String(counter).padStart(3, "0");
  return `ORD-${year}${month}${day}-${paddedSeq}`;
}

export function buildOrder(
  items: CartItem[],
  customer: CustomerDetails,
  taxPercent: number,
  notes?: string
): Order {
  const orderId = generateOrderId();
  const subtotal = items.reduce(
    (sum, ci) => sum + ci.item.price * ci.quantity,
    0
  );
  const taxAmount = Math.round(((subtotal * taxPercent) / 100) * 100) / 100;
  const totalAmount = Math.round((subtotal + taxAmount) * 100) / 100;

  return {
    orderId,
    createdAt: new Date().toISOString(),
    tableId: customer.tableId.toUpperCase(),
    customerName: customer.name?.trim() || "Guest",
    customerMobile: customer.mobile.trim(),
    items: [...items],
    subtotal,
    taxPercent,
    taxAmount,
    totalAmount,
    specialInstructions: notes?.trim() || customer.notes?.trim() || undefined,
    status: "placed",
  };
}
