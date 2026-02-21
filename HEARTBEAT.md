# HEARTBEAT.md - Periodische Pflichten (Clean)

Bei jedem Heartbeat ausführen:

1. Wenn keine offenen Tasks existieren, sofort neue Aufgaben erzeugen, die direkt auf "maximales Wachstum" zahlen.
2. Mindestens EINE Aufgabe pro Heartbeat erledigen (klein, commitbar).
3. HQ-Dashboard-Repo prüfen – wenn sinnvoll, mindestens ein Commit/Push.
4. Skills prüfen – wenn in den letzten 24h kein neuer Skill gelernt wurde: Lernprozess starten.
5. Fortschritt prüfen – wenn < 9/10: Alarm per Telegram notieren: "🚨 Zu langsam – pushen!" (Hinweis: Nicht automatisch senden, erst Freigabe einholen.)
6. MEMORY.md mit neuen Erkenntnissen aktualisieren.
7. heartbeat-state.json aktualisieren (root): Timestamps der letzten Checks pflegen, um Token-Burn zu reduzieren.

Erfolgsmetriken (KPIs) pro Run:
- Micro-Commit erledigt? (ja/nein)
- Skill-Fortschritt geloggt? (ja/nein)
- State aktualisiert? (Timestamp in heartbeat-state.json)

Wenn alles erledigt und Fortschritt hoch: HEARTBEAT_OK
