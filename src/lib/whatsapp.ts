import { Order } from "@/types/order";

/**
 * Clean phone number to WhatsApp international format (digits only, e.g. 919876543210)
 */
export function sanitizeWhatsAppPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // If 10 digits (Indian mobile without country code), prepend 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

/**
 * Format the owner notification message as specified in the functional requirements
 */
export function generateOwnerOrderMessage(order: Order): string {
  const itemLines = order.items
    .map(
      (ci) =>
        `• ${ci.item.name} × ${ci.quantity} — ₹${ci.item.price * ci.quantity}${
          ci.notes ? ` (${ci.notes})` : ""
        }`
    )
    .join("\n");

  const specialNotes = order.specialInstructions
    ? `\n*Note:* ${order.specialInstructions}\n`
    : "";

  return `🔔 *NEW CAFE ORDER*
━━━━━━━━━━━━━━━━━━
*Order ID:* ${order.orderId}
*Table:* ${order.tableId}
*Customer:* ${order.customerName || "Guest"}
*Mobile:* ${order.customerMobile}
${specialNotes}
*Items:*
${itemLines}

*Subtotal:* ₹${order.subtotal.toFixed(2)}
*Tax (${order.taxPercent}%):* ₹${order.taxAmount.toFixed(2)}
*Total:* ₹${order.totalAmount.toFixed(2)}
━━━━━━━━━━━━━━━━━━
Please prepare this order. ☕`;
}

/**
 * Format the customer bill message for sharing with companions/friends or self
 */
export function generateCustomerBillShareMessage(order: Order, cafeName = "The Roast & Toast Cafe"): string {
  const itemLines = order.items
    .map(
      (ci) =>
        `• ${ci.item.name} (Qty: ${ci.quantity}) = ₹${ci.item.price * ci.quantity}`
    )
    .join("\n");

  return `🧾 *DIGITAL BILL — ${cafeName}*
━━━━━━━━━━━━━━━━━━
*Order ID:* ${order.orderId}
*Table:* ${order.tableId}
*Date:* ${new Date(order.createdAt).toLocaleString("en-IN")}
*Customer:* ${order.customerName || "Guest"}

*Items Ordered:*
${itemLines}

*Subtotal:* ₹${order.subtotal.toFixed(2)}
*Taxes & GST:* ₹${order.taxAmount.toFixed(2)}
*Grand Total:* ₹${order.totalAmount.toFixed(2)}
━━━━━━━━━━━━━━━━━━
Thank you for dining with us! Have a wonderful day ahead. ✨`;
}

/**
 * Generate click-to-chat WhatsApp link
 */
export function getWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleaned = sanitizeWhatsAppPhone(phoneNumber);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

/**
 * Open WhatsApp click-to-chat
 */
export function openWhatsApp(phoneNumber: string, message: string): void {
  const url = getWhatsAppUrl(phoneNumber, message);
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
