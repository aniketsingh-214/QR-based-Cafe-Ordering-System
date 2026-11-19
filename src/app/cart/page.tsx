"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  UtensilsCrossed,
  Receipt,
  User,
  Phone,
  MapPin,
  Edit2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useCustomerStore } from "@/store/customer-store";
import { formatCurrency } from "@/lib/utils";
import { getTableById } from "@/data/tables";
import CustomerDetailsModal from "@/components/customer/CustomerDetailsModal";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getTaxAmount,
    getGrandTotal,
    taxPercent,
  } = useCartStore();

  const { tableId, name, mobile, notes, setNotes } = useCustomerStore();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const subtotal = getSubtotal();
  const taxAmount = getTaxAmount();
  const grandTotal = getGrandTotal();
  const activeTableInfo = getTableById(tableId);

  const handleProceedToCheckout = () => {
    // If mobile is not filled, open the modal first
    if (!mobile || !tableId) {
      setIsCustomerModalOpen(true);
      return;
    }
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-cafe-100 rounded-full flex items-center justify-center mx-auto text-cafe-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-extrabold text-cafe-950">Your Cart is Empty</h2>
        <p className="text-xs text-cafe-600 max-w-xs mx-auto leading-relaxed">
          Looks like you haven&apos;t added any delicious items to your table order yet.
        </p>
        <button
          onClick={() => router.push(tableId ? `/menu?table=${tableId}` : "/menu")}
          className="px-6 py-3 bg-cafe-950 text-white rounded-2xl text-sm font-bold shadow-md hover:bg-cafe-900 inline-flex items-center gap-2"
        >
          <UtensilsCrossed className="w-4 h-4 text-amber-300" />
          <span>Browse Cafe Menu</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(tableId ? `/menu?table=${tableId}` : "/menu")}
          className="flex items-center gap-1.5 text-xs font-bold text-cafe-700 hover:text-cafe-950"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Table & Customer Summary Card */}
      <div className="bg-white rounded-2xl p-4 border border-cafe-200/90 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cafe-900 text-amber-300 flex items-center justify-center font-black text-sm">
            {tableId || "T??"}
          </div>
          <div>
            <p className="font-extrabold text-cafe-950 text-sm flex items-center gap-1.5">
              <span>{activeTableInfo ? activeTableInfo.name : `Table ${tableId || "Unset"}`}</span>
              {activeTableInfo && (
                <span className="text-[11px] text-cafe-500 font-normal">
                  ({activeTableInfo.zone})
                </span>
              )}
            </p>
            <p className="text-xs text-cafe-600">
              {mobile ? (
                <span>
                  {name || "Guest"} · {mobile}
                </span>
              ) : (
                <span className="text-amber-700 font-medium">Please add your mobile number</span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCustomerModalOpen(true)}
          className="p-2 rounded-xl bg-cafe-100 hover:bg-cafe-200 text-cafe-700 transition-colors"
          title="Edit Details"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      {/* Cart Items List */}
      <div className="bg-white rounded-3xl p-5 border border-cafe-200/90 shadow-soft space-y-4">
        <h3 className="font-extrabold text-cafe-950 text-base pb-2 border-b border-cafe-100 flex items-center justify-between">
          <span>Items in Your Order</span>
          <span className="text-xs font-semibold text-cafe-500">
            {items.reduce((s, i) => s + i.quantity, 0)} items
          </span>
        </h3>

        <div className="divide-y divide-cafe-100">
          {items.map((cartItem) => {
            const itemTotal = cartItem.item.price * cartItem.quantity;

            return (
              <div key={cartItem.item.id} className="py-3.5 flex items-start gap-3">
                {/* Item Image */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cafe-100 shrink-0">
                  <Image
                    src={cartItem.item.image}
                    alt={cartItem.item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info & Quantity */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-cafe-950 text-sm leading-tight truncate">
                      {cartItem.item.name}
                    </h4>
                    <span className="font-black text-cafe-950 text-sm">
                      {formatCurrency(itemTotal)}
                    </span>
                  </div>

                  <p className="text-xs text-cafe-500 mt-0.5">
                    {formatCurrency(cartItem.item.price)} each
                  </p>

                  {cartItem.notes && (
                    <p className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md mt-1 inline-block border border-amber-200">
                      Note: {cartItem.notes}
                    </p>
                  )}

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center gap-2 bg-cafe-100/90 rounded-xl px-2 py-1">
                      <button
                        onClick={() =>
                          updateQuantity(cartItem.item.id, cartItem.quantity - 1)
                        }
                        className="p-1 rounded text-cafe-700 hover:bg-cafe-200 active:scale-90 transition-transform"
                      >
                        <Minus className="w-3.5 h-3.5 text-cafe-700" />
                      </button>
                      <span className="text-xs font-bold text-cafe-950 w-5 text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(cartItem.item.id, cartItem.quantity + 1)
                        }
                        className="p-1 rounded text-cafe-700 hover:bg-cafe-200 active:scale-90 transition-transform"
                      >
                        <Plus className="w-3.5 h-3.5 text-cafe-700" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(cartItem.item.id)}
                      className="text-cafe-400 hover:text-red-600 p-1 rounded-lg"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Kitchen Cooking Notes */}
      <div className="bg-white rounded-2xl p-4 border border-cafe-200/90 shadow-2xs">
        <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-cafe-600" />
          Kitchen Cooking Instructions
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Please bring water glasses, make coffee extra hot, serve drinks first..."
          rows={2}
          className="w-full px-3 py-2 border border-cafe-300 rounded-xl text-cafe-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-600"
        />
      </div>

      {/* Bill Calculation Summary Card */}
      <div className="bg-white rounded-3xl p-5 border border-cafe-200/90 shadow-soft space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-cafe-100">
          <Receipt className="w-4 h-4 text-cafe-800" />
          <h3 className="font-extrabold text-cafe-950 text-sm">Bill Summary</h3>
        </div>

        <div className="space-y-2 text-xs text-cafe-700">
          <div className="flex justify-between">
            <span>Item Subtotal</span>
            <span className="font-semibold text-cafe-950">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between text-cafe-600">
            <span>Taxes & GST ({taxPercent}%)</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>

          <div className="pt-2 border-t border-cafe-200 flex justify-between items-baseline">
            <span className="text-sm font-extrabold text-cafe-950">Grand Total</span>
            <span className="text-lg font-black text-cafe-950">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Action Button */}
      <button
        onClick={handleProceedToCheckout}
        className="w-full py-4 px-5 rounded-2xl bg-cafe-950 hover:bg-cafe-900 text-white font-extrabold text-base shadow-elevated flex items-center justify-between transition-transform active:scale-[0.99] group"
      >
        <div className="text-left">
          <p className="text-[11px] text-cafe-300 font-normal">Ready to order</p>
          <p className="text-base font-black text-white">{formatCurrency(grandTotal)}</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500 text-cafe-950 px-4 py-2 rounded-xl font-black text-sm group-hover:bg-amber-400">
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>

      {/* Customer Modal if needs update */}
      <CustomerDetailsModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />
    </div>
  );
}
