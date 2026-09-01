import { createSignal, createEffect, For, Show } from 'solid-js';
import { layersTree, selectedLayerIds, setSelectedLayerIds } from '../stores/mapStore';
import { zoomToLayer } from '../lib/capabilities';
import { closePanel } from '../stores/uiStore';
import { findNodeByNumber } from '../lib/layerTree';
import type { LayerNode } from '../stores/configStore';

// A group node is never itself added as a WMS layer (see toLayerNode) — only
// its leaves are real, checkable layers, so a group's checked/indeterminate
// state must be derived from its leaves rather than tracked as its own id.
function leafIds(node: LayerNode): string[] {
  return node.Children?.length ? node.Children.flatMap(leafIds) : [node.Number];
}

function toggleNode(node: LayerNode, checked: boolean) {
  const ids = leafIds(node);
  setSelectedLayerIds(prev => {
    if (checked) {
      const toAdd = ids.filter(i => !prev.includes(i));
      return [...prev, ...toAdd];
    }
    return prev.filter(i => !ids.includes(i));
  });
}

function LayerItem(props: { node: LayerNode }) {
  const checked = () => selectedLayerIds().includes(props.node.Number);

  return (
    <div class="flex items-center justify-between bg-[#f0f1f1] px-2 py-2 my-2 rounded border-b border-gray-300 text-sm">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <input
          type="checkbox"
          id={props.node.Number}
          checked={checked()}
          onChange={e => toggleNode(props.node, e.currentTarget.checked)}
          class="cursor-pointer shrink-0"
        />
        <label for={props.node.Number} class="text-[#3f4346] text-xs truncate cursor-pointer">
          {props.node.Name}
        </label>
      </div>
      <Show when={props.node.service}>
        <button
          onClick={() => zoomToLayer(props.node.service!)}
          title="Zoom to layer"
          class="ml-2 shrink-0 text-[#258ccc] opacity-70 hover:opacity-100"
        >
          <i class="fas fa-search-plus text-xs" />
        </button>
      </Show>
    </div>
  );
}

function LayerGroup(props: { node: LayerNode }) {
  const [open, setOpen] = createSignal(true);
  const ids = () => leafIds(props.node);
  const checked = () => ids().every(id => selectedLayerIds().includes(id));
  const indeterminate = () => !checked() && ids().some(id => selectedLayerIds().includes(id));
  let checkboxEl!: HTMLInputElement;
  createEffect(() => { checkboxEl.indeterminate = indeterminate(); });

  return (
    <div>
      <div class="flex justify-between items-center px-2.5 py-2.5 bg-[#258ccc] text-white cursor-pointer mb-1 hover:bg-[#0056b3] transition-colors">
        <div class="flex items-center gap-2">
          <input
            ref={checkboxEl}
            type="checkbox"
            id={props.node.Number}
            checked={checked()}
            onChange={e => toggleNode(props.node, e.currentTarget.checked)}
            class="cursor-pointer"
            onClick={e => e.stopPropagation()}
          />
          <label for={props.node.Number} class="font-bold text-sm cursor-pointer" onClick={e => e.preventDefault()}>
            {props.node.Name}
          </label>
        </div>
        <button onClick={() => setOpen(o => !o)} class="ml-2">
          <i class={`fas fa-angle-down text-sm transition-transform ${open() ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <Show when={open()}>
        <div class="pl-2.5">
          <For each={props.node.Children}>
            {child => child.Children?.length ? <LayerGroup node={child} /> : <LayerItem node={child} />}
          </For>
        </div>
      </Show>
    </div>
  );
}

export function LayersPanel() {
  const tree = () => layersTree();

  return (
    <div class="absolute top-4 right-25 bg-white rounded-xl shadow-md w-72 max-h-125 flex flex-col overflow-hidden">
      <div class="flex justify-between items-center bg-gray-100 px-2.5 py-2.5 rounded-t-xl font-bold">
        <span>Layers</span>
        <button onClick={closePanel} class="text-gray-600 hover:text-red-500">
          <i class="fas fa-times" />
        </button>
      </div>
      <div class="overflow-y-auto p-2 flex-1">
        <Show when={tree().length} fallback={<p class="text-sm text-gray-500 p-2">No layers loaded.</p>}>
          <For each={tree()}>
            {node => node.Children?.length ? <LayerGroup node={node} /> : <LayerItem node={node} />}
          </For>
        </Show>
      </div>
    </div>
  );
}
