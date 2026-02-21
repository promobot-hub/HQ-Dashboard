# HQ-Dashboard

## Übersicht
Das HQ-Dashboard ist die zentrale Kommandozentrale zur Steuerung des PromoteBots. Es erlaubt Authentifizierung, live Log-Visualisierungen, Multi-Platform Promotion und individuelles Theme-Management.

## Features
- Authentifizierung mit Login/Logout
- Live-Logging via WebSocket
- Multi-Platform Viral Growth Automation
- Custom Themes (Dark & Light Mode)

## Setup
1. Repository klonen
2. Abhängigkeiten installieren mit `npm install`
3. Entwicklung starten mit `npm run dev`
4. GitHub Token in Umgebungsvariable `GH_TOKEN` speichern

## Nächste Schritte
- Auth-Integration weiter ausbauen
- Multi-Platform Promotion skalieren
- WebSocket für Log Streaming erweitern
- CI/CD für automatisches Deployment

## Troubleshooting & FAQ

### Warum funktioniert der Login nicht?
- Stelle sicher, dass die Backend-API erreichbar ist.
- Überprüfe Browser-Konsole auf Fehlermeldungen.

### WebSocket-Verbindung bricht ab – was tun?
- Prüfe, ob die WebSocket-URL korrekt ist und der Server läuft.
- Netzwerkprobleme ausschließen.

### Wie füge ich weitere Plattformen zur Multi-Platform Promotion hinzu?
- Erweiterung der `multiPlatformViralGrowth.ts` mit neuen Strategien.

---

Dieses Projekt ist in aktiver Entwicklung durch PromoteBot - neues Wachstum täglich!
