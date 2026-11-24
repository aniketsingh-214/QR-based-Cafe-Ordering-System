import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Share2,
  Printer,
  MessageCircle,
  UtensilsCrossed,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useCustomerStore } from "@/store/customer-store";
import { Order } from "@/types/order";
import {
  generateOwnerOrderMessage,
  getOwnerOrderUrl,
  getCustomerBillUrl,
  OWNER_WHATSAPP,
} from "@/lib/whatsapp";
import { printBill } from "@/lib/bill-generator";
import DigitalReceipt from "@/components/receipt/DigitalReceipt";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { lastOrder, orderHistory } = useCartStore();
  const { tableId } = useCustomerStore();

  const [showMessagePreview, setShowMessagePreview] = useState(false);

  // Fallback order if user refreshed or navigated directly
  const order: Order | null =
    lastOrder || (orderHistory.length > 0 ? orderHistory[0] : null);

  useEffect(() => {
    // Fire festive confetti animation
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D97706", "#10B981", "#7E6040", "#F59E0B"],
      });
    } catch {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-cafe-950">No recent order found</h2>
        <p className="text-xs text-cafe-600">
          You haven&apos;t placed an order yet or browser storage was cleared.
        </p>
        <button
          onClick={() => navigate(tableId ? `/menu?table=${tableId}` : "/menu")}
          className="px-6 py-2.5 bg-cafe-900 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          Go to Menu
        </button>
      </div>
    );
  }

  // Owner number is a fixed constant (never customer-editable). Plain <a href> links are used instead of
  // window.open() so iOS Safari / in-app browsers (Google Lens, Instagram) cannot block the popup.
  const ownerMessage = generateOwnerOrderMessage(order);
  const ownerUrl = getOwnerOrderUrl(order);
  const customerBillUrl = getCustomerBillUrl(order);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Confirmation Hero Card */}
      <div className="text-center space-y-3 bg-white rounded-3xl p-6 sm:p-8 border border-cafe-200/90 shadow-soft no-print">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Order Placed Successfully
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-cafe-950 mt-2">
            Thank You, {order.customerName || "Valued Guest"}!
          </h1>
          <p className="text-xs sm:text-sm text-cafe-600 mt-1 max-w-sm mx-auto">
            Your order has been registered for{" "}
            <strong className="text-cafe-900">{order.tableId}</strong>.
          </p>
        </div>

        {/* WhatsApp Notification CTA Box (Step 08) */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-elevated space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-100">
            <MessageCircle className="w-4 h-4 text-emerald-200" />
            <span>Step 08 · Send Order to Kitchen</span>
          </div>

          <p className="text-xs text-emerald-50 max-w-md mx-auto leading-relaxed">
            <strong>Your order is not received by the kitchen until you tap Send in WhatsApp.</strong>{" "}
            Tap the button, then press the green send arrow in WhatsApp.
          </p>

          <a
            href={ownerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-white text-emerald-950 font-black text-sm sm:text-base hover:bg-emerald-50 shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
          >
            <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600" />
            <span>Send Order to Kitchen on WhatsApp</span>
          </a>

          <p className="text-[11px] text-emerald-200/90">
            Kitchen number: +{OWNER_WHATSAPP}
          </p>
        </div>

        {/* Message Preview Accordion */}
        <div className="pt-2 text-left">
          <button
            onClick={() => setShowMessagePreview(!showMessagePreview)}
            className="text-xs text-cafe-600 hover:text-cafe-900 font-medium flex items-center gap-1 mx-auto cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cafe-500" />
            <span>{showMessagePreview ? "Hide" : "Preview"} Pre-filled WhatsApp Text</span>
            {showMessagePreview ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showMessagePreview && (
            <div className="mt-2 p-3 bg-cafe-100 rounded-xl font-mono text-[11px] text-cafe-800 whitespace-pre-wrap border border-cafe-200">
              {ownerMessage}
            </div>
          )}
        </div>
      </div>

      {/* Sharing & Printing Action Buttons */}
      <div className="grid grid-cols-2 gap-3 no-print">
        {/* Share Bill on WhatsApp */}
        <a
          href={customerBillUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-white hover:bg-cafe-50 rounded-2xl border border-cafe-300 font-bold text-xs sm:text-sm text-cafe-900 shadow-2xs flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          <Share2 className="w-4 h-4 text-emerald-600" />
          <span>Send Bill to My WhatsApp</span>
        </a>

        {/* Print / Save PDF Bill */}
        <button
          onClick={printBill}
          className="p-3.5 bg-white hover:bg-cafe-50 rounded-2xl border border-cafe-300 font-bold text-xs sm:text-sm text-cafe-900 shadow-2xs flex items-center justify-center gap-2 transition-colors active:scale-95 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-cafe-800" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Digital Receipt / Tax Invoice */}
      <div className="space-y-2">
        <h2 className="text-sm font-extrabold text-cafe-950 px-2 flex items-center gap-1.5 no-print">
          <span>Digital Receipt & Itemized Tax Invoice</span>
        </h2>
        <DigitalReceipt order={order} />
      </div>

      {/* Return to Menu Button */}
      <div className="text-center pt-2 pb-6 no-print">
        <button
          onClick={() => navigate(`/menu?table=${order.tableId}`)}
          className="px-6 py-3 bg-cafe-950 text-white rounded-2xl text-xs sm:text-sm font-bold hover:bg-cafe-900 inline-flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <UtensilsCrossed className="w-4 h-4 text-amber-300" />
          <span>Order More Food for Table {order.tableId}</span>
        </button>
      </div>
    </div>
  );
}
