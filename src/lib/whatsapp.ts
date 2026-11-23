import { Order } from "@/types/order";
import { DEFAULT_CAFE_CONFIG } from "@/data/config";

/**
 * Normalise any Indian mobile input ("98765 43210", "+91 98765-43210", "09876543210", "919876543210")
 * to a bare 10-digit number. Returns null when it is not a valid Indian mobile number.
 */
export function normalizeIndianMobile(input: string): string | null {
  let digits = (input || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

/**
 * Clean phone number to WhatsApp international format (digits only, e.g. 919079629797).
 * Throws on invalid input so a bad number can never silently produce a dead wa.me link.
 */
export function sanitizeWhatsAppPhone(phone: string): string {
  const mobile = normalizeIndianMobile(phone);
  if (!mobile) throw new Error(`Invalid WhatsApp phone number: "${phone}"`);
  return `91${mobile}`;
}

/** The one and only kitchen/owner number. Never taken from customer-editable state. */
export const OWNER_WHATSAPP = sanitizeWhatsAppPhone(DEFAULT_CAFE_CONFIG.ownerWhatsAppNumber);

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
 * Format the customer bill message. It is sent to the number the customer entered at checkout.
 */
export function generateCustomerBillShareMessage(order: Order, cafeName = DEFAULT_CAFE_CONFIG.cafeName): string {
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
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

/** Link that opens a chat with the OWNER (919079629797) containing the kitchen order. */
export function getOwnerOrderUrl(order: Order): string {
  return getWhatsAppUrl(OWNER_WHATSAPP, generateOwnerOrderMessage(order));
}

/** Link that opens a chat with the CUSTOMER'S OWN number (as entered at checkout) containing their bill. */
export function getCustomerBillUrl(order: Order): string {
  return getWhatsAppUrl(order.customerMobile, generateCustomerBillShareMessage(order));
}
