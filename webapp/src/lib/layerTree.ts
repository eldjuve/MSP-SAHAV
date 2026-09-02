import type { LayerNode } from '../stores/configStore';

export function findNodeByNumber(nodes: LayerNode[], id: string): LayerNode | null {
  for (const node of nodes) {
    if (node.Number === id) return node;
    if (node.Children) {
      const result = findNodeByNumber(node.Children, id);
      if (result) return result;
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
