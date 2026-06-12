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

export const [activePanel, setActivePanel] = createSignal<ActivePanel>(null);
export const [sidebarOpen, setSidebarOpen] = createSignal(false);
export const [sidebarContent, setSidebarContent] = createSignal<SidebarContent | null>(null);

export function togglePanel(panel: NonNullable<ActivePanel>) {
  setActivePanel(p => (p === panel ? null : panel));
}

export function openPanel(panel: NonNullable<ActivePanel>) {
  setActivePanel(panel);
}

export function closePanel() {
  setActivePanel(null);
}
