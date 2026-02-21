import './globals.css';
import ThemeProviderClient from '../components/ThemeProviderClient';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'HQ Dashboard',
  description: 'Dashboard for PromoteBot Skills and Tasks',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProviderClient>
          <Navbar />
          {children}
        </ThemeProviderClient>
      </body>
    </html>
  );
}
