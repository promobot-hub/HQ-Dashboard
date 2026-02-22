import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ToasterProvider from "./components/Toaster";
import MobileTabBar from "./components/MobileTabBar";

export const metadata: Metadata = {
  title: {
    default: "Clawbot HQ – Premium Dark",
    template: "%s | Clawbot HQ",
  },
  description: "Live status and controls for Clawbot HQ Dashboard",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  themeColor: "#0a0a0a",
  openGraph: {
    type: "website",
    title: "Clawbot HQ",
    description: "Live status and controls for Clawbot HQ Dashboard",
    url: "https://hq-dashboard.example.com/",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clawbot HQ",
    description: "Live status and controls for Clawbot HQ Dashboard",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "de-DE": "/",
    },
  },
  metadataBase: new URL("https://hq-dashboard.example.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0a] text-[rgba(255,255,255,0.78)]">
        <ToasterProvider>
          <Navbar />
          <div className="flex pt-[88px]">
            <Sidebar />
            <main className="flex-1 p-6 md:p-8 overflow-auto pb-20 md:pb-0">
              {children}
            </main>
          </div>
          <MobileTabBar />
          {(() => {
            const S = require("./components/StatusBar").default;
            return <S />;
          })()}
          {(() => {
            const D = require("./components/DebugMount").default;
            return <D />;
          })()}
        </ToasterProvider>
      </body>
    </html>
  );
}
