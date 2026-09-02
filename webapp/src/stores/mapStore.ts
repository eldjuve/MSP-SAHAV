import { createSignal } from 'solid-js';
import L from 'leaflet';

export type BasemapType = 'satellite' | 'imagery' | 'topo';
export type LegendEntry = { layerId: string; service: string; name: string };

// Override via VITE_GEOSERVER_URL in .env.local to point at the demo
// GeoServer (see demo-geoserver/README.md — docker compose up in
// demo-geoserver/) or any other instance without editing source. No
// workspace here — every layer/feature is qualified as "workspace:name",
// so the workspace is always resolved per-layer via wmsUrlForWorkspace /
// wfsUrlForWorkspace below, which lets nav.json span multiple workspaces.
export const GEOSERVER_BASE_URL =
  import.meta.env.VITE_GEOSERVER_URL ?? 'https://yourdomain.in/geoserver';

// Pinned everywhere a WMS request is made (here, capabilities.ts, legend.ts)
// rather than left to each caller's/Leaflet's own default: WMS 1.3.0 swaps
// EPSG:4326's axis order to lat/lon, which would silently break every
// bbox this app builds in lon/lat order. Bump this only alongside an audit
// of every bbox-building call site.
export const WMS_VERSION = '1.1.1';

export const [basemap, setBasemap] = createSignal<BasemapType>(
  (sessionStorage.getItem('basemap') as BasemapType | null) ?? 'imagery',
);
export const [layersTree, setLayersTree] = createSignal<
  import('../stores/configStore').LayerNode[]
>([]);
export const [selectedLayerIds, setSelectedLayerIds] = createSignal<string[]>([]);
export const [legendEntries, setLegendEntries] = createSignal<LegendEntry[]>([]);

let _map: L.Map | null = null;
let _basemapLayer: L.TileLayer | null = null;
const _addedLayers: Record<string, L.TileLayer.WMS> = {};

export function getMap() {
  return _map;
}

const BASEMAP_TILES: Record<BasemapType, () => L.TileLayer> = {
  // Pulls Google's raw tile server directly rather than through the
  // official Maps JS API/embed — outside Google's terms of service for
  // programmatic tile access (inherited from the pre-rewrite app, not
  // introduced here). Attributed regardless; swap for a licensed satellite
  // source (Esri's World_Imagery is already used below for "imagery") if
  // this app is ever meant for production use beyond an internal demo.
  satellite: () =>
    L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 22,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google',
    }),
  imagery: () =>
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: '&copy; <a href="http://www.esri.com/">Esri</a>, ESRI', maxZoom: 20 },
    ),
  topo: () =>
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      { attribution: '&copy; <a href="http://www.esri.com/">Esri</a>, ESRI', maxZoom: 20 },
    ),
};

export function initMapInstance(el: HTMLDivElement) {
  destroyMapInstance();
  _map = L.map(el, { zoomControl: false, zoomSnap: 0, zoomDelta: 0.25 }).setView([11.96, 79.8], 9);
  L.control.zoom({ position: 'bottomright' }).addTo(_map);
  applyBasemap(basemap());

  // Leaflet only listens for window resize events, so a CSS-driven resize
  // of its own container (e.g. the info sidebar pushing the map narrower)
  // leaves tiles rendering offset/torn until this fires invalidateSize.
  const map = _map;
  const resizeObserver = new ResizeObserver(() => map.invalidateSize());
  resizeObserver.observe(el);
  map.on('unload', () => resizeObserver.disconnect());
}

// Shared by initMapInstance (tearing down a previous instance before
// creating the next) and MapContainer's onCleanup (unmount) — keeping both
// paths in one place means getMap() never hands back a removed map.
export function destroyMapInstance() {
  if (!_map) return;
  _map.off();
  _map.remove();
  _map = null;
}

export function applyBasemap(type: BasemapType) {
  if (!_map) return;
  if (_basemapLayer) _map.removeLayer(_basemapLayer);
  _basemapLayer = BASEMAP_TILES[type]();
  _basemapLayer.addTo(_map);
  sessionStorage.setItem('basemap', type);
}

export function changeBasemap(type: BasemapType) {
  setBasemap(type);
  applyBasemap(type);
}

export function addWmsLayer(layerId: string, service: string, name: string) {
  if (!_map || _addedLayers[layerId]) return;
  // Each layer's own SLD bakes in its fill/stroke opacity (fill-opacity
  // 0.7, stroke-opacity 1 — see ../../GEOSERVER_CHANGES.md), so the
  // rendered PNG's own alpha channel is already correct at full tile
  // opacity.
  const layer = L.tileLayer.wms(wmsUrlForWorkspace(getWorkspace(service)), {
    layers: service,
    format: 'image/png',
    transparent: true,
    version: WMS_VERSION,
  });
  layer.addTo(_map);
  _addedLayers[layerId] = layer;

  setLegendEntries((prev) => [...prev, { layerId, service, name }]);
}

export function removeWmsLayer(layerId: string) {
  if (!_map || !_addedLayers[layerId]) return;
  _map.removeLayer(_addedLayers[layerId]);
  delete _addedLayers[layerId];
  setLegendEntries((prev) => prev.filter((e) => e.layerId !== layerId));
}

export function clearAllWmsLayers() {
  if (!_map) return;
  Object.keys(_addedLayers).forEach((id) => {
    _map!.removeLayer(_addedLayers[id]);
    delete _addedLayers[id];
  });
  setLegendEntries([]);
  setSelectedLayerIds([]);
}

export function setMapView(center: [number, number], zoom: number) {
  _map?.setView(new L.LatLng(center[0], center[1]), zoom);
}

// Local layer name (without the "workspace:" prefix) and workspace prefix —
// GeoServer's WMS capabilities and its GeoJSON featureID scheme both
// address layers by local name. See src/lib/capabilities.ts, which owns
// fetching/parsing GetCapabilities itself (zoomToLayer included).
export function getLayerName(service: string): string {
  return service.replace(/^[^:]+:/, '');
}

export function getWorkspace(service: string): string {
  return service.match(/^([^:]+):/)?.[1] ?? '';
}

export function wmsUrlForWorkspace(workspace: string): string {
  return `${GEOSERVER_BASE_URL}/${workspace}/wms`;
}

export function wfsUrlForWorkspace(workspace: string): string {
  return `${GEOSERVER_BASE_URL}/${workspace}/wfs`;
}
