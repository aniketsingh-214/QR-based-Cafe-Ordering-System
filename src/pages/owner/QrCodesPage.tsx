import React, { useState, useEffect, useMemo } from "react";
import Image from "@/components/ui/Image";
import { useNavigate } from "react-router-dom";
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
  Search,
  Trash2,
  Globe,
  Copy,
  LogOut,
  Users,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { DEFAULT_CAFE_CONFIG } from "@/data/config";
import { useTablesStore } from "@/store/tables-store";
import { TableInfo } from "@/types/customer";
import {
  generateTableQrDataUrl,
  getTableMenuUrl,
  getSiteOrigin,
} from "@/lib/qr-generator";
import OwnerLoginModal from "@/components/owner/OwnerLoginModal";

interface TableQrData extends TableInfo {
  qrDataUrl: string;
  url: string;
}

const PRESET_ZONES = [
  "Indoor Window",
  "Indoor Main Hall",
  "Cozy Corner Lounge",
  "Patio Terrace",
  "Garden Gazebo",
  "Rooftop Balcony",
  "Private VIP Lounge",
  "Outdoor Bar Counter",
];

export default function QrCodesPage() {
  const navigate = useNavigate();
  const tables = useTablesStore((s) => s.tables);
  const addTable = useTablesStore((s) => s.addTable);
  const removeTable = useTablesStore((s) => s.removeTable);
  const isExistingTable = useTablesStore((s) => s.isExistingTable);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("owner_auth") === "true";
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [tableQrs, setTableQrs] = useState<TableQrData[]>([]);
  const [loading, setLoading] = useState(true);

  // New table form state
  const [newTableId, setNewTableId] = useState("");
  const [newTableName, setNewTableName] = useState("");
  const [newTableZone, setNewTableZone] = useState("Indoor Main Hall");
  const [newTableSeats, setNewTableSeats] = useState(4);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZoneFilter, setSelectedZoneFilter] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedUrlFeedback, setCopiedUrlFeedback] = useState(false);

  const siteOrigin = getSiteOrigin();

  // Load and generate high-res QR codes for all tables in the store
  useEffect(() => {
    if (!isAuthenticated) return;

      let isMounted = true;
      async function loadAllQrs() {
        setLoading(true);
        const results: TableQrData[] = [];
          for (const t of tables) {
            try {
              const qrDataUrl = await generateTableQrDataUrl(t.id);
              const url = getTableMenuUrl(t.id);
              results.push({
                ...t,
                qrDataUrl,
                url,
              });
            } catch (err) {
              console.error("Failed to generate QR for", t.id, err);
            }
          }
          if (isMounted) {
            setTableQrs(results);
            setLoading(false);
          }
        }

  loadAllQrs();
  return () => {
    isMounted = false;
  };
}, [tables, isAuthenticated]);

  const isDuplicate = Boolean(newTableId && isExistingTable(newTableId));

  const handleCreateNewTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableId.trim()) return;

      const cleanId = newTableId.trim().toUpperCase();
      if (isExistingTable(cleanId)) {
        setFeedbackMsg({ text: `Table "${cleanId}" already exists. Pick a different ID.`, type: "error" });
        return;
      }

        const success = addTable({
          id: cleanId,
          name: newTableName.trim() || `Table ${cleanId}`,
          zone: newTableZone.trim() || "Main Dining Area",
          seats: newTableSeats,
        });

        if (success) {
          setFeedbackMsg({ text: `Table ${cleanId} created & QR generated!`, type: "success" });
          setNewTableId("");
          setNewTableName("");
          setTimeout(() => setFeedbackMsg(null), 3000);
        }
      };

      const handleDeleteTable = (id: string) => {
        removeTable(id);
        setFeedbackMsg({ text: `Table ${id} removed.`, type: "success" });
        setTimeout(() => setFeedbackMsg(null), 2500);
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

      const handleCopyOrigin = () => {
        navigator.clipboard.writeText(siteOrigin);
        setCopiedUrlFeedback(true);
        setTimeout(() => setCopiedUrlFeedback(false), 1500);
      };

      const handlePrintAll = () => {
        window.print();
      };

        const handleLogout = () => {
          sessionStorage.removeItem("owner_auth");
          setIsAuthenticated(false);
          navigate("/");
        };

        // Filtered QR cards
        const filteredTableQrs = useMemo(() => {
          const q = searchQuery.toLowerCase().trim();
          return tableQrs.filter((t) => {
            if (selectedZoneFilter !== "All" && t.zone !== selectedZoneFilter) return false;
            if (q) {
              const matchesId = t.id.toLowerCase().includes(q);
              const matchesName = t.name.toLowerCase().includes(q);
              const matchesZone = t.zone.toLowerCase().includes(q);
              return matchesId || matchesName || matchesZone;
            }
            return true;
          });
        }, [tableQrs, searchQuery, selectedZoneFilter]);

        const totalSeats = useMemo(() => {
          return tables.reduce((acc, t) => acc + (t.seats || 0), 0);
        }, [tables]);

        if (!isAuthenticated) {
          return (
            <div className="max-w-md mx-auto px-4 py-16">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cafe-200/90 shadow-soft text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-cafe-950 text-amber-300 flex items-center justify-center mx-auto shadow-xs">
                      <ShieldCheck className="w-7 h-7 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-cafe-950">Owner Portal Protected</h2>
                      <p className="text-xs text-cafe-600 mt-1">
                        Please authenticate to access the table QR routing studio.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="w-full py-3 bg-cafe-950 hover:bg-cafe-900 text-white rounded-xl text-xs font-bold transition-transform active:scale-95 cursor-pointer shadow-xs"
                    >
                      Enter Owner Credentials
                    </button>
                  </div>
                  <OwnerLoginModal
                    isOpen={isLoginModalOpen}
                    onClose={() => {
                      setIsLoginModalOpen(false);
                      if (sessionStorage.getItem("owner_auth") === "true") {
                        setIsAuthenticated(true);
                      }
                    }}
                  />
                </div>
                );
  }

                    return (
                    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                      {/* Top Controls Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
                        <button
                          onClick={() => navigate("/")}
                          className="flex items-center gap-1.5 text-xs font-bold text-cafe-700 hover:text-cafe-950 bg-white px-3 py-2 rounded-xl border border-cafe-300 shadow-2xs transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to Home</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handlePrintAll}
                            className="flex items-center gap-1.5 px-4 py-2 bg-cafe-900 hover:bg-cafe-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                          >
                            <Printer className="w-4 h-4 text-amber-300" />
                            <span>Print All Table Tent Cards</span>
                          </button>

                          <button
                            onClick={handleLogout}
                            title="Log Out of Owner Studio"
                            className="p-2 rounded-xl bg-white hover:bg-red-50 text-cafe-600 hover:text-red-600 border border-cafe-300 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Main Studio Header & Live QR Route Info Card */}
                      <div className="bg-white rounded-3xl p-6 border border-cafe-200/90 shadow-soft no-print space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
                              <QrCode className="w-4 h-4" />
                              <span>Owner Studio · QR Routing & Table Studio</span>
                            </div>
                            <h1 className="text-2xl font-black text-cafe-950">Cafe Table QR Code Center</h1>
                            <p className="text-xs text-cafe-600 max-w-xl leading-relaxed">
                              Generate, customize, and print high-resolution QR codes for every dining table.
                              Scanning automatically directs customers to your live menu with the table pre-selected.
                            </p>
                          </div>

                          {/* Quick Stats Pill */}
                          <div className="flex items-center gap-3 bg-cafe-50 px-4 py-3 rounded-2xl border border-cafe-200">
                            <div className="text-center pr-3 border-r border-cafe-200">
                              <span className="block text-xl font-black text-cafe-950">{tables.length}</span>
                              <span className="text-[10px] text-cafe-500 font-semibold uppercase">Tables</span>
                            </div>
                            <div className="text-center">
                              <span className="block text-xl font-black text-amber-800">{totalSeats}</span>
                              <span className="text-[10px] text-cafe-500 font-semibold uppercase">Dining Seats</span>
                            </div>
                          </div>
                        </div>

                        {/* Live Public URL / Routing Preview Card */}
                        <div className="p-4 rounded-2xl bg-cafe-50 border border-cafe-200/90 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-cafe-200 flex items-center justify-center text-cafe-800">
                              <Globe className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-cafe-950">Public Origin for QR Codes</p>
                              <code className="text-[11px] text-cafe-700 bg-white px-2 py-0.5 rounded border border-cafe-200 font-mono">
                                {siteOrigin}/menu?table=&#123;TABLE_ID&#125;
                              </code>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleCopyOrigin}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-cafe-100 text-cafe-800 text-xs font-bold border border-cafe-300 flex items-center gap-1.5 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>{copiedUrlFeedback ? "Copied Origin!" : "Copy Origin"}</span>
                            </button>
                            <button
                              onClick={() => navigate(`/menu?table=${tables[0]?.id || "T01"}`)}
                              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Simulate Customer Scan</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Table Generator Card (Clean modern form without alerts) */}
                      <div className="bg-white rounded-3xl p-6 border border-cafe-200/90 shadow-soft no-print space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                              <Plus className="w-4 h-4 text-amber-800" />
                            </div>
                            <div>
                              <h2 className="text-sm font-extrabold text-cafe-950">Create New Table & Dynamic QR</h2>
                              <p className="text-[11px] text-cafe-600">Instantly creates a new table QR and adds it to customer choices</p>
                            </div>
                          </div>

                          {feedbackMsg && (
                            <div
                              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${feedbackMsg.type === "success"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                                  : "bg-red-50 text-red-800 border border-red-300"
                                }`}
                            >
                              <span>{feedbackMsg.text}</span>
                            </div>
                          )}
                        </div>

                          <form onSubmit={handleCreateNewTable} className="space-y-4 pt-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                              {/* Table ID */}
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-xs font-semibold text-cafe-800 uppercase tracking-wider">
                                    Table ID <span className="text-red-500">*</span>
                                  </label>
                                  {isDuplicate && (
                                    <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                                      ID Exists
                                    </span>
                                  )}
                                </div>
                                <input
                                  type="text"
                                  value={newTableId}
                                  onChange={(e) => setNewTableId(e.target.value.toUpperCase())}
                                  placeholder="e.g. T13, VIP-1"
                                  className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-bold uppercase ${isDuplicate
                                      ? "border-red-400 bg-red-50/50 text-red-900"
                                      : "border-cafe-300 bg-cafe-50/50 text-cafe-950 focus:ring-2 focus:ring-amber-600"
                                    }`}
                                  required
                                />
                              </div>

                              {/* Table Name (Optional) */}
                              <div>
                                <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1">
                                  Display Name <span className="text-cafe-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                  type="text"
                                  value={newTableName}
                                  onChange={(e) => setNewTableName(e.target.value)}
                                  placeholder="e.g. Table 13 (Window)"
                                  className="w-full px-3.5 py-2.5 border border-cafe-300 rounded-xl text-xs text-cafe-950 bg-cafe-50/50"
                                />
                              </div>

                        {/* Zone Selector */}
                        <div>
                          <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1">
                            Dining Zone
                          </label>
                          <select
                            value={newTableZone}
                            onChange={(e) => setNewTableZone(e.target.value)}
                            className="w-full px-3 py-2.5 border border-cafe-300 rounded-xl text-xs text-cafe-950 font-semibold bg-cafe-50/50"
                          >
                            {PRESET_ZONES.map((z) => (
                              <option key={z} value={z}>
                                {z}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Seats Stepper & Submit */}
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1">
                              Seats
                            </label>
                            <div className="flex items-center justify-between border border-cafe-300 rounded-xl px-2 py-1.5 bg-cafe-50/50">
                              <button
                                type="button"
                                onClick={() => setNewTableSeats((s) => Math.max(1, s - 1))}
                                className="p-1 rounded text-cafe-700 hover:bg-cafe-200 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold text-cafe-950">{newTableSeats}</span>
                              <button
                                type="button"
                                onClick={() => setNewTableSeats((s) => Math.min(20, s + 1))}
                                className="p-1 rounded text-cafe-700 hover:bg-cafe-200 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isDuplicate || !newTableId.trim()}
                            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Generate QR</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                    {/* Table Filter & Search Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 no-print">
                      {/* Search */}
                      <div className="relative w-72">
                        <Search className="w-3.5 h-3.5 text-cafe-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search table ID or zone..."
                          className="w-full pl-9 pr-3.5 py-2 bg-white border border-cafe-300 rounded-xl text-xs text-cafe-900 shadow-2xs"
                        />
                      </div>

                      {/* Zone Filter Chips */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                        <button
                          onClick={() => setSelectedZoneFilter("All")}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${selectedZoneFilter === "All"
                              ? "bg-cafe-950 text-amber-300"
                              : "bg-white text-cafe-700 hover:bg-cafe-100 border border-cafe-200"
                            }`}
                        >
                          All Zones ({tableQrs.length})
                        </button>
                      {PRESET_ZONES.map((zone) => {
                        const count = tableQrs.filter((t) => t.zone === zone).length;
                        if (count === 0) return null;
                        return (
                          <button
                            key={zone}
                            onClick={() => setSelectedZoneFilter(zone)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${selectedZoneFilter === zone
                                ? "bg-cafe-950 text-amber-300"
                                : "bg-white text-cafe-700 hover:bg-cafe-100 border border-cafe-200"
                              }`}
                          >
                            {zone} ({count})
                          </button>
                        );
                      })}
                    </div>
                </div>

                {/* Printable Table Cards Grid */}
                {loading ? (
                  <div className="text-center py-16 text-cafe-600 text-sm">
                    Generating high-resolution table QR codes...
                  </div>
                ) : filteredTableQrs.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center text-cafe-600 border border-cafe-200">
                    No tables match your search query.
                  </div>
                ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTableQrs.map((table) => (
                          <div
                            key={table.id}
                            className="bg-white rounded-3xl p-6 border-2 border-cafe-300 shadow-soft text-center flex flex-col justify-between relative group hover:border-amber-600 transition-colors"
                          >
                            {/* Brand Top */}
                            <div>
                                <div className="flex items-center justify-center gap-1.5 text-cafe-950 font-bold text-xs">
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
                                  onClick={() => navigate(`/menu?table=${table.id}`)}
                                  title="Simulate customer scanning QR"
                                  className="p-2 rounded-xl bg-cafe-100 hover:bg-cafe-200 text-cafe-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Test</span>
                                </button>

                                {/* Copy Link */}
                                <button
                                  onClick={() => handleCopyLink(table)}
                                  title="Copy QR URL"
                                  className="p-2 rounded-xl bg-cafe-100 hover:bg-cafe-200 text-cafe-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
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
                                  className="p-2 rounded-xl bg-cafe-900 hover:bg-cafe-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>PNG</span>
                                </button>

                                {/* Remove Table (if not default table T01-T12) */}
                                {table.id > "T12" && (
                                  <button
                                    onClick={() => handleDeleteTable(table.id)}
                                    title="Remove Custom Table"
                                    className="p-2 rounded-xl text-cafe-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
          ))}
                          </div>
                        )}
                      </div>
                    );
}
