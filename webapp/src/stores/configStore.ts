import { createStore } from 'solid-js/store';
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

interface ConfigState {
  nav: NavConfig;
  loaded: boolean;
}

export const [configState, setConfigState] = createStore<ConfigState>({
  nav: {},
  loaded: false,
});

async function discoverChildren(layer: string, submenus: Set<string>): Promise<NavEntryConfig[]> {
  const node = await fetchCapabilitiesNode(layer);
  if (!node?.children.length) return [];
  return Promise.all(node.children.map(async (child): Promise<NavEntryConfig> => {
    if (!submenus.has(child.name)) return { label: child.title, layer: child.name };
    return { label: child.title, items: await discoverChildren(child.name, submenus) };
  }));
}

export async function loadAllConfig() {
  const rawNav: NavFile = await fetch('/config/nav.json').then(r => r.json());
  const nav: NavConfig = {};
  await Promise.all(Object.entries(rawNav).map(async ([key, root]) => {
    nav[key] = await discoverChildren(root.layer, new Set(root.submenus));
  }));
  setConfigState({ nav, loaded: true });
}
