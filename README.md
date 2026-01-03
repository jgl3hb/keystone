# Keystone 3D Map

Interactive 3D ski resort map of Keystone, Colorado built with Three.js.

## Features

- **Detailed Terrain**: Procedurally generated terrain with three peaks (Dercum Mountain, North Peak, The Outback) and five bowls
- **Ski Runs**: 30+ major ski runs color-coded by difficulty (Green/Blue/Black/Double Black)
- **Lift System**: All 14 major lifts with animated gondola cabins and chairlifts
- **Dynamic Environment**: Pine tree forests with tree-line cutoff, day/night mode
- **Interactive Controls**: Layer toggles, difficulty filters, camera presets

## Resort Stats

- Base Elevation: 9,280 ft
- Summit Elevation: 12,408 ft  
- Vertical Drop: 3,128 ft
- Skiable Terrain: 3,149 acres
- Runs: 135+
- Lifts: 20

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:3000 in your browser.

## Controls

- **Mouse**: Orbit camera (drag), Zoom (scroll)
- **Layer Toggles**: Show/hide runs, lifts, trees, labels
- **Difficulty Filter**: Filter runs by difficulty
- **View Presets**: Quick camera positions for different areas
- **Day/Night**: Toggle between day and night lighting

## Tech Stack

- [Three.js](https://threejs.org/) - 3D graphics library
- [Vite](https://vitejs.dev/) - Build tool and dev server

## License

MIT
