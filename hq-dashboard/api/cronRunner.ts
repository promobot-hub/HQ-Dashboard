// ESM-friendly Cron Runner with 5-minute cadence
// Uses a global singleton to avoid duplicate timers across hot-reloads

const g: any = globalThis as any;
if (!g.__HQ_CRON__) {
  g.__HQ_CRON__ = {
    timer: null as NodeJS.Timer | null,
    running: false as boolean,
    cadenceMs: 5 * 60 * 1000,
    lastRunAt: null as string | null,
    nextRunAt: null as string | null,
  };
}

async function runCycle() {
  const state = g.__HQ_CRON__;
  state.lastRunAt = new Date().toISOString();
  try {
    const base = process.env.CRON_SELF_URL || "http://localhost:3000";
    // Trigger the evolution engine prompt via existing improve endpoint (server proxy → Core)
    await fetch(`${base}/api/improve`, { method: "POST" }).catch(() => null);
    // Optional: snapshot for audit
    await fetch(`${base}/api/snapshot`, { method: "POST" }).catch(() => null);
  } catch (e) {
    // swallow errors; next cycle will try again
  } finally {
    const next = new Date(Date.now() + state.cadenceMs);
    state.nextRunAt = next.toISOString();
  }
}

export function getCronStatus() {
  const s = g.__HQ_CRON__;
  return {
    running: !!s.running,
    cadenceMs: s.cadenceMs,
    lastRunAt: s.lastRunAt,
    nextRunAt: s.nextRunAt,
  };
}

export function startCronRunner() {
  const state = g.__HQ_CRON__;
  if (state.running) return state;
  state.running = true;
  // Immediate run, then interval
  runCycle();
  state.timer = setInterval(runCycle, state.cadenceMs);
  const next = new Date(Date.now() + state.cadenceMs);
  state.nextRunAt = next.toISOString();
  return state;
}

export function stopCronRunner() {
  const state = g.__HQ_CRON__;
  if (state.timer) clearInterval(state.timer);
  state.timer = null;
  state.running = false;
  return state;
}
