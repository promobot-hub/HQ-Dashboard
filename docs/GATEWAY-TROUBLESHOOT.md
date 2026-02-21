# Gateway Troubleshoot (Local loopback 127.0.0.1:8080)

Wenn `gateway timeout after 30000ms` erscheint:

1) Prüfe, ob der OpenClaw Gateway Dienst läuft
   - `openclaw gateway status` (falls CLI vorhanden)
   - Alternativ: Prozess/Port prüfen `ss -ltnp | grep 8080` oder `curl -v http://127.0.0.1:8080`

2) Falls kein Gateway benötigt:
   - In `/data/.openclaw/openclaw.json` unter `gateway` den Modus deaktivieren oder auf Remote ändern
     Beispiel (deaktivieren):
     ```json
     "gateway": { "mode": "disabled" }
     ```
     oder Timeout reduzieren/Backoff über aufrufende Komponenten implementieren.

3) Backoff/Retry implementieren, wenn lokale Dienste zeitweise langsam sind.

4) Logs prüfen: `/data/.openclaw/update-check.json`, `agents`/`plugins`/`cron` Ordner.

Hinweis: In dieser Umgebung ist `openclaw` CLI evtl. nicht verfügbar. Dann Option (2) nutzen oder Gateway separat starten.
