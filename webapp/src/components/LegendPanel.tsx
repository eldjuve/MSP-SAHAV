import { For, Show } from 'solid-js';
import { legendEntries, LEGEND_BASE_URL } from '../stores/mapStore';
import { closePanel } from '../stores/uiStore';

export function LegendPanel() {
  return (
    <div class="absolute top-4 right-25 bg-white rounded-xl shadow-md w-72 max-h-125 flex flex-col overflow-hidden">
      <div class="flex justify-between items-center bg-gray-100 px-2.5 py-2.5 rounded-t-xl font-bold">
        <span>Legend</span>
        <button onClick={closePanel} class="text-gray-600 hover:text-red-500">
          <i class="fas fa-times" />
        </button>
      </div>
      <div class="overflow-y-auto p-2.5 flex-1 text-sm">
        <Show when={legendEntries().length} fallback={<p class="text-gray-500">No active layers.</p>}>
          <For each={legendEntries()}>
            {entry => (
              <div class="mb-3">
                <Show when={entry.custom}>
                  <div class="font-semibold text-xs mb-1">{entry.name}</div>
                </Show>
                <div class="flex items-center gap-2">
                  <img
                    src={`${LEGEND_BASE_URL}${encodeURIComponent(entry.service)}`}
                    alt={entry.name}
                    width="30"
                    class="shrink-0"
                  />
                  <Show when={!entry.custom}>
                    <span class="text-xs">{entry.name}</span>
                  </Show>
                </div>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
}
