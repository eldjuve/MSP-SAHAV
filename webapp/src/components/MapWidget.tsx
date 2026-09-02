import { For } from 'solid-js';
import { togglePanel } from '../stores/uiStore';

const TOOLS = [
  { icon: 'fa-layer-group', label: 'Layers', panel: 'layers' as const },
  { icon: 'fa-list', label: 'Legend', panel: 'legend' as const },
  { icon: 'fa-map', label: 'Basemaps', panel: 'basemaps' as const },
];

export function MapWidget() {
  return (
    <div class="absolute top-4 right-5 bg-white rounded-[2rem] w-15 py-2.5 flex flex-col items-center gap-4 shadow-md">
      <For each={TOOLS}>
        {({ icon, label, panel }) => (
          <button
            class="flex flex-col items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => togglePanel(panel)}
            title={label}
          >
            <i class={`fas ${icon} text-base text-black`} />
            <span class="text-xs text-gray-500 mt-0.5">{label}</span>
          </button>
        )}
      </For>
    </div>
  );
}
