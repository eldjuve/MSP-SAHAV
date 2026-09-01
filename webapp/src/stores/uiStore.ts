import { createSignal } from 'solid-js';
import type { EChartsOption } from 'echarts';

export type ActivePanel = 'layers' | 'legend' | 'basemaps' | null;

export interface SidebarContent {
  title: string;
  chapterHeader?: string;
  subpara?: string;
  about?: string;
  chartOptions: EChartsOption[];
}

// A report sourced from a feature's chart_data, tagged so it can be told
// apart from other kinds of sidebar content (e.g. the main feature's own
// title/about) when assembling what the dropdown picker offers.
export interface ChartReportContent extends SidebarContent {
  type: 'chart';
}

export const [activePanel, setActivePanel] = createSignal<ActivePanel>(null);
export const [sidebarOpen, setSidebarOpen] = createSignal(false);

// The current menu item's own static text, if it has any (some menu items
// exist purely to select a map feature and have none). Always shown above
// the chart picker, never itself an option in it.
export const [mainContent, setMainContentRaw] = createSignal<SidebarContent | null>(null);

// Reports discovered from currently-selected map features' chart_data,
// keyed by layer id so they can be added/removed as layers are
// (de)selected — see the layer-selection effect in MapContainer.tsx.
const [featureCharts, setFeatureChartsRaw] = createSignal<Record<string, ChartReportContent[]>>({});

// Every selected feature's reports, filtered down to actual chart_data
// entries — this (not the main feature's own text) is what the sidebar
// picker offers. It shows a picker whenever there's more than one.
export const chartReportOptions = () =>
  Object.values(featureCharts()).flat().filter(r => r.type === 'chart');

export const [selectedChartIndex, setSelectedChartIndex] = createSignal(0);

export function setSidebarContent(content: SidebarContent | null) {
  setMainContentRaw(content);
  setSelectedChartIndex(0);
}

export function setFeatureChartOptions(layerId: string, reports: ChartReportContent[]) {
  setFeatureChartsRaw(prev => {
    if (!reports.length) {
      if (!(layerId in prev)) return prev;
      const next = { ...prev };
      delete next[layerId];
      return next;
    }
    return { ...prev, [layerId]: reports };
  });
}

export function clearFeatureChartOptions(layerId: string) {
  setFeatureChartOptions(layerId, []);
}

export function togglePanel(panel: NonNullable<ActivePanel>) {
  setActivePanel(p => (p === panel ? null : panel));
}

export function openPanel(panel: NonNullable<ActivePanel>) {
  setActivePanel(panel);
}

export function closePanel() {
  setActivePanel(null);
}
