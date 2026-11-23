import QRCode from "qrcode";

/**
 * Canonical public origin printed into every QR code.
 * Prefer NEXT_PUBLIC_SITE_URL (set in production) so QR codes generated while the owner is on a
 * preview/localhost URL never encode the wrong host.
 */
export function getSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (configured) return configured;
  return typeof window !== "undefined" ? window.location.origin : "https://cafe.com";
}

/** True when QR codes would point at a host customers' phones cannot reach. */
export function isUnreachableOrigin(origin: string): boolean {
  return /^https?:\/\/(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(origin);
}

export function getTableMenuUrl(tableId: string, baseUrl?: string): string {
  const origin = baseUrl || getSiteOrigin();
  return `${origin}/menu?table=${encodeURIComponent(tableId.toUpperCase())}`;
}

export async function generateTableQrDataUrl(
  tableId: string,
  baseUrl?: string,
  options?: QRCode.QRCodeToDataURLOptions
): Promise<string> {
  const url = getTableMenuUrl(tableId, baseUrl);
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 320,
    color: {
      dark: "#22170F", // Cafe dark brown
      light: "#FFFFFF",
    },
    ...options,
  });
}
