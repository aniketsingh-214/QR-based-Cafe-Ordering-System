import type { Metadata } from "next";

// Owner-only area: never indexed, never cached. Access is enforced by src/middleware.ts.
export const metadata: Metadata = {
  title: "Owner Panel",
  robots: { index: false, follow: false, nocache: true },
};

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
