import { onMount, onCleanup, createEffect } from 'solid-js';
import {
  initMapInstance,
  destroyMapInstance,
  selectedLayerIds,
  layersTree,
  addWmsLayer,
  removeWmsLayer,
} from '../stores/mapStore';
import { findNodeByNumber } from '../lib/layerTree';
import { loadFeatureCharts } from '../lib/charts';
import { setFeatureChartOptions, clearFeatureChartOptions } from '../stores/uiStore';

export function MapContainer() {
  let mapDiv!: HTMLDivElement;
  let prevSelectedIds: string[] = [];

  onMount(() => {
    initMapInstance(mapDiv);
  });
  onCleanup(() => {
    destroyMapInstance();
  });

  createEffect(() => {
    const current = selectedLayerIds();
    const tree = layersTree();

    const toRemove = prevSelectedIds.filter((id) => !current.includes(id));
    const toAdd = current.filter((id) => !prevSelectedIds.includes(id));

    toRemove.forEach((id) => {
      removeWmsLayer(id);
      clearFeatureChartOptions(id);
    });
    toAdd.forEach((id) => {
      const node = findNodeByNumber(tree, id);
      if (!node?.service) return;
      addWmsLayer(id, node.service, node.Name);
      // Any selected feature may expose chart_data — try it and ignore a
      // miss. Guard against the layer having been deselected again before
      // this resolves.
      loadFeatureCharts(node.service).then((reports) => {
        if (selectedLayerIds().includes(id)) setFeatureChartOptions(id, reports);
      });
    });

    prevSelectedIds = [...current];
  });

  return <div ref={mapDiv} class="absolute inset-0 isolate" />;
}
