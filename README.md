# Map Draw App

Polished GeoJSON drawing app built with React + TypeScript + Vite + Bun, Tailwind, shadcn-style UI components, and MapLibre GL JS.

## Coordinate system

This app assumes **WGS84 / EPSG:4326 (SRID 4326)** and stores coordinates as **`[longitude, latitude]`**.

## Tech stack

- React + TypeScript
- Vite
- Bun
- Tailwind CSS
- shadcn-style component structure
- MapLibre GL JS
- @mapbox/mapbox-gl-draw

## Install

```bash
bun install
```

## Run

```bash
bun dev
```

## Checks

```bash
bun run typecheck
bun run lint
bun run build
```

## Features

- Top command bar with Clear / Export / Import / Sample / Settings actions.
- Draw modes: Select/Edit, Point, LineString, Polygon, Rectangle (polygon mode).
- Select/edit/delete selected and clear all.
- GeoJSON viewer/editor tabs with validation and download.
- Settings drawer:
  - Floating Sidebar switch.
  - Toggle button style modes (Icon Only / Icon with Label / Icon & Label Sidebar).
  - Live preview card.

