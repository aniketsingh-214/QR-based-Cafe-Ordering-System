import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee, ShoppingBag, X, Check, UtensilsCrossed, MapPin, ChevronDown, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useCustomerStore } from "@/store/customer-store";
import { useTablesStore } from "@/store/tables-store";

export default function Header() {
  const navigate = useNavigate();
  // Granular selectors
  const itemCount = useCartStore((s) => s.getItemCount());
  const tableId = useCustomerStore((s) => s.tableId);
  const setTableId = useCustomerStore((s) => s.setTableId);
  const dynamicTables = useTablesStore((s) => s.tables);
  const addTable = useTablesStore((s) => s.addTable);

  const [isTableOpen, setIsTableOpen] = useState(false);
  const [customTableInput, setCustomTableInput] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(tableId || "T01");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleOpenTable = useCallback(() => {
    setSelectedPreset(tableId || "T01");
    setCustomTableInput(tableId || "");
    setSavedNotice(false);
    setIsTableOpen(true);
  }, [tableId]);

  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault();
      const finalTable = (isCustomMode ? customTableInput : selectedPreset).trim().toUpperCase();

      if (finalTable) {
        setTableId(finalTable);
        // Ensure custom table is in the dynamic tables store
        addTable({
          id: finalTable,
          name: `Table ${finalTable}`,
          zone: "Dining Area",
          seats: 4,
        });
      }

      setSavedNotice(true);
      setTimeout(() => {
        setIsTableOpen(false);
        setSavedNotice(false);
    }, 600);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cafe-200/80 shadow-xs no-print">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div
            onClick={() => navigate(tableId ? `/menu?table=${tableId}` : "/")}
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

          {/* Right Actions: Dynamic Table Button (LEFT of Add to Cart) + Shopping Cart Button */}
          <div className="flex items-center gap-2">
            {/* Dynamic Table Number Button — Positioned immediately left of the Cart button */}
            <button
              onClick={handleOpenTable}
              title="Change Table Number"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-2xs active:scale-95 ${tableId
                  ? "bg-amber-50/80 hover:bg-amber-100/80 text-amber-950 border-amber-300"
                  : "bg-white hover:bg-cafe-100 text-cafe-800 border-cafe-300"
                }`}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-extrabold">{tableId ? `Table ${tableId}` : "Select Table"}</span>
              <ChevronDown className="w-3 h-3 text-cafe-500" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2.5 bg-cafe-900 hover:bg-cafe-800 text-white rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center cursor-pointer"
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

      {/* Dynamic Table Selector Modal */}
      {isTableOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-cafe-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-cafe-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cafe-900 text-amber-300 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-cafe-950 text-base">Select Dining Table</h2>
                    <p className="text-[11px] text-cafe-600">Choose your table or type a dynamic number</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsTableOpen(false)}
                  className="p-1 rounded-lg text-cafe-400 hover:text-cafe-900 hover:bg-cafe-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTable} className="mt-4 space-y-4">
                    {/* Mode Switcher: Choose from List vs Custom Entry */}
              <div className="grid grid-cols-2 p-1 bg-cafe-100 rounded-xl text-xs font-bold text-cafe-700">
                    <button
                      type="button"
                      onClick={() => setIsCustomMode(false)}
                      className={`py-1.5 rounded-lg transition-all ${!isCustomMode ? "bg-white text-cafe-950 shadow-xs" : "hover:text-cafe-950"
                        }`}
                    >
                    Choose Table ({dynamicTables.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(true)}
                    className={`py-1.5 rounded-lg transition-all ${isCustomMode ? "bg-white text-cafe-950 shadow-xs" : "hover:text-cafe-950"
                      }`}
                  >
                    Type Dynamic ID
                  </button>
                </div>

                {!isCustomMode ? (
                  <div>
                    <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1.5">
                      Available Cafe Tables
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                      {dynamicTables.map((t) => {
                        const isSelected = selectedPreset === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedPreset(t.id)}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${isSelected
                                ? "bg-cafe-950 text-amber-300 border-cafe-950 font-black shadow-xs scale-102"
                                : "bg-white hover:bg-cafe-50 border-cafe-300 text-cafe-800 text-xs font-bold"
                              }`}
                          >
                            <span className="block text-xs">{t.id}</span>
                            <span className="text-[10px] text-cafe-500 font-normal truncate block">
                              {t.zone}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1">
                      Enter Custom Table Number
                    </label>
                    <input
                      type="text"
                      value={customTableInput}
                      onChange={(e) => setCustomTableInput(e.target.value.toUpperCase())}
                      placeholder="e.g. T13, VIP-1, Balcony-2"
                      className="w-full px-3.5 py-2.5 border border-cafe-300 rounded-xl text-cafe-950 text-sm font-bold uppercase focus:outline-hidden focus:ring-2 focus:ring-amber-600 bg-cafe-50/50"
                      required
                      autoFocus
                    />
                    <p className="text-[11px] text-cafe-500 mt-1">
                      Any dynamic table number will automatically be registered and saved.
                    </p>
                  </div>
                )}

                {savedNotice && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Table updated successfully!
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsTableOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-cafe-300 text-cafe-700 text-xs font-bold hover:bg-cafe-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-cafe-950 hover:bg-cafe-900 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Confirm Table
                  </button>
                </div>
              </form>
            </div>
          </div>
      )}
        </>
      );
}
