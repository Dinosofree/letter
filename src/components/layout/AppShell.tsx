"use client";

import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { Toaster } from "react-hot-toast";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-3.5rem)] pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#4A4238",
            color: "#FAF7F2",
            fontSize: "14px",
            borderRadius: "8px",
          },
        }}
      />
    </>
  );
}
