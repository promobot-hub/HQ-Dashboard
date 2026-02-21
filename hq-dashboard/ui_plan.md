# UI Modernisierung – Clawbot HQ-Dashboard (Premium Dark)

Ziel: Premium Dark Theme mit Tailwind CSS v4, Glassmorphism-Flächen, sanften Neumorphism-Akzenten, moderner Typografie (Inter + Satoshi), klarer visueller Hierarchie, hervorragender UX und Echtzeit‑Statusfläche für Clawbot.

## Design-Grundlagen

- Farbpalette (Dark + Neon Accents)

  - Base/Background: #0a0a0a (deep black)
  - Surface 1 (Panels): rgba(26, 26, 26, 0.9) / #1a1a1a
  - Surface 2 (Cards/Glass): rgba(255, 255, 255, 0.06) (Glassmorphism-Layer + Blur)
  - Border/Lines: rgba(255,255,255,0.08) 1px hairline
  - Neon Cyan Accent: #22d3ee (Primary Accent)
  - Neon Violet Accent: #a855f7 (Secondary Accent)
  - Success: #10b981 (emerald-500)
  - Warning: #f59e0b (amber-500)
  - Danger: #ef4444 (red-500)
  - Text High: rgba(255,255,255,0.95)
  - Text Med: rgba(255,255,255,0.75)
  - Text Low: rgba(255,255,255,0.55)

- Typografie

  - Headline/Body: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"
  - Display/Numbers/Akzente: Satoshi, Inter var
  - Headings (H1-H3): extrabold/bold, enge Zeilenhöhe, leichtes Tracking
  - Body: 16–18px, 1.6 line-height, klare Kontraststufen (High/Med/Low)

- Effekte
  - Glassmorphism Panels: backdrop-blur-md, bg-white/5–8, border-white/10, shadow-[0_8px_32px_rgba(0,0,0,0.35)]
  - Neumorphism (sanft): leichte inner/outer shadow auf Buttons/Pills bei Hover/Active
  - Akzent-Linien/Gradients: cyan→violet verläufe (bg-gradient-to-r from-cyan-400 to-violet-500 in dünnen Linien/Badges)

## Informationsarchitektur

- Global Navigation (Top‑Bar)

  - Logo/Brand (Clawbot HQ)
  - Tabs: Overview, Tasks, Skills, Runs, Logs, Settings
  - CTA: “Trigger Improve” (optional), Status‑Dot (Live/Fail)

- Overview (Landing)

  - Hero: Projekt‑Claim + Live‑Zustand (Runs Today, Total Runs, Last Run, Live Ping)
  - Ops Status Panel (Glass): Heartbeat Liveness, AutoImprove letzte Runs, Deploy‑Status
  - Activity Stream: letzte Micro‑Commits/AutoImprove‑Events (marquee/scroll)
  - Quick Actions: “Run Improve Cycle”, “Open Report”, “Open Logs”

- Tasks

  - Board (Glass Cards): Todo/In Progress/Done, Drag&Drop (dnd‑kit)
  - Quick‑Add (Neumorphism Input)
  - Filters/Tags (Accent‑Pills)

- Skills

  - Skill‑Grid mit Fortschritt (Ring/Bar, neon‑accent stroke)
  - Detail Drawer: Historie/Beispiele/Letzte Änderungen

- Runs

  - Liste/Timeline: Heartbeat/AutoImprove Zyklen, Status, Dauer, Diffs/Stats

- Logs

  - Live‑Log Console (monospace, virtualized), Filter nach Level/Komponente

- Settings
  - Konfiguration (Endpoints, Pings), Theme‑Toggles

## UX/Interaction Patterns

- Hover/Focus: sanfte Scale (1.01), neon‑glow shadow
- Buttons: ghost + accent‑filled Varianten (cyan/violet), disabled states farbentsättigt
- Cards: Glassmorphism; on-hover subtle tilt + shadow‑intensivierung
- Loaders: Thin progress bars (gradient cyan→violet)
- Animations: framer‑motion leichte fade/slide für Panels; skeletons für lazy content

## Komponenten (Tailwind Klassen)

- GlassCard: bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]
- AccentBadge: text-white px-2 py-1 rounded-md bg-gradient-to-r from-cyan-400 to-violet-500
- Pill: rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80 hover:bg-white/10
- Tile (KPIs): bg-[#111]/90 border border-white/10 rounded-xl p-4 shadow-[inset_0_1px_rgba(255,255,255,0.05)]

## Fonts & Assets

- Inter + Satoshi per next/font oder self‑hosted (woff2)
- color_palette.png skizziert (siehe Datei)

## Performance/SEO/Accessibility

- Nur notwendige JS laden (code-splitting), virtualized lists
- Meta/OG tags + sitemap/robots
- ARIA‑Labels, Farb‑Kontrast AA+, Focus states deutlich

## Implementierungsreihenfolge

1. Tailwind v4 Setup + Fonts + Theme Tokens
2. Layout‑Shell (Nav, Content Grid) + Hero
3. Ops‑Status Panel (Glass) + StatusTiles (Echtwerte)
4. Activity Stream + Logs Viewer Politur
5. Tasks/Skills Grids + Details
6. Settings + Fine‑Tuning (Animations/Polish)
