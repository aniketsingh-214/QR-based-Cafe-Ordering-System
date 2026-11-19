"use client";

import React from "react";
import { Search, X, Star, Leaf } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  vegOnly: boolean;
  onToggleVegOnly: () => void;
  bestsellerOnly: boolean;
  onToggleBestsellerOnly: () => void;
  resultCount: number;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  vegOnly,
  onToggleVegOnly,
  bestsellerOnly,
  onToggleBestsellerOnly,
  resultCount,
}: SearchBarProps) {
  return (
    <div className="space-y-3 pt-2">
      {/* Search Bar Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-cafe-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search cappuccino, fries, sandwich, brownie..."
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-cafe-200 rounded-2xl text-sm text-cafe-900 placeholder:text-cafe-400 focus:outline-hidden focus:ring-2 focus:ring-cafe-800 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-cafe-400 hover:text-cafe-700"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Quick Pills */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {/* Veg Only Toggle */}
          <button
            onClick={onToggleVegOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold border transition-all ${
              vegOnly
                ? "bg-emerald-50 text-emerald-800 border-emerald-400 shadow-2xs"
                : "bg-white text-cafe-600 border-cafe-200 hover:bg-cafe-100"
            }`}
          >
            <Leaf className={`w-3.5 h-3.5 ${vegOnly ? "text-emerald-600" : "text-cafe-400"}`} />
            <span>Pure Veg</span>
          </button>

          {/* Bestseller Toggle */}
          <button
            onClick={onToggleBestsellerOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold border transition-all ${
              bestsellerOnly
                ? "bg-amber-50 text-amber-900 border-amber-400 shadow-2xs"
                : "bg-white text-cafe-600 border-cafe-200 hover:bg-cafe-100"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${bestsellerOnly ? "fill-amber-500 text-amber-500" : "text-cafe-400"}`} />
            <span>Bestsellers</span>
          </button>
        </div>

        <span className="text-[11px] text-cafe-500 font-medium">
          {resultCount} {resultCount === 1 ? "item" : "items"}
        </span>
      </div>
    </div>
  );
}
