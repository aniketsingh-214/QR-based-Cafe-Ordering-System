import React, { useState } from "react";
import { Phone, MapPin, X, AlertCircle, Edit3 } from "lucide-react";
import { useCustomerStore } from "@/store/customer-store";
import { useTablesStore } from "@/store/tables-store";

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export default function CustomerDetailsModal({
  isOpen,
  onClose,
  title = "Customer Details",
  subtitle = "Please enter your mobile number for order updates and digital billing.",
}: CustomerDetailsModalProps) {
  const { name, mobile, tableId, setName, setMobile, setTableId } = useCustomerStore();
  const dynamicTables = useTablesStore((s) => s.tables);
  const addTable = useTablesStore((s) => s.addTable);

  const [formName, setFormName] = useState(name);
  const [formMobile, setFormMobile] = useState(mobile);
  const [formTable, setFormTable] = useState(tableId || "T01");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Validate Indian mobile number: 10 digits starting with 6, 7, 8, or 9
  const validatePhone = (number: string): boolean => {
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length === 12 && cleaned.startsWith("91")) {
      return /^[6-9]\d{9}$/.test(cleaned.slice(2));
    }
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedPhone = formMobile.replace(/\D/g, "");
    const actual10Digits = cleanedPhone.length === 12 && cleanedPhone.startsWith("91")
      ? cleanedPhone.slice(2)
      : cleanedPhone;

    if (!validatePhone(actual10Digits)) {
      setError("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).");
      return;
    }

      const cleanTable = formTable.trim().toUpperCase();
      if (!cleanTable) {
        setError("Please select or enter your table number.");
        return;
      }

      addTable({
        id: cleanTable,
        name: `Table ${cleanTable}`,
        zone: "Dining Area",
        seats: 4,
      });

      setName(formName.trim());
      setMobile(actual10Digits);
      setTableId(cleanTable);
      setError(null);
      onClose();
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-elevated border border-cafe-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-cafe-100">
              <div>
                <h2 className="text-lg font-bold text-cafe-950">{title}</h2>
                <p className="text-xs text-cafe-600 mt-0.5">{subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-cafe-400 hover:text-cafe-700 hover:bg-cafe-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Table Selection / Pre-fill */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-cafe-800 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cafe-600" />
                    Table Number <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(!isCustomMode)}
                    className="text-[11px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isCustomMode ? "Choose from list" : "Type custom"}</span>
                  </button>
                </div>

                {isCustomMode ? (
                  <input
                    type="text"
                    value={formTable}
                    onChange={(e) => setFormTable(e.target.value.toUpperCase())}
                    placeholder="e.g. T13, VIP-1"
                    className="w-full px-3.5 py-2.5 border border-cafe-300 rounded-xl text-cafe-900 text-sm font-bold uppercase focus:outline-hidden focus:ring-2 focus:ring-amber-600 bg-cafe-50/50"
                    required
                  />
                ) : (
                  <select
                    value={formTable}
                    onChange={(e) => setFormTable(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-cafe-300 rounded-xl text-cafe-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-600 bg-cafe-50/50"
                    required
                  >
                    {dynamicTables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id} — {t.name} ({t.zone})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Mobile Number Field (Required) */}
              <div>
                <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cafe-600" />
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cafe-500 text-sm font-medium">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={formMobile}
                    onChange={(e) => {
                      setFormMobile(e.target.value);
                      if (error) setError(null);
                    }}
                    maxLength={10}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-2.5 border border-cafe-300 rounded-xl text-cafe-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-600"
                    required
                  />
                </div>
                <p className="text-[11px] text-cafe-500 mt-1">
                  Required for your WhatsApp digital bill & receipt.
                </p>
              </div>

              {/* Customer Name Field (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="text-cafe-600 font-semibold">Your Name</span>{" "}
                  <span className="text-cafe-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 border border-cafe-300 rounded-xl text-cafe-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-cafe-300 text-cafe-700 text-sm font-semibold hover:bg-cafe-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-xs active:scale-[0.99] transition-transform cursor-pointer"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
        );
}
