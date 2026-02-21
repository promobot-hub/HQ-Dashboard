import "./globals.css";
import ThemeProviderClient from "../components/ThemeProviderClient";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { DarkModeProvider } from "../context/DarkModeContext";

export const metadata = {
  title: "HQ Dashboard",
  description: "Dashboard for PromoteBot Skills and Tasks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <DarkModeProvider>
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-8 overflow-auto">{children}</main>
          </div>
        </DarkModeProvider>
      </body>
    </html>
  );
}
