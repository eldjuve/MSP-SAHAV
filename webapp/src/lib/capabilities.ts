import L from 'leaflet';
import { getMap, getWorkspace, wmsUrlForWorkspace, WMS_VERSION } from '../stores/mapStore';
import type { LayerNode } from '../stores/configStore';

// A GeoServer WMS layer or layer group, as discovered from GetCapabilities.
// Group nodes (with children) aren't independently addable — only their
// leaves are (see toLayerNode).
export type CapabilitiesNode = {
  name: string;
  title: string;
  abstract?: string;
  bounds?: L.LatLngBounds;
  children: CapabilitiesNode[];
};

function directChild(el: Element | undefined, tag: string): Element | undefined {
  return el ? Array.from(el.children).find((c) => c.tagName === tag) : undefined;
}

// A workspace-scoped WMS GetCapabilities response gives each layer's bare
// local name (e.g. "Environment"), not the "workspace:layer" qualified form
// — but every other part of this app (nav.json, chart_data lookups) always
// uses qualified names. Reconstruct that here so it's qualified everywhere
// downstream, rather than leaking GeoServer's per-endpoint naming quirk.
function parseLayer(el: Element, workspace: string): CapabilitiesNode {
  const rawName = directChild(el, 'Name')?.textContent ?? '';
  const name = rawName.includes(':') ? rawName : `${workspace}:${rawName}`;
  const title = directChild(el, 'Title')?.textContent ?? rawName;
  const abstract = directChild(el, 'Abstract')?.textContent?.trim() || undefined;
  const bboxEl = directChild(el, 'LatLonBoundingBox');
  const bounds = bboxEl
    ? L.latLngBounds(
        [parseFloat(bboxEl.getAttribute('miny')!), parseFloat(bboxEl.getAttribute('minx')!)],
        [parseFloat(bboxEl.getAttribute('maxy')!), parseFloat(bboxEl.getAttribute('maxx')!)],
      )
    : undefined;
  const children = Array.from(el.children)
    .filter((c) => c.tagName === 'Layer')
    .map((c) => parseLayer(c, workspace));
  return { name, title, abstract, bounds, children };
}

// Each workspace's GetCapabilities document is fetched and parsed once per
// session and reused. A failed fetch isn't cached, so the next call retries.
const _capabilitiesTrees = new Map<string, Promise<CapabilitiesNode[]>>();

export function fetchCapabilitiesTree(workspace: string): Promise<CapabilitiesNode[]> {
  const cached = _capabilitiesTrees.get(workspace);
  if (cached) return cached;
  const promise = (async () => {
    try {
      const res = await fetch(
        `${wmsUrlForWorkspace(workspace)}?service=WMS&version=${WMS_VERSION}&request=GetCapabilities`,
      );
      const xml = await res.text();
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      const rootLayer = directChild(doc.getElementsByTagName('Capability')[0], 'Layer');
      return rootLayer
        ? Array.from(rootLayer.children)
            .filter((c) => c.tagName === 'Layer')
            .map((c) => parseLayer(c, workspace))
        : [];
    } catch (e) {
      console.error(`Error fetching GetCapabilities for workspace "${workspace}"`, e);
      _capabilitiesTrees.delete(workspace);
      return [];
    }
  })();
  _capabilitiesTrees.set(workspace, promise);
  return promise;
}

function findNode(nodes: CapabilitiesNode[], name: string): CapabilitiesNode | undefined {
  for (const node of nodes) {
    if (node.name === name) return node;
    const found = findNode(node.children, name);
    if (found) return found;
  }
  return undefined;
}

// Look up a layer or layer group by its qualified "workspace:layer" name,
// fetching (and caching) that workspace's GetCapabilities document first.
export async function fetchCapabilitiesNode(name: string): Promise<CapabilitiesNode | undefined> {
  const tree = await fetchCapabilitiesTree(getWorkspace(name));
  return findNode(tree, name);
}

export async function zoomToLayer(service: string) {
  const map = getMap();
  const node = await fetchCapabilitiesNode(service);
  if (map && node?.bounds) map.fitBounds(node.bounds);
}

// A capabilities node becomes a checkable entry in the Layers panel — only
// leaves are independently addable as a WMS layer; a group's checkbox
// cascades to its children instead (see LayersPanel.tsx's toggleNode).
export function toLayerNode(node: CapabilitiesNode): LayerNode {
  return {
    Number: node.name,
    Name: node.title,
    service: node.children.length ? undefined : node.name,
    Children: node.children.length ? node.children.map(toLayerNode) : undefined,
  };
}
