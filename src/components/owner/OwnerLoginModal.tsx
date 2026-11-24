import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, X, Eye, EyeOff, ArrowRight } from "lucide-react";

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OwnerLoginModal({ isOpen, onClose }: OwnerLoginModalProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const expectedUser = import.meta.env.VITE_OWNER_PANEL_USER || "owner";
    const expectedPass = import.meta.env.VITE_OWNER_PANEL_PASSWORD || "owner123";

    if (username.trim() === expectedUser && password === expectedPass) {
      sessionStorage.setItem("owner_auth", "true");
      setError(null);
      onClose();
      navigate("/owner/qr-codes");
    } else {
      setError("Incorrect username or password. Default credentials: owner / owner123");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-elevated border border-cafe-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between pb-3 border-b border-cafe-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cafe-950 text-amber-300 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-cafe-950">Owner Access Verification</h2>
              <p className="text-xs text-cafe-600">Table QR Code Management Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-cafe-400 hover:text-cafe-700 hover:bg-cafe-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3.5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1">
              Owner Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. owner"
              className="w-full px-3.5 py-2.5 border border-cafe-300 rounded-xl text-cafe-950 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-600 bg-cafe-50/50"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-cafe-800 uppercase tracking-wider mb-1">
              Owner Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter owner password"
                className="w-full pl-3.5 pr-10 py-2.5 border border-cafe-300 rounded-xl text-cafe-950 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-600 bg-cafe-50/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-cafe-400 hover:text-cafe-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-cafe-500 mt-1">
              Credentials configured in environment variables (or owner / owner123).
            </p>
          </div>

          <div className="pt-2 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-cafe-300 text-cafe-700 text-xs font-bold hover:bg-cafe-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-cafe-950 hover:bg-cafe-900 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-[0.99] cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>Unlock Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
