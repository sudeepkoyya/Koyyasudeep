# EcoSphereX — Environmental Intelligence Dashboard

A responsive software-only expo prototype for visualizing environmental indicators.

## Features
- Air-quality index, noise level, soil pH, and temperature KPI cards
- Auto-refreshing demo readings every 5 seconds
- Interactive trend chart with selectable metrics
- Monitoring-zone status cards
- Rule-based environmental alert panel
- Responsive desktop and mobile layout

## Run locally
This is a static website. Open `index.html` in a browser, or serve the folder using a local static server.

For example, from this folder:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Important data note
The current version uses randomly generated **simulated demo readings**. It is not connected to physical sensors or a verified environmental data API. Do not present the values as actual measured AQI, noise, pH, or temperature. Chart.js is loaded from a CDN, so the chart requires internet access.

## Structure
- `index.html` — dashboard layout
- `styles.css` — responsive styling
- `script.js` — simulated readings, chart, and alert logic

## Next steps
1. Test the UI on mobile and desktop.
2. Add a trusted real-data API or sensor endpoint if available.
3. Add project architecture and data-flow diagrams for the expo.
4. Deploy this folder as the Vercel project root (or configure the Vercel root directory to `EcoSphereX`).
