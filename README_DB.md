# Data Layer Plan

Phases:
- Phase 1: GitHub-DB (RAW/Contents) primary. UI reads RAW; server writes via GH Contents API with ETag/Retry/Backoff. Files under data/*.json and *.ndjson.
- Phase 2: HMAC Ingest. Core posts signed payloads to /api/ingest/*; server persists to GitHub-DB. Feature flag: USE_HMAC_INGEST=true; env HMAC_SECRET.
- Phase 3: Supabase (Postgres). Drizzle schema + migrations. DB adapter selected by DATA_SOURCE=supabase|github. One-way sync job (GitHub → Supabase). Not live yet.

Env (server-only):
- GH_REPO=promobot-hub/HQ-Dashboard
- GH_TOKEN=...
- USE_HMAC_INGEST=true|false
- HMAC_SECRET=...
- DATA_SOURCE=github|supabase
- SUPABASE_URL=...
- SUPABASE_SERVICE_ROLE=...
- SUPABASE_ANON_KEY=... (optional for later client reads)

Adapters
- githubAdapter: writes via ghPut (ETag, If-Match, retries). JSONL append is idempotent by hash.
- supabaseAdapter: inserts/upserts via supabase-js with service role (server only). RLS prepared for later.

Sync Job (GitHub → Supabase)
- Route: /api/sync/github-to-supabase (server-only). Reads RAW data files and upserts into Supabase.
- Idempotency: derive stable ids (hash of line for logs/metrics), upsert by pk for tasks.

Health/Debug
- /health shows mode (GitHub Mode) + freshness per data group.
- /debug shows latest writes (file, ts, ok/error, retries, etag).
