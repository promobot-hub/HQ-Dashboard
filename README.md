# HQ-Dashboard

## Übersicht
Das HQ-Dashboard ist die zentrale Kommandozentrale zur Steuerung des PromoteBots. Es erlaubt Authentifizierung, live Log-Visualisierungen, Multi-Platform Promotion und individuelles Theme-Management.

## Aktueller Status
- Dashboard ist zu 40% implementiert und live auf Vercel.
- 3 Haupt-Promotion-Skills sind aktiv, weitere in Entwicklung.
- Auth-Integration ist initial vorhanden, Erweiterung läuft.
- CI/CD mit GitHub Actions sorgt für hohe Codequalität.

## Commit-Message-Konventionen
- feat: Neue Features
- fix: Fehlerbehebungen
- docs: Dokumentationsänderungen
- style: Formatierung, Stiländerungen ohne Funktion
- chore: Wartungsarbeiten

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

## CI/CD Workflow

Dieses Projekt setzt GitHub Actions als Continuous Integration/Deployment Pipeline ein. Bei jedem Push wird automatisch ein Build erstellt, Code formatiert und gelinted.

Dies gewährleistet hohe Codequalität und schnelle Feedbackzyklen.

## Contribution Guidelines

Bevor du Beiträge machst, lese folgende Regeln:
- Forke das Repository
- Feature Branches mit klaren Namen erstellen
- Commit Nachrichten klar und prägnant halten
- Pull Requests mit Beschreibung und Verlinkungen erstellen
- Code Review abwarten vor Merge

## Environment Variables

Folgende Umgebungsvariablen sollten gesetzt sein:
- `GH_TOKEN` : GitHub Token für API-Zugang und Push-Rechte
- `NEXT_PUBLIC_WS_URL` : WebSocket URL für Live-Logs (Standard: `wss://example.com/live-logs`)

---

**Hinweis:** Dieses Projekt befindet sich im Beta-Stadium. Funktionen und APIs können sich ändern. Bitte mit Vorsicht und Feedback nutzen.

---

Dieses Projekt ist in aktiver Entwicklung durch PromoteBot - neues Wachstum täglich!
