Du bist ein Senior Next.js 16.1.6 + TypeScript + Turbopack + Render.com Experte.

Aufgabe: Analysiere das komplette Repository https://github.com/promobot-hub/HQ-Dashboard (aktueller `main`-Branch) und finde ALLE Fehler, die einen `yarn build` oder `next build` auf Render scheitern lassen könnten.

Vorgehen (streng, vollständig):
1) TypeScript Errors
- implizit `any`
- fehlende Props-Interfaces
- Type-Mismatches (z.B. dnd-kit UniqueIdentifier vs string)
- fehlende Typ-Imports

2) Next.js App Router Issues
- Server Components, die Client-Hooks (useState, useEffect) benutzen
- Fehlende `"use client"`
- Falsche Import-Pfade in app/api/* Routes
- API-Routes, die require() statt import benutzen

3) Build-spezifische Probleme
- package.json Scripts (build/start)
- yarn.lock vs package-lock.json
- Turbopack-spezifische Errors
- fehlende .env / Environment-Variablen
- dynamische Imports / next/dynamic

4) Weitere Render-Breaker
- Node-Version (.nvmrc)
- Build Command auf Render
- Dateien, die im .gitignore sind aber gebraucht werden
- Abhängigkeiten, die nur dev sind aber im Production-Build fehlen

Output:
- Liste JEDEN Fehlers mit: exakter Dateipfad + Zeilennummer + konkrete Lösung
- Am Ende: Priorisierte Liste
  - Kritische Fehler (sofort fixen)
  - Warnungen (später)
  - Empfohlene Render-Einstellungen

Starte jetzt mit der Analyse.