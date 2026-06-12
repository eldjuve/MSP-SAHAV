import type { LayerNode } from '../stores/configStore';

export function findNodeByNumber(
  data: LayerNode | LayerNode[] | Record<string, unknown>,
  id: string,
): LayerNode | null {
  if (Array.isArray(data)) {
    for (const item of data) {
      const result = findNodeByNumber(item, id);
      if (result) return result;
    }
    return null;
  }
  if (typeof data === 'object' && data !== null) {
    const node = data as LayerNode;
    if (node.Number === id) return node;
    if (node.Children) {
      const result = findNodeByNumber(node.Children, id);
      if (result) return result;
    }
    for (const key of Object.keys(data)) {
      if (key !== 'Number' && key !== 'Name' && key !== 'service' && key !== 'Children') {
        const result = findNodeByNumber((data as Record<string, unknown>)[key] as LayerNode, id);
        if (result) return result;
      }
    }
  }
  return null;
}

export function getAllLeafNodes(nodes: LayerNode[]): LayerNode[] {
  const result: LayerNode[] = [];
  function traverse(n: LayerNode) {
    if (n.Children && n.Children.length > 0) {
      n.Children.forEach(traverse);
    } else {
      result.push(n);
    }
  }
  nodes.forEach(traverse);
  return result;
}
