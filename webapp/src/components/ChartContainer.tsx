import { onCleanup, createEffect } from 'solid-js';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

export function ChartContainer(props: { option: EChartsOption }) {
  let div!: HTMLDivElement;
  let chart: echarts.ECharts | undefined;

  // A ref is bound before effects run, so initializing lazily here — rather
  // than in onMount, with a separate createEffect for updates — keeps this
  // to one effect: no cross-effect ordering to rely on, and setOption isn't
  // called twice on the first render.
  createEffect(() => {
    if (!chart) {
      chart = echarts.init(div);
      const ro = new ResizeObserver(() => chart?.resize());
      ro.observe(div);
      onCleanup(() => {
        ro.disconnect();
        chart?.dispose();
      });
    }
    chart.setOption(props.option, true);
  });

  return <div ref={div} style="width: 100%; height: 280px;" />;
}
