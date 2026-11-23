# Project Architecture, Code Structure & Current Status

**Project Name:** QR-based Cafe Ordering System (Phase 1 — Frontend-Only MVP)  
**Repository:** [https://github.com/aniketsingh-214/QR-based-Cafe-Ordering-System.git](https://github.com/aniketsingh-214/QR-based-Cafe-Ordering-System.git)  
**Branch:** `master`  
**Current Phase:** Phase 1 (Completed & Production Built)

---

## 1. Executive Summary & Objective

The **QR-based Cafe Ordering System** is a mobile-first, contactless ordering web application developed with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

### Phase 1 Architectural Principles:
- **No Backend / Database Required:** All menu data, customer dining context, cart states, and temporary orders reside client-side in **Zustand** stores synchronized with browser `localStorage`.
- **Contactless Table QR Routing:** Unique URLs per table (e.g., `cafe.com/menu?table=T01`) automatically associate the dining session with the scanned physical table.
- **WhatsApp Click-to-Chat Integration:** Bridges order transmission without expensive backend SMS/WhatsApp Cloud APIs by opening WhatsApp directly with a pre-filled, formatted kitchen order for the cafe owner/barista.
- **Thermal Digital Receipt & PDF Export:** Generates an itemized digital receipt featuring cafe GSTIN, FSSAI credentials, 5% GST breakdown (2.5% CGST + 2.5% SGST), browser print-to-PDF styles, and WhatsApp receipt sharing.

---

## 2. Project File Structure

Below is the directory tree of the project codebase:

```
cafe-ordering/
├── .gitignore                          # Excludes node_modules, .next, .env, build traces
├── README.md                           # Quickstart guide, test scenarios & verification steps
├── cloud.md                            # Comprehensive codebase structure, functionality & status documentation
├── next.config.mjs                     # Next.js configuration (Unsplash & Pexels image domains)
├── package.json                        # Dependencies, devDependencies & npm run scripts
├── postcss.config.js                   # PostCSS configuration for Tailwind CSS
├── tailwind.config.ts                  # Tailwind configuration with custom cafe color palette
├── tsconfig.json                       # TypeScript compiler options & `@/*` path aliases
├── public/
│   └── logo/
│       └── coffee.svg                  # SVG cafe brand mark
└── src/
    ├── app/
    │   ├── globals.css                 # Global CSS layers & @media print rules for receipts
    │   ├── layout.tsx                  # Root responsive wrapper with Header & BottomCartBar
    │   ├── page.tsx                    # Screen 01 & 02: QR Landing & Table Identification
    │   ├── menu/
    │   │   └── page.tsx                # Screen 03 & 04: Digital Menu browsing & search
    │   ├── cart/
    │   │   └── page.tsx                # Screen 05: Cart management & calculation
    │   ├── checkout/
    │   │   └── page.tsx                # Screen 06: Review details & place order
    │   ├── order-success/
    │   │   └── page.tsx                # Screen 07 & 08: Order confirmation & WhatsApp action
    │   └── qr-codes/
    │       └── page.tsx                # Cafe Staff QR Code & Tent Card Print Center
    ├── components/
    │   ├── customer/
    │   │   └── CustomerDetailsModal.tsx # Customer details editing modal with phone validation
    │   ├── layout/
    │   │   ├── BottomCartBar.tsx       # Floating sticky bottom cart indicator
    │   │   └── Header.tsx              # Brand header, table pill, owner settings & cart button
    │   ├── menu/
    │   │   ├── CategoryTabs.tsx        # Horizontal category switcher with item counts
    │   │   ├── MenuCard.tsx            # Dish card with image, veg badge, stepper & price
    │   │   ├── MenuItemModal.tsx       # Dish detail modal with special cooking notes
    │   │   └── SearchBar.tsx           # Real-time search bar & veg/bestseller toggles
    │   └── receipt/
    │       └── DigitalReceipt.tsx      # Authentic thermal receipt with GST breakdown
    ├── data/
    │   ├── categories.ts               # 7 Category definitions with Lucide icon mappings
    │   ├── config.ts                   # Cafe branding, default owner WhatsApp, GST & tax rates
    │   ├── menu.ts                     # Configurable catalog across all 7 categories
    │   └── tables.ts                   # Table master data T01 - T12 with zones & seats
    ├── lib/
    │   ├── bill-generator.ts           # Itemized bill computation & window.print() trigger
    │   ├── order-generator.ts          # Order ID generator (ORD-YYYYMMDD-XXX)
    │   ├── qr-generator.ts             # High-res QR code generator using `qrcode` library
    │   ├── utils.ts                    # Tailwind `cn`, INR currency & date formatters
    │   └── whatsapp.ts                 # WhatsApp message builders & wa.me click-to-chat
    ├── store/
    │   ├── cart-store.ts               # Zustand store for cart items, quantities & totals
    │   └── customer-store.ts           # Zustand store for table ID, mobile, name & notes
    └── types/
        ├── customer.ts                 # TypeScript types for CustomerDetails & TableInfo
        ├── menu.ts                     # TypeScript types for MenuItem, Category & CategoryInfo
        └── order.ts                    # TypeScript types for CartItem, Order & CafeConfig
```

---

## 3. Detailed File-by-File Functionality

### 3.1 Configuration & Root Files

| File | Purpose & Functionality |
| :--- | :--- |
| `package.json` | Defines project metadata, build scripts (`next dev`, `next build`, `next start`), and dependencies: Next.js 14, React 18, Zustand, Lucide React, qrcode, canvas-confetti, Tailwind CSS, and Zod. |
| `tsconfig.json` | Configures strict TypeScript checking, bundler module resolution, and path aliasing (`@/*` -> `./src/*`). |
| `tailwind.config.ts` | Extends Tailwind with an authentic warm cafe palette (`cafe-50` to `cafe-950`), custom amber/emerald accents, soft elevation box shadows, and font configurations. |
| `next.config.mjs` | Configures Next.js image optimization domains for high-resolution photography from Unsplash (`images.unsplash.com`) and Pexels. |
| `postcss.config.js` | Directs Tailwind CSS and Autoprefixer processing for cross-browser CSS styling. |
| `.gitignore` | Excludes `.next/`, `node_modules/`, `out/`, build logs, and environment files from Git version control. |
| `README.md` | Provides complete documentation on system flow, local installation, testing scenarios, and prompt verification calculations. |

---

### 3.2 Application Pages (`src/app/`)

| Route / File | Screen | Description & Capabilities |
| :--- | :--- | :--- |
| `src/app/page.tsx` | **Screen 01 & 02: QR Landing** | • Detects table number from the URL query parameter `?table=Txx`.<br>• Pre-fills detected table with zone & seat indicator.<br>• Validates customer's Indian mobile number (`^[6-9]\d{9}$`).<br>• Provides manual table selection fallback for walk-in guests.<br>• Offers quick shortcut to the Staff QR Center. |
| `src/app/menu/page.tsx` | **Screen 03 & 04: Digital Menu** | • Interactive menu listing across 7 categories.<br>• Live instant search matching item names, descriptions, and tags.<br>• Quick filter toggles for **Pure Veg 🌿** and **Bestsellers ⭐**.<br>• Sticky category pill navigation with live item counts.<br>• Clicking any dish triggers the custom cooking notes modal. |
| `src/app/cart/page.tsx` | **Screen 05: Shopping Cart** | • Itemized list with increment/decrement steppers and removal.<br>• Real-time financial calculation: Subtotal + 5% GST (2.5% CGST + 2.5% SGST) = Grand Total.<br>• Table and customer mobile recap with instant edit modal trigger.<br>• Special kitchen dining notes input.<br>• Direct progression to checkout. |
| `src/app/checkout/page.tsx` | **Screen 06: Checkout Review** | • Final confirmation screen before kitchen dispatch.<br>• Verifies table number, validated mobile number, and optional name.<br>• Assembles order payload with unique ID: `ORD-YYYYMMDD-XXX`.<br>• Saves order to store, clears cart, and navigates to confirmation. |
| `src/app/order-success/page.tsx` | **Screen 07 & 08: Order Confirmation** | • Fires celebratory confetti animation upon arrival.<br>• **WhatsApp Owner Notification CTA**: Opens WhatsApp with pre-filled kitchen order.<br>• Shows accordion preview of the exact WhatsApp transmission.<br>• **Print / Save as PDF Button**: Prints clean thermal receipt without UI headers or footers.<br>• **Share Bill on WhatsApp Button**: Allows customer to forward receipt to dining companions. |
| `src/app/qr-codes/page.tsx` | **Staff Table QR Center** | • Generates unique QR codes for tables `T01` to `T12` using `qrcode`.<br>• Custom Table Generator (e.g. `VIP-1`, `TERRACE-4`).<br>• Direct "Test Menu" link simulating customer table scan.<br>• Direct PNG download for graphic designers.<br>• "Print All Table Tent Cards" layout for physical table display stands. |
| `src/app/layout.tsx` | **Root Layout** | • Mobile-first responsive wrapper with viewport restrictions.<br>• Global sticky `Header` and floating `BottomCartBar`. |
| `src/app/globals.css` | **Global Styles** | • Tailwind layer definitions.<br>• `@media print` rules configuring clean thermal bill printing and hiding navigation elements. |

---

### 3.3 UI Components (`src/components/`)

| Component | Functionality |
| :--- | :--- |
| `components/layout/Header.tsx` | Top navigation bar with cafe branding, live active table indicator pill, staff QR center button, settings modal to configure the owner's WhatsApp number, and dynamic cart item counter badge. |
| `components/layout/BottomCartBar.tsx` | Swiggy/Zomato-style sticky floating pill that appears when items are added to the cart, displaying item count, grand total, and a direct link to the cart. |
| `components/menu/MenuCard.tsx` | Card displaying dish photo, veg/non-veg indicator, bestseller tag, estimated preparation time, description, price in INR, and quick +/- stepper. |
| `components/menu/MenuItemModal.tsx` | Full-screen/modal inspection with high-res photography, dish tags, special preparation notes input (e.g., "extra hot", "oat milk"), and custom quantity selector. |
| `components/menu/CategoryTabs.tsx` | Sticky horizontal scrollbar displaying all 7 food categories plus "All Items", complete with Lucide icons and category item counters. |
| `components/menu/SearchBar.tsx` | Search input with clear button, paired with single-tap toggle buttons for "Pure Veg" and "Bestsellers". |
| `components/customer/CustomerDetailsModal.tsx` | Reusable modal dialog allowing customers or waitstaff to update table assignment, mobile number, or guest name from any page. |
| `components/receipt/DigitalReceipt.tsx` | Authentic receipt layout featuring cafe header, address, GSTIN, FSSAI numbers, itemized billing table, CGST/SGST tax split, and perforated edge styling. |

---

### 3.4 Data & Configuration (`src/data/`)

| File | Content & Functionality |
| :--- | :--- |
| `data/menu.ts` | Complete catalog of 20+ dishes across 7 categories (**Coffee**, **Tea**, **Cold Beverages**, **Snacks**, **Sandwiches**, **Main Course**, **Desserts**). Includes exact prompt items: Classic Cappuccino (₹180), Gourmet Veg Club Sandwich (₹150), and Crispy Peri-Peri French Fries (₹120). |
| `data/categories.ts` | Category metadata containing unique IDs, labels, Lucide icon identifiers, and descriptions. |
| `data/tables.ts` | Dining tables `T01` through `T12` categorized into zones (**Indoor Window**, **Indoor Main Hall**, **Cozy Corner Lounge**, **Patio Terrace**, **Garden Gazebo**, **Mezzanine Quiet Study**, **Outdoor Bar Counter**) with seating capacities. |
| `data/config.ts` | Default configuration for cafe name, tagline, physical address, GSTIN, FSSAI license, 5% tax rate, and default owner WhatsApp contact number (`919876543210`). |

---

### 3.5 State Management (`src/store/`)

| Store | State Managed & Persistence |
| :--- | :--- |
| `store/cart-store.ts` | Managed using **Zustand** with `persist` middleware saving to `cafe-cart-store` in `localStorage`.<br>• `items`: Array of items, quantities, and item-level notes.<br>• `taxPercent`: 5%.<br>• `lastOrder` & `orderHistory`: Stores placed orders for digital receipt viewing.<br>• Computed helpers: `getSubtotal()`, `getTaxAmount()`, `getGrandTotal()`, `getItemCount()`, `getItemQuantity(id)`. |
| `store/customer-store.ts` | Managed using **Zustand** with `persist` middleware saving to `cafe-customer-store` in `localStorage`.<br>• `tableId`: Active dining table.<br>• `mobile`: Required 10-digit Indian phone number.<br>• `name`: Optional customer name.<br>• `notes`: Order-level dining or cooking instructions.<br>• `customOwnerWhatsApp`: Override cafe owner contact number for testing. |

---

### 3.6 Libraries & Utilities (`src/lib/`)

| Utility | Description & Implementation Details |
| :--- | :--- |
| `lib/whatsapp.ts` | • `sanitizeWhatsAppPhone(phone)`: Normalizes phone numbers to WhatsApp international format (`919876543210`).<br>• `generateOwnerOrderMessage(order)`: Formats order details with bold labels, emojis, item breakdown, and subtotal/tax/grand total for the kitchen.<br>• `generateCustomerBillShareMessage(order)`: Formats itemized receipt text for customer-to-friend sharing.<br>• `openWhatsApp(phone, message)`: Constructs `https://wa.me/{phone}?text={encoded}` and triggers browser click-to-chat. |
| `lib/qr-generator.ts` | • `getTableMenuUrl(tableId, baseUrl)`: Builds destination URL (e.g. `https://cafe.com/menu?table=T01`).<br>• `generateTableQrDataUrl(tableId)`: Uses `qrcode` to generate high-resolution PNG data URLs with dark chocolate color scheme (`#22170F`). |
| `lib/order-generator.ts` | • `generateOrderId()`: Generates unique daily order identifiers formatted as `ORD-YYYYMMDD-XXX` using a local daily sequence counter.<br>• `buildOrder(items, customer, taxPercent, notes)`: Assembles complete `Order` payload. |
| `lib/bill-generator.ts` | • `generateItemizedBill(order, config)`: Computes subtotal, CGST (2.5%), SGST (2.5%), total tax, and grand total.<br>• `printBill()`: Triggers `window.print()` targeting print styles. |
| `lib/utils.ts` | • `cn(...)`: Tailwind class variance merger using `clsx` and `tailwind-merge`.<br>• `formatCurrency(amount)`: Formats numbers into Indian Rupee strings (`₹630.00`).<br>• `formatDate(date)`: Formats date timestamps (`19 Nov 2026, 10:30 PM`). |

---

### 3.7 TypeScript Type Definitions (`src/types/`)

| File | Types Exported |
| :--- | :--- |
| `types/menu.ts` | `MenuCategoryType`, `MenuItem`, `CategoryInfo` |
| `types/customer.ts` | `CustomerDetails`, `TableInfo` |
| `types/order.ts` | `CartItem`, `Order`, `CafeConfig` |

---

## 4. Current Status & Verification

| Dimension | Current Status | Notes / Verification |
| :--- | :---: | :--- |
| **Source Code** | **100% Complete** | All 8 screens, components, stores, and utilities implemented. |
| **Next.js Production Build** | **Passing (`0 Errors`)** | `npm run build` compiled all 7 routes to static output without errors or warnings. |
| **TypeScript Validation** | **Passing (`0 Errors`)** | Strict type-checking enabled and validated. |
| **Git Version Control** | **Up-to-Date** | Committed and pushed to `origin/master` at GitHub: [aniketsingh-214/QR-based-Cafe-Ordering-System](https://github.com/aniketsingh-214/QR-based-Cafe-Ordering-System.git). |
| **Local Persistence** | **Active** | Cart, customer details, and order history persist across browser refreshes via `localStorage`. |
| **Print & PDF Styling** | **Active** | CSS `@media print` rules render only the thermal bill, hiding all page headers and buttons. |
| **Staff QR Generator** | **Active** | Located at `/qr-codes`, rendering high-res printable table cards for tables T01 through T12. |

---

## 5. Phase 1 vs. Future Roadmap

| Capability | Phase 1 (Current MVP) | Phase 2 (Future Scope) | Phase 3 (Advanced) |
| :--- | :--- | :--- | :--- |
| **Architecture** | Frontend-Only (Next.js + Zustand) | Fullstack (Next.js + Supabase / PostgreSQL) | Distributed Microservices |
| **Database** | None (`localStorage` state) | Relational Database (PostgreSQL / Prisma) | Distributed DB with Redis cache |
| **Order Storage** | Local browser session | Centralized persistent database | Multi-branch unified database |
| **WhatsApp Messaging** | `wa.me` Click-to-Chat (manual user send) | Automated WhatsApp Business Cloud API | Two-way automated chatbot notifications |
| **Receipts** | Thermal digital screen + Browser Print/PDF | Auto-emailed / Auto-WhatsApp PDF bills | Integrated e-invoicing & GST filing |
| **Payments** | Cash / UPI at counter | Razorpay / Stripe integrated checkout | Split bill, table tabs & Apple Pay |
| **Kitchen Ops** | Waitstaff reads owner WhatsApp | Real-time Kitchen Display System (KDS) | Automated cooking station ticket routing |

---

## 6. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open in browser
# Direct Table Scan Simulation: http://localhost:3000/?table=T01
# Staff QR Generator & Tent Cards: http://localhost:3000/qr-codes
```
