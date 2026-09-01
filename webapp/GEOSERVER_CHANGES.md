# GeoServer changes needed for nav, layers, and chart data

The frontend's navigation, map layers, and chart data are all discovered
from GeoServer at runtime — `public/config/nav.json` is now the *only*
hardcoded config file, and it holds nothing but nav labels and which
GeoServer layer/layer-group each one points at. Everything else
(`datarepo.json`, `menuitems.json`, `Multi_DataTree.json`, and the
per-item `infra.json`/`tourism_shore.json`/`humanconflicts.json` trees)
has been removed.

Three things must happen on the GeoServer side before the app works:

1. **Set the real server URL.** `GEOSERVER_URL` in `src/stores/mapStore.ts`
   is still the placeholder `https://yourdomain.in/geoserver/MSPudhu/wms`
   inherited from the original app.
2. **Publish the layer groups `nav.json` references** (see below) in the
   `MSPudhu` workspace, each with a `Title` and (ideally) an `Abstract` set,
   since those become the sidebar heading/body text directly — there's no
   local text to fall back to.
3. **Publish `MSPudhu:ChartData`** (see further down) for any feature that
   should show charts.

## Nav is just one root group + which children are submenus

`public/config/nav.json` replaces the old `datarepo.json` + `menuitems.json`
+ `Multi_DataTree.json` trio. It holds one root per top nav key (Data
Repository, Status Indicators, Conflicts, Services):

```ts
{ layer?: string, submenus?: string[], items?: NavEntry[] }
```

**Nothing here names an individual leaf layer — only which layers should
become submenus.** `layer` is a GeoServer group whose children are
auto-discovered from `GetCapabilities` at load time (see `discoverChildren`
in `src/stores/configStore.ts`). By default every discovered child becomes
a flat, clickable entry — a bundle or single feature, exactly like before.
`submenus` is an allowlist of layer names (checked at every level of the
discovered tree, so it applies recursively) that should instead expand into
a further nav submenu; everything not listed stays flat automatically, with
no frontend change needed when GeoServer's own grouping changes.

`items` adds hardcoded entries alongside whatever was discovered, for the
two things `GetCapabilities` genuinely can't produce: an external link
("INCOIS Services"), or a leaf that needs a label different from its
layer's own title ("Water Quality" reuses the plain `District_Boundary`
layer, so it can't just take that layer's own generic title). Sections with
nothing worth discovering (Conflicts, Services) skip `layer`/`submenus`
entirely and are just a flat `items` list.

Clicking a resolved leaf (an entry with `layer` but no `items`) fetches
that `layer`'s node from GetCapabilities, then:

- sets the map view to that layer's own bounding box,
- builds the Layers panel tree from its children (if it's a layer group —
  see below) and selects every one of them,
- sets the sidebar title/about from that layer's own `Title`/`Abstract`,
- and — via the existing layer-selection effect in
  `src/components/MapContainer.tsx` — automatically tries to fetch
  `chart_data` for every selected sublayer (see the "charts" section
  below).

**A leaf's `layer` can point at a single layer or a layer group.** A layer
group's children become the Layers-panel checklist for that leaf (a group
node isn't independently checkable — checking it cascades to its children,
same as today's Layers-panel behavior). Almost every existing nav item maps
to a layer group, because today's `Multi_DataTree.json` trees always bundle
a base `District_Boundary` layer with one or more topic layers — that's
exactly what a GeoServer layer group is for.

`link` opens an external URL instead of selecting a layer (no `layer`
needed on that entry) — used for "INCOIS Services".

**The water-quality buoy is a real point feature, not frontend
decoration.** The old app drew it as a static Leaflet marker with a
hardcoded lat/lng and a custom icon. Instead, publish it as an actual
GeoServer point layer (real coordinates, in the same PostGIS store as
everything else) styled via SLD with an `<ExternalGraphic>` pointing at the
buoy icon in place of a default point symbol — that's a standard WMS/SLD
pattern. Add it to `MSPudhu:District_Boundary` (or its own small group) and
it renders automatically whenever that feature is selected, with no
frontend code at all. The one thing this drops versus before is the
marker's click-to-popup — that would need `GetFeatureInfo` support, which
this app doesn't have for any layer yet, buoy or otherwise.

