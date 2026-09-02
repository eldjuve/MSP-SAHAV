import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NavEntryConfig } from '../stores/configStore';
import type { CapabilitiesNode } from './capabilities';

vi.mock('./capabilities', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./capabilities')>();
  return { ...actual, fetchCapabilitiesNode: vi.fn() };
});

import { fetchCapabilitiesNode } from './capabilities';
import { handleMenuItemClick } from './menuHandler';
import { mainContent } from '../stores/uiStore';

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

function node(name: string, title: string): CapabilitiesNode {
  return { name, title, children: [] };
}

const itemA: NavEntryConfig = { label: 'A', layer: 'WS:A' };
const itemB: NavEntryConfig = { label: 'B', layer: 'WS:B' };

describe('handleMenuItemClick', () => {
  beforeEach(() => {
    vi.mocked(fetchCapabilitiesNode).mockReset();
  });

  it('a faster second click is not clobbered by a slower first one resolving late', async () => {
    const slowA = deferred<CapabilitiesNode | undefined>();
    vi.mocked(fetchCapabilitiesNode)
      .mockImplementationOnce(() => slowA.promise)
      .mockImplementationOnce(async () => node('WS:B', 'Item B'));

    const clickA = handleMenuItemClick(itemA);
    const clickB = handleMenuItemClick(itemB);

    await clickB;
    expect(mainContent()?.title).toBe('Item B');

    // A's fetch finally arrives after B already won — it must be ignored.
    slowA.resolve(node('WS:A', 'Item A'));
    await clickA;
    expect(mainContent()?.title).toBe('Item B');
  });

  it('a single click still updates the sidebar normally', async () => {
    vi.mocked(fetchCapabilitiesNode).mockImplementationOnce(async () => node('WS:B', 'Item B'));
    await handleMenuItemClick(itemB);
    expect(mainContent()?.title).toBe('Item B');
  });
});
