# Demo GeoServer

A local GeoServer + PostGIS stack for demoing this app without touching the
real production GeoServer. It's seeded with the real Puducherry MSP data
(pulled from the live public instance at
[marinespatialplanning.in/puducherrygeo](https://marinespatialplanning.in/puducherrygeo),
workspace `MSPudhu`, and committed under `data/` — see `scripts/fetch-data.sh`),
scoped down to the ~79 layers `public/config/nav.json`
can reach, organized into the layer groups it expects (see
`../GEOSERVER_CHANGES.md`'s "Layer groups to create" table), styled with the
same real SLD cartography the production site uses (green mangroves,
transparent-fill district boundaries, etc. — see `styles/`), plus a demo
`MSPudhu:ChartData` table so the Water Quality / Marine Pollution chart
panels have something to show. Chart values are synthetic demo data, not
real measurements.

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

Once it's up, `src/stores/mapStore.ts`'s `GEOSERVER_URL` already points at
`http://localhost:8080/geoserver/MSPudhu/wms` — just run the app's dev
server as usual.

GeoServer admin UI: http://localhost:8080/geoserver (admin / geoserver).

## What each script does

| script | purpose |
|---|---|
| `docker-compose.yml` | postgis (port 55432 on the host) + geoserver 2.25 (kartoza/geoserver, port 8080) |
| `scripts/init-geoserver.sh` | creates the `MSPudhu` workspace and a `mspudhu_postgis` PostGIS datastore |
| `scripts/fetch-data.sh` | **maintenance only, not run by `setup.sh`.** Downloads WFS GeoJSON for every layer in `referenced_local_names.txt` from the live production GeoServer into `data/*.json`. Only needs re-running if the live server's data changes or a new layer is added — the fetched output is committed, so normal setup doesn't depend on the live server for this |
| `scripts/load-data.sh` | imports each downloaded GeoJSON into PostGIS via a throwaway `ogr2ogr` container (no local GDAL install needed) |
| `scripts/publish-layers.sh` | publishes each loaded table as a GeoServer layer, using the exact mixed-case layer name the frontend expects as the exposed name (`ogr2ogr` lowercases table names on import; `nativeName` maps back to the real table), and sets each layer's `Title` — the label the frontend actually displays — from `layer-title-overrides.tsv`, then `layer-titles.tsv`, then a `"_"` -> `" "` reformat of the raw name |
| `scripts/fetch-titles.py` | **maintenance only, not run by `setup.sh`.** Re-fetches every layer's `Title` from the live production GeoServer into `layer-titles.tsv`, for layers where the live title is actually more descriptive than the raw name. `layer-title-overrides.tsv` is hand-curated instead (not fetched) — it's for the layers where nobody, live server included, ever set a real title (e.g. `LULC_Pondy` -> "Land Use", recovered from the old app's removed `Multi_DataTree.json`) |
| `scripts/create-layer-groups.sh` | creates every layer group `public/config/nav.json` references (bundles like `Boundaries`, plus the nested `Environment`/`Ecology`/`Human_Activities`/`Socio_Economic`/`DataRepository` groups), each with a `Title`/`Abstract` — that's what the sidebar shows when a group is selected, since there's no local text to fall back to |
| `scripts/fetch-styles.py` | **maintenance only, not run by `setup.sh`.** Re-fetches every layer's real SLD style from the live production GeoServer into `styles/*.sld` + `layer-style-map.tsv`. Only needs re-running if the live server's styles change or a new layer is added — the fetched output is committed, so normal setup doesn't depend on the live server for this |
| `scripts/apply-styles.sh` | uploads every `styles/*.sld` to the local GeoServer and sets each layer's default style per `layer-style-map.tsv`, so the demo looks like the real site (green mangroves, transparent-fill boundaries, etc.) instead of GeoServer's generic gray default |
| `scripts/chartdata.py` | generates the demo `MSPudhu:ChartData` rows + `CREATE TABLE`/`INSERT` SQL, matching the `ChartBundle`/`ChartSpec` shapes in `../src/lib/geoserver.ts` |
| `scripts/seed-chartdata.sh` | runs `chartdata.py`, loads it into Postgres, and publishes `MSPudhu:ChartData` |
| `scripts/setup.sh` | runs all of the above in order |

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
  `styles/` and `layer-titles.tsv` — re-run `scripts/fetch-data.sh` to
  refresh it from the live server.
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
  self-hosted via GeoServer's own resource API
  (`/rest/resource/workspaces/MSPudhu/styles/*.svg` — see `styles/icons/`)
  so rendering has no external dependency, and renaming `ns1` to `xlink`
  throughout. The fixed `.sld` files are committed, so this doesn't recur
  on a fresh `apply-styles.sh` run.
- To tear down: `docker compose down` (add `-v` to also drop the data
  volumes and start fresh next time).
