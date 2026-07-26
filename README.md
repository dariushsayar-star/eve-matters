# EVE Matters Experience Center

Luxury interactive showroom software for the EVE Matters mattress brand — built with Electron, React, Vite, Three.js, GSAP, Framer Motion and Tailwind CSS. Persian (RTL) interface, dark luxury theme, designed to run fullscreen on a 55" touch display in a physical showroom.

## Quick start

```bash
npm install
npm run electron:dev
```

This starts the Vite dev server and launches the Electron window pointed at it (windowed, DevTools open, so you can iterate).

## Building the Windows installer (.exe)

### Option A — Cloud build with GitHub Actions (no local Node/Windows needed)

This project includes `.github/workflows/build.yml`, which builds the Windows
installer automatically on GitHub's own Windows servers. See the step-by-step
guide in the chat, or in short:

1. Push this project to a GitHub repository.
2. Go to the repo's **Actions** tab → select **Build Windows EXE** → **Run workflow**.
3. When it finishes (a few minutes), open the run → download the
   **EVE-Matters-Windows-Installer** artifact — that's your `.exe`.

### Option B — Build locally (requires Windows 10/11 or macOS/Linux + Node 18+)

```bash
npm install
npm run electron:build:win
```


This runs `vite build` then `electron-builder --win`, producing an NSIS installer in `release/`. Requires running on Windows, or on macOS/Linux with Wine installed (electron-builder's usual cross-build requirement).

Before your first production build:

1. Drop a proper multi-resolution `icon.ico` into `build/` (see `build/README.md`).
2. Optionally add a brand film at `src/assets/brand-loop.mp4` for the Brand page's video background — it degrades gracefully without one.
3. Optionally replace the synthesized UI sounds (`src/hooks/useSound.js`, generated with the Web Audio API — no binary assets required) with recorded sound design if you have some.
4. For a fully offline kiosk (no internet in the showroom), download the Vazirmatn variable font and place it at `src/assets/fonts/Vazirmatn[wght].woff2` — `src/styles/index.css` already has the `@font-face` rule wired up for it. Otherwise the app pulls Vazirmatn from Google Fonts on first load.

## What's inside

| Page | Path | What it does |
|---|---|---|
| Splash | `/` | Animated intro, auto-navigates to Home after 3s |
| Home | `/home` | Hero 3D mattress + 6 navigation cards |
| Brand | `/brand` | Brand story + animated timeline |
| Technology | `/technology` | 7 interactive technology cards |
| Structure | `/structure` | Exploded 3D mattress, 8 clickable layers |
| Recommendation | `/recommendation` | Smart questionnaire → scored mattress match |
| Body Analysis | `/body-analysis` | Showroom-only visualization (heatmap, spine, scores) — not medical |
| Compare | `/compare` | SIMBA / HAPPY / ROYAL / PREMIUM spec comparison |
| Warranty | `/warranty` | Warranty plans + care instructions |
| Contact | `/contact` | Map placeholder, phone, Instagram, QR |
| Settings | `/settings` | Dark mode, language, brightness, sound |

## Project structure

```
electron/         main.js (kiosk window), preload.js
src/
  animations/      shared GSAP presets
  components/      GlassCard, Navbar, BottomNav, Layout, ScoreRing, etc.
  data/            mattresses.js, layers.js, technologies.js, warranty.js
  hooks/           useSettings (persisted app settings), useSound (synthesized UI sfx)
  pages/           one file per route, listed above
  three/           MattressViewer.jsx (hero), MattressExploded.jsx (structure page)
  utils/           recommendation.js (scoring engine)
  styles/          index.css (Tailwind + glassmorphism utility classes)
```

## Notes

- Routing uses `HashRouter` (not `BrowserRouter`) since the production build is loaded via `file://` inside Electron.
- The kiosk window (`electron/main.js`) is frameless, fullscreen, and not resizable in production; in dev (`NODE_ENV=development`) it runs windowed with DevTools so you can build comfortably.
- Staff shortcuts: `Ctrl+Shift+Q` quits, `F11` toggles fullscreen, `Ctrl+Shift+R` reloads — useful during setup/troubleshooting on the showroom floor.
