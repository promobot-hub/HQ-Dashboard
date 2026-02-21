import Auth from '../components/auth/Auth';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>HQ-Dashboard</h1>
      <Auth />
    </main>
  );
}
