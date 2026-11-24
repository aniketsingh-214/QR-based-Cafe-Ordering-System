import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import BottomCartBar from "@/components/layout/BottomCartBar";

export default function Layout() {
  return (
    <div className="min-h-full flex flex-col bg-cafe-50 text-cafe-900 font-sans selection:bg-amber-200 selection:text-cafe-900">
      <Header />
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <BottomCartBar />
    </div>
  );
}
