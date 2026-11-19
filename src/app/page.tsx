"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Coffee,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Phone,
  User,
  Sparkles,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { useCustomerStore } from "@/store/customer-store";
import { CAFE_TABLES, getTableById } from "@/data/tables";
import { DEFAULT_CAFE_CONFIG } from "@/data/config";

function LandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableParam = searchParams.get("table");

  const { name, mobile, tableId, setName, setMobile, setTableId } = useCustomerStore();

  const [selectedTable, setSelectedTable] = useState<string>(tableParam || tableId || "T01");
  const [customerName, setCustomerName] = useState<string>(name);
  const [customerMobile, setCustomerMobile] = useState<string>(mobile);
  const [error, setError] = useState<string | null>(null);

  // If table parameter exists in URL, sync to state
  useEffect(() => {
    if (tableParam) {
      const cleanTable = tableParam.trim().toUpperCase();
      setSelectedTable(cleanTable);
      setTableId(cleanTable);
    } else if (tableId) {
      setSelectedTable(tableId);
    }
  }, [tableParam, tableId, setTableId]);

  const activeTableInfo = getTableById(selectedTable);

  const validatePhone = (number: string): boolean => {
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length === 12 && cleaned.startsWith("91")) {
      return /^[6-9]\d{9}$/.test(cleaned.slice(2));
    }
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  const handleStartOrdering = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedPhone = customerMobile.replace(/\D/g, "");
    const actual10Digits =
      cleanedPhone.length === 12 && cleanedPhone.startsWith("91")
        ? cleanedPhone.slice(2)
        : cleanedPhone;

    if (!validatePhone(actual10Digits)) {
      setError("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).");
      return;
    }

    if (!selectedTable) {
      setError("Please select or enter your table number.");
      return;
    }

    setName(customerName.trim());
    setMobile(actual10Digits);
    setTableId(selectedTable);

    // Redirect to menu with table query
    router.push(`/menu?table=${encodeURIComponent(selectedTable)}`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cafe-950 via-cafe-900 to-cafe-800 text-white p-6 shadow-elevated border border-cafe-700/60">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Contactless QR Ordering</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {DEFAULT_CAFE_CONFIG.cafeName}
        </h1>
        <p className="text-cafe-300 text-xs sm:text-sm mt-1 leading-relaxed">
          {DEFAULT_CAFE_CONFIG.cafeTagline}
        </p>

        {/* Table Confirmation Badge */}
        <div className="mt-5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-cafe-950 font-black text-sm flex items-center justify-center shadow-xs">
              {selectedTable}
            </div>
            <div>
              <p className="text-[11px] text-cafe-300 uppercase tracking-wider font-semibold">
                Detected Dining Table
              </p>
              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{activeTableInfo ? activeTableInfo.name : `Table ${selectedTable}`}</span>
                {activeTableInfo && (
                  <span className="text-[11px] text-amber-300 font-normal">
                    • {activeTableInfo.zone}
                  </span>
                )}
              </p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
      </div>

      {/* Steps Progress Mini-Guide */}
      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold text-cafe-700">
        <div className="p-2 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-900">
          <span className="block font-black text-xs text-amber-800">1. QR</span>
          Table Set
        </div>
        <div className="p-2 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-900">
          <span className="block font-black text-xs text-amber-800">2. Info</span>
          Your Mobile
        </div>
        <div className="p-2 rounded-xl bg-white border border-cafe-200 text-cafe-500">
          <span className="block font-black text-xs text-cafe-700">3. Menu</span>
          Pick Food
        </div>
        <div className="p-2 rounded-xl bg-white border border-cafe-200 text-cafe-500">
          <span className="block font-black text-xs text-cafe-700">4. Order</span>
          WhatsApp
        </div>
      </div>

      {/* Customer Info Form */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-cafe-200/90">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-cafe-950 flex items-center gap-2">
            <span>Welcome! Let&apos;s get you seated</span>
          </h2>
          <p className="text-xs text-cafe-600 mt-1">
            Enter your mobile number to receive your itemized digital bill and order confirmation.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleStartOrdering} className="space-y-4">
          {/* Table Picker */}
          <div>
            <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cafe-600" />
                Table Number
              </span>
              <span className="text-[11px] text-amber-700 font-normal">Pre-filled via QR</span>
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full px-3.5 py-3 border border-cafe-300 rounded-xl text-cafe-950 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-600 bg-cafe-50/50"
            >
              {CAFE_TABLES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} — {t.name} ({t.zone} · {t.seats} seats)
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Number (Mandatory) */}
          <div>
            <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cafe-600" />
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cafe-500 text-sm font-bold">
                +91
              </div>
              <input
                type="tel"
                value={customerMobile}
                onChange={(e) => {
                  setCustomerMobile(e.target.value);
                  if (error) setError(null);
                }}
                maxLength={10}
                placeholder="9876543210"
                className="w-full pl-12 pr-4 py-3 border border-cafe-300 rounded-xl text-cafe-950 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-600 shadow-2xs"
                required
              />
            </div>
            <p className="text-[11px] text-cafe-500 mt-1">
              Required for instant WhatsApp order verification & receipt.
            </p>
          </div>

          {/* Customer Name (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cafe-600" />
              Your Name <span className="text-cafe-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-3 border border-cafe-300 rounded-xl text-cafe-950 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-600"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-cafe-950 hover:bg-cafe-900 text-white font-extrabold text-sm sm:text-base shadow-elevated flex items-center justify-center gap-2 transition-transform active:scale-[0.99] group"
          >
            <span>Explore Cafe Menu</span>
            <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>

      {/* Staff & Table Utility Link */}
      <div className="p-4 rounded-2xl bg-cafe-100/80 border border-cafe-300/80 flex items-center justify-between text-xs text-cafe-800">
        <div className="flex items-center gap-2.5">
          <QrCode className="w-5 h-5 text-cafe-700" />
          <div>
            <p className="font-bold">Cafe Staff & QR Code Generator</p>
            <p className="text-cafe-600 text-[11px]">Generate & print table tent cards</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/qr-codes")}
          className="px-3 py-1.5 rounded-xl bg-white border border-cafe-300 font-bold hover:bg-cafe-200 transition-colors flex items-center gap-1 text-cafe-900"
        >
          <span>View QRs</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-cafe-600">Loading table info...</div>}>
      <LandingContent />
    </Suspense>
  );
}
