import type { NavEntryConfig } from '../stores/configStore';
import {
  setLayersTree,
  setSelectedLayerIds,
  clearAllWmsLayers,
  setMapView,
  getMap,
} from '../stores/mapStore';
import { fetchCapabilitiesNode, toLayerNode } from './capabilities';
import { getAllLeafNodes } from './layerTree';
import {
  setSidebarContent,
  setSidebarOpen,
  openPanel,
} from '../stores/uiStore';

const PUDUCHERRY_CENTER: [number, number] = [11.91, 79.78];

export async function handleMenuItemClick(item: NavEntryConfig) {
  clearAllWmsLayers();

  if (!item.layer) {
    console.warn(`Nav item "${item.label}" has no layer configured`);
    setSidebarContent({ title: item.label, chartOptions: [] });
    setSidebarOpen(true);
    return;
  }

  const node = await fetchCapabilitiesNode(item.layer);
  if (!node) {
    console.warn(`GeoServer layer not found: ${item.layer}`);
    setSidebarContent({ title: item.label, chartOptions: [] });
    setSidebarOpen(true);
    return;
  }

  const tree = [toLayerNode(node)];
  setLayersTree(tree);

  const map = getMap();
  if (node.bounds && map) {
    map.fitBounds(node.bounds);
  } else {
    setMapView(PUDUCHERRY_CENTER, 12);
  }

  // Select every real sublayer this feature has — MapContainer's
  // layer-selection effect adds each as a WMS layer and tries to fetch its
  // chart_data.
  const idsToSelect = getAllLeafNodes(tree).filter(n => n.service).map(n => n.Number);
  setSelectedLayerIds(idsToSelect);
  openPanel('legend');

  // Title/about come straight from this layer's own GetCapabilities
  // Title/Abstract — there's no local per-item text to fall back to.
  setSidebarContent({
    title: node.title,
    about: node.abstract,
    chartOptions: [],
  });
  setSidebarOpen(true);
}
