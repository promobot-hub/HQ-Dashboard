// Data source wrapper. Selects adapter by DATA_SOURCE env (supabase|github). Default: github
// Optional supabase dependency: only required when DATA_SOURCE=supabase
let createClient: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({ createClient } = require("@supabase/supabase-js"));
} catch (_) {
  // not installed; ok when using github adapter
}

export type DBAdapter = {
  tasks: {
    upsertMany: (rows: any[]) => Promise<{ inserted: number; updated: number }>;
    list: () => Promise<any[]>;
  };
  logs: {
    appendMany: (rows: any[]) => Promise<{ inserted: number }>;
  };
  metrics: {
    appendMany: (rows: any[]) => Promise<{ inserted: number }>;
  };
  scheduler: {
    listJobs: () => Promise<any[]>;
    saveJobs: (jobs: any[]) => Promise<{ ok: boolean }>;
    appendHistory: (rows: any[]) => Promise<{ inserted: number }>;
    listHistory: (limit?: number) => Promise<any[]>;
  };
  sessions: {
    snapshot: (snap: any) => Promise<{ ok: boolean }>;
  };
  heartbeat: {
    write: (row: any) => Promise<{ ok: boolean }>;
  };
};

export function getDbAdapter(): DBAdapter {
  const src = process.env.DATA_SOURCE || "github";
  if (src === "supabase") return supabaseAdapter();
  return githubAdapter();
}

function supabaseAdapter(): DBAdapter {
  if (!createClient) {
    throw new Error(
      "@supabase/supabase-js is not installed. Set DATA_SOURCE=github or add the dependency."
    );
  }
  const url = process.env.SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE || "";
  const sb = createClient(url, serviceKey, { auth: { persistSession: false } });
  // Prep-only stubs. Wire actual selects/inserts during Phase 3.
  return {
    tasks: {
      async upsertMany(rows) {
        return { inserted: 0, updated: 0 };
      },
      async list() {
        return [];
      },
    },
    logs: {
      async appendMany(rows) {
        return { inserted: 0 };
      },
    },
    metrics: {
      async appendMany(rows) {
        return { inserted: 0 };
      },
    },
    scheduler: {
      async listJobs() {
        return [];
      },
      async saveJobs(jobs) {
        return { ok: false };
      },
      async appendHistory(rows) {
        return { inserted: 0 };
      },
      async listHistory(limit = 100) {
        return [];
      },
    },
    sessions: {
      async snapshot(snap) {
        return { ok: false };
      },
    },
    heartbeat: {
      async write(row) {
        return { ok: false };
      },
    },
  };
}

function githubAdapter(): DBAdapter {
  // Use existing gh utils on server routes. Here just define placeholders used by UI/server.
  return {
    tasks: {
      async upsertMany(_rows) {
        return { inserted: 0, updated: 0 };
      },
      async list() {
        return [];
      },
    },
    logs: {
      async appendMany(_rows) {
        return { inserted: 0 };
      },
    },
    metrics: {
      async appendMany(_rows) {
        return { inserted: 0 };
      },
    },
    scheduler: {
      async listJobs() {
        return [];
      },
      async saveJobs(_jobs) {
        return { ok: true };
      },
      async appendHistory(_rows) {
        return { inserted: 0 };
      },
      async listHistory(_limit = 100) {
        return [];
      },
    },
    sessions: {
      async snapshot(_snap) {
        return { ok: true };
      },
    },
    heartbeat: {
      async write(_row) {
        return { ok: true };
      },
    },
  };
}
