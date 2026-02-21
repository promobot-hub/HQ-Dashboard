# Clawbot HQ – Premium Dark UI

Diese UI ist ein vollständiges, eigenständiges Frontend (statisch), das die modernisierte Dark-Theme-Oberfläche von Clawbot HQ demonstriert.

Ordner-Struktur
- frontend/
  - index.html – Fertige, integrierte Seite (Navbar + Sidebar + Dashboard + Interaktionen)
  - globals.css – Reset, Variablen, Base-Layer, Utilities, Mobile-Bottom-Bar
  - components/
    - navbar.html, sidebar.html – Referenz-Komponenten
    - buttons.html, cards.html, inputs.html, toggles.html, progress.html, tables.html – wiederverwendbare Bausteine
    - modals.js – Glass-Backdrop Modal + Settings Form API
    - toasts.js – Toast-System mit Micro-Animationen
    - charts.js – Chart.js Loader + CPU/Memory Live-Demo
  - layout.html, base.html, dashboard.html – zusätzliche Demos

Wie starten
- Schnell: Öffne frontend/index.html direkt im Browser (lokal).
  - Hinweis: Die Charts laden Chart.js via CDN. Internetzugang erforderlich.
- Alternativ: Mit einfachem Static Server (empfohlen für CORS/Cache-Header)
  - Python: `cd frontend && python3 -m http.server 8089` → http://localhost:8089
  - Node: `npx serve frontend -l 8089` → http://localhost:8089

Design/Features
- Premium Dark Theme: #0a0a0a Grundton, Neon-Akzente #22d3ee (cyan) / #a855f7 (violet)
- Glassmorphism, sanfte Neumorphism-Akzente, weiche Transitions
- Responsive: Sidebar wird unter 768px zur Bottom-Bar
- Accessibility: aria-Attribute, Fokus-Ringe in Neon, Farbkontrast beachtet
- Performance: Lazy Loading bei Bildern, Skripte per `defer`, Chart.js dynamisch
- Charts: Live-Demo (CPU/Memory) via Chart.js, einfache Zufalls-Feeds

Screenshots (Beschreibung)
- 01-landing-hero.png – Hero-Status-Card mit CB-Logo, Heartbeat-Dot, KPI-Leiste
- 02-stats-cards.png – Vier Glass-Stat-Cards mit Gradient-Border und Hover-Lift
- 03-sidebar-bottom-bar.png – Mobile-Ansicht mit Bottom-Bar-Navigation
- 04-modals-toasts.png – Glass-Modal und Toast-Notifications

Integration in Next.js
- Tailwind v4 Config liegt unter hq-dashboard/tailwind.config.js (Plan aus UI-Modernisierung)
- Globals und Komponenten in Next.js importieren (app/layout.tsx, app/page.tsx, components/*)
- Live-Daten an /api/status anbinden (bereits vorhanden im Projekt)

UI_OVERHAUL_COMPLETED – Die Clawbot Website ist jetzt tip-top modern premium Dark Theme und sieht verdammt gut aus.
