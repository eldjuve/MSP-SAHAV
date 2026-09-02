# Why This Rewrite

The frontend was rebuilt from a vanilla JavaScript/jQuery-era stack into
TypeScript on SolidJS, built with Vite. The motivation was maintainability
and configurability, not a cosmetic refresh:

- **Type safety end to end.** Layer configs, GeoServer responses, and chart
  data all now flow through typed interfaces (see `src/stores/configStore.ts`,
  `src/lib/charts.ts`), so a mismatch between what GeoServer serves and what
  a component expects is caught at build time instead of failing silently in
  the browser.

- **Far less hardcoded configuration.** The previous app encoded the entire
  nav tree, every layer bundle, and every chart's content directly in
  frontend JSON files (`datarepo.json`, `menuitems.json`,
  `Multi_DataTree.json`, and several topic-specific trees), so adding or
  reorganizing a single dataset meant a frontend code change and redeploy.
  The app now discovers its nav tree, layer groups, titles, descriptions,
  and legends from GeoServer's own `GetCapabilities` at runtime — see
  `docs/Technical/data_formats.md`. `public/config/nav.json` is the only
  config file left, and it holds nothing but nav labels and which GeoServer
  group each one points at.

- **Content changes without a frontend deploy.** Because nav structure,
  layer titles/descriptions, and chart content all live in GeoServer, adding
  a dataset, renaming a layer, or publishing a new chart report is a
  GeoServer-side change. Nothing in the frontend needs to change to add,
  move, or remove a report or a layer within an existing nav group.

- **Open to new data and regions with no frontend change.** Since the app
  resolves each layer's GeoServer workspace per-request rather than
  assuming one fixed workspace, `nav.json` can span multiple GeoServer
  workspaces — the `demo-geoserver` stack's second `MSPLak` (Lakshadweep)
  workspace demonstrates a second region being added purely as GeoServer
  content, with one new `nav.json` entry and zero other frontend changes.

- **A reproducible local environment.** `demo-geoserver/` provides a
  GeoServer + PostGIS stack via Docker Compose, seeded with real Puducherry
  MSP data, so the app can be developed and tested end to end without
  access to the production GeoServer instance.
