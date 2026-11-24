import React, { useState, useEffect } from "react";
import Image from "@/components/ui/Image";
import { X, Plus, Minus, Clock, Star, MessageSquare } from "lucide-react";
import { MenuItem } from "@/types/menu";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";

interface MenuItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

function MenuItemModalComponent({ item, onClose }: MenuItemModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const existingItem = useCartStore((s) =>
    item ? s.items.find((i) => i.item.id === item.id) : undefined
  );

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (item) {
      if (existingItem) {
        setQuantity(existingItem.quantity);
        setNotes(existingItem.notes || "");
      } else {
        setQuantity(1);
        setNotes("");
      }
    }
  }, [item, existingItem]);

  if (!item) return null;

  const handleSave = () => {
    if (existingItem) {
      updateQuantity(item.id, quantity);
      existingItem.notes = notes.trim() || undefined;
    } else {
      for (let i = 0; i < quantity; i++) {
        addItem(item, notes.trim() || undefined);
      }
    }
    onClose();
  };

  const itemTotal = item.price * quantity;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-elevated border border-cafe-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Top Image Banner */}
        <div className="relative h-56 sm:h-64 w-full bg-cafe-100 shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-white flex items-center justify-center border border-emerald-600 shadow-xs">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
            </span>
            {item.isBestseller && (
              <span className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                <Star className="w-3.5 h-3.5 fill-white" />
                Bestseller
              </span>
            )}
            {item.preparationTime && (
              <span className="flex items-center gap-1 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-md backdrop-blur-xs">
                <Clock className="w-3.5 h-3.5" />
                {item.preparationTime}
              </span>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-xl font-extrabold text-cafe-950">{item.name}</h2>
              <span className="text-xl font-black text-cafe-900">{formatCurrency(item.price)}</span>
            </div>
            <p className="text-sm text-cafe-600 mt-2 leading-relaxed">{item.description}</p>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-cafe-100 text-cafe-700 text-xs rounded-lg font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Special Instructions / Notes */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cafe-600" />
              Special Instructions
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Extra hot, less ice, almond milk, no sugar..."
              maxLength={80}
              className="w-full px-3.5 py-2.5 border border-cafe-300 rounded-xl text-cafe-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-600 bg-cafe-50/50"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add Button */}
        <div className="p-4 bg-cafe-50/80 border-t border-cafe-200 flex items-center justify-between gap-3 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 bg-white border border-cafe-300 rounded-2xl px-3 py-2 shadow-2xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1 rounded-lg text-cafe-700 hover:bg-cafe-100 active:scale-90 transition-transform"
              aria-label="Decrease"
            >
              <Minus className="w-4 h-4 text-cafe-700" />
            </button>
            <span className="font-extrabold text-sm text-cafe-950 w-6 text-center select-none">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1 rounded-lg text-cafe-700 hover:bg-cafe-100 active:scale-90 transition-transform"
              aria-label="Increase"
            >
              <Plus className="w-4 h-4 text-cafe-700" />
            </button>
          </div>

          {/* Action CTA */}
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-2xl bg-cafe-950 hover:bg-cafe-900 text-white font-extrabold text-sm shadow-sm flex items-center justify-between active:scale-[0.99] transition-transform"
          >
            <span>Add to Order</span>
            <span>{formatCurrency(itemTotal)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MenuItemModalComponent);
