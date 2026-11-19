export type MenuCategoryType =
  | "All"
  | "Coffee"
  | "Tea"
  | "Cold Beverages"
  | "Snacks"
  | "Sandwiches"
  | "Main Course"
  | "Desserts";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategoryType;
  availability: boolean;
  isVeg: boolean;
  isBestseller?: boolean;
  spiceLevel?: "none" | "mild" | "medium" | "spicy";
  preparationTime?: string; // e.g. "5-7 mins"
  tags?: string[];
}

export interface CategoryInfo {
  id: MenuCategoryType;
  label: string;
  iconName: string;
  description: string;
}
