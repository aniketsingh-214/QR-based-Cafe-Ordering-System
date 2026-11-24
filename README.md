# The Roast & Toast Cafe — QR-based Table Ordering System

A frontend-only, contactless QR-based cafe ordering web application built with **Vite**, **React 18**, **TypeScript**, **Tailwind CSS**, and **Zustand**. Designed for mobile responsiveness, seamless table-side ordering, instant WhatsApp kitchen notifications, and digital receipts without any backend or database requirements.

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

- **Build Tool & Dev Server**: Vite
- **Framework**: React 18 + React Router 6
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom warm cafe palette
- **Global Styles**: `src/globals.css` (custom CSS variables, scrollbars, print styles)
- **Icons**: Lucide React
- **State Management**: Zustand with `localStorage` persistence
- **QR Generation**: `qrcode` (dynamic table tent cards & QR URLs)
- **Notifications**: WhatsApp Click-to-Chat (`wa.me` links with URL-encoded messages)
- **Receipt / Printing**: Optimized CSS `@media print` engine for thermal bills

---

## 📦 Project Structure

```
├── index.html                  # Vite root HTML entry
├── vite.config.ts              # Vite configuration with @/ alias
├── tailwind.config.ts          # Tailwind CSS theme configuration
├── postcss.config.js           # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
├── public/                     # Static assets (coffee.svg logo, etc.)
├── src/
│   ├── main.tsx                # Application mounting entry point
│   ├── App.tsx                 # React Router route definitions
│   ├── globals.css             # Tailwind base & custom design styles
│   ├── pages/
│   │   ├── LandingPage.tsx     # Screen 01 & 02: Table identification & Customer details
│   │   ├── MenuPage.tsx        # Screen 03 & 04: Digital Menu browsing & search
│   │   ├── CartPage.tsx        # Screen 05: Cart management & calculation
│   │   ├── CheckoutPage.tsx    # Screen 06: Order review & placement
│   │   ├── OrderSuccessPage.tsx# Screen 07 & 08: Digital bill & WhatsApp trigger
│   │   └── owner/
│   │       └── QrCodesPage.tsx # Owner QR Code & Tent Card Print Center
│   ├── components/
│   │   ├── common/
│   │   │   └── ScrollToTop.tsx # Resets scroll position on navigation
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── BottomCartBar.tsx
│   │   ├── menu/
│   │   │   ├── MenuCard.tsx
│   │   │   ├── MenuItemModal.tsx
│   │   │   ├── CategoryTabs.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── customer/
│   │   │   └── CustomerDetailsModal.tsx
│   │   ├── receipt/
│   │   │   └── DigitalReceipt.tsx
│   │   └── ui/
│   │       └── Image.tsx       # Responsive image component
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
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run the Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```
This produces optimized production assets in `dist/`.
