# Project Architecture, Code Structure & Current Status

**Project Name:** QR-based Cafe Ordering System (Phase 1 — Frontend-Only MVP)  
**Repository:** [https://github.com/aniketsingh-214/QR-based-Cafe-Ordering-System.git](https://github.com/aniketsingh-214/QR-based-Cafe-Ordering-System.git)  
**Branch:** `master`  
**Current Phase:** Phase 1 (Hotfix Applied & Production Built)

---

## 1. Executive Summary & Objective

The **QR-based Cafe Ordering System** is a mobile-first, contactless ordering web application developed with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

### Phase 1 Architectural Principles:
- **No Backend / Database Required:** All menu data, customer dining context, cart states, and temporary orders reside client-side in **Zustand** stores synchronized with browser `localStorage`.
- **Contactless Table QR Routing:** Unique URLs per table (e.g., `cafe.com/menu?table=T01`) automatically associate the dining session with the scanned physical table.
- **Fixed Kitchen Order Target:** Orders are sent directly to the verified kitchen WhatsApp number (`+91 90796 29797`), eliminating any risk of customer tampering with the recipient number.
- **Direct Anchor Links (Zero Popup Blocker Interception):** Plain `<a href target="_blank">` tags are used instead of `window.open()`, ensuring compatibility across iOS Safari and in-app camera browsers (Google Lens, Instagram, QR scanners).
- **Owner Panel Security (Basic Auth Middleware):** The table QR code generator and tent card print center reside at `/owner/qr-codes`, guarded by server-side HTTP Basic Auth (`OWNER_PANEL_USER` and `OWNER_PANEL_PASSWORD`).
- **Thermal Digital Receipt & PDF Export:** Generates an itemized digital receipt featuring cafe GSTIN, FSSAI credentials, 5% GST breakdown (2.5% CGST + 2.5% SGST), browser print-to-PDF styles, and customer WhatsApp receipt sharing.

---

## 2. Project File Structure

Below is the directory tree of the project codebase:

```
cafe-ordering/
├── .env.example                        # Template for OWNER_PANEL_USER, OWNER_PANEL_PASSWORD, NEXT_PUBLIC_SITE_URL
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
    ├── middleware.ts                   # HTTP Basic Auth protecting /owner/* routes
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
    │   └── owner/
    │       ├── layout.tsx              # Owner layout: noindex, nofollow, nocache
    │       └── qr-codes/
    │           └── page.tsx            # Owner-only QR Code & Tent Card Print Center
    ├── components/
    │   ├── customer/
    │   │   └── CustomerDetailsModal.tsx # Customer details editing modal with phone validation
    │   ├── layout/
    │   │   ├── BottomCartBar.tsx       # Floating sticky bottom cart indicator
    │   │   └── Header.tsx              # Brand header, table pill & cart button
    │   ├── menu/
    │   │   ├── CategoryTabs.tsx        # Horizontal category switcher with item counts
    │   │   ├── MenuCard.tsx            # Dish card with image, veg badge, stepper & price
    │   │   ├── MenuItemModal.tsx       # Dish detail modal with special cooking notes
    │   │   └── SearchBar.tsx           # Real-time search bar & veg/bestseller toggles
    │   └── receipt/
    │       └── DigitalReceipt.tsx      # Authentic thermal receipt with GST breakdown
    ├── data/
    │   ├── categories.ts               # 7 Category definitions with Lucide icon mappings
    │   ├── config.ts                   # Cafe branding, fixed owner WhatsApp (919079629797), GST & tax rates
    │   ├── menu.ts                     # Configurable catalog across all 7 categories
    │   └── tables.ts                   # Table master data T01 - T12 with zones & seats
    ├── lib/
    │   ├── bill-generator.ts           # Itemized bill computation & window.print() trigger
    │   ├── order-generator.ts          # Order ID generator (ORD-YYYYMMDD-XXX)
    │   ├── qr-generator.ts             # High-res QR code generator using `qrcode` library & site origin detection
    │   ├── utils.ts                    # Tailwind `cn`, INR currency & date formatters
    │   └── whatsapp.ts                 # WhatsApp message builders & direct wa.me link generators
    ├── store/
    │   ├── cart-store.ts               # Zustand store for cart items, quantities & totals (immutable mapping)
    │   └── customer-store.ts           # Zustand store for table ID, mobile, name & notes (v1 migration)
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
| `.env.example` | Template for environment variables: `OWNER_PANEL_USER`, `OWNER_PANEL_PASSWORD`, and `NEXT_PUBLIC_SITE_URL`. |
| `src/middleware.ts` | Server-side HTTP Basic Auth protecting `/owner/:path*`. Compares credentials with constant-time equality check (`safeEqual`) to protect against timing attacks. Fails closed (HTTP 503) if credentials are not configured. |
| `package.json` | Defines project metadata, build scripts (`next dev`, `next build`, `next start`), and dependencies. |
| `tsconfig.json` | Configures strict TypeScript checking, bundler module resolution, and path aliasing (`@/*` -> `./src/*`). |
| `tailwind.config.ts` | Extends Tailwind with an authentic warm cafe palette (`cafe-50` to `cafe-950`), custom amber/emerald accents, soft elevation box shadows, and font configurations. |
| `next.config.mjs` | Configures Next.js image optimization domains for high-resolution photography from Unsplash (`images.unsplash.com`) and Pexels. |
| `postcss.config.js` | Directs Tailwind CSS and Autoprefixer processing for cross-browser CSS styling. |
| `.gitignore` | Excludes `.next/`, `node_modules/`, `out/`, build logs, and environment files (`.env*.local`) from Git version control. |
| `README.md` | Provides complete documentation on system flow, local installation, testing scenarios, and prompt verification calculations. |

---

### 3.2 Application Pages (`src/app/`)

| Route / File | Screen | Description & Capabilities |
| :--- | :--- | :--- |
| `src/app/page.tsx` | **Screen 01 & 02: QR Landing** | • Detects table number from the URL query parameter `?table=Txx`.<br>• Pre-fills detected table with zone & seat indicator.<br>• Validates customer's Indian mobile number (`normalizeIndianMobile`).<br>• Clean customer view with zero staff/admin controls. |
| `src/app/menu/page.tsx` | **Screen 03 & 04: Digital Menu** | • Interactive menu listing across 7 categories.<br>• Live instant search matching item names, descriptions, and tags.<br>• Quick filter toggles for **Pure Veg 🌿** and **Bestsellers ⭐**.<br>• Sticky category pill navigation with live item counts.<br>• Clicking any dish triggers the custom cooking notes modal. |
| `src/app/cart/page.tsx` | **Screen 05: Shopping Cart** | • Itemized list with increment/decrement steppers and removal.<br>• Real-time financial calculation: Subtotal + 5% GST (2.5% CGST + 2.5% SGST) = Grand Total.<br>• Table and customer mobile recap with instant edit modal trigger.<br>• Special kitchen dining notes input.<br>• Direct progression to checkout. |
| `src/app/checkout/page.tsx` | **Screen 06: Checkout Review** | • Final confirmation screen before kitchen dispatch.<br>• Uses `normalizeIndianMobile` for clean 10-digit mobile number normalization.<br>• Assembles order payload with unique ID: `ORD-YYYYMMDD-XXX`.<br>• Saves order to store, clears cart, and navigates to confirmation. |
| `src/app/order-success/page.tsx` | **Screen 07 & 08: Order Confirmation** | • Fires celebratory confetti animation upon arrival.<br>• **WhatsApp Owner Notification Link**: Direct `<a href target="_blank">` tag opening WhatsApp to `+919079629797` with pre-filled kitchen order.<br>• Shows accordion preview of the exact WhatsApp transmission.<br>• **Print / Save as PDF Button**: Prints clean thermal receipt without UI headers or footers.<br>• **Send Bill to My WhatsApp Link**: Direct link sending customer receipt to their own mobile number. |
| `src/app/owner/layout.tsx` | **Owner Layout** | • Sets `robots: { index: false, follow: false, nocache: true }`. |
| `src/app/owner/qr-codes/page.tsx` | **Owner Table QR Center** | • Basic-Auth protected table QR code generator for tables `T01` to `T12`.<br>• Detects and warns if public origin is localhost or unreachable (`isUnreachableOrigin`).<br>• Custom Table Generator (e.g. `VIP-1`, `TERRACE-4`).<br>• PNG download and printable table tent cards. |
| `src/app/layout.tsx` | **Root Layout** | • Mobile-first responsive wrapper with viewport restrictions.<br>• Global sticky `Header` and floating `BottomCartBar`. |
| `src/app/globals.css` | **Global Styles** | • Tailwind layer definitions.<br>• `@media print` rules configuring clean thermal bill printing and hiding navigation elements. |

---

### 3.3 UI Components (`src/components/`)

| Component | Functionality |
| :--- | :--- |
| `components/layout/Header.tsx` | Top navigation bar with cafe branding, live active table indicator pill (opens table picker only), and dynamic cart item counter badge. Owner settings and QR links removed from customer view. |
| `components/layout/BottomCartBar.tsx` | Sticky floating pill displaying item count, grand total, and a direct link to the cart. |
| `components/menu/MenuCard.tsx` | Card displaying dish photo, veg/non-veg indicator, bestseller tag, estimated preparation time, description, price in INR, and quick +/- stepper. |
| `components/menu/MenuItemModal.tsx` | Full-screen/modal inspection with high-res photography, dish tags, special preparation notes input, and custom quantity selector. |
| `components/menu/CategoryTabs.tsx` | Sticky horizontal scrollbar displaying all 7 food categories plus "All Items", complete with Lucide icons and category item counters. |
| `components/menu/SearchBar.tsx` | Search input with clear button, paired with single-tap toggle buttons for "Pure Veg" and "Bestsellers". |
| `components/customer/CustomerDetailsModal.tsx` | Reusable modal dialog allowing customers or waitstaff to update table assignment, mobile number, or guest name. |
| `components/receipt/DigitalReceipt.tsx` | Authentic receipt layout featuring cafe header, address, GSTIN, FSSAI numbers, itemized billing table, CGST/SGST tax split, and perforated edge styling. |

---

### 3.4 Data & Configuration (`src/data/`)

| File | Content & Functionality |
| :--- | :--- |
| `data/menu.ts` | Complete catalog of 20+ dishes across 7 categories (**Coffee**, **Tea**, **Cold Beverages**, **Snacks**, **Sandwiches**, **Main Course**, **Desserts**). Includes exact prompt items: Classic Cappuccino (₹180), Gourmet Veg Club Sandwich (₹150), and Crispy Peri-Peri French Fries (₹120). |
| `data/categories.ts` | Category metadata containing unique IDs, labels, Lucide icon identifiers, and descriptions. |
| `data/tables.ts` | Dining tables `T01` through `T12` categorized into zones with seating capacities. |
| `data/config.ts` | Default configuration for cafe name, tagline, physical address, GSTIN, FSSAI license, 5% tax rate, and verified kitchen WhatsApp number (`919079629797`). |

---

### 3.5 State Management (`src/store/`)

| Store | State Managed & Persistence |
| :--- | :--- |
| `store/cart-store.ts` | Managed using **Zustand** with `persist` middleware saving to `cafe-cart-store` in `localStorage`.<br>• Immutable array update via `.map()` when updating existing item quantities.<br>• Computed helpers: `getSubtotal()`, `getTaxAmount()`, `getGrandTotal()`, `getItemCount()`, `getItemQuantity(id)`. |
| `store/customer-store.ts` | Managed using **Zustand** with `persist` middleware saving to `cafe-customer-store` in `localStorage`.<br>• Stores `tableId`, `mobile`, `name`, and `notes`.<br>• **v1 Migration**: Automatically strips deprecated `customOwnerWhatsApp` from client storage to prevent customers from retaining stale numbers. |

---

### 3.6 Libraries & Utilities (`src/lib/`)

| Utility | Description & Implementation Details |
| :--- | :--- |
| `lib/whatsapp.ts` | • `normalizeIndianMobile(input)`: Parses and validates Indian mobile numbers to 10 digits.<br>• `sanitizeWhatsAppPhone(phone)`: Prepends `91` and throws if invalid.<br>• `OWNER_WHATSAPP`: Constant holding `919079629797`.<br>• `getOwnerOrderUrl(order)`: Direct URL to kitchen WhatsApp.<br>• `getCustomerBillUrl(order)`: Direct URL to customer's own WhatsApp with digital bill. |
| `lib/qr-generator.ts` | • `getSiteOrigin()`: Returns `NEXT_PUBLIC_SITE_URL` if set, else `window.location.origin`.<br>• `isUnreachableOrigin(origin)`: Detects localhost or private subnet IPs to warn owners before printing QR codes.<br>• `generateTableQrDataUrl(tableId)`: Uses `qrcode` to generate high-resolution PNG data URLs. |
| `lib/order-generator.ts` | • `generateOrderId()`: Generates unique daily order identifiers formatted as `ORD-YYYYMMDD-XXX`.<br>• `buildOrder(items, customer, taxPercent, notes)`: Assembles complete `Order` payload. |
| `lib/bill-generator.ts` | • `generateItemizedBill(order, config)`: Computes subtotal, CGST (2.5%), SGST (2.5%), total tax, and grand total.<br>• `printBill()`: Triggers `window.print()` targeting print styles. |
| `lib/utils.ts` | • `cn(...)`: Tailwind class variance merger.<br>• `formatCurrency(amount)`: Formats numbers into Indian Rupee strings (`₹630.00`).<br>• `formatDate(date)`: Formats date timestamps. |

---

## 4. Current Status & Verification

| Dimension | Current Status | Notes / Verification |
| :--- | :---: | :--- |
| **Source Code** | **100% Complete** | All hotfix changes, owner Basic Auth, and direct WhatsApp links applied. |
| **Production Build** | **Passing (`0 Errors`)** | Tested with `npm run build`; routes compiled cleanly. |
| **TypeScript Validation** | **Passing (`0 Errors`)** | Strict type-checking validated. |
| **Security** | **Hardened** | Staff QR tools moved to `/owner/*` behind Basic Auth; kitchen number constant in server/build config. |
