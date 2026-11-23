"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, ShoppingBag, X, Check, UtensilsCrossed } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useCustomerStore } from "@/store/customer-store";
import { CAFE_TABLES } from "@/data/tables";

export default function Header() {
  const router = useRouter();
  const itemCount = useCartStore((s) => s.getItemCount());
  const { tableId, setTableId } = useCustomerStore();

  const [isTableOpen, setIsTableOpen] = useState(false);
  const [tempTable, setTempTable] = useState(tableId || "");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleOpenTable = () => {
    setTempTable(tableId || "");
    setSavedNotice(false);
    setIsTableOpen(true);
  };

  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempTable) {
      setTableId(tempTable);
    }
    setSavedNotice(true);
    setTimeout(() => {
      setIsTableOpen(false);
      setSavedNotice(false);
    }, 800);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cafe-200/80 shadow-xs no-print">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div
            onClick={() => router.push(tableId ? `/menu?table=${tableId}` : "/")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cafe-700 to-cafe-900 flex items-center justify-center text-amber-100 shadow-sm transition-transform group-hover:scale-105">
              <Coffee className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h1 className="font-bold text-cafe-950 text-base leading-tight tracking-tight flex items-center gap-1.5">
                The Roast & Toast
                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-medium border border-amber-300">
                  QR Order
                </span>
              </h1>
              <p className="text-[11px] text-cafe-600 font-medium">Artisan Coffee & Bistro</p>
            </div>
          </div>

          {/* Right Actions: Table Pill, Cart (no owner/staff controls on the customer site) */}
          <div className="flex items-center gap-2">
            {tableId ? (
              <button
                onClick={handleOpenTable}
                title="Change Table"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-cafe-100 text-cafe-900 text-xs font-semibold border border-cafe-300/80 hover:bg-cafe-200 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{tableId}</span>
              </button>
            ) : (
              <button
                onClick={handleOpenTable}
                className="text-xs px-2.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors font-medium flex items-center gap-1"
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700" />
                <span>Select Table</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => router.push("/cart")}
              className="relative p-2.5 bg-cafe-900 hover:bg-cafe-800 text-white rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Table picker modal */}
      {isTableOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-elevated border border-cafe-200">
            <div className="flex items-center justify-between pb-3 border-b border-cafe-100">
              <h2 className="font-bold text-cafe-950 text-base">Your Table</h2>
              <button
                onClick={() => setIsTableOpen(false)}
                className="p-1 rounded-lg text-cafe-500 hover:text-cafe-900 hover:bg-cafe-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTable} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1">
                  Dining Table
                </label>
                <select
                  value={tempTable}
                  onChange={(e) => setTempTable(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-cafe-300 rounded-xl text-cafe-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-cafe-600 bg-cafe-50/50"
                >
                  <option value="" disabled>
                    Select your table
                  </option>
                  {CAFE_TABLES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id} — {t.name} ({t.zone})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-cafe-500 mt-1">
                  Scan the QR code on your table, or pick your table here.
                </p>
              </div>

              {savedNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Table updated!
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTableOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-cafe-300 text-cafe-700 text-sm font-semibold hover:bg-cafe-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cafe-900 hover:bg-cafe-800 text-white text-sm font-semibold shadow-xs"
                >
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