### Layer groups to create, with proposed names

These names are **proposals**, chosen to match the old `Multi_DataTree.json`
keys/services as closely as possible without colliding with an existing
layer's own name (e.g. "Coral Reefs" can't be named `MSPudhu:Corals` since
that's already the name of its own child layer). Rename freely — `nav.json`
is the only place that needs to agree with whatever you actually call them.

Five of these are new **nested** groups with no `Multi_DataTree.json`
counterpart at all — they only ever existed as hardcoded structure in
`datarepo.json` (or, for `MSPudhu:DataRepository`, didn't exist as a
concept at all — the frontend used to just hardcode all 8 of its children
directly). For discovery to work, each needs to be created as a GeoServer
layer group whose own members are the *other* groups from this table (e.g.
`MSPudhu:Ecology`'s members are `MSPudhu:Mangroves`, `MSPudhu:Coral_Reefs`,
etc. — GeoServer supports nesting layer groups this way), and each of the
four listed in `nav.json`'s `submenus` must be a **direct** member of
`MSPudhu:DataRepository` for it to be discovered and expanded correctly.

| nav label | proposed layer/group | should contain |
|---|---|---|
| *(Data Repository root, new, nested)* | `MSPudhu:DataRepository` | `MSPudhu:Boundaries`, `MSPudhu:Lulc`, `MSPudhu:Water_Resources`, `MSPudhu:Environment`, `MSPudhu:Ecology`, `MSPudhu:Human_Activities`, `MSPudhu:Socio_Economic`, `MSPudhu:Risk` |
| Boundaries | `MSPudhu:Boundaries` | District_Boundary, VillageBoundary, VillageNames |
| LULC | `MSPudhu:Lulc` | LULC_Pondy |
| Water Resources | `MSPudhu:Water_Resources` | District_Boundary, River, Tanks |
| Environment *(new, nested)* | `MSPudhu:Environment` | `MSPudhu:Geomorphology` |
| Geomorphology | `MSPudhu:Geomorphology` | District_Boundary, Geomorphology_Clipped |
| Ecology *(new, nested)* | `MSPudhu:Ecology` | `MSPudhu:Mangroves`, `MSPudhu:Coral_Reefs`, `MSPudhu:Biodiversity`, `MSPudhu:Sandy_Area`, `MSPudhu:Fishingzones`, `MSPudhu:Turtle` |
| Mangroves | `MSPudhu:Mangroves` | District_Boundary, Mangroves_2022 (and/or _2017, _2013) |
| Coral Reefs | `MSPudhu:Coral_Reefs` | District_Boundary, Corals |
| Biodiversity Hotspots | `MSPudhu:Biodiversity` | District_Boundary, Osudu_Lake, Biodiversity_Hotspots |
| Sandy Area | `MSPudhu:Sandy_Area` | District_Boundary, Sand_Dune, SandSpit, Sandy_Beach |
| Fish Potential Sites | `MSPudhu:Fishingzones` | District_Boundary, Potential_Fishing_Zone |
| Biological Production Hotspots | `MSPudhu:Turtle` | District_Boundary, Turtle_Nesting_Ground |
| Human Activities *(new, nested)* | `MSPudhu:Human_Activities` | `MSPudhu:Coastal_Structures`, `MSPudhu:Infrastructures`, `MSPudhu:Archeological_Sites` |
| Coastal Protection Structures | `MSPudhu:Coastal_Structures` | District_Boundary, Coastal_Protection_Structures |
| Infrastructures | `MSPudhu:Infrastructures` | District_Boundary + the infra point layers (aqueduct, anganwadi, banks, bus stations, etc. — see git history on `infra.json` for the full old list) |
| Archeological Sites | `MSPudhu:Archeological_Sites` | District_Boundary, Archeological_Site |
| Socio Economic *(new, nested)* | `MSPudhu:Socio_Economic` | `MSPudhu:Coastal_Aquaculture`, `MSPudhu:Surface_Boats`, `MSPudhu:Scuba` |
| Coastal Aquaculture | `MSPudhu:Coastal_Aquaculture` | District_Boundary, Aquaculture |
| Surface Boat Sports | `MSPudhu:Surface_Boats` | District_Boundary, Sports_Activities |
| Scuba Diving | `MSPudhu:Scuba` | District_Boundary, Scuba_Diving_Locations |
| Coastal Inundation Risk | `MSPudhu:Risk` | District_Boundary, CIRA_PY_final |
| Marine Pollution | `MSPudhu:Marine_Outfall` | (already a single real layer — no group needed) |
| Vulnerability | `MSPudhu:Vulnerability` | District_Boundary, Multi_Hazard_Line, Tsunami_Water_Level |
| Ecology vs Human Activities | `MSPudhu:Ecology_vs_Human_Activities` | District_Boundary, Mangrove_BoatingConflict, Mangrove, Crab_locations, Tourism_Activity |
| Tourism vs Shoreline | `MSPudhu:Tourism_vs_Shoreline_Group` | District_Boundary, Tourism_vs_Shoreline, Tourist_Beach_Puducherry, Beach_Resorts, Coastal_Amenities |
| Fisheries vs Tourism | `MSPudhu:Fisheries_vs_Tourism` | District_Boundary, Tourism_vs_Fisheries, Coastal_Amenities |
| Water Quality | `MSPudhu:District_Boundary` | (reuses the plain boundary layer — no group needed) |

