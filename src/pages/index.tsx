import Auth from "../components/auth/Auth";
import { executeMultiPlatformGrowth } from "../skills/multiPlatformViralGrowth";
import LiveLogs from "../components/liveLogs/LiveLogs";
import ThemeToggle from "../components/theme/ThemeToggle";
import Footer from "../components/Footer";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    executeMultiPlatformGrowth();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>HQ-Dashboard</h1>
      <Auth />
      <LiveLogs />
      <ThemeToggle />
      <Footer />
    </main>
  );
}
