import React, { useState, useMemo, useEffect, useCallback, useTransition, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { Edit2, UtensilsCrossed } from "lucide-react";
import { MENU_ITEMS } from "@/data/menu";
import { MenuItem, MenuCategoryType } from "@/types/menu";
import { useCustomerStore } from "@/store/customer-store";
import { getTableById } from "@/data/tables";
import MenuCard from "@/components/menu/MenuCard";
import MenuItemModal from "@/components/menu/MenuItemModal";
import CategoryTabs from "@/components/menu/CategoryTabs";
import SearchBar from "@/components/menu/SearchBar";
import CustomerDetailsModal from "@/components/customer/CustomerDetailsModal";

function MenuContent() {
  const [searchParams] = useSearchParams();
  const tableParam = searchParams.get("table");

  // Granular selectors so MenuContent only re-renders when relevant customer info changes
  const tableId = useCustomerStore((s) => s.tableId);
  const setTableId = useCustomerStore((s) => s.setTableId);
  const mobile = useCustomerStore((s) => s.mobile);
  const name = useCustomerStore((s) => s.name);

  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // useTransition ensures user input / click events are handled immediately without blocking paint
  const [, startTransition] = useTransition();

  // Sync table from URL if present
  useEffect(() => {
    if (tableParam) {
      setTableId(tableParam.trim().toUpperCase());
    }
  }, [tableParam, setTableId]);

  const activeTableInfo = useMemo(() => getTableById(tableId), [tableId]);

  // Compute category item counts (static constant)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: MENU_ITEMS.length };
    for (const item of MENU_ITEMS) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      // Veg filter
      if (vegOnly && !item.isVeg) {
        return false;
      }
      // Bestseller filter
      if (bestsellerOnly && !item.isBestseller) {
        return false;
      }
      // Search filter
      if (query) {
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, vegOnly, bestsellerOnly, searchQuery]);

  const handleSelectCategory = useCallback((category: MenuCategoryType) => {
    startTransition(() => {
      setSelectedCategory(category);
    });
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    startTransition(() => {
      setSearchQuery(query);
    });
  }, []);

  const handleToggleVegOnly = useCallback(() => {
    startTransition(() => {
      setVegOnly((v) => !v);
    });
  }, []);

  const handleToggleBestsellerOnly = useCallback(() => {
    startTransition(() => {
      setBestsellerOnly((b) => !b);
    });
  }, []);

  const handleSelectItem = useCallback((item: MenuItem) => {
    setActiveItem(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveItem(null);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      {/* Table & Customer Info Banner */}
      <div className="bg-white rounded-2xl p-3.5 border border-cafe-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cafe-900 text-amber-300 flex items-center justify-center font-black text-sm">
            {tableId || "T??"}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-cafe-950 text-sm">
                {activeTableInfo ? activeTableInfo.name : `Table ${tableId || "Not Selected"}`}
              </span>
              {activeTableInfo && (
                <span className="text-[11px] text-cafe-500 font-medium">
                  ({activeTableInfo.zone})
                </span>
              )}
            </div>
            <p className="text-xs text-cafe-600 flex items-center gap-1">
              {mobile ? (
                <span>
                  Guest: <strong className="text-cafe-900">{name || "Customer"}</strong> ({mobile})
                </span>
              ) : (
                <span className="text-amber-800 font-medium">Mobile not added yet</span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCustomerModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cafe-100 hover:bg-cafe-200 text-cafe-800 text-xs font-bold border border-cafe-300 transition-colors cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5 text-cafe-600" />
          <span>{mobile ? "Edit Info" : "Add Mobile"}</span>
        </button>
      </div>

      {/* Search & Quick Filters */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        vegOnly={vegOnly}
        onToggleVegOnly={handleToggleVegOnly}
        bestsellerOnly={bestsellerOnly}
        onToggleBestsellerOnly={handleToggleBestsellerOnly}
        resultCount={filteredItems.length}
      />

      {/* Sticky Category Tabs */}
      <CategoryTabs
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        categoryCounts={categoryCounts}
      />

      {/* Menu Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 pt-1">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} onSelect={handleSelectItem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-cafe-200 p-8 space-y-3">
          <UtensilsCrossed className="w-10 h-10 text-cafe-400 mx-auto" />
          <h3 className="text-base font-bold text-cafe-950">No items match your criteria</h3>
          <p className="text-xs text-cafe-600 max-w-xs mx-auto">
            Try adjusting your search terms, clearing filters, or switching category tabs.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setVegOnly(false);
              setBestsellerOnly(false);
              setSelectedCategory("All");
            }}
            className="px-4 py-2 bg-cafe-900 text-white rounded-xl text-xs font-bold hover:bg-cafe-800 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Item Detail Modal */}
      <MenuItemModal item={activeItem} onClose={handleCloseModal} />

      {/* Customer Info Modal */}
      <CustomerDetailsModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-cafe-600">Loading menu...</div>}>
      <MenuContent />
    </Suspense>
  );
}
