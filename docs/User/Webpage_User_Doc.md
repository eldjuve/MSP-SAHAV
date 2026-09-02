**User Documentation for the Web Application**

## Introduction

This document explains how to use the Puducherry Geo MSP web application.
The app is a browser-based interactive map for exploring Marine Spatial
Planning data — boundaries, land use, ecology, infrastructure, status
indicators, and conflicts between coastal activities — built on Leaflet and
GeoServer.

## System Requirements

- A modern web browser (Chrome, Firefox, Edge, Safari)
- JavaScript enabled
- An internet connection

## Getting Started

1. Open your browser.
2. Enter the application URL in the address bar and press **Enter**.

### User Interface Overview

- **Top bar** — the app's icon and title, and a link to INCOIS's storm surge web GIS
  portal.
- **Navigation menu** — dropdown menus for exploring the available data
  (see "Menu Navigation" below).
- **Map** — the main interactive map, powered by Leaflet.
- **Map tools** (top-right) — buttons for the Layers, Legend, and Basemaps
  panels.
- **Info panel** — a slide-out panel on the right showing details and
  charts for whatever is currently selected. Toggle it with the "INFO" tab
  on its edge.

## Features

### 1. Map Interaction

Pan and zoom with the mouse, touch controls, or the zoom buttons in the
bottom-right corner.

### 2. Menu Navigation

Click a menu item in the top navigation bar to open its dropdown, then
click an entry to load it:

- **Data Repository** — boundaries, land use/land cover, water resources,
  environment, ecology, human activities, socio-economic layers, and
  coastal inundation risk.
- **Status Indicators** — status layers such as marine pollution and water
  quality.
- **Conflicts & Compatibilities** — where activities like tourism, fishing,
  and shoreline use overlap or conflict.
- **Services-MoES** — services published by the Ministry of Earth Sciences.

Some menu items may appear disabled (greyed out) if that section has no
published content yet.

Selecting a menu item:

- moves the map to that item's area,
- loads its associated map layers,
- opens the info panel with a description and, if available, charts for
  that item.

### 3. Layer Management

- Click the **Layers** button (top-right) to open the Layers panel.
- Layers are grouped; a group's checkbox selects or clears every layer in
  it, and expands/collapses with the arrow on its right.
- Click the magnifying-glass icon next to a layer to zoom the map to its
  extent.
- Uncheck a layer to remove it from the map.

### 4. Legend

Click the **Legend** button to see the symbols and colors used by every
currently active layer.

### 5. Base Map Selection

Click the **Basemaps** button and choose between **Google Satellite Map**,
**ESRI World Imagery**, or **ESRI Topographic**. Google and Esri imagery can
be used with attribution, which the map already displays.

### 6. Info Panel and Charts

When a selected feature has associated reports (e.g. water quality,
weather, or mangrove status over time), the info panel shows its
description and charts. If more than one report is available for what's
currently selected, a dropdown at the top of the info panel lets you switch
between them.
