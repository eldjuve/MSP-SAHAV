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
import { setSidebarContent, setSidebarOpen, openPanel, setNavLoading } from '../stores/uiStore';

const PUDUCHERRY_CENTER: [number, number] = [11.91, 79.78];

// Guards against a fast second click resolving before a slower first one —
// without this, clicking A then B could still end with A's (now-stale)
// layer tree/sidebar content clobbering B's once A's fetch finally resolves.
let requestId = 0;

export async function handleMenuItemClick(item: NavEntryConfig) {
  const thisRequest = ++requestId;
  clearAllWmsLayers();
  // A new click always supersedes whatever the previous one was doing —
  // reset first, so a stale spinner from a superseded click never lingers.
  setNavLoading(false);

  if (!item.layer) {
    console.warn(`Nav item "${item.label}" has no layer configured`);
    setSidebarContent({ title: item.label, chartOptions: [] });
    setSidebarOpen(true);
    return;
  }

  setNavLoading(true);
  const node = await fetchCapabilitiesNode(item.layer);
  if (thisRequest !== requestId) return; // a newer click already owns navLoading
  setNavLoading(false);
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
    // A single point feature's (or point layer group's) bounds collapse to
    // near-zero area — fitBounds would otherwise zoom in as far as Leaflet
    // allows trying to "fit" it. Cap how far a fit can zoom so a point
    // lands at a sensible street-level view instead of a blank max-zoom tile.
    map.fitBounds(node.bounds, { maxZoom: 15 });
  } else {
    setMapView(PUDUCHERRY_CENTER, 12);
  }

  // Select every real sublayer this feature has — MapContainer's
  // layer-selection effect adds each as a WMS layer and tries to fetch its
  // chart_data.
  const idsToSelect = getAllLeafNodes(tree)
    .filter((n) => n.service)
    .map((n) => n.Number);
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
