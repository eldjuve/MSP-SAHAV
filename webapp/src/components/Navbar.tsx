import { For, Show } from 'solid-js';
import { DropdownMenu } from '@kobalte/core/dropdown-menu';
import { createSignal } from 'solid-js';
import { navConfig } from '../stores/configStore';
import { handleMenuItemClick } from '../lib/menuHandler';
import { navLoading } from '../stores/uiStore';
import type { NavEntryConfig } from '../stores/configStore';

const NAV_ITEMS = [
  { label: 'Data Repository', key: 'dataRepository' },
  { label: 'Sectoral Plans', key: null },
  { label: 'Status Indicators', key: 'status indicators' },
  { label: 'Project Proposals', key: null },
  { label: 'Conflicts & Compatibilities', key: 'conflicts' },
  { label: 'Proposed MSP', key: null },
  { label: 'Services-MoES', key: 'services' },
  // Demo-only: proves nav.json can span a second GeoServer workspace
  // (MSPLak) — see demo-geoserver/scripts/setup-lakshadweep.sh. Not part
  // of the real site's menu structure.
  { label: 'Lakshadweep (demo)', key: 'lakshadweep' },
];

function NavDropdownItem(props: { item: NavEntryConfig }) {
  const hasChildren = () => (props.item.items?.length ?? 0) > 0;

  return (
    <Show
      when={hasChildren()}
      fallback={
        <DropdownMenu.Item class="dd-item" onSelect={() => handleMenuItemClick(props.item)}>
          {props.item.label}
        </DropdownMenu.Item>
      }
    >
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger class="dd-sub-trigger">
          {props.item.label}
          <span class="text-gray-400 text-xs">►</span>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.Portal>
          <DropdownMenu.SubContent class="dd-content">
            <For each={props.item.items}>{(child) => <NavDropdownItem item={child} />}</For>
          </DropdownMenu.SubContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Sub>
    </Show>
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
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          <i class="fas fa-bars text-lg" />
        </button>

        {/* Nav items */}
        <ul
          // Only needs to beat z-index:auto (0), not any specific number —
          // nothing else in the app sets an explicit z-index. Needed only
          // for the mobile `absolute` overlay case below, since DOM order
          // alone would otherwise put the later map/panels div on top of
          // it; at md+ the list is `relative`/in-flow (never overlapping
          // anything), so it's reset to auto there — keeping it set would
          // give the list its own stacking context that outranks the
          // dropdown portal's (unstyled, z-index: auto) content, painting
          // a wrapped second row on top of an open dropdown instead of
          // behind it.
          class={`flex-col md:flex-row flex-wrap md:flex items-start md:items-center gap-x-1 bg-white md:bg-transparent absolute md:relative top-full left-0 right-0 md:top-auto shadow-md md:shadow-none p-3 md:p-0 z-2 md:z-auto ${mobileOpen() ? 'flex' : 'hidden md:flex'}`}
        >
          <For each={NAV_ITEMS}>
            {(nav) => {
              const menuData = () => (nav.key ? navConfig()?.[nav.key] : null);
              const hasMenu = () => !!menuData()?.length;

              return (
                <li>
                  <Show
                    when={hasMenu()}
                    fallback={
                      <button
                        class="px-3 py-1.5 text-sm font-semibold text-[#36383a] whitespace-nowrap cursor-not-allowed opacity-50"
                        disabled
                      >
                        {nav.label}
                      </button>
                    }
                  >
                    <DropdownMenu>
                      <DropdownMenu.Trigger class="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-[#36383a] whitespace-nowrap rounded-sm outline-none hover:bg-black/10 data-expanded:bg-black/10 transition-colors">
                        {nav.label}
                        <span class="text-xs opacity-60">▾</span>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content class="dd-content">
                          <For each={menuData()!}>{(item) => <NavDropdownItem item={item} />}</For>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu>
                  </Show>
                </li>
              );
            }}
          </For>
        </ul>
      </div>
      {/* Covers both the initial nav.json + GetCapabilities discovery
          (navConfig.loading) and a single nav click's fetch (navLoading) —
          absolutely positioned so it never shifts layout when it appears. */}
      <Show when={navLoading() || navConfig.loading}>
        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 animate-pulse" />
      </Show>
    </nav>
  );
}
