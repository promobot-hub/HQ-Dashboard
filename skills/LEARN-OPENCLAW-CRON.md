# Lern-Stub: OpenClaw Cron Best Practices

Ziel: Kurzer Leitfaden für stabile, nutzbringende Cron-Runs.

Best Practices
- Atomare Micro-Commits: pro Run genau eine kleine, messbare Änderung.
- Interne Aktionen bevorzugen: Dateien, Logs, STATE; keine externen Posts ohne Freigabe.
- Idempotenz: Reads vor Writes; Append durch Read+Write, keine Blind-Overwrites.
- KPIs loggen: HEARTBEAT-LOG.md, STATUS.md, heartbeat-state.json synchron halten.
- Zeitfenster respektieren: Keine lauten Alerts außerhalb 23:00–08:00 (lokal), außer explizit.
- Fehlerfreundlich: Nie destruktiv (kein rm). Immer recoverable Änderungen.

Checkliste pro Run
- [ ] Micro-Commit definiert?
- [ ] Logs/State aktualisiert?
- [ ] Nächste Aktion vorbereitet?

Nächste Vertiefung
- Automatisches Parsen von KPIs aus STATE -> STATUS.
- Template-Funktionen für Log-Append und KPI-Update.