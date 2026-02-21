# HQ-Dashboard (Next.js App Router)

Production-Ready UI, live verbunden mit dem Clawbot Python Core.

Quick Start

- Install: `cd hq-dashboard && npm i`
- Dev: `npm run dev`
- Build: `npm run build`
- Start (prod): `npm start`

Env

- NEXT_PUBLIC_CLAWBOT_API_BASE (optional; default: http://localhost:8000)
- INGEST_SECRET (für HMAC-Signaturen)
- GH_TOKEN (optional, nur Server): GitHub Token für Snapshots & Ingest-Commits
- GH_REPO (optional, nur Server): z. B. promobot-hub/HQ-Dashboard

Architektur

- App Router unter `app/`
  - `app/layout.tsx` – Root-Layout (Dark Theme, Navbar/Sidebar)
  - `app/page.tsx` – Landing (Hero + Heartbeat + Kanban + Improve + Activity)
  - `app/components/` – UI-Komponenten (KanbanBoard, TaskCard, HeartbeatWidget, SelfImproveWidget, ActivityFeed)
  - `app/api/*` – Proxy-API-Routen zu ${CLAWBOT_API_BASE}
  - `app/api/ingest/*` – HMAC-signierte Ingest-Endpoints (Core → UI) mit optionalen GitHub-Commits

API-Proxies (Server)

- GET /api/tasks → ${CLAWBOT_API_BASE}/api/tasks
- POST /api/tasks (body: { id, status }) → PATCH /api/tasks/{id} (fallback POST /api/tasks)
- GET /api/heartbeat → ${CLAWBOT_API_BASE}/api/heartbeat
- GET /api/logs?limit=20 → ${CLAWBOT_API_BASE}/api/logs?limit=20
- POST /api/improve → ${CLAWBOT_API_BASE}/api/improve

Ingest Webhooks (Server)

- Alle erwarten Header: X-Timestamp (ms), X-Signature (sha256=<hex>) mit HMAC(INGEST_SECRET, `${timestamp}:${rawBody}`)
- POST /api/ingest/tasks body: { tasks: [...] } → schreibt data/tasks.json + snapshot
- POST /api/ingest/heartbeat body: { ... } → schreibt data/heartbeat.json + snapshot
- POST /api/ingest/logs body: NDJSON-String → hängt an data/logs.ndjson

Python-Client (Beispiel)

```python
import time, hmac, hashlib, requests
INGEST_SECRET = "<same-as-env>"
BASE = "https://<your-render-app>"

def sign(raw: bytes, ts: str):
    mac = hmac.new(INGEST_SECRET.encode(), f"{ts}:".encode()+raw, hashlib.sha256).hexdigest()
    return f"sha256={mac}"

# Tasks
raw = b'{"tasks":[{"id":"t1","title":"Demo","status":"pending"}]}'
ts = str(int(time.time()*1000))
headers = {"X-Timestamp": ts, "X-Signature": sign(raw, ts), "Content-Type":"application/json"}
requests.post(f"{BASE}/api/ingest/tasks", data=raw, headers=headers)
```

Live-UI

- HeartbeatWidget: Poll 4s (Fallback /api/status)
- KanbanBoard: Poll 4s; HTML5 Drag & Drop; Optimistic Updates
- SelfImproveWidget: Trigger + „Clawbot is thinking…“ Loading-State
- ActivityFeed: Poll 4s; Auto-Scroll-Bereich

Deploy-Hinweise

- Setze `NEXT_PUBLIC_CLAWBOT_API_BASE` (Core-URL) und `INGEST_SECRET`
- Optional: `GH_TOKEN` + `GH_REPO` für Repo-Snapshots/Commits
- Node 22 empfohlen; Tailwind v4 ist konfiguriert

```

```
