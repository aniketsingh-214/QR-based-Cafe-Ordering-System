import { CafeConfig } from "@/types/order";

export const DEFAULT_CAFE_CONFIG: CafeConfig = {
  cafeName: "The Roast & Toast Cafe",
  cafeTagline: "Artisan Coffee · Fresh Bakes · Table Dining",
  address: "Shop 14, High Street Avenue, Indiranagar, Bengaluru - 560038",
  gstNumber: "29AAAAA0000A1Z5",
  fssaiNumber: "11223344556677",
  ownerWhatsAppNumber: "919079629797", // Single source of truth: the ONLY number that receives kitchen orders (91 + 10 digits)
  taxPercent: 5, // 5% GST (2.5% CGST + 2.5% SGST)
  currencySymbol: "₹",
  supportPhone: "+91 90796 29797",
};
