import { createResource, For, Show } from 'solid-js';
import { legendEntries } from '../stores/mapStore';
import { closePanel } from '../stores/uiStore';
import { fetchLegendClasses, type LegendClass, type LegendSwatch } from '../lib/legend';
import type { LegendEntry } from '../stores/mapStore';

function swatchStyle(swatch: LegendSwatch): Record<string, string> {
  switch (swatch.kind) {
    case 'polygon':
      return { 'background-color': swatch.fill, border: `1px solid ${swatch.stroke}` };
    case 'point':
      return { 'background-color': swatch.fill, border: `1px solid ${swatch.stroke}`, 'border-radius': '9999px' };
    case 'line':
      return { 'border-top': `2px solid ${swatch.stroke}` };
  }
}

function Swatch(props: { swatch: LegendSwatch }) {
  return (
    <span
      class="inline-block w-3.5 shrink-0"
      classList={{ 'h-3.5': props.swatch.kind !== 'line' }}
      style={swatchStyle(props.swatch)}
    />
  );
}

function LegendEntryRow(props: { entry: LegendEntry }) {
  const [classes] = createResource(() => props.entry.service, fetchLegendClasses);
  // A single class needs no header of its own — just its swatch labeled
  // with the layer name.
  const multiClass = () => (classes()?.length ?? 0) > 1;

  return (
    <Show
      when={multiClass()}
      fallback={
        <div class="mb-3 flex items-center gap-2">
          <Show when={classes()?.[0]}>{cls => <Swatch swatch={cls().swatch} />}</Show>
          <span class="text-xs">{props.entry.name}</span>
        </div>
      }
    >
      <div class="mb-3">
        <div class="font-semibold text-xs mb-1">{props.entry.name}</div>
        <div class="flex flex-col gap-1">
          <For each={classes()}>
            {(cls: LegendClass) => (
              <div class="flex items-center gap-2">
                <Swatch swatch={cls.swatch} />
                <Show when={cls.title}>
                  <span class="text-xs">{cls.title}</span>
                </Show>
              </div>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
}

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
          <For each={legendEntries()}>{entry => <LegendEntryRow entry={entry} />}</For>
        </Show>
      </div>
    </div>
  );
}
