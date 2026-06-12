import { createSignal, For, Show } from 'solid-js';
import { configState } from '../stores/configStore';
import { handleMenuItemClick } from '../lib/menuHandler';
import type { DataRepoItem } from '../stores/configStore';

const NAV_ITEMS = [
  { label: 'Data Repository', key: 'dataRepository' },
  { label: 'Sectoral Plans', key: null },
  { label: 'Status Indicators', key: 'status indicators' },
  { label: 'Project Proposals', key: null },
  { label: 'Conflicts & Compatibilities', key: 'conflicts' },
  { label: 'Proposed MSP', key: null },
  { label: 'Services-MoES', key: 'services' },
];

function DropdownItem(props: { item: DataRepoItem; depth: number }) {
  const label = () => props.item.category ?? props.item.name ?? '';
  const children = () =>
    props.item.items?.map(i => ({ category: i.name ?? i.category, items: i.items })) ?? [];
  const hasChildren = () => children().length > 0;

  return (
    <li class="relative group/sub">
      <button
        class="w-full text-left px-4 py-2.5 text-sm font-bold text-[#36383a] flex justify-between items-center whitespace-nowrap hover:bg-msp-dark hover:text-white transition-colors"
        onClick={() => !hasChildren() && handleMenuItemClick(label())}
      >
        {label()}
        <Show when={hasChildren()}>
          <span class="ml-4 text-xs">►</span>
        </Show>
      </button>
      <Show when={hasChildren()}>
        <ul class="absolute left-full top-0 min-w-[200px] bg-msp-menu-bg shadow-md hidden group-hover/sub:block">
          <For each={children()}>
            {child => <DropdownItem item={child} depth={props.depth + 1} />}
          </For>
        </ul>
      </Show>
    </li>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = createSignal(false);

  return (
    <nav class="bg-msp-primary relative shrink-0">
      <div class="flex items-center justify-center px-4 py-2 min-h-11">
        {/* Mobile hamburger */}
        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 md:hidden text-[#36383a] p-1"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle navigation"
        >
          <i class="fas fa-bars text-lg" />
        </button>

        {/* Nav items */}
        <ul
          class={`flex-col md:flex-row flex-wrap md:flex items-start md:items-center gap-x-1 bg-white md:bg-transparent absolute md:relative top-full left-0 right-0 md:top-auto shadow-md md:shadow-none p-3 md:p-0 ${mobileOpen() ? 'flex' : 'hidden md:flex'}`}
        >
          <For each={NAV_ITEMS}>
            {nav => {
              const menuData = () => nav.key ? configState.datarepo[nav.key] : null;
              const hasMenu = () => !!menuData()?.length;

              return (
                <li class={`relative ${hasMenu() ? 'group' : ''}`}>
                  <button
                    class={`px-3 py-1.5 text-sm font-semibold text-[#36383a] whitespace-nowrap ${hasMenu() ? 'cursor-pointer hover:underline' : 'cursor-not-allowed opacity-70'}`}
                    onClick={() => { if (!hasMenu()) return; setMobileOpen(false); }}
                  >
                    {nav.label}
                    <Show when={hasMenu()}>
                      <span class="ml-1 text-xs">▾</span>
                    </Show>
                  </button>
                  <Show when={hasMenu()}>
                    <ul class="absolute left-0 top-full min-w-[200px] bg-msp-menu-bg shadow-md hidden group-hover:block">
                      <For each={menuData()!}>
                        {item => <DropdownItem item={item} depth={0} />}
                      </For>
                    </ul>
                  </Show>
                </li>
              );
            }}
          </For>
        </ul>
      </div>
    </nav>
  );
}
