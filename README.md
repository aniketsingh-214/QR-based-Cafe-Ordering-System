# The Roast & Toast Cafe — QR-based Table Ordering System (Phase 1)

A frontend-only, contactless QR-based cafe ordering web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Zustand**. Designed for mobile responsiveness, seamless table-side ordering, instant WhatsApp kitchen notifications, and digital receipts without any backend or database requirements.

---

## 🚀 Customer Experience Flow (8 Screens)

```
[01. QR Scan / Landing]  ──▶  [02. Customer Mobile]  ──▶  [03. Digital Menu]
      ?table=T01                Indian Mobile Validation      7 Categories, Search & Filters
                                                                    │
                                                                    ▼
[06. Checkout Review]   ◀──   [05. Cart Summary]     ◀──  [04. Item Details]
   Table, Mobile, Notes          Qty, Subtotal, 5% GST       Image, Tags, Cooking Notes
         │
         ▼
[07. Order Confirmation & Digital Bill]  ──▶  [08. WhatsApp Click-to-Chat]
   Unique ID: ORD-YYYYMMDD-XXX                  Owner Kitchen Notification &
   Thermal Bill Styling, Print & PDF            Companion Bill Sharing
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom warm cafe palette
- **Icons**: Lucide React
- **State Management**: Zustand with `localStorage` persistence
- **QR Generation**: `qrcode` (dynamic table tent cards & QR URLs)
- **Notifications**: WhatsApp Click-to-Chat (`wa.me` links with URL-encoded messages)
- **Receipt / Printing**: Optimized CSS `@media print` engine for thermal bills

---

## 📦 Project Structure

```
├── public/
├── src/
│   ├── app/
│   │   ├── page.tsx            # Screen 01 & 02: Table identification & Customer details
│   │   ├── menu/page.tsx       # Screen 03 & 04: Digital Menu browsing & search
│   │   ├── cart/page.tsx       # Screen 05: Cart management & calculation
│   │   ├── checkout/page.tsx   # Screen 06: Order review & placement
│   │   ├── order-success/page.tsx # Screen 07 & 08: Digital bill & WhatsApp trigger
│   │   ├── owner/qr-codes/page.tsx   # Owner-only QR Code & Tent Card Print Center (Basic-Auth protected)
│   │   ├── layout.tsx          # Root mobile-first layout with Header & Bottom Cart Bar
│   │   └── globals.css         # Styling & print receipt rules
│   ├── components/
│   │   ├── layout/Header.tsx
│   │   ├── layout/BottomCartBar.tsx
│   │   ├── menu/MenuCard.tsx
│   │   ├── menu/MenuItemModal.tsx
│   │   ├── menu/CategoryTabs.tsx
│   │   ├── menu/SearchBar.tsx
│   │   ├── customer/CustomerDetailsModal.tsx
│   │   └── receipt/DigitalReceipt.tsx
│   ├── data/
│   │   ├── menu.ts             # Complete menu across 7 categories
│   │   ├── categories.ts       # Coffee, Tea, Cold Drinks, Snacks, Sandwiches, Main Course, Desserts
│   │   ├── tables.ts           # Tables T01 - T12 with zones & seat counts
│   │   └── config.ts           # Cafe branding, default owner WhatsApp, tax rates
│   ├── store/
│   │   ├── cart-store.ts       # Zustand cart store with subtotal, tax, grand total
│   │   └── customer-store.ts   # Zustand customer & active table store
│   ├── lib/
│   │   ├── whatsapp.ts         # WhatsApp message formatting & wa.me click-to-chat
│   │   ├── qr-generator.ts     # QR Code generation via `qrcode`
│   │   ├── order-generator.ts  # Unique ID generator (ORD-YYYYMMDD-XXX)
│   │   ├── bill-generator.ts   # Itemized bill computation & browser print trigger
│   │   └── utils.ts
│   └── types/
│       ├── menu.ts
│       ├── order.ts
│       └── customer.ts
└── package.json
```

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` to enable the owner panel:
```bash
cp .env.example .env.local
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Scenarios

1. **Table-Specific QR Simulation**:
   - Visit [http://localhost:3000/?table=T01](http://localhost:3000/?table=T01) or [http://localhost:3000/menu?table=T04](http://localhost:3000/menu?table=T04)
   - Notice that the table ID is automatically detected and locked.

2. **Customer Information & Validation**:
   - Enter your Indian mobile number (`9876543210`) and optional name.
   - Validation ensures a valid 10-digit number before order placement.

3. **Menu Browsing & Search**:
   - Filter by categories: **Coffee**, **Tea**, **Cold Beverages**, **Snacks**, **Sandwiches**, **Main Course**, **Desserts**.
   - Use the live search bar or toggles for **Pure Veg 🌿** and **Bestsellers ⭐**.
   - Tap any card to view detailed notes, preparation time, and add custom instructions.

4. **Verify Prompt Example Calculations**:
   - Add **2 × Classic Cappuccino** (₹180 ea = ₹360)
   - Add **1 × Gourmet Veg Club Sandwich** (₹150)
   - Add **1 × Crispy Peri-Peri French Fries** (₹120)
   - Check Cart:
     - Subtotal: **₹630.00**
     - Taxes (5% GST): **₹31.50**
     - Grand Total: **₹661.50**

5. **Place Order & WhatsApp Trigger**:
   - Proceed to Checkout and tap **Confirm & Place Order**.
   - Order ID is generated in format: `ORD-20261119-001`.
   - Tap **Send Order to Kitchen on WhatsApp**: Direct link opens WhatsApp to the kitchen number (`+919079629797`) with pre-filled order.
   - Tap **Send Bill to My WhatsApp** to send receipt text to customer's own number.
   - Tap **Print / Save PDF** to trigger clean thermal receipt printing.

6. **QR Code Generator & Table Stand Center**:
   - Visit [http://localhost:3000/owner/qr-codes](http://localhost:3000/owner/qr-codes)
   - Enter owner credentials from `.env.local` (`owner` / `change-me-to-a-long-random-password`).
   - View, download, or print table tent cards for all tables (T01 - T12) or create custom tables.
