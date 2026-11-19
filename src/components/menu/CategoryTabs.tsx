"use client";

import React from "react";
import {
  Coffee,
  CupSoda,
  GlassWater,
  Utensils,
  Sandwich,
  Soup,
  Cake,
  Sparkles,
} from "lucide-react";
import { MenuCategoryType } from "@/types/menu";
import { CATEGORIES } from "@/data/categories";

interface CategoryTabsProps {
  selectedCategory: MenuCategoryType;
  onSelectCategory: (category: MenuCategoryType) => void;
  categoryCounts: Record<string, number>;
}

export default function CategoryTabs({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryTabsProps) {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case "Coffee":
        return <Coffee className="w-4 h-4" />;
      case "Tea":
        return <CupSoda className="w-4 h-4" />;
      case "Cold Beverages":
        return <GlassWater className="w-4 h-4" />;
      case "Snacks":
        return <Utensils className="w-4 h-4" />;
      case "Sandwiches":
        return <Sandwich className="w-4 h-4" />;
      case "Main Course":
        return <Soup className="w-4 h-4" />;
      case "Desserts":
        return <Cake className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const tabs: { id: MenuCategoryType; label: string }[] = [
    { id: "All", label: "All Items" },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <div className="sticky top-16 z-30 bg-cafe-50/95 backdrop-blur-md py-2.5 border-b border-cafe-200/80 -mx-4 px-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        {tabs.map((tab) => {
          const isSelected = selectedCategory === tab.id;
          const count = categoryCounts[tab.id] || 0;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 select-none ${
                isSelected
                  ? "bg-cafe-900 text-amber-300 shadow-xs"
                  : "bg-white text-cafe-700 hover:bg-cafe-100 hover:text-cafe-900 border border-cafe-200"
              }`}
            >
              {getCategoryIcon(tab.id)}
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isSelected
                    ? "bg-amber-400 text-cafe-950"
                    : "bg-cafe-100 text-cafe-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
