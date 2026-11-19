"use client";

import React from "react";
import Image from "next/image";
import { Plus, Minus, Star, Clock } from "lucide-react";
import { MenuItem } from "@/types/menu";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export default function MenuCard({ item, onSelect }: MenuCardProps) {
  const { getItemQuantity, addItem, updateQuantity } = useCartStore();
  const quantity = getItemQuantity(item.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(item.id, quantity - 1);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white rounded-2xl p-3.5 border border-cafe-200/90 shadow-soft hover:shadow-elevated transition-all duration-200 flex flex-col justify-between cursor-pointer group active:scale-[0.99]"
    >
      <div>
        {/* Image & Badges */}
        <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-cafe-100 mb-3">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Veg / Non-Veg badge */}
          <div className="absolute top-2 left-2 z-10">
            <div className="w-5 h-5 rounded-md bg-white/95 backdrop-blur-xs flex items-center justify-center border border-emerald-600 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            </div>
          </div>

          {/* Bestseller badge */}
          {item.isBestseller && (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-amber-500/95 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
              <Star className="w-3 h-3 fill-white text-white" />
              <span>POPULAR</span>
            </div>
          )}

          {/* Prep Time badge */}
          {item.preparationTime && (
            <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3" />
              <span>{item.preparationTime}</span>
            </div>
          )}
        </div>

        {/* Item Title & Description */}
        <h3 className="font-bold text-cafe-950 text-sm md:text-base leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors">
          {item.name}
        </h3>
        <p className="text-xs text-cafe-600 line-clamp-2 mt-1 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Price & Add Button */}
      <div className="mt-3.5 pt-2.5 border-t border-cafe-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-cafe-500 font-medium">Price</span>
          <span className="font-extrabold text-cafe-950 text-base md:text-lg tracking-tight">
            {formatCurrency(item.price)}
          </span>
        </div>

        {/* Quantity Stepper or Add Button */}
        {quantity > 0 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 bg-cafe-900 text-white rounded-xl px-2 py-1 shadow-xs"
          >
            <button
              onClick={handleDecrease}
              className="p-1 rounded-md hover:bg-cafe-800 active:scale-90 transition-transform"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5 text-amber-300" />
            </button>
            <span className="text-xs font-bold w-4 text-center select-none text-white">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="p-1 rounded-md hover:bg-cafe-800 active:scale-90 transition-transform"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-all active:scale-95 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-amber-700" />
            <span>ADD</span>
          </button>
        )}
      </div>
    </div>
  );
}
