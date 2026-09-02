import { getLayerName, getWorkspace, wfsUrlForWorkspace } from '../stores/mapStore';

const CHART_DATA_LOCAL_NAME = 'ChartData';

export type BoxStats = { min: number; q1: number; median: number; q3: number; max: number };
export type ScatterPoint = { year: number; value: number };

// Server-shaped, ready-to-render chart data — the client picks its renderer
// by `chartType` and does no further data shaping (grouping, sorting,
// aggregating raw rows). See ../../../docs/Technical/data_formats.md.
export type ChartSpec =
  | {
      chartType: 'boxplot';
      title: string;
      xLabel: string;
      yLabel: string;
      categories: string[];
      data: BoxStats[];
    }
  | {
      chartType: 'bar' | 'line';
      title: string;
      xLabel: string;
      yLabel: string;
      categories: string[];
      series: { name: string; data: number[] }[];
    }
  | {
      chartType: 'scatter';
      title: string;
      xLabel: string;
      yLabel: string;
      series: { name: string; data: ScatterPoint[] }[];
    };

// One selectable report: the display text plus its charts. A feature's
// `chart_data` is an array of these — when there's more than one, the
// sidebar shows a picker and the user chooses which to view (see
// InfoSidebar.tsx). Most features will only ever have one.
export type ChartBundle = {
  title: string;
  chapterHeader?: string;
  subpara?: string;
  about?: string;
  charts: ChartSpec[];
};

// GeoServer's GeoJSON output serializes jsonb columns as either a native
// nested value or an escaped JSON string, depending on GeoServer/GeoTools
// version — parse defensively so `chart_data` works either way.
function parseJsonbField<T>(value: T | string): T {
  return typeof value === 'string' ? JSON.parse(value) : value;
}

// A real map feature's chart_data is one row in that feature's own
// workspace's `ChartData` layer, addressed by featureID rather than a CQL
// filter — the primary key is the feature's own GeoServer layer name (its
// `service`, e.g. "MSPudhu:District_Boundary" or "MSPudhu:Marine_Outfall"),
// with the workspace prefix stripped. There's no separate editorial key to
// author — whoever populates a workspace's ChartData decides which real
// feature a report belongs to purely by choosing which service name to key
// it under.
export async function fetchFeatureCharts(service: string): Promise<ChartBundle[]> {
  const workspace = getWorkspace(service);
  const localName = getLayerName(service);
  const params = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeName: `${workspace}:${CHART_DATA_LOCAL_NAME}`,
    outputFormat: 'application/json',
    featureID: `${CHART_DATA_LOCAL_NAME}.${localName}`,
    propertyName: 'chart_data',
  });
  try {
    const res = await fetch(`${wfsUrlForWorkspace(workspace)}?${params}`);
    if (!res.ok) return [];
    const fc: { features?: { properties: { chart_data: ChartBundle[] | string } }[] } =
      await res.json();
    const raw = fc.features?.[0]?.properties.chart_data;
    return raw ? parseJsonbField<ChartBundle[]>(raw) : [];
  } catch (e) {
    console.error(`Error fetching chart data for "${service}"`, e);
    return [];
  }
}
