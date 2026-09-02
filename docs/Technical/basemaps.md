# Basemaps

The app offers three basemaps, all served as Leaflet tile layers:

| type        | label                | source                              |
| ----------- | --------------------- | ----------------------------------- |
| `satellite` | Google Satellite Map  | Google's raw tile server            |
| `imagery`   | ESRI World Imagery    | Esri `World_Imagery` tile service   |
| `topo`      | ESRI Topographic      | Esri `World_Topo_Map` tile service  |

The active basemap is a Solid signal, persisted in `sessionStorage` so it
survives a reload within the same tab (`basemap`/`changeBasemap` in
`src/stores/mapStore.ts`). `BASEMAP_TILES` in that same file maps each
`BasemapType` to a factory that builds its `L.TileLayer`; `applyBasemap`
swaps the active tile layer on the map instance.

The picker UI lives in `src/components/BasemapsPanel.tsx`, which lists the
same three options with thumbnail images from `public/img/`.

## Adding a basemap

1. Add the new type to the `BasemapType` union in `src/stores/mapStore.ts`.
2. Add a matching entry to `BASEMAP_TILES` with a factory that returns an
   `L.TileLayer` for the new source.
3. Add a thumbnail image to `public/img/` and a matching entry to
   `BASEMAPS` in `src/components/BasemapsPanel.tsx`.

## Note on the Google Satellite tile source

The `satellite` option pulls Google's raw tile server directly rather than
through the official Maps JS API/embed, which is outside Google's terms of
service for programmatic tile access. It's attributed regardless, but if
this app is ever meant for production use beyond an internal demo, swap it
for a licensed satellite source — Esri's `World_Imagery` (already used for
the `imagery` option) is a drop-in alternative.
