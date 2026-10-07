import type { Metadata, Viewport } from "next";
import "./globals.css";
import OfflineRegister from "@/components/OfflineRegister";

export const metadata: Metadata = {
  title: "FindMe",
  description: "One link that shows exactly where you are.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = { themeColor: "#0f766e", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto min-h-screen max-w-md px-4 py-5 font-sans antialiased">
        {children}
        <OfflineRegister />
      </body>
    </html>
  );
}
