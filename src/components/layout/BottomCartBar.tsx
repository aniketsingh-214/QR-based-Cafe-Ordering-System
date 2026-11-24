import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, ArrowRight, MapPin } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useCustomerStore } from "@/store/customer-store";
import { formatCurrency } from "@/lib/utils";

function BottomCartBarComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // Granular selectors so BottomCartBar only updates when itemCount, grandTotal or tableId actually changes
  const itemCount = useCartStore((s) => s.getItemCount());
  const grandTotal = useCartStore((s) => s.getGrandTotal());
  const tableId = useCustomerStore((s) => s.tableId);

  // Only display if items are in cart and not already on cart, checkout or success pages
  if (itemCount === 0 || pathname === "/cart" || pathname === "/checkout" || pathname === "/order-success") {
    return null;
  }

  return (
    <aside aria-label="Cart Summary Bar" className="fixed bottom-4 left-0 right-0 z-30 px-4 max-w-lg mx-auto no-print">
      <button
        onClick={() => navigate("/cart")}
        className="w-full bg-cafe-950 text-white rounded-2xl p-4 shadow-elevated flex items-center justify-between border border-cafe-700/50 hover:bg-cafe-900 transition-transform active:scale-[0.99] group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span className="absolute -top-1 -right-1 bg-amber-500 text-cafe-950 text-[11px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          </div>
          <div className="text-left">
            <p className="text-xs text-cafe-300 font-medium">
              {itemCount} {itemCount === 1 ? "item" : "items"} added
            </p>
            <p className="text-base font-extrabold text-white">
              {formatCurrency(grandTotal)}
              <span className="text-xs font-normal text-cafe-400 ml-1.5">(incl. taxes)</span>
            </p>
          </div>
        </div>

          {/* Right side: Dynamic Table Badge + View Cart CTA */}
          <div className="flex items-center gap-2">
            {tableId && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-white/10 px-2.5 py-1 rounded-lg border border-white/15">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{tableId}</span>
              </span>
            )}
            <div className="flex items-center gap-1.5 bg-amber-500 text-cafe-950 font-bold text-sm px-4 py-2.5 rounded-xl shadow-xs group-hover:bg-amber-400 transition-colors">
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
      </button>
    </aside>
  );
}

export default React.memo(BottomCartBarComponent);
