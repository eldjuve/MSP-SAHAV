import { createResource, createEffect } from 'solid-js';
import { fetchCapabilitiesNode } from '../lib/capabilities';

export interface LayerNode {
  Number: string;
  Name: string;
  service?: string;
  Children?: LayerNode[];
}

// A resolved nav entry, ready to render (see Navbar.tsx). Title/about text
// for a `layer` entry always comes from that layer's own GetCapabilities
// Title/Abstract, never configured here.
export interface NavEntryConfig {
  label: string;
  layer?: string;
  items?: NavEntryConfig[];
}

// The raw shape of nav.json: one root per top nav key, naming a GeoServer
// group whose children are auto-discovered as flat leaves (bundles or
// single features). `submenus` names which of those layers (anywhere in
// the discovered tree) should expand into a further nav submenu instead of
// staying a flat leaf — everything not listed stays a bundle/single
// feature automatically.
export interface NavRootConfig {
  layer: string;
  submenus?: string[];
}

export type NavFile = Record<string, NavRootConfig>;
export type NavConfig = Record<string, NavEntryConfig[]>;

// The default nav config, baked in at build time. Override via
// VITE_NAV_CONFIG (a JSON string matching NavFile — see .env.example) to
// ship a different nav tree without a source change, the same way
// VITE_GEOSERVER_URL overrides GEOSERVER_BASE_URL in ../stores/mapStore.ts.
const DEFAULT_NAV_CONFIG: NavFile = {
  dataRepository: {
    layer: 'MSPudhu:DataRepository',
    submenus: [
      'MSPudhu:Environment',
      'MSPudhu:Ecology',
      'MSPudhu:Human_Activities',
      'MSPudhu:Socio_Economic',
    ],
  },
  'status indicators': { layer: 'MSPudhu:StatusIndicators' },
  conflicts: { layer: 'MSPudhu:Conflicts' },
  services: { layer: 'MSPudhu:Services' },
  lakshadweep: { layer: 'MSPLak:Boundaries' },
};

function loadNavFile(): NavFile {
  const raw = import.meta.env.VITE_NAV_CONFIG;
  return raw ? JSON.parse(raw) : DEFAULT_NAV_CONFIG;
}

async function discoverChildren(layer: string, submenus: Set<string>): Promise<NavEntryConfig[]> {
  const node = await fetchCapabilitiesNode(layer);
  if (!node?.children.length) return [];
  return Promise.all(
    node.children.map(async (child): Promise<NavEntryConfig> => {
      if (!submenus.has(child.name)) return { label: child.title, layer: child.name };
      return { label: child.title, items: await discoverChildren(child.name, submenus) };
    }),
  );
}

async function fetchNavConfig(): Promise<NavConfig> {
  const rawNav = loadNavFile();
  const nav: NavConfig = {};
  await Promise.all(
    Object.entries(rawNav).map(async ([key, root]) => {
      nav[key] = await discoverChildren(root.layer, new Set(root.submenus));
    }),
  );
  return nav;
}

// The app's nav tree, discovered once from GeoServer at startup — fetches
// as soon as this module is first imported (see index.tsx). `navConfig.loading`
// drives App.tsx's startup loading bar; Navbar.tsx reads `navConfig()` directly.
export const [navConfig] = createResource(fetchNavConfig);

createEffect(() => {
  if (navConfig.error) console.error('Failed to load nav config', navConfig.error);
});
