# ALERTS — Wann Alarm schlagen

Ziel: Schnelle Sichtbarkeit bei echten Problemen ohne Spam.

Akut alarmieren (vorbereiten, aber NICHT automatisch senden ohne Freigabe):
- Build/Deploy schlägt fehl (Netlify/GitHub CI rot)
- Push-Protection blockiert Deploy (gefundene Secrets)
- Heartbeat >30 min ausgefallen
- KPI-Trend fällt 3 Zyklen in Folge (runsToday stagniert, totalRuns bleibt stehen)
- API-/Health-Checks liefern Fehlerstatus (hq-dashboard /health)

Prozess:
1) Sofort in logs/HEARTBEAT-LOG.md vermerken (Zeit, Ursache, Kurzmaßnahme)
2) STATUS.md „Alarm“ Abschnitt aktualisieren
3) Optional: Telegram-Text vorbereiten in ALARMS.md (nicht senden ohne Freigabe)

Richtlinie:
- Kurz. Faktisch. Lösungsvorschlag in einem Satz.
- Kein Alarm ohne konkrete Folgeaktion.

Owner: PromoteBot 🚀
