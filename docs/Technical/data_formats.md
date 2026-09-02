# GeoServer Data Formats

The frontend's navigation, map layers, legend, and chart data are all
discovered from GeoServer at runtime. `public/config/nav.json` is the only
hardcoded config file in the app, and it holds nothing but nav labels and
which GeoServer layer/layer group each one points at — everything else
(layer titles, descriptions, bounding boxes, legend classes, chart content)
comes from GeoServer itself.

This document describes what GeoServer needs to expose for the app to work,
and the exact JSON shapes it expects.

## Base configuration

`GEOSERVER_BASE_URL` in `src/stores/mapStore.ts` (override via
`VITE_GEOSERVER_URL` in `.env.local`) is a bare base URL with no workspace —
each layer's own workspace (from its `workspace:name` qualifier) is appended
per-request, via `wmsUrlForWorkspace`/`wfsUrlForWorkspace` in
`src/stores/mapStore.ts`. This lets `nav.json` span more than one GeoServer
workspace (see the `demo-geoserver` stack's second `MSPLak` workspace for an
example).

## Navigation (`nav.json`)

`public/config/nav.json` holds one root per top nav key, each a plain
`GeoServer` group name plus an optional list of children that should expand
into a further nav submenu:

```ts
{ layer: string, submenus?: string[] }
```

**Nothing here names an individual leaf layer.** Every root names a
GeoServer group; its children are auto-discovered from `GetCapabilities` at
load time (see `discoverChildren` in `src/stores/configStore.ts`). By
default every discovered child becomes a flat, clickable entry — a bundle or
single feature. `submenus` is an allowlist of layer names (checked at every
level of the discovered tree, so it applies recursively) that should instead
expand into a further nav submenu; everything not listed stays flat
automatically, with no frontend change needed when GeoServer's own grouping
changes.

Clicking a resolved leaf fetches that `layer`'s node from `GetCapabilities`,
then:

- sets the map view to that layer's own bounding box,
- builds the Layers panel tree from its children (if it's a layer group —
  see below) and selects every one of them,
- sets the sidebar title/about from that layer's own `Title`/`Abstract`,
- and — via the layer-selection effect in `src/components/MapContainer.tsx`
  — automatically tries to fetch `chart_data` for every selected sublayer
  (see "Charts" below).

**A leaf's `layer` can point at a single layer or a layer group.** A layer
group's children become the Layers-panel checklist for that leaf (a group
node isn't independently checkable — checking it cascades to its children).
Most nav items map to a layer group, bundling a boundary layer together with
one or more topic layers.

If a `nav.json` entry's `layer` isn't published yet, clicking it just shows
that label with no map layer or chart, rather than erroring.

### Layer groups

Every layer group `nav.json` (in any workspace it references) discovers
from should have a `Title` and, ideally, an `Abstract` set, since those
become the sidebar heading/body text directly — there's no local text to
fall back to. A "nested" group (one whose own members are other groups
rather than plain layers) needs each of its listed `submenus` members to be
a **direct** member of it for discovery to expand it correctly.

## Layer opacity

Layer opacity is set per layer, in each SLD, not in the frontend. Every
style's `Fill`/`Stroke` `CssParameter`s should set `fill-opacity` to `0.7`
and `stroke-opacity` to `1` — translucent fills so the basemap shows
through, crisp opaque outlines. A layer whose SLD doesn't set these renders
at GeoServer's own default (fully opaque fill).

A rule that deliberately sets some other opacity (e.g. `0`, for an
invisible helper polygon backing a label-only layer) should be left alone —
this convention is about the unset, implicitly-1.0 case, not a blanket
override.

## Point features

A point feature (e.g. a water-quality buoy) is a real GeoServer point
layer — real coordinates in the same store as everything else — styled via
SLD with an `<ExternalGraphic>` in place of a default point symbol, and
added as a member of whichever nav group should render it automatically. Its
`chart_data` is keyed off that layer's own name, same as any other feature
(see "Charts" below). A point feature has no click-to-popup — that would
need `GetFeatureInfo` support, which this app doesn't implement for any
layer.

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
name to key its `MSPudhu:ChartData` row under.

If `MSPudhu:ChartData` isn't published yet, or a given feature has no
matching row, that feature's selection simply contributes no reports rather
than erroring — `fetchFeatureCharts` returns `[]` on any fetch failure or
missing feature.

## Feature type to publish: `ChartData`

One row per real feature type that has charts, holding an **array of
selectable reports** — each a `ChartBundle` with its own title, chapter
header, subheading, about text, and charts — as a single `jsonb` blob in a
`chart_data` column.

| attribute    | type  | notes                                                    |
| ------------ | ----- | --------------------------------------------------------- |
| `chart_data` | jsonb | a `ChartBundle[]` — see shape below                        |
| geometry     | Point | representative location for the row (not read by the frontend) |

**The primary key must equal the feature's own `service` name, with the
workspace prefix stripped** (e.g. `District_Boundary`, `Marine_Outfall`),
because the frontend fetches each row by GeoServer `featureID` built from
it — `ChartData.District_Boundary`, `ChartData.Marine_Outfall`, etc. —
rather than by CQL filter. See `fetchFeatureCharts` in `src/lib/geoserver.ts`.

The frontend parses `chart_data` defensively — GeoServer's GeoJSON output
serializes `jsonb` either as a native nested value or as an escaped JSON
string depending on GeoServer/GeoTools version, and `fetchFeatureCharts`
handles both (see `parseJsonbField` in `src/lib/geoserver.ts`).

## `ChartBundle` shape

**The client does zero data shaping.** No grouping, sorting, aggregating, or
label lookups happen in `charts.ts`. Every chart is already shaped into
exactly what ECharts needs, and `chartType` tells the client which of its
three renderers (boxplot / bar-or-line / scatter) to use.

```ts
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
  readable and independent of it.
- `bar`/`line` — one or more named series sharing one `categories` axis.
  Multiple series (e.g. a breakdown by category or zone) render with a
  legend; a single series doesn't.
- `scatter` — one or more named series of `ScatterPoint` values, no shared
  `categories` (the x-axis is time-based). Same reasoning as `BoxStats`:
  `scatterOption` translates each point into the positional `[x, y]` pair
  ECharts' own `scatter` series requires, rather than shipping that
  convention over the wire.

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
- See `demo-geoserver/` for a working local stack (GeoServer + PostGIS via
  Docker Compose) that publishes real Puducherry MSP data in this shape,
  including the scripts that build it.
