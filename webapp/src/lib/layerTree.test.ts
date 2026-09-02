import { describe, it, expect } from 'vitest';
import { findNodeByNumber, getAllLeafNodes } from './layerTree';
import type { LayerNode } from '../stores/configStore';

const tree: LayerNode[] = [
  {
    Number: 'A',
    Name: 'Group A',
    Children: [
      { Number: 'A1', Name: 'Leaf A1', service: 'WS:A1' },
      {
        Number: 'A2',
        Name: 'Group A2',
        Children: [{ Number: 'A2a', Name: 'Leaf A2a', service: 'WS:A2a' }],
      },
    ],
  },
  { Number: 'B', Name: 'Leaf B', service: 'WS:B' },
  { Number: 'C', Name: 'Empty group C', Children: [] },
];

describe('findNodeByNumber', () => {
  it('finds a top-level leaf', () => {
    expect(findNodeByNumber(tree, 'B')?.Name).toBe('Leaf B');
  });

  it('finds a node nested inside groups', () => {
    expect(findNodeByNumber(tree, 'A2a')?.Name).toBe('Leaf A2a');
  });

  it('finds a group node itself, not just leaves', () => {
    expect(findNodeByNumber(tree, 'A2')?.Name).toBe('Group A2');
  });

  it('returns null when the id is not present', () => {
    expect(findNodeByNumber(tree, 'nope')).toBeNull();
  });

  it('returns null for an empty tree', () => {
    expect(findNodeByNumber([], 'A')).toBeNull();
  });
});

describe('getAllLeafNodes', () => {
  it('collects every leaf across nested groups, in order', () => {
    expect(getAllLeafNodes(tree).map((n) => n.Number)).toEqual(['A1', 'A2a', 'B', 'C']);
  });

  it('treats a group with an empty Children array as a leaf', () => {
    const [emptyGroupLeaf] = getAllLeafNodes([
      { Number: 'C', Name: 'Empty group C', Children: [] },
    ]);
    expect(emptyGroupLeaf.Number).toBe('C');
  });

  it('returns an empty array for an empty tree', () => {
    expect(getAllLeafNodes([])).toEqual([]);
  });
});