Two files that were already unreferenced *before* this change —
`public/config/ecology.json` and `public/config/socioeconomic.json` — are
unrelated pre-existing dead config, left untouched.

## Charts are attached to selected features, not menu items

Whenever a layer with a real `service`/name (e.g. `MSPudhu:District_Boundary`,
`MSPudhu:Marine_Outfall`) gets selected — via a nav click or a Layers-panel
checkbox — the frontend automatically tries to fetch `chart_data` for that
same feature from `MSPudhu:ChartData`, and clears it again on deselection.
See the layer-selection effect in `src/components/MapContainer.tsx` and
`fetchFeatureCharts`/`loadFeatureCharts` in `src/lib/geoserver.ts` /
`src/lib/charts.ts`.

Reports from every currently-selected feature are merged into one list in
the sidebar (`sidebarOptions` in `src/stores/uiStore.ts`). When there's more
than one — either because one feature has multiple reports, or because
several features with charts are selected at once — the sidebar shows a
`<select>` picker and the user chooses which to view (see
`InfoSidebar.tsx`).

**Deciding which real feature a report belongs to is entirely a
GeoServer/content decision** — nothing in the frontend needs to change to
add, move, or remove a report. You just choose which feature's `service`
name to key its `MSPudhu:ChartData` row under. In particular:

- **Weather parameters** (Precipitation, Humidity, Airtemperature min/max,
  Cloud Cover, Pressure, Wind Speed) fit naturally as multiple reports keyed
  under `District_Boundary` — since "Water Quality" already selects that
  feature, its row's `chart_data` array can hold the weather reports *and*
  the water-quality reports side by side; the sidebar picker lets the user
  choose between them.
- **Fisheries** and **Tourism** had no distinct map feature at all in the
  old config. `Fishingzones` (Fish Potential Sites) is a natural fit for
  fisheries; tourism doesn't have an obvious existing candidate — pick
  whichever tourism-related layer makes sense (e.g. one of the tourism
  activity layers) and key its `ChartData` row there.
- **Mangroves Status** (mangrove area over time by zone) fits naturally
  under the `Mangroves` layer group above.

## Feature type to publish: `MSPudhu:ChartData`

One row per real feature type that has charts, holding an **array of
selectable reports** — each a `ChartBundle` with its own title, chapter
header, subheading, about text, and charts — as a single `jsonb` blob in a
`chart_data` column.

