import { For } from 'solid-js';
import { basemap, changeBasemap } from '../stores/mapStore';
import { closePanel } from '../stores/uiStore';
import type { BasemapType } from '../stores/mapStore';

const BASEMAPS: { type: BasemapType; img: string; label: string }[] = [
  { type: 'satellite', img: '/img/satellite.png', label: 'Google Satellite Map' },
  { type: 'imagery', img: '/img/imagery.png', label: 'ESRI World Imagery' },
  { type: 'topo', img: '/img/streets.png', label: 'ESRI Topographic' },
];

export function BasemapsPanel() {
  return (
    <div class="absolute top-4 right-25 bg-white rounded-xl shadow-md w-80 overflow-hidden">
      <div class="flex justify-between items-center px-4 py-3 font-bold text-lg">
        <span>Basemaps</span>
        <button
          onClick={closePanel}
          class="border-none bg-none text-2xl cursor-pointer text-gray-500 hover:text-black leading-none"
          aria-label="Close basemaps panel"
        >
          ×
        </button>
      </div>
      <div class="flex flex-col gap-2.5 px-4 pb-4">
        <For each={BASEMAPS}>
          {({ type, img, label }) => (
            <button
              class={`flex items-center gap-2.5 p-2.5 rounded cursor-pointer transition-colors text-left ${basemap() === type ? 'bg-msp-menu-bg' : 'hover:bg-gray-100'}`}
              onClick={() => {
                changeBasemap(type);
                closePanel();
              }}
            >
              <img src={img} alt={label} class="w-25 rounded" />
              <span class="text-sm font-medium">{label}</span>
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
