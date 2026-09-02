import type { EChartsOption } from 'echarts';
import { fetchFeatureCharts, type ChartBundle, type ChartSpec } from './geoserver';

function boxplotOption(spec: Extract<ChartSpec, { chartType: 'boxplot' }>): EChartsOption {
  return {
    title: { text: spec.title, textStyle: { fontSize: 13 } },
    tooltip: {
      trigger: 'item',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (p: any) =>
        `${spec.xLabel}: ${p.name}<br/>Max: ${p.data[4]}<br/>Q3: ${p.data[3]}<br/>Median: ${p.data[2]}<br/>Q1: ${p.data[1]}<br/>Min: ${p.data[0]}`,
    },
    xAxis: { type: 'category', data: spec.categories, name: spec.xLabel },
    yAxis: { type: 'value', name: spec.yLabel },
    // ECharts' boxplot series requires each point as a positional
    // [min, q1, median, q3, max] tuple — translate our named stats into
    // that shape here rather than baking ECharts' convention into the data.
    series: [{ type: 'boxplot', data: spec.data.map((b) => [b.min, b.q1, b.median, b.q3, b.max]) }],
    grid: { containLabel: true, left: 16, right: 16, top: 48, bottom: 40 },
  };
}

function columnOption(spec: Extract<ChartSpec, { chartType: 'bar' | 'line' }>): EChartsOption {
  return {
    title: { text: spec.title, textStyle: { fontSize: 13 } },
    tooltip: { trigger: 'axis' },
    legend: { show: spec.series.length > 1 },
    xAxis: { type: 'category', data: spec.categories, name: spec.xLabel },
    yAxis: { type: 'value', name: spec.yLabel },
    series: spec.series.map((s) => ({ name: s.name, type: spec.chartType, data: s.data })),
    grid: { containLabel: true, left: 16, right: 16, top: 48, bottom: 40 },
  };
}

function scatterOption(spec: Extract<ChartSpec, { chartType: 'scatter' }>): EChartsOption {
  return {
    title: { text: spec.title, textStyle: { fontSize: 13 } },
    tooltip: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (p: any) =>
        `${p.seriesName}<br/>${new Date(p.data[0]).getFullYear()}: ${Number(p.data[1]).toFixed(2)}`,
    },
    xAxis: {
      type: 'time',
      name: spec.xLabel,
      axisLabel: { formatter: '{yyyy}' },
    },
    yAxis: { type: 'value', name: spec.yLabel },
    // ECharts' scatter series requires each point as a positional [x, y]
    // pair — translate our named points into that shape here rather than
    // baking ECharts' convention into the data.
    series: spec.series.map((s) => ({
      name: s.name,
      type: 'scatter',
      data: s.data.map((p) => [p.year, p.value]),
    })),
    grid: { containLabel: true, left: 16, right: 16, top: 48, bottom: 40 },
  };
}

function toOption(spec: ChartSpec): EChartsOption {
  switch (spec.chartType) {
    case 'boxplot':
      return boxplotOption(spec);
    case 'bar':
    case 'line':
      return columnOption(spec);
    case 'scatter':
      return scatterOption(spec);
  }
}

export type ChartContent = {
  type: 'chart';
  title: string;
  chapterHeader?: string;
  subpara?: string;
  about?: string;
  chartOptions: EChartsOption[];
};

function toChartContent(bundle: ChartBundle): ChartContent {
  const { charts, ...meta } = bundle;
  return { ...meta, type: 'chart', chartOptions: charts.map(toOption) };
}

// One entry per selectable report for this map feature — the caller (the
// sidebar) shows a picker when there's more than one.
export async function loadFeatureCharts(service: string): Promise<ChartContent[]> {
  const bundles = await fetchFeatureCharts(service);
  return bundles.map(toChartContent);
}