| attribute | type | notes |
|---|---|---|
| `chart_data` | jsonb | a `ChartBundle[]` — see shape below |
| geometry | Point | representative location for the row (not read by the frontend) |

**The primary key must equal the feature's own `service` name, with the
workspace prefix stripped** (e.g. `District_Boundary`, `Marine_Outfall`),
because the frontend fetches each row by GeoServer `featureID` built from
it — `ChartData.District_Boundary`, `ChartData.Marine_Outfall`, etc. —
rather than by CQL filter. See `fetchFeatureCharts` in
`src/lib/geoserver.ts`.

The frontend parses `chart_data` defensively — GeoServer's GeoJSON output
serializes `jsonb` either as a native nested value or as an escaped JSON
string depending on GeoServer/GeoTools version, and `fetchFeatureCharts`
handles both (see `parseJsonbField` in `src/lib/geoserver.ts`).

## `ChartBundle` shape

**The client does zero data shaping.** No grouping, sorting, aggregating, or
label lookups happen in `charts.ts`. Every chart is already shaped into
exactly what ECharts needs, and `chartType` tells the client which of its
three renderers (boxplot / bar-or-line / scatter) to use.

```
{
  title: string,           // sidebar heading
  chapterHeader?: string,  // sidebar chapter header
  subpara?: string,        // sidebar subheading
  about?: string,          // sidebar body text (can include HTML, e.g. <br/>)
  charts: ChartSpec[],
}
```

## `ChartSpec` shapes

```ts
type BoxStats = { min: number; q1: number; median: number; q3: number; max: number };
type ScatterPoint = { year: number; value: number };

type ChartSpec =
  | { chartType: 'boxplot'; title: string; xLabel: string; yLabel: string;
      categories: string[]; data: BoxStats[] }
  | { chartType: 'bar' | 'line'; title: string; xLabel: string; yLabel: string;
      categories: string[]; series: { name: string; data: number[] }[] }
  | { chartType: 'scatter'; title: string; xLabel: string; yLabel: string;
      series: { name: string; data: ScatterPoint[] }[] };
```

- `boxplot` — one box per category (e.g. one per year), each described by a
  named `BoxStats` object rather than a positional tuple. `boxplotOption` in
  `src/lib/charts.ts` translates each into the `[min, q1, median, q3, max]`
  array ECharts' own `boxplot` series requires — that ordering is ECharts'
  convention, not the wire format, so a named object keeps `chart_data`
  readable and independent of it. Used for weather parameters.
- `bar`/`line` — one or more named series sharing one `categories` axis.
  Used for fisheries/tourism/mangrove charts and the two marine-outfall
  criteria charts. Multiple series (e.g. a breakdown by category or mangrove
  zone) render with a legend; a single series doesn't.
- `scatter` — one or more named series of `ScatterPoint` values, no shared
  `categories` (the x-axis is time-based). Same reasoning as `BoxStats`:
  `scatterOption` translates each point into the positional `[x, y]` pair
  ECharts' own `scatter` series requires, rather than shipping that
  convention over the wire. Used for the water-quality DO/DIN/DIP/Chlorophyll
  charts, one spec per parameter.

## Notes

- The frontend requests `outputFormat=application/json` (GeoJSON) for chart
  data, and WMS 1.1.1 `GetCapabilities` for nav/layer discovery. No other
  output format is handled for either.
- `GetCapabilities` is fetched and parsed once per workspace per session and
  cached (see `src/lib/capabilities.ts`) — it's not re-fetched on every nav
  click or zoom-to-layer.
- Each chart request addresses one feature by `featureID` (e.g.
  `ChartData.District_Boundary`), not a CQL filter — the row's primary key
  must be the selected feature's `service` name with the workspace prefix
  stripped.
- If `MSPudhu:ChartData` isn't published yet, or a given feature has no
  matching row, that feature's selection simply contributes no reports
  rather than erroring — `fetchFeatureCharts` returns `[]` on any fetch
  failure or missing feature. Likewise, if a `nav.json` entry's `layer`
  isn't published yet, clicking it just shows that label with no map layer
  or chart, rather than erroring.
