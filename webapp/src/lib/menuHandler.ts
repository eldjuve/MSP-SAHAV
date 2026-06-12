import { configState } from '../stores/configStore';
import {
  setLayersTree,
  setSelectedLayerIds,
  clearAllWmsLayers,
  clearExtraLayers,
  addWmsLayer,
  addExtraLayer,
  setMapView,
} from '../stores/mapStore';
import { findNodeByNumber } from './layerTree';
import { resolveChartOptions } from './charts';
import {
  setSidebarContent,
  setSidebarOpen,
  openPanel,
} from '../stores/uiStore';
import L from 'leaflet';

async function loadLayerTree(jsonpath: string): Promise<import('../stores/configStore').LayerNode[] | null> {
  if (jsonpath.includes('Multi_DataTree.json') || !jsonpath) return null;
  try {
    const res = await fetch(`/config/${jsonpath}`);
    return res.json();
  } catch {
    return null;
  }
}

export async function handleMenuItemClick(itemName: string) {
  const config = configState.menuitems[itemName];
  if (!config) {
    console.warn(`No config found for: ${itemName}`);
    return;
  }

  // Handle redirect-only items
  if (config.otherfunctions?.name === 'redirectToServiceLinks') {
    if (config.title.includes('INCOIS')) {
      window.open('https://incois.gov.in/portal/stormsurge/webgis.jsp', '_blank');
    }
    return;
  }

  // Clear previous state
  clearAllWmsLayers();
  clearExtraLayers();

  // Resolve the layer tree
  let tree = configState.allLayerInfo[config.key] ?? null;
  if (!tree) {
    const loaded = await loadLayerTree(config.jsonpath);
    if (loaded) tree = loaded;
  }

  if (tree) {
    setLayersTree(tree);
  }

  // Update map view
  const center: [number, number] =
    Array.isArray(config.center) && config.center.length === 2
      ? config.center
      : [11.91, 79.78];
  setMapView(center, config.zoom ?? 12);

  // Pre-select configured layers
  if (tree && config.data?.length) {
    const idsToSelect = config.data.filter(id =>
      findNodeByNumber(tree!, id) !== null,
    );
    setSelectedLayerIds(idsToSelect);
    idsToSelect.forEach(id => {
      const node = findNodeByNumber(tree!, id);
      if (node?.service) addWmsLayer(id, node.service, node.Name);
    });
    openPanel('legend');
  }

  // Add buoy marker for water quality
  if (config.otherfunctions?.name === 'loadWaterquality') {
    const icon = L.icon({ iconUrl: '/img/buoy.png', iconSize: [45, 60] });
    const marker = L.marker([11.919712, 79.846512], { icon });
    marker.bindPopup('Puducherry Buoy');
    addExtraLayer(marker);
  }

  // Load charts
  let chartOptions: import('echarts').EChartsOption[] = [];
  if (config.otherfunctions?.name) {
    chartOptions = await resolveChartOptions(config.otherfunctions.name, config.title);
  }

  // Update info sidebar
  setSidebarContent({
    title: config.title,
    chapterHeader: config.chapterheader,
    subpara: config.subpara,
    about: config.about,
    chartOptions,
  });
  setSidebarOpen(true);
}
