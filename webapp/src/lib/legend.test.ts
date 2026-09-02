import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchLegendClasses } from './legend';

// Each test uses its own layer name — fetchLegendClasses caches by name at
// module scope, so a shared one would leak results between tests.
function mockLegendResponse(rules: unknown[]) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      json: async () => ({ Legend: [{ rules }] }),
    })),
  );
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchLegendClasses', () => {
  it('parses a polygon rule', async () => {
    mockLegendResponse([
      { name: 'built-up', symbolizers: [{ Polygon: { fill: '#ff0000', stroke: '#000000' } }] },
    ]);
    const classes = await fetchLegendClasses('WS:Polygon1');
    expect(classes).toEqual([
      { title: 'built-up', swatch: { kind: 'polygon', fill: '#ff0000', stroke: '#000000' } },
    ]);
  });

  it('parses a line rule', async () => {
    mockLegendResponse([{ name: 'road', symbolizers: [{ Line: { stroke: '#333' } }] }]);
    const classes = await fetchLegendClasses('WS:Line1');
    expect(classes).toEqual([{ title: 'road', swatch: { kind: 'line', stroke: '#333' } }]);
  });

  it('prefers the mark graphic (has a fill) over an icon-only graphic for a point rule', async () => {
    mockLegendResponse([
      {
        name: 'buoy',
        symbolizers: [
          {
            Point: { graphics: [{/* icon, no fill */}, { fill: '#e8590c', stroke: '#c92a2a' }] },
          },
        ],
      },
    ]);
    const classes = await fetchLegendClasses('WS:Point1');
    expect(classes).toEqual([
      { title: 'buoy', swatch: { kind: 'point', fill: '#e8590c', stroke: '#c92a2a' } },
    ]);
  });

  it('drops a rule named "Single symbol" (not a real class label)', async () => {
    mockLegendResponse([
      { name: 'Single symbol', symbolizers: [{ Polygon: { fill: '#fff', stroke: '#000' } }] },
    ]);
    const [cls] = await fetchLegendClasses('WS:SingleSymbol1');
    expect(cls.title).toBeUndefined();
  });

  it('skips a Text-only rule entirely (no visual swatch)', async () => {
    mockLegendResponse([
      { name: 'river-label', symbolizers: [{ Text: {} }] },
      { name: 'river-line', symbolizers: [{ Line: { stroke: '#00f' } }] },
    ]);
    const classes = await fetchLegendClasses('WS:TextSkip1');
    expect(classes).toHaveLength(1);
    expect(classes[0].title).toBe('river-line');
  });

  it('returns an empty array (not a throw) when the request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down');
      }),
    );
    await expect(fetchLegendClasses('WS:Failing1')).resolves.toEqual([]);
  });

  it('caches by layer name — a second call does not refetch', async () => {
    const fetchSpy = vi.fn(async () => ({ json: async () => ({ Legend: [{ rules: [] }] }) }));
    vi.stubGlobal('fetch', fetchSpy);
    await fetchLegendClasses('WS:Cached1');
    await fetchLegendClasses('WS:Cached1');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
