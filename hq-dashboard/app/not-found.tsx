export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="rounded-3xl border border-[rgba(255,255,255,0.08)] bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-8 text-center">
        <div className="text-3xl font-extrabold text-white">404</div>
        <div className="mt-2 text-white/70">Page not found</div>
        <div className="mt-4 text-xs text-white/50">
          Navigate via the top navbar to continue.
        </div>
      </div>
    </div>
  );
}
