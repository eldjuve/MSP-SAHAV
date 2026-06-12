import { createSignal } from 'solid-js';
import L from 'leaflet';

export type BasemapType = 'satellite' | 'imagery' | 'topo';
export type LegendEntry = { layerId: string; service: string; name: string; custom: boolean };

export const LAYERS_WITH_CUSTOM_LEGENDS = new Set([
  'lulc', 'geomorph', 'biohotspots', 'cps', 'vuln', 'coastameni', 'TvsS', 'TvsF', 'mof',
]);

const LAYERS_NOT_TRANSPARENT = new Set([
  'MSPudhu:Marine_Outfall', 'MSPudhu:VillageNames', 'MSPudhu:Tourism_Activity',
  'MSPudhu:Crab_locations', 'MSPudhu:Archeological_Site', 'MSPudhu:Coastal_Protection_Structures',
  'MSPudhu:CRZ', 'MSPudhu:Rock_Revetment_points', 'MSPudhu:Groynes', 'MSPudhu:Lighthouse',
  'MSPudhu:Jetty or Breakwater', 'MSPudhu:Placenames', 'MSPudhu:Port', 'MSPudhu:Port Area',
  'MSPudhu:Railway Line', 'MSPudhu:Lines', 'MSPudhu:Points', 'MSPudhu:SurveyPlotNumbers',
  'MSPudhu:Road', 'MSPudhu:Hazard_Line', 'MSPudhu:Multi_Hazard_Line',
  'MSPudhu:Government_Quarter', 'MSPudhu:Govt_Office', 'MSPudhu:Grave', 'MSPudhu:Dams',
  'MSPudhu:Park_Area', 'MSPudhu:Bus_Stations', 'MSPudhu:Banks', 'MSPudhu:Major_Road_Network',
  'MSPudhu:Major_Landmarks', 'MSPudhu:Power_Mainline', 'MSPudhu:Open_Drain',
  'MSPudhu:Religious_Place', 'MSPudhu:Pump_House_Area', 'MSPudhu:Playground_Area',
  'MSPudhu:Rail_Culvert', 'MSPudhu:Railway_Station', 'MSPudhu:Police_Stations',
  'MSPudhu:Road_Bridges', 'MSPudhu:Veterinary_Hospitals', 'MSPudhu:Stadium_Locations',
  'MSPudhu:Substation_Locations', 'MSPudhu:Traffic_Signal_Locations',
  'MSPudhu:Under_water_cable-UT_Pondy', 'MSPudhu:Underwater_Cable-Under_Construction',
  'MSPudhu:Bathymetry_10m', 'MSPudhu:Sandy_Beach', 'MSPudhu:Sandy_Spit', 'MSPudhu:River',
  'MSPudhu:District_Boundary', 'MSPudhu:Corals', 'MSPudhu:Biodiversity_Hotspots',
  'MSPudhu:Turtle_Nesting_Ground', 'MSPudhu:Tourism_Boating', 'MSPudhu:Tourist_Beach_Puducherry',
  'MSPudhu:Beach_Resorts', 'MSPudhu:Coastal_Amenities', 'MSPudhu:Scuba_Diving_Locations',
  'MSPudhu:Sports_Activities', 'MSPudhu:Sand_Dune', 'MSPudhu:SandSpit',
]);

export const GEOSERVER_URL = 'https://yourdomain.in/geoserver/MSPudhu/wms';
export const LEGEND_BASE_URL =
  `${GEOSERVER_URL}?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=`;

export const [basemap, setBasemap] = createSignal<BasemapType>(
  (sessionStorage.getItem('basemap') as BasemapType | null) ?? 'imagery',
);
export const [layersTree, setLayersTree] = createSignal<import('../stores/configStore').LayerNode[]>([]);
export const [selectedLayerIds, setSelectedLayerIds] = createSignal<string[]>([]);
export const [legendEntries, setLegendEntries] = createSignal<LegendEntry[]>([]);

let _map: L.Map | null = null;
let _basemapLayer: L.TileLayer | null = null;
const _addedLayers: Record<string, L.TileLayer.WMS> = {};
let _extraLayers: L.Layer[] = [];

export function getMap() { return _map; }

const BASEMAP_TILES: Record<BasemapType, () => L.TileLayer> = {
  satellite: () =>
    L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 22,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
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
  if (_map) { _map.off(); _map.remove(); }
  _map = L.map(el, { zoomControl: false, zoomSnap: 0, zoomDelta: 0.25 }).setView(
    [11.96, 79.8],
    9,
  );
  L.control.zoom({ position: 'bottomright' }).addTo(_map);
  applyBasemap(basemap());
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
  const layer = L.tileLayer.wms(GEOSERVER_URL, {
    layers: service,
    format: 'image/png',
    transparent: true,
  } as L.WMSOptions);
  layer.setOpacity(LAYERS_NOT_TRANSPARENT.has(service) ? 1 : 0.7);
  layer.addTo(_map);
  _addedLayers[layerId] = layer;

  setLegendEntries(prev => [
    ...prev,
    { layerId, service, name, custom: LAYERS_WITH_CUSTOM_LEGENDS.has(layerId) },
  ]);
}

export function removeWmsLayer(layerId: string) {
  if (!_map || !_addedLayers[layerId]) return;
  _map.removeLayer(_addedLayers[layerId]);
  delete _addedLayers[layerId];
  setLegendEntries(prev => prev.filter(e => e.layerId !== layerId));
}

export function clearAllWmsLayers() {
  if (!_map) return;
  Object.keys(_addedLayers).forEach(id => {
    _map!.removeLayer(_addedLayers[id]);
    delete _addedLayers[id];
  });
  setLegendEntries([]);
  setSelectedLayerIds([]);
}

export function clearExtraLayers() {
  if (!_map) return;
  _extraLayers.forEach(l => _map!.removeLayer(l));
  _extraLayers = [];
}

export function addExtraLayer(layer: L.Layer) {
  if (!_map) return;
  layer.addTo(_map);
  _extraLayers.push(layer);
}

export function setMapView(center: [number, number], zoom: number) {
  _map?.setView(new L.LatLng(center[0], center[1]), zoom);
}

export async function zoomToLayer(service: string) {
  if (!_map) return;
  const stripped = service.replace('MSPudhu:', '').replace(/ /g, '%20');
  try {
    const res = await fetch(`${GEOSERVER_URL}?service=WMS&version=1.1.1&request=GetCapabilities`);
    const xml = await res.text();
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    for (const layer of Array.from(doc.getElementsByTagName('Layer'))) {
      const nameEl = layer.getElementsByTagName('Name')[0];
      if (nameEl?.textContent === stripped || nameEl?.textContent === service.replace('MSPudhu:', '')) {
        const bbox = layer.getElementsByTagName('LatLonBoundingBox')[0];
        if (bbox) {
          const bounds = L.latLngBounds(
            [parseFloat(bbox.getAttribute('miny')!), parseFloat(bbox.getAttribute('minx')!)],
            [parseFloat(bbox.getAttribute('maxy')!), parseFloat(bbox.getAttribute('maxx')!)],
          );
          _map.fitBounds(bounds);
        }
        break;
      }
    }
  } catch (e) {
    console.error('Error fetching layer bounds', e);
  }
}
