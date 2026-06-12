import { onMount, onCleanup, createEffect } from 'solid-js';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

export function ChartContainer(props: { option: EChartsOption }) {
  let div!: HTMLDivElement;
  let chart: echarts.ECharts | undefined;

  onMount(() => {
    chart = echarts.init(div);
    chart.setOption(props.option);
    const ro = new ResizeObserver(() => chart?.resize());
    ro.observe(div);
    onCleanup(() => ro.disconnect());
  });

  createEffect(() => {
    if (chart) chart.setOption(props.option, true);
  });

  onCleanup(() => {
    if (chart) echarts.dispose(div);
  });

  return <div ref={div} style="width: 100%; height: 280px;" />;
}
