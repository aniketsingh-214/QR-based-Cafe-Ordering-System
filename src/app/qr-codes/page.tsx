"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  QrCode,
  Download,
  ExternalLink,
  Printer,
  Plus,
  Coffee,
  Sparkles,
  ArrowLeft,
  Check,
} from "lucide-react";
import { CAFE_TABLES } from "@/data/tables";
import { DEFAULT_CAFE_CONFIG } from "@/data/config";
import { generateTableQrDataUrl, getTableMenuUrl } from "@/lib/qr-generator";

interface TableQrData {
  id: string;
  name: string;
  zone: string;
  seats: number;
  qrDataUrl: string;
  url: string;
}

export default function QrCodesPage() {
  const router = useRouter();
  const [tableQrs, setTableQrs] = useState<TableQrData[]>([]);
  const [loading, setLoading] = useState(true);
  const [customTableId, setCustomTableId] = useState("");
  const [customZone, setCustomZone] = useState("Special Lounge");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadQrs() {
      setLoading(true);
      const results: TableQrData[] = [];
      for (const table of CAFE_TABLES) {
        try {
          const qrDataUrl = await generateTableQrDataUrl(table.id);
          const url = getTableMenuUrl(table.id);
          results.push({
            ...table,
            qrDataUrl,
            url,
          });
        } catch (err) {
          console.error("Error generating QR:", err);
        }
      }
      setTableQrs(results);
      setLoading(false);
    }
    loadQrs();
  }, []);

  const handleAddCustomTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTableId.trim()) return;

    const cleanId = customTableId.trim().toUpperCase();
    if (tableQrs.some((t) => t.id === cleanId)) {
      alert("This table ID already exists!");
      return;
    }

    try {
      const qrDataUrl = await generateTableQrDataUrl(cleanId);
      const url = getTableMenuUrl(cleanId);
      setTableQrs((prev) => [
        {
          id: cleanId,
          name: `Table ${cleanId}`,
          zone: customZone.trim() || "Custom Area",
          seats: 4,
          qrDataUrl,
          url,
        },
        ...prev,
      ]);
      setCustomTableId("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadQr = (table: TableQrData) => {
    const link = document.createElement("a");
    link.href = table.qrDataUrl;
    link.download = `QR-Table-${table.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = (table: TableQrData) => {
    navigator.clipboard.writeText(table.url);
    setCopiedId(table.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Back Link */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-xs font-bold text-cafe-700 hover:text-cafe-950"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={handlePrintAll}
          className="flex items-center gap-2 px-4 py-2 bg-cafe-900 text-white rounded-xl text-xs font-bold hover:bg-cafe-800 shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print All Table Tent Cards</span>
        </button>
      </div>

      {/* Hero Information */}
      <div className="bg-white rounded-3xl p-6 border border-cafe-200/90 shadow-soft no-print space-y-2">
        <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
          <QrCode className="w-4 h-4" />
          <span>Module 1 · QR Code & Table Identification</span>
        </div>
        <h1 className="text-2xl font-black text-cafe-950">Cafe Table QR Code Center</h1>
        <p className="text-xs text-cafe-600 leading-relaxed max-w-2xl">
          Each dining table has a unique QR code. When customers scan it with their phone camera,
          the cafe menu automatically loads with their table number pre-selected.
        </p>

        {/* Generate Custom Table Input */}
        <form onSubmit={handleAddCustomTable} className="pt-4 flex flex-wrap gap-2.5 items-center">
          <input
            type="text"
            value={customTableId}
            onChange={(e) => setCustomTableId(e.target.value.toUpperCase())}
            placeholder="New Table ID (e.g. T13, VIP-1)"
            className="px-3.5 py-2 border border-cafe-300 rounded-xl text-xs text-cafe-900 font-bold uppercase w-48"
          />
          <input
            type="text"
            value={customZone}
            onChange={(e) => setCustomZone(e.target.value)}
            placeholder="Zone (e.g. Balcony, Rooftop)"
            className="px-3.5 py-2 border border-cafe-300 rounded-xl text-xs text-cafe-900 w-48"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Generate QR</span>
          </button>
        </form>
      </div>

      {/* Printable Table Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-cafe-600 text-sm">
          Generating high-resolution table QR codes...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tableQrs.map((table) => (
            <div
              key={table.id}
              className="bg-white rounded-3xl p-6 border-2 border-cafe-300 shadow-soft text-center flex flex-col justify-between relative group hover:border-amber-600 transition-colors"
            >
              {/* Brand Top */}
              <div>
                <div className="flex items-center justify-center gap-1.5 text-cafe-900 font-bold text-xs">
                  <Coffee className="w-4 h-4 text-amber-700" />
                  <span>{DEFAULT_CAFE_CONFIG.cafeName}</span>
                </div>
                <p className="text-[10px] text-cafe-500">{DEFAULT_CAFE_CONFIG.cafeTagline}</p>

                {/* Table ID Big Badge */}
                <div className="my-3 py-1.5 px-4 bg-cafe-950 text-white rounded-2xl inline-block shadow-xs">
                  <span className="text-xl font-black tracking-wider">{table.id}</span>
                </div>
                <p className="text-xs font-bold text-cafe-800">{table.name}</p>
                <p className="text-[11px] text-cafe-500">
                  {table.zone} · {table.seats} Seats
                </p>

                {/* QR Code Graphic */}
                <div className="my-4 p-3 bg-cafe-50 rounded-2xl border border-cafe-200 inline-block shadow-inner">
                  {table.qrDataUrl && (
                    <Image
                      src={table.qrDataUrl}
                      alt={`QR code for ${table.id}`}
                      width={180}
                      height={180}
                      className="mx-auto rounded-lg"
                      unoptimized
                    />
                  )}
                </div>

                <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 py-1 px-3 rounded-full border border-amber-200 mx-auto w-fit">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Scan with Phone Camera to Order</span>
                </div>
              </div>

              {/* Action Buttons (Hidden on Print) */}
              <div className="mt-4 pt-4 border-t border-cafe-100 flex items-center justify-center gap-2 no-print">
                {/* Test Customer View */}
                <button
                  onClick={() => router.push(`/menu?table=${table.id}`)}
                  title="Simulate customer scanning QR"
                  className="p-2 rounded-xl bg-cafe-100 hover:bg-cafe-200 text-cafe-800 text-xs font-bold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Menu</span>
                </button>

                {/* Copy Link */}
                <button
                  onClick={() => handleCopyLink(table)}
                  title="Copy QR URL"
                  className="p-2 rounded-xl bg-cafe-100 hover:bg-cafe-200 text-cafe-800 text-xs font-bold flex items-center gap-1"
                >
                  {copiedId === table.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <span>Copy URL</span>
                  )}
                </button>

                {/* Download PNG */}
                <button
                  onClick={() => handleDownloadQr(table)}
                  title="Download QR Image"
                  className="p-2 rounded-xl bg-cafe-900 hover:bg-cafe-800 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PNG</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
