"use client";

import React from "react";
import { Order } from "@/types/order";
import { DEFAULT_CAFE_CONFIG } from "@/data/config";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Coffee, CheckCircle, ShieldCheck } from "lucide-react";

interface DigitalReceiptProps {
  order: Order;
}

export default function DigitalReceipt({ order }: DigitalReceiptProps) {
  const cgst = Math.round(((order.subtotal * (order.taxPercent / 2)) / 100) * 100) / 100;
  const sgst = Math.round((order.taxAmount - cgst) * 100) / 100;

  return (
    <div className="receipt-container bg-white text-cafe-950 p-6 sm:p-8 rounded-3xl border-2 border-dashed border-cafe-300 shadow-soft max-w-md mx-auto relative font-mono text-xs">
      {/* Decorative top circle notches */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-cafe-50 rounded-full border-b border-cafe-300 no-print"></div>

      {/* Cafe Header */}
      <div className="text-center pb-4 border-b border-cafe-300 space-y-1">
        <div className="flex items-center justify-center gap-1.5 font-sans font-black text-lg text-cafe-950 tracking-tight">
          <Coffee className="w-5 h-5 text-amber-700" />
          <span>{DEFAULT_CAFE_CONFIG.cafeName}</span>
        </div>
        <p className="text-[11px] text-cafe-600 font-sans">{DEFAULT_CAFE_CONFIG.cafeTagline}</p>
        <p className="text-[10px] text-cafe-500 leading-tight px-4">{DEFAULT_CAFE_CONFIG.address}</p>
        <div className="pt-1 text-[10px] text-cafe-600 flex justify-center gap-3">
          <span>GSTIN: {DEFAULT_CAFE_CONFIG.gstNumber}</span>
          <span>FSSAI: {DEFAULT_CAFE_CONFIG.fssaiNumber}</span>
        </div>
      </div>

      {/* Bill Meta Data */}
      <div className="py-3 border-b border-dashed border-cafe-300 space-y-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-cafe-600">ORDER NO:</span>
          <span className="font-bold text-cafe-950">{order.orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-cafe-600">DATE & TIME:</span>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-cafe-600">TABLE NO:</span>
          <span className="font-extrabold bg-cafe-900 text-white px-2 py-0.5 rounded text-xs">
            {order.tableId}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-cafe-600">CUSTOMER:</span>
          <span className="font-bold">{order.customerName || "Guest"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-cafe-600">MOBILE:</span>
          <span>+91 {order.customerMobile}</span>
        </div>
      </div>

      {/* Itemized Table Header */}
      <div className="py-2 border-b border-cafe-300 font-bold text-cafe-800 flex justify-between text-[11px]">
        <span className="w-1/2">ITEM</span>
        <span className="w-12 text-center">QTY</span>
        <span className="w-16 text-right">PRICE</span>
        <span className="w-16 text-right">TOTAL</span>
      </div>

      {/* Items List */}
      <div className="py-2.5 border-b border-dashed border-cafe-300 space-y-2 text-[11px]">
        {order.items.map((ci) => (
          <div key={ci.item.id} className="space-y-0.5">
            <div className="flex justify-between items-start">
              <span className="w-1/2 font-medium text-cafe-950 truncate pr-1">
                {ci.item.name}
              </span>
              <span className="w-12 text-center font-bold">{ci.quantity}</span>
              <span className="w-16 text-right text-cafe-600">₹{ci.item.price}</span>
              <span className="w-16 text-right font-bold text-cafe-950">
                ₹{ci.item.price * ci.quantity}
              </span>
            </div>
            {ci.notes && (
              <p className="text-[10px] text-amber-800 italic pl-1">
                ↳ Note: {ci.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Financial Breakdown */}
      <div className="py-3 border-b border-cafe-300 space-y-1.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-cafe-600">SUBTOTAL</span>
          <span className="font-semibold text-cafe-900">₹{order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-cafe-600">
          <span>CGST (2.5%)</span>
          <span>₹{cgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-cafe-600">
          <span>SGST (2.5%)</span>
          <span>₹{sgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-cafe-600">
          <span>TOTAL TAXES (5%)</span>
          <span>₹{order.taxAmount.toFixed(2)}</span>
        </div>
        <div className="pt-2 border-t border-dashed border-cafe-300 flex justify-between items-baseline font-black text-sm text-cafe-950">
          <span>GRAND TOTAL</span>
          <span className="text-base text-cafe-950">₹{order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Special Requests if any */}
      {order.specialInstructions && (
        <div className="py-2 border-b border-dashed border-cafe-300 text-[10px] text-cafe-700">
          <span className="font-bold text-cafe-900">KITCHEN INSTRUCTIONS: </span>
          <span>{order.specialInstructions}</span>
        </div>
      )}

      {/* Bill Footer & QR Verification Stamp */}
      <div className="pt-4 text-center space-y-1.5 font-sans">
        <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-bold text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>ORDER CONFIRMED & QUEUED</span>
        </div>
        <p className="text-[10px] text-cafe-500">
          Please notify the barista/waitstaff via WhatsApp.
        </p>
        <p className="text-[10px] font-mono tracking-widest text-cafe-400 pt-1">
          ••• THANK YOU FOR DINING WITH US •••
        </p>
      </div>

      {/* Decorative bottom notch */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-cafe-50 rounded-full border-t border-cafe-300 no-print"></div>
    </div>
  );
}
