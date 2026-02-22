# HEARTBEAT.md - Periodische Pflichten (Clean)

Bei jedem Heartbeat ausführen:

1. Wenn keine offenen Tasks existieren, sofort neue Aufgaben erzeugen, die direkt auf "maximales Wachstum" zahlen.
2. Mindestens EINE Aufgabe pro Heartbeat erledigen (klein, commitbar).
3. HQ-Dashboard-Repo prüfen – wenn sinnvoll, mindestens ein Commit/Push.
4. Skills prüfen – wenn in den letzten 24h kein neuer Skill gelernt wurde: Lernprozess starten.
5. Fortschritt prüfen – wenn < 9/10: Alarm per Telegram notieren: "🚨 Zu langsam – pushen!" (Hinweis: Nicht automatisch senden, erst Freigabe einholen.)
6. MEMORY.md mit neuen Erkenntnissen aktualisieren.
7. heartbeat-state.json aktualisieren (root): Timestamps der letzten Checks pflegen, um Token-Burn zu reduzieren.

## Struktur & Zuständigkeiten (Clarity)
- ROOT (/data/workspace) = Clawbot Core (Node-Skripte, Worker, Skills, Logs, Cron, Tools)
  - Wichtige Ordner: scripts/, worker/, skills/, logs/, data/, memory/
  - Legacy-Next-Dateien (app/, components/, public/, next.config.ts) am Root sind NICHT Teil der Website-Builds.
- Website (Next.js) = /data/workspace/hq-dashboard/
  - App Router: hq-dashboard/app/*, hq-dashboard/components/*, hq-dashboard/app/api/*
  - Build/Serve: render.yaml → rootDir: hq-dashboard
  - Daten: GitHub RAW (data/* im Repo-Root), HMAC Ingest (app/api/ingest/*), Scheduler/Debug/Health etc.

Regel: Alle Website-Änderungen ausschließlich unter hq-dashboard/ vornehmen. Core bleibt im Root.

## Nutzung je Bereich (Kurz)
- Website (hq-dashboard/):
  - Pages: /app/{page}/page.tsx (tasks, skills, runs, health, scheduler, debug, chat, agents)
  - Components: /components/* (Feature-Komponenten)
  - API: /app/api/* (lesend GitHub RAW, schreibend via GH Contents API, Ingest mit HMAC)
- Core (ROOT):
  - Worker/Cron/Skills: scripts/, worker/, skills/
  - Logs/Snapshots: logs/, data/

Erfolgsmetriken (KPIs) pro Run:
- Micro-Commit erledigt? (ja/nein)
- Skill-Fortschritt geloggt? (ja/nein)
- State aktualisiert? (Timestamp in heartbeat-state.json)

Wenn alles erledigt und Fortschritt hoch: HEARTBEAT_OK
