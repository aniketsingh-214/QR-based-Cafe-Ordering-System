import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  MessageSquare,
  AlertCircle,
  Receipt,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useCustomerStore } from "@/store/customer-store";
import { formatCurrency } from "@/lib/utils";
import { getTableById } from "@/data/tables";
import { buildOrder } from "@/lib/order-generator";
import { normalizeIndianMobile } from "@/lib/whatsapp";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getTaxAmount, getGrandTotal, taxPercent, clearCart, setLastOrder } =
    useCartStore();
  const { tableId, name, mobile, notes, setName, setMobile, setTableId, setNotes } =
    useCustomerStore();

  const [formName, setFormName] = useState(name);
  const [formMobile, setFormMobile] = useState(mobile);
  const [formTable, setFormTable] = useState(tableId || "");
  const [formNotes, setFormNotes] = useState(notes);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const taxAmount = getTaxAmount();
  const grandTotal = getGrandTotal();
  const activeTableInfo = getTableById(formTable);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      setError("Your cart is empty. Please add items before placing an order.");
      return;
    }

    const actual10Digits = normalizeIndianMobile(formMobile);
    if (!actual10Digits) {
      setError("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).");
      return;
    }

    if (!formTable) {
      setError("Please specify your table number.");
      return;
    }

    setIsSubmitting(true);

    // Save details to store
    setName(formName.trim());
    setMobile(actual10Digits);
    setTableId(formTable);
    setNotes(formNotes.trim());

    // Build the order object
    const newOrder = buildOrder(
      items,
      {
        name: formName.trim(),
        mobile: actual10Digits,
        tableId: formTable,
        notes: formNotes.trim(),
      },
      taxPercent,
      formNotes.trim()
    );

    // Save into lastOrder in store
    setLastOrder(newOrder);

    // Clear active cart items
    clearCart();

    // Route to confirmation / digital bill screen
    navigate("/order-success");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-cafe-950">No items to checkout</h2>
        <button
          onClick={() => navigate(tableId ? `/menu?table=${tableId}` : "/menu")}
          className="px-6 py-2.5 bg-cafe-900 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Back to Cart link */}
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center gap-1.5 text-xs font-bold text-cafe-700 hover:text-cafe-950 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Cart</span>
      </button>

      <div className="border-b border-cafe-200 pb-2">
        <h1 className="text-2xl font-black text-cafe-950">Review & Place Order</h1>
        <p className="text-xs text-cafe-600 mt-0.5">
          Step 06 · Review dining table and contact details for instant WhatsApp order transmission.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="space-y-5">
        {/* Customer & Dining Details Card */}
        <div className="bg-white rounded-3xl p-5 border border-cafe-200/90 shadow-soft space-y-4">
          <h2 className="font-extrabold text-cafe-950 text-sm flex items-center gap-2 border-b border-cafe-100 pb-2">
            <User className="w-4 h-4 text-cafe-800" />
            <span>Table & Customer Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Table Number */}
            <div>
              <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cafe-600" />
                Table Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formTable}
                onChange={(e) => setFormTable(e.target.value.toUpperCase())}
                placeholder="e.g. T01"
                className="w-full px-3.5 py-2.5 border border-cafe-300 rounded-xl text-cafe-950 text-sm font-bold bg-cafe-50/50 uppercase"
                required
              />
              {activeTableInfo && (
                <p className="text-[11px] text-cafe-500 mt-1">
                  {activeTableInfo.name} ({activeTableInfo.zone})
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-cafe-600" />
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cafe-500 text-xs font-bold pointer-events-none">
                  +91
                </span>
                <input
                  type="tel"
                  value={formMobile}
                  onChange={(e) => {
                    setFormMobile(e.target.value);
                    if (error) setError(null);
                  }}
                  maxLength={10}
                  placeholder="9876543210"
                  className="w-full pl-11 pr-3.5 py-2.5 border border-cafe-300 rounded-xl text-cafe-950 text-sm font-medium"
                  required
                />
              </div>
            </div>

            {/* Customer Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cafe-600" />
                Customer Name <span className="text-cafe-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Rahul"
                className="w-full px-3.5 py-2.5 border border-cafe-300 rounded-xl text-cafe-950 text-sm"
              />
            </div>

            {/* Special Instructions */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-cafe-600" />
                Kitchen Notes / Requests <span className="text-cafe-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="e.g. Please serve drinks first, extra napkins"
                className="w-full px-3.5 py-2.5 border border-cafe-300 rounded-xl text-cafe-900 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Itemized Order Review */}
        <div className="bg-white rounded-3xl p-5 border border-cafe-200/90 shadow-soft space-y-3">
          <h2 className="font-extrabold text-cafe-950 text-sm flex items-center gap-2 border-b border-cafe-100 pb-2">
            <Receipt className="w-4 h-4 text-cafe-800" />
            <span>Order Summary ({items.length} unique items)</span>
          </h2>

          <div className="space-y-2 divide-y divide-cafe-100">
            {items.map((ci) => (
              <div key={ci.item.id} className="pt-2 flex justify-between items-start text-xs">
                <div>
                  <p className="font-bold text-cafe-950">
                    {ci.item.name}{" "}
                    <span className="text-cafe-500 font-normal">× {ci.quantity}</span>
                  </p>
                  {ci.notes && <p className="text-[11px] text-amber-800">Note: {ci.notes}</p>}
                </div>
                <span className="font-black text-cafe-950">
                  {formatCurrency(ci.item.price * ci.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-cafe-200 space-y-1.5 text-xs text-cafe-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-cafe-950">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-cafe-600">
              <span>Taxes & GST ({taxPercent}%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <div className="pt-2 border-t border-cafe-200 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-cafe-950">Grand Total</span>
              <span className="text-xl font-black text-cafe-950">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Informational WhatsApp Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-emerald-950">Instant WhatsApp Order Notification</p>
            <p className="text-emerald-800 mt-0.5 leading-relaxed">
              When you confirm, WhatsApp will open with your pre-formatted order message for the cafe kitchen, and your itemized digital bill will be ready.
            </p>
          </div>
        </div>

        {/* Place Order CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-base shadow-elevated flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{isSubmitting ? "Generating Order..." : "Confirm & Place Order"}</span>
        </button>
      </form>
    </div>
  );
}
