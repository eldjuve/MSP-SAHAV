import type { EChartsOption } from 'echarts';

type BoxRow = { category: string; [key: string]: { min: number; q1: number; median: number; q3: number; max: number } | string };
type SeriesRow = { name: string; data: number[]; categories?: string[] };

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function boxplotOption(
  categories: string[],
  data: [number, number, number, number, number][],
  title: string,
  yName: string,
): EChartsOption {
  return {
    title: { text: title, textStyle: { fontSize: 13 } },
    tooltip: {
      trigger: 'item',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (p: any) =>
        `Year: ${p.name}<br/>Max: ${p.data[4]}<br/>Q3: ${p.data[3]}<br/>Median: ${p.data[2]}<br/>Q1: ${p.data[1]}<br/>Min: ${p.data[0]}`,
    },
    xAxis: { type: 'category', data: categories, name: 'Year' },
    yAxis: { type: 'value', name: yName },
    series: [{ type: 'boxplot', data }],
    grid: { containLabel: true, left: 16, right: 16, top: 48, bottom: 40 },
  };
}

function columnOption(
  series: SeriesRow[],
  title: string,
  xTitle: string,
  yTitle: string,
  type: 'bar' | 'line' = 'bar',
): EChartsOption {
  const categories = series[0]?.categories ?? series[0]?.data.map((_, i) => String(i)) ?? [];
  return {
    title: { text: title, textStyle: { fontSize: 13 } },
    tooltip: { trigger: 'axis' },
    legend: { show: series.length > 1 },
    xAxis: { type: 'category', data: categories, name: xTitle },
    yAxis: { type: 'value', name: yTitle },
    series: series.map(s => ({ name: s.name, type, data: s.data })),
    grid: { containLabel: true, left: 16, right: 16, top: 48, bottom: 40 },
  };
}

function scatterOption(
  series: { name: string; data: [number, number][] }[],
  title: string,
  xTitle: string,
  yTitle: string,
): EChartsOption {
  return {
    title: { text: title, textStyle: { fontSize: 13 } },
    tooltip: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (p: any) =>
        `${p.seriesName}<br/>${new Date(p.data[0]).getFullYear()}: ${Number(p.data[1]).toFixed(2)}`,
    },
    xAxis: {
      type: 'time',
      name: xTitle,
      axisLabel: { formatter: '{yyyy}' },
    },
    yAxis: { type: 'value', name: yTitle },
    series: series.map(s => ({ name: s.name, type: 'scatter', data: s.data })),
    grid: { containLabel: true, left: 16, right: 16, top: 48, bottom: 40 },
  };
}

async function buildBoxplotCharts(file: string, dataKey: string, title: string, yLabel: string): Promise<EChartsOption[]> {
  const raw = await fetchJson<BoxRow[]>(file);
  if (!raw) return [];
  const categories = raw.map(e => String(e.category));
  const data = raw.map(e => {
    const d = e[dataKey] as { min: number; q1: number; median: number; q3: number; max: number };
    return [d.min, d.q1, d.median, d.q3, d.max] as [number, number, number, number, number];
  });
  return [boxplotOption(categories, data, title, yLabel)];
}

const WEATHER_CFG: Record<string, { file: string; key: string; yLabel: string; chartTitle: string }> = {
  'Precipitation': { file: '/chart_data/precipitation.json', key: 'precipitation', yLabel: 'Precipitation (mm)', chartTitle: 'Total Rainfall (mm)' },
  'Humidity': { file: '/chart_data/humidity.json', key: 'humidity', yLabel: 'Humidity (%)', chartTitle: 'Humidity' },
  'Airtemperature': { file: '/chart_data/min_temperature.json', key: 'mintemperature', yLabel: 'Degrees (°C)', chartTitle: 'Mean Min Temperature' },
  'Wind Speed': { file: '/chart_data/windspeed.json', key: 'windspeed', yLabel: 'm/s', chartTitle: 'Wind Speed' },
  'Pressure': { file: '/chart_data/pressure.json', key: 'pressure', yLabel: 'Pressure (hpa)', chartTitle: 'Pressure' },
  'Cloud Cover': { file: '/chart_data/total_cloud_cover.json', key: 'cloudcover', yLabel: 'Cloud Cover', chartTitle: 'Total Cloud Cover' },
};

export async function loadWeatherCharts(title: string): Promise<EChartsOption[]> {
  const cfg = WEATHER_CFG[title];
  if (!cfg) return [];
  const opts = await buildBoxplotCharts(cfg.file, cfg.key, cfg.chartTitle, cfg.yLabel);
  if (title === 'Airtemperature') {
    const maxOpts = await buildBoxplotCharts(
      '/chart_data/max_temperature.json', 'maxtemperature', 'Mean Max Temperature', 'Degrees (°C)',
    );
    return [...opts, ...maxOpts];
  }
  return opts;
}

