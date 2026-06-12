import { togglePanel } from '../stores/uiStore';

const TOOLS = [
  { icon: 'fa-layer-group', label: 'Layers', panel: 'layers' as const },
  { icon: 'fa-list', label: 'Legend', panel: 'legend' as const },
  { icon: 'fa-map', label: 'Basemaps', panel: 'basemaps' as const },
];

export function MapWidget() {
  return (
    <div class="absolute top-4 right-5 bg-white rounded-[30px] w-[60px] py-2.5 flex flex-col items-center gap-4 shadow-md">
      {TOOLS.map(({ icon, label, panel }) => (
        <button
          class="flex flex-col items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => togglePanel(panel)}
          title={label}
        >
          <i class={`fas ${icon} text-[15px] text-black`} />
          <span class="text-[10px] text-gray-500 mt-0.5">{label}</span>
        </button>
      ))}
    </div>
  );
}
