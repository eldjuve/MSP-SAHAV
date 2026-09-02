# Demo GeoServer

A local GeoServer + PostGIS stack for demoing this app without touching the
real production GeoServer. It's seeded with the real Puducherry MSP data
(pulled from the live public instance at
[marinespatialplanning.in/puducherrygeo](https://marinespatialplanning.in/puducherrygeo),
workspace `MSPudhu`, and committed under `data/`),
scoped down to the ~79 layers `public/config/nav.json`
can reach, organized into the layer groups it expects (see
`../../docs/Technical/data_formats.md`), styled with the
same real SLD cartography the production site uses (green mangroves,
transparent-fill district boundaries, custom point icons — see `styles/`),
plus a `WaterQuality_Buoy` point layer (a real GeoServer point feature with
a custom icon — see `../../docs/Technical/data_formats.md`) and a demo
`MSPudhu:ChartData` table so the
Water Quality / Marine Pollution / Weather chart panels have something to
show. Chart values are synthetic demo data, not real measurements.

It also seeds a second workspace, `MSPLak`, with a single real Lakshadweep
district boundary polygon (`data/Lakshadweep_District_Boundary.json`, from
[geoBoundaries](https://www.geoboundaries.org)'s open India ADM2 dataset,
CC BY 4.0 — attribute geoBoundaries if this data is reused elsewhere) —
see `scripts/setup-lakshadweep.sh` — plus a `MSPLak:ChartData` Weather
Parameters bundle for that boundary, built from **real** 2018-2023 daily
weather observations for Kavaratti, Lakshadweep, via
[Open-Meteo](https://open-meteo.com)'s historical archive API (ERA5/ERA5-Land
reanalysis, Copernicus Climate Change Service, CC BY 4.0) — see
`scripts/lakshadweep-chartdata.py`. Unlike `MSPudhu:ChartData`, these
values aren't synthetic. It's all there purely to demonstrate that
`nav.json` and the frontend's per-layer workspace resolution (see
`../../docs/Technical/data_formats.md`) support more than one GeoServer workspace; it
shows up in the app's top nav as "Lakshadweep (demo)"
(`../src/components/Navbar.tsx`), not part of the real site's menu.

## Quick start

```
cd demo-geoserver
docker compose up -d          # postgis + geoserver, exposed on 5432->55432 / 8080
bash scripts/setup.sh         # workspace, data load, publish, layer groups, chart demo data
```

`scripts/setup.sh` loads the committed `data/` (no live server needed) and
is otherwise idempotent-ish: it'll re-create/re-publish GeoServer resources
on a re-run (existing ones just fail harmlessly and are reported as
already-exists).

Once it's up, `.env.local`'s `VITE_GEOSERVER_URL` already points at
`http://localhost:8080/geoserver` — just run the app's dev server as usual.

GeoServer admin UI: http://localhost:8080/geoserver (admin / geoserver).

## What each script does

| script | purpose |
|---|---|
| `docker-compose.yml` | postgis (port 55432 on the host) + geoserver 2.25 (kartoza/geoserver, port 8080) |
| `scripts/init-geoserver.sh` | creates the `MSPudhu` workspace and a `mspudhu_postgis` PostGIS datastore |
| `scripts/load-data.sh` | imports each downloaded GeoJSON into PostGIS via a throwaway `ogr2ogr` container (no local GDAL install needed) |
| `scripts/publish-layers.sh` | publishes each loaded table as a GeoServer layer, using the exact mixed-case layer name the frontend expects as the exposed name (`ogr2ogr` lowercases table names on import; `nativeName` maps back to the real table), and sets each layer's `Title` — the label the frontend actually displays — from `layer-title-overrides.tsv`, then `layer-titles.tsv`, then a `"_"` -> `" "` reformat of the raw name |
| `scripts/create-layer-groups.sh` | creates every layer group `public/config/nav.json` references (bundles like `Boundaries`, plus the nested `Environment`/`Ecology`/`Human_Activities`/`Socio_Economic`/`DataRepository` groups), each with a `Title`/`Abstract` — that's what the sidebar shows when a group is selected, since there's no local text to fall back to. See `../../docs/Technical/data_formats.md` |
| `scripts/apply-styles.sh` | uploads every `styles/*.sld` to the local GeoServer and sets each layer's default style per `layer-style-map.tsv`, so the demo looks like the real site (green mangroves, transparent-fill boundaries, etc.) instead of GeoServer's generic gray default |
| `scripts/chartdata.py` | generates the demo `MSPudhu:ChartData` rows + `CREATE TABLE`/`INSERT` SQL, matching the `ChartBundle`/`ChartSpec` shapes in `../src/lib/geoserver.ts` |
| `scripts/seed-chartdata.sh` | runs `chartdata.py`, loads it into Postgres, and publishes `MSPudhu:ChartData` |
| `scripts/setup-lakshadweep.sh` | provisions a second demo workspace, `MSPLak`, from a single real Lakshadweep district boundary polygon (`data/Lakshadweep_District_Boundary.json`) — proves `public/config/nav.json` can span more than one GeoServer workspace, since every layer/WMS/WFS lookup in the frontend already resolves its workspace per-layer (see `wmsUrlForWorkspace`/`wfsUrlForWorkspace` in `../src/stores/mapStore.ts`). Reuses the same Postgres database as `MSPudhu` (a second workspace/datastore pointing at the same db is normal) and the generic `load-data.sh`. No `ChartData` table for this workspace, so the InfoSidebar's chart fetch for it 400s harmlessly (already handled — `fetchFeatureCharts` returns `[]` on a failed request) |
| `scripts/seed-lakshadweep-chartdata.sh` | runs `lakshadweep-chartdata.py`, loads it into Postgres, and publishes `MSPLak:ChartData` — a Weather Parameters bundle for `District_Boundary`, built from **real** historical weather observations (Open-Meteo's archive API, ERA5/ERA5-Land reanalysis), unlike `MSPudhu:ChartData`'s synthetic values. This is the one step in `setup.sh` that needs internet access |
| `scripts/setup.sh` | runs all of the above in order |

`data/*.json`, `styles/*.sld` + `layer-style-map.tsv`, and `layer-titles.tsv`
were pulled from the live production GeoServer by one-off `fetch-*` scripts
(`fetch-data.sh`, `fetch-styles.py`, `fetch-titles.py`) that are no longer
in the repo — their output is committed and that's all `setup.sh` needs, so
they were deleted rather than kept around unused. To refresh any of these
from the live server again, recover the script from git history, e.g.:
```
git log --oneline --diff-filter=D -- webapp/demo-geoserver/scripts/fetch-data.sh
git show <that commit>^:webapp/demo-geoserver/scripts/fetch-data.sh > scripts/fetch-data.sh
```

`referenced_local_names.txt` is every distinct layer name (workspace prefix
stripped) that `create-layer-groups.sh`'s bundles reference — i.e. every
individual layer that ends up as a member of some group in `nav.json`'s
tree. All of these were confirmed present on the live server as of this
writing; if a future re-fetch finds one missing, `create-layer-groups.sh`
will just report a `FAIL` for whichever group referenced it — check
`/tmp/layergroup-<name>.log` for the actual GeoServer error, then either
fix the member name or drop it from that group's member list in the script.

## Notes / gotchas

- `demo-geoserver/data/` (downloaded GeoJSON, ~80MB) is committed, like
  `styles/` and `layer-titles.tsv` — see the note below the script table for
  how to refresh it from the live server (the fetch script isn't in the
  repo any more).
- Leaflet's `L.tileLayer.wms` (used in `mapStore.ts`) defaults to WMS
  **1.1.1**, which uses lon/lat axis order for EPSG:4326. If you're
  poking the GeoServer WMS endpoint directly with `curl`, match that
  (`version=1.1.1`) or you'll get blank tiles from swapped axes on 1.3.0.
- Postgres in the compose stack is exposed on host port **55432** (not 5432)
  to avoid colliding with a local Postgres install.
- **`GetCapabilities` from the workspace-scoped WMS endpoint
  (`/geoserver/MSPudhu/wms`) returns bare layer names** (`Environment`, not
  `MSPudhu:Environment`), even though every layer name elsewhere in this
  app (`nav.json`, `MSPudhu:ChartData` lookups) is workspace-qualified.
  `src/lib/capabilities.ts` reconstructs the qualified name from the
  workspace it fetched, so the frontend doesn't need to know about this —
  but if you're inspecting `GetCapabilities` output by hand, don't be
  surprised the `<Name>` elements aren't prefixed.
- **6 point-icon styles needed fixing** (`Fire`, `bank`, `burg`, `fish`,
  `fish2`, `snowflake`) — none of their originally-referenced icons were
  usable (a nonexistent `cleancoastindia.com`/an IP address, or `burg`'s
  `file:/C:/...` Windows path from the original GeoServer install), and
  worse, every one of them declared the XLink namespace under the prefix
  `ns1` instead of the conventional `xlink` — GeoTools' SLD parser doesn't
  resolve `ns1:href` by namespace URI, so it reads a null href and throws
  an NPE (`DefaultResourceLocator.locateResource`) on *upload*, not just at
  render time. Fixed by re-pointing each at a same-licensed (Apache 2.0)
  [Material Symbols](https://github.com/google/material-design-icons) icon,
  self-hosted alongside the style (`styles/icons/*.svg`, uploaded to each
  style's own resource dir by `apply-styles.sh`'s icon loop) and referenced
  by a **relative** `xlink:href` (just the filename, e.g. `bank.svg`), and
  renaming `ns1` to `xlink` throughout. The fixed `.sld` files are
  committed, so this doesn't recur — but see the next note, this wasn't
  quite right the first time either.
- **A relative `xlink:href` is required, not an absolute
  `/rest/resource/...` URL.** The 6 icon styles above (plus `buoy`, added
  later) originally pointed `xlink:href` at the icon's absolute REST URL
  (`http://localhost:8080/geoserver/rest/resource/workspaces/MSPudhu/styles/*.svg`).
  That *uploads* fine and GeoServer never logs an error, but at render time
  it silently falls back to the style's plain `<Mark>` (a colored square) —
  `/rest/resource/**` requires HTTP Basic auth (confirmed: `curl` without
  credentials gets a 401), and GeoServer's own `ExternalGraphic` fetcher
  doesn't send any. A bare relative filename skips the HTTP round-trip
  entirely (resolved straight from the style's resource directory), so it
  isn't affected. Always verify a new icon style by actually rendering a
  `GetMap` tile and looking at the pixels — an `HTTP 200`/`201` on style
  upload only proves the XML parsed, not that the icon shows up.
  on a fresh `apply-styles.sh` run.
- **Every style's `fill-opacity`/`stroke-opacity` is set to `0.7`/`1`**
  (translucent fills, crisp outlines — see `../../docs/Technical/data_formats.md`'s
  "Layer opacity" section). The `.sld` files are committed
  with this baked in — recovering and re-running `fetch-styles.py` (see the
  note above the script table) would pull pristine copies from the live
  server and lose it, so re-apply the same fill-opacity/stroke-opacity
  convention to whatever changed if you do.
- To tear down: `docker compose down` (add `-v` to also drop the data
  volumes and start fresh next time).
