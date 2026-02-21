import "./globals.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "Clawbot HQ – Premium Dark",
  description: "Live status and controls for Clawbot HQ Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0a] text-[rgba(255,255,255,0.75)]">
        <Navbar />
        <div className="flex pt-[88px]">
          <Sidebar />
          <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
