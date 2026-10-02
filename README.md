# Networking Basics — Interactive Presentation

A beginner-friendly presentation on computer networking fundamentals, built with
HTML5, CSS3, vanilla JavaScript and SVG — no frameworks, no backend.

## 🎯 Overview

**Title:** Networking Basics
**Subtitle:** Understanding How Devices Communicate
**Slides:** 34
**Diagrams:** 34, every one authored in draw.io

> 📖 **New:** [STUDY-GUIDE.md](STUDY-GUIDE.md) — read this to learn the material and
> explain it. It explains *why* each slide says what it says, plus the analogies,
> anticipated audience questions with short answers, and delivery notes.

## 🚀 Quick Start

```bash
open index.html          # or double-click it
npx serve .              # local server, recommended
```

## ⌨️ Controls

| Key | Action |
|-----|--------|
| ← / → | Previous / Next slide |
| Space | Next slide |
| Home / End | First / Last slide |
| 1–9 | Jump to approximate position |
| F | Toggle fullscreen |
| Click | Next slide |
| Swipe | Touch navigation |

The notes button (bottom right) shows speaker notes for the current slide.

## 📁 Project Structure

```
networking-presentation/
├── index.html                  # Entry point
├── STUDY-GUIDE.md              # Study material: read/learn/explain the deck
├── css/
│   ├── main.css                # Design system & layout
│   ├── animations.css          # Transitions, keyframes & diagram motion
│   └── diagrams.css            # SVG & diagram styles
├── js/
│   ├── slides.js               # Slide data (34 slides: titles, bullets, notes)
│   ├── diagram-svgs.js         # GENERATED: all 34 draw.io diagrams as SVG
│   ├── diagrams.js             # Diagram engine + packet animations
│   ├── animations.js           # Animation helpers
│   ├── navigation.js           # Keyboard/touch/fullscreen controls
│   └── app.js                  # Main application
├── assets/diagrams/            # GENERATED: the same 34 diagrams as .svg
├── scripts/
│   ├── generate-drawio.js      # Builds networking-diagrams.drawio (34 pages)
│   └── export-svgs.js          # Exports each page to SVG
├── networking-diagrams.drawio  # Editable draw.io source — ALL diagrams
└── README.md
```

## 🧭 Diagram Pipeline

**Every diagram in the deck is authored in draw.io.** There are no hand-drawn
SVG fallbacks left — `js/diagrams.js` is only the loader plus the packet
animations. Each page is a fixed 800×460 canvas and the page order matches the
slide order.

```bash
node scripts/generate-drawio.js   # 1. rebuild networking-diagrams.drawio
node scripts/export-svgs.js       # 2. export -> assets/diagrams/*.svg + diagram-svgs.js
```

`export-svgs.js` needs the draw.io desktop CLI and a display; set `DRAWIO_BIN` if
it is not at `/snap/bin/drawio`. It exports with `-t --size page --theme light`,
strips draw.io's embedded source copy and its base64 **text rasters** (~80% of
each file), tags connector paths with `class="edge"` so the CSS can animate them,
injects the `<circle id="pkt_…">` fixtures the packet animations drive, and
**fails loudly** if a page loses its viewBox, its `.network-svg` class or a packet id.

Page → slide mapping (see the `PAGES` tables in both scripts):

| Page | Diagram | Slide |
|---|---|---|
| 1 | networkPathIntro | 01 — Title |
| 2 | deviceToNetwork | 02 — What Is Networking? |
| 3 | valueIcons | 03 — Why Networks? |
| 4 | networkScale | 04 — Types of Networks |
| 5 | fullNetwork | 05 — Network Components |
| 6 | deviceIcons | 06 — Network Devices |
| 7 | hubVsSwitch | 07 — Hub vs Switch |
| 8 | switching | 08 — Switching |
| 9 | routing | 09 — Routing |
| 10 | routerVsSwitch | 10 — Router vs Switch |
| 11 | topologies | 11 — Topologies |
| 12 | encapsulation | 12 — Encapsulation |
| 13 | osiLayers | 13 — OSI Model |
| 14 | osiInAction | 14 — OSI in Action |
| 15 | tcpipModel | 15 — TCP/IP Model |
| 16 | macVsIp | 16 — MAC vs IP |
| 17 | **ipv4Addressing** | **17 — IPv4 Addressing** |
| 18 | **ipClasses** | **18 — IP Address Classes** |
| 19 | **ipRanges** | **19 — IP Address Ranges** |
| 20 | subnetting | 20 — Subnetting |
| 21 | tcpVsUdp | 21 — TCP vs UDP |
| 22 | protocolMap | 22 — Common Protocols |
| 23 | dnsResolution | 23 — DNS |
| 24 | dhcpDora | 24 — DHCP |
| 25 | portsAndSockets | 25 — Ports & Sockets |
| 26 | internetPath | 26 — How the Internet Works |
| 27 | websiteLoading | 27 — Opening a Website |
| 28 | firewall | 28 — Firewall |
| 29 | nat | 29 — NAT |
| 30 | securityLayers | 30 — Network Security |
| 31 | troubleshooting | 31 — Troubleshooting |
| 32 | cheatSheet | 32 — Cheat Sheet |
| 33 | finalMap | 33 — Final Network Map |
| 34 | questions | 34 — Questions |

## ✨ Diagram Motion

Small, ambient animations defined in `css/animations.css`, all disabled under
`prefers-reduced-motion`:

- **Connector dash flow** — a slow dash drifts along every `path.edge`, reading
  as traffic moving. Thin links drift more slowly than thick ones.
- **Breathing glow** — the drawing gently fades between 92% and 100% opacity.
- **Packet halo** — the travelling packets get a soft cyan drop-shadow.

## 🎨 Design System

- **Background:** deep navy/charcoal gradient
- **Primary:** electric blue → cyan; **Secondary:** purple accents
- **Typography:** Inter (headings), Fira Code (labels)
- **Glassmorphism:** frosted panels, thin grid, electric-blue glows

## 🔧 Technical Notes

- All 34 diagrams are draw.io exports (`networking-diagrams.drawio` →
  `assets/diagrams/*.svg`), inlined into `js/diagram-svgs.js` so the deck also
  works from `file://`
- Packet movement animations use `setInterval`
- `prefers-reduced-motion` respected throughout
- No external dependencies
