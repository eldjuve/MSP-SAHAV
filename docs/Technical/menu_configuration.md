# Menu / Navigation Configuration

## Overview

The sidebar navigation is driven by a single config file,
`public/config/nav.json`, combined with data discovered from GeoServer at
runtime. `nav.json` only says which GeoServer group each top-level nav
entry points at, and which of its descendants should become a further
submenu — it never names an individual leaf layer. Everything a user
actually sees (labels, descriptions, which layers a click loads) comes from
GeoServer's own `GetCapabilities` response.

## `nav.json` shape

```ts
type NavFile = Record<
  string,
  {
    layer: string; // a GeoServer group name, e.g. "MSPudhu:DataRepository"
    submenus?: string[]; // layer names that should expand into a further submenu
  }
>;
```

Example:

```json
{
  "dataRepository": {
    "layer": "MSPudhu:DataRepository",
    "submenus": ["MSPudhu:Environment", "MSPudhu:Ecology"]
  },
  "status indicators": {
    "layer": "MSPudhu:StatusIndicators"
  }
}
```

Each top-level key is referenced from `src/components/Navbar.tsx`'s
`NAV_ITEMS` list, which maps a nav bar label to the `nav.json` key that
supplies its dropdown. A `NAV_ITEMS` entry with `key: null` renders as a
disabled placeholder — useful for menu items that exist in the UI but have
no content to discover yet.

## How it works

1. On startup, `fetchNavConfig` in `src/stores/configStore.ts` fetches
   `nav.json` and, for each root, calls `discoverChildren`.
2. `discoverChildren` fetches the root's `GetCapabilities` node (via
   `fetchCapabilitiesNode` in `src/lib/capabilities.ts`) and walks its
   children. A child whose name is **not** in `submenus` becomes a flat,
   clickable leaf (`{ label, layer }`). A child whose name **is** in
   `submenus` recurses, becoming a submenu of its own discovered children.
   `submenus` is checked at every level, so it applies recursively through
   nested groups.
3. The resolved tree (`NavConfig`) is what `Navbar.tsx` renders as dropdown
   menus, including nested `DropdownMenu.Sub` submenus.
4. Clicking a resolved leaf (`handleMenuItemClick` in
   `src/lib/menuHandler.ts`) fetches that leaf's own `GetCapabilities` node
   and:
   - zooms the map to that layer's bounding box,
   - builds the Layers panel tree from its children (if it's a layer group)
     and selects all of them,
   - sets the sidebar title/about text from the layer's own
     `Title`/`Abstract`,
   - triggers a chart-data fetch for every newly selected sublayer.

`GetCapabilities` is fetched once per workspace per session and cached (see
`src/lib/capabilities.ts`), not re-fetched on every click.

## Adding a new nav entry

Adding, renaming, or reorganizing what appears under an existing top-level
nav entry needs no frontend change at all — publish or rearrange layer
groups in GeoServer and the nav tree picks it up on next load.

To add a new **top-level** nav entry:

1. Add a key to `nav.json` naming the GeoServer group it should discover
   from.
2. Add a matching `{ label, key }` entry to `NAV_ITEMS` in
   `src/components/Navbar.tsx`.

See `docs/Technical/data_formats.md` for what GeoServer needs to expose
(layer group titles/abstracts, chart data, opacity conventions) for a nav
entry to render fully.
