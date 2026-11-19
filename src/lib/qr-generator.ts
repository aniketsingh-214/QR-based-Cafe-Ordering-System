import QRCode from "qrcode";

export function getTableMenuUrl(tableId: string, baseUrl?: string): string {
  const origin =
    baseUrl ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://cafe.com");
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
