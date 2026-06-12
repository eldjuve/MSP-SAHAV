import { createStore } from 'solid-js/store';

export interface LayerNode {
  Number: string;
  Name: string;
  service?: string;
  Children?: LayerNode[];
}

export interface MenuItemConfig {
  key: string;
  jsonpath: string;
  title: string;
  center: [number, number];
  zoom: number;
  data: string[];
  about?: string;
  chapterheader?: string;
  subpara?: string;
  otherfunctions?: { name: string; params: string[] };
}

export interface DataRepoItem {
  category?: string;
  name?: string;
  items?: DataRepoItem[];
}

export type DataRepoConfig = Record<string, DataRepoItem[]>;
export type MenuItemsConfig = Record<string, MenuItemConfig>;
export type LayerInfoConfig = Record<string, LayerNode[]>;

interface ConfigState {
  datarepo: DataRepoConfig;
  menuitems: MenuItemsConfig;
  allLayerInfo: LayerInfoConfig;
  loaded: boolean;
}

export const [configState, setConfigState] = createStore<ConfigState>({
  datarepo: {},
  menuitems: {},
  allLayerInfo: {},
  loaded: false,
});

export async function loadAllConfig() {
  const [datarepo, menuitems, allLayerInfo] = await Promise.all([
    fetch('/config/datarepo.json').then(r => r.json()),
    fetch('/config/menuitems.json').then(r => r.json()),
    fetch('/config/Multi_DataTree.json').then(r => r.json()),
  ]);
  setConfigState({ datarepo, menuitems, allLayerInfo, loaded: true });
}
