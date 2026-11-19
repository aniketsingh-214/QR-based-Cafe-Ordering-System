import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomCartBar from "@/components/layout/BottomCartBar";

export const metadata: Metadata = {
  title: "The Roast & Toast Cafe — Table QR Ordering",
  description: "Seamless QR-based contactless cafe table ordering with instant WhatsApp order transmission and digital receipt.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cafe-50 text-cafe-900 font-sans selection:bg-amber-200 selection:text-cafe-900">
        <Header />
        <main className="flex-1 pb-24">{children}</main>
        <BottomCartBar />
      </body>
    </html>
  );
}
