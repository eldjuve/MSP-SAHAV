import { onMount, onCleanup, createEffect } from 'solid-js';
import {
  initMapInstance,
  selectedLayerIds,
  layersTree,
  addWmsLayer,
  removeWmsLayer,
  legendEntries,
} from '../stores/mapStore';
import { findNodeByNumber } from '../lib/layerTree';

export function MapContainer() {
  let mapDiv!: HTMLDivElement;
  let prevSelectedIds: string[] = [];

  onMount(() => {
    initMapInstance(mapDiv);
  });

  createEffect(() => {
    const current = selectedLayerIds();
    const tree = layersTree();

    const toRemove = prevSelectedIds.filter(id => !current.includes(id));
    const toAdd = current.filter(id => !prevSelectedIds.includes(id));

    toRemove.forEach(id => removeWmsLayer(id));
    toAdd.forEach(id => {
      const node = findNodeByNumber(tree, id);
      if (node?.service) addWmsLayer(id, node.service, node.Name);
    });

    prevSelectedIds = [...current];
  });

  return <div ref={mapDiv} class="absolute inset-0 -z-1" />
}
