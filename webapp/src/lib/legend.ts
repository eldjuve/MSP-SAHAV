import { getWorkspace, wmsUrlForWorkspace, WMS_VERSION } from '../stores/mapStore';

export type LegendSwatch =
  | { kind: 'polygon'; fill: string; stroke: string }
  | { kind: 'line'; stroke: string }
  | { kind: 'point'; fill: string; stroke: string };

// One classification row in a layer's legend, sourced from GetLegendGraphic's
// JSON output — a standard core WMS format, not a plugin.
export type LegendClass = { title?: string; swatch: LegendSwatch };

type RawPointGraphic = { fill?: string; stroke?: string };
type RawSymbolizer =
  | { Polygon: { fill?: string; stroke?: string } }
  | { Line: { stroke?: string } }
  | { Point: { graphics?: RawPointGraphic[] } }
  | { Text: unknown };

type RawRule = { name?: string; title?: string; symbolizers?: RawSymbolizer[] };
type RawLegendResponse = { Legend?: { rules?: RawRule[] }[] };

// A rule's symbolizers are tried in this order — Text-only rules (e.g. a
// river's label-placement rule alongside its line rule) carry no visual
// swatch of their own and are skipped entirely.
function toSwatch(symbolizers: RawSymbolizer[] | undefined): LegendSwatch | null {
  for (const s of symbolizers ?? []) {
    if ('Polygon' in s) {
      return { kind: 'polygon', fill: s.Polygon.fill ?? 'transparent', stroke: s.Polygon.stroke ?? '#666' };
    }
    if ('Point' in s) {
      // A point styled with a custom icon (e.g. an SVG pin) lists the icon
      // graphic first and a synthetic vector "mark" (fill/stroke) second, as
      // a fallback for clients that can't render external graphics. The
      // icon itself isn't usable here — GeoServer only serves it from its
      // REST API, which requires admin credentials — so use the mark.
      const mark = s.Point.graphics?.find(g => g.fill) ?? s.Point.graphics?.[0];
      return { kind: 'point', fill: mark?.fill ?? 'transparent', stroke: mark?.stroke ?? '#666' };
    }
    if ('Line' in s) {
      return { kind: 'line', stroke: s.Line.stroke ?? '#666' };
    }
  }
  return null;
}

// GeoServer names an unclassified single-rule style "Single symbol" when
// its SLD gives the rule no title of its own — not a real class label, so
// it's dropped rather than shown verbatim.
function ruleTitle(rule: RawRule): string | undefined {
  if (rule.title) return rule.title;
  if (rule.name && rule.name !== 'Single symbol') return rule.name;
  return undefined;
}

const _cache = new Map<string, Promise<LegendClass[]>>();

export function fetchLegendClasses(service: string): Promise<LegendClass[]> {
  const cached = _cache.get(service);
  if (cached) return cached;
  const promise = (async () => {
    const params = new URLSearchParams({
      service: 'WMS', version: WMS_VERSION, request: 'GetLegendGraphic',
      format: 'application/json', layer: service,
    });
    try {
      const res = await fetch(`${wmsUrlForWorkspace(getWorkspace(service))}?${params}`);
      const data: RawLegendResponse = await res.json();
      const rules = data.Legend?.[0]?.rules ?? [];
      return rules
        .map((rule): LegendClass | null => {
          const swatch = toSwatch(rule.symbolizers);
          return swatch ? { title: ruleTitle(rule), swatch } : null;
        })
        .filter((c): c is LegendClass => c !== null);
    } catch (e) {
      console.error(`Error fetching legend classes for "${service}"`, e);
      _cache.delete(service);
      return [];
    }
  })();
  _cache.set(service, promise);
  return promise;
}