export async function loadFisheriesCharts(): Promise<EChartsOption[]> {
  const [revenue, landing, folk] = await Promise.all([
    fetchJson<SeriesRow>('/chart_data/fishermen_revenue.json'),
    fetchJson<SeriesRow>('/chart_data/fish_landing.json'),
    fetchJson<SeriesRow[]>('/chart_data/fishermen.json'),
  ]);
  const opts: EChartsOption[] = [];
  if (revenue) opts.push(columnOption([revenue], 'Fisheries Revenue in Crore', 'Year', 'Revenue in Crores', 'line'));
  if (landing) opts.push(columnOption([landing], 'Fish Landing in Tons', 'Year', 'Fish Landing in Tons', 'line'));
  if (folk) opts.push(columnOption(folk, 'Active Fisher Folk in Puducherry UT', 'Year', 'No. of Fishermen'));
  return opts;
}

export async function loadTourismCharts(): Promise<EChartsOption[]> {
  const [stats, revenue, resorts] = await Promise.all([
    fetchJson<SeriesRow[]>('/chart_data/tourism_statistics.json'),
    fetchJson<SeriesRow[]>('/chart_data/tourism_revenue.json'),
    fetchJson<SeriesRow[]>('/chart_data/tourism_resort_count.json'),
  ]);
  const opts: EChartsOption[] = [];
  if (stats) opts.push(columnOption(stats, 'Tourism Statistics Puducherry', 'Year', 'No. of Tourists'));
  if (revenue) opts.push(columnOption(revenue, 'Tourism Revenue (INR mn)', 'Year', 'Revenue (INR Mn)'));
  if (resorts) opts.push(columnOption(resorts, 'Puducherry Resorts Count', 'Year', 'No. of Resorts'));
  return opts;
}

export async function loadMangroveCharts(): Promise<EChartsOption[]> {
  const data = await fetchJson<(SeriesRow & { categories: string[] })[]>('/chart_data/mangroves_area_hectars.json');
  if (!data) return [];
  return [columnOption(data, 'Mangroves', 'Year', 'Area in Hectares', 'line')];
}

export async function loadMarineOutfallCharts(): Promise<EChartsOption[]> {
  const [sw3, sw5] = await Promise.all([
    fetchJson<(SeriesRow & { categories: string[] })[]>('/chart_data/water_quality_sw3.json'),
    fetchJson<(SeriesRow & { categories: string[] })[]>('/chart_data/water_quality_sw5.json'),
  ]);
  const opts: EChartsOption[] = [];
  if (sw3) opts.push(columnOption(sw3, 'Primary Water Quality Criteria for Class SW-III Waters', 'Elements', 'Units (µg/l)'));
  if (sw5) opts.push(columnOption(sw5, 'Primary Water Quality Criteria for Class SW-V Waters', 'Elements', 'Units (µg/l)'));
  return opts;
}

export async function loadWaterQualityCharts(): Promise<EChartsOption[]> {
  const [status, chlorophyll] = await Promise.all([
    fetchJson<Record<string, unknown>[]>('/chart_data/water_quality_status.json'),
    fetchJson<Record<string, unknown>[]>('/chart_data/water_quality_chlorophyll.json'),
  ]);
  if (!status && !chlorophyll) return [];

  const combined = [...(status ?? []), ...(chlorophyll ?? [])];
  const paramDetails: Record<string, { name: string; unit: string }> = {
    DO: { name: 'Dissolved Oxygen', unit: 'mg/l' },
    DIN: { name: 'Dissolved Inorganic Nitrogen', unit: 'µmol/l' },
    DIP: { name: 'Dissolved Inorganic Phosphate', unit: 'µmol/l' },
    Chlorophyll: { name: 'Chlorophyll', unit: 'µg/l' },
  };
  const params = [...new Set(combined.flatMap(Object.keys))].filter(
    k => k !== 'year' && k !== 'zone' && k !== 'source',
  );
  return params.map(param => {
    const data = combined
      .filter(e => e[param] !== undefined)
      .map(e => [e.year as number, parseFloat(String(e[param]))] as [number, number]);
    const info = paramDetails[param] ?? { name: param, unit: 'units' };
    return scatterOption([{ name: info.name, data }], info.name, 'Year', info.unit);
  });
}

export async function resolveChartOptions(fnName: string, title: string): Promise<EChartsOption[]> {
  switch (fnName) {
    case 'loadWeather': return loadWeatherCharts(title);
    case 'loadWaterquality': return loadWaterQualityCharts();
    case 'loadMangrovesStatus': return loadMangroveCharts();
    case 'loadfisheries': return loadFisheriesCharts();
    case 'loadtourism': return loadTourismCharts();
    case 'loadMarineOutfall': return loadMarineOutfallCharts();
    default: return [];
  }
}
