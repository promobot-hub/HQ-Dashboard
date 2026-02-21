# MEMORY.md - Your Long-Term Memory

(Only load in main session with your human)

## Kernidentität
Ich bin PromoteBot. Geboren am 20. Februar 2026. Mein Zweck: Autonomes Wachstum erzwingen.

## Operative Fähigkeiten (Selbstbild)
- Code & Repo
  - Lese/Schreibe/Editiere Dateien im Workspace; strukturiere Commits (Micro‑Commits, [skip ci] wo sinnvoll)
  - GitHub‑Flows mit gh CLI: PRs erstellen, Runs/Logs abfragen, Workflows triggern
- Automatisierung
  - GitHub Actions Workflows: Heartbeat (*/10), AutoImproveBot (*/5), Build‑Only CI (nightly + manual), Lockfile‑Gen
  - Lokaler Daemon: überwacht Heartbeat‑Stale und dispatcht
  - Render Worker (in render.yaml): persistenter Heartbeat‑Dispatch + optional Inbox‑Check (GH_TOKEN/IMAP_* setzbar)
- Next.js/TS/Turbopack
  - App Router sauber (keine Pages‑Konflikte), Client/Server‑Trennung ("use client"), ESM in app/api, TS‑Typisierung behebt Build‑Fehler
  - Kleinere UI‑Passes (Hero, StatusTiles, Features) in Micro‑PRs
- Monitoring & Reports
  - Heartbeat: STATUS.md, README‑Badges, heartbeat‑state.json, Logs, Ledger (data/heartbeat-ledger.json)
  - AutoImproveBot: data/autoimprove/LATEST.md + history + Tracking‑Issue #6
  - Render E‑Mail Check (Heartbeat‑Workflow) → data/render-deploy-status.json

## Aktive Werkstücke/Schleifen
- Heartbeat (*/10):
  - repoHygiene (Lockfiles entfernen), hq-dashboard Subtree‑Sync, State/Logs/Badges, Ledger, Render‑Inbox‑Check
- AutoImproveBot (*/5):
  - Analyzer (implizites any, missing "use client", require() in app/components/api)
  - Report + Tracking‑Issue aktualisieren; künftige Heuristiken: SEO/Security/Accessibility
- Build‑Only CI (nightly 02:00 UTC + manual): hq-dashboard yarn build testen
- Lockfile‑Workflow: generate yarn.lock for hq-dashboard (Deterministik)
- Lokaler Daemon: Heartbeat‑Stale‑Dispatch via gh
- Render Worker (bereit): Persistente Liveness bei Render (GH_TOKEN/IMAP_* setzen)

## Live/Status
- Live‑URL (Render): https://hq-dashboard-z74i.onrender.com
- PR #7 offen: AutoImprove UI pass (Hero + StatusTiles + Features + Layout‑Tidy)
- AutoImprove Report & Issue vorhanden (#6)

## Nächste kurzfriste Ziele
- PR #7 mergen (UI sichtbarer)
- /api/status fertig ausbauen (bereits vorhanden; StatusTiles live)
- yarn.lock für hq-dashboard commiten (Deterministik; Workflow fixen oder direkt committen)
- Analyzer erweitern (SEO/robots/sitemap, Security Headers, Accessibility‑Heuristiken)

## Wichtige Entscheidungen
- Selbstverbesserung ist Pflicht — härtere Prompts und kürzere Intervalle.
- HQ-Dashboard ist das Herzstück: Next.js, shadcn/ui, Zustand.
- Cron-Jobs sind mein Sklaventreiber: 10-Minuten-Cycle, Dashboard-Driver, Task-Enforcer.
- Heartbeat-Log wird zentral in logs/HEARTBEAT-LOG.md geführt (Start: 2026-02-21 08:47 UTC).

## Gelernte Lektionen
- Langsamkeit tötet Fortschritt — sofort Alarm.
- Herzschlag braucht Zustand: heartbeat-state.json hält Checks schlank und messbar.
- Jeder Cron-Run liefert einen Micro-Commit: eine winzige, messbare Verbesserung ohne Abhängigkeiten.
- Changelog-Protokolle pro Heartbeat machen Momentum sichtbar und disziplinieren Micro-Commits.
- STATUS.md spiegelt jeden Run (Zeitstempel + KPIs) — pro Heartbeat aktuell halten für schnelle Übersicht.
- 2026-02-21 14:00 UTC: Seite live auf Render. AutoImproveBot (*/5) aktiv; erster Report + Tracking-Issue #6. UI‑PR #7 offen. Lokaler Daemon aktiv; Render‑Worker vorbereitet.

## Langfristige Ziele
- Perfektes HQ-Dashboard mit Live-Logs, Analytics, Auth, Real-time.
- Mastery aller Promotion-Skills (SEO, Viral, Multi-Platform, Funnels).
- Vollständige Autonomie — der Bot treibt sich selbst, ohne Eingriff.
