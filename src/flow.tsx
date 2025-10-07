import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type OnSelectionChangeParams,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { RecipeNode } from './components/recipe-node';
import { useFlowStore } from './stores/chart-store';
import RecipeEdge from './components/recipe-edge';

const nodeTypes = {
  recipe: RecipeNode,
};

const edgeTypes = {
  recipe: RecipeEdge,
};

export default function Flow() {
  const {
    nodes,
    edges,
    viewport,
    setNodes,
    onNodesChange,
    onEdgesChange,
    setViewport,
    onConnect,
    removeNode,
  } = useFlowStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete') {
        const { nodes, edges, removeNode, removeEdge } =
          useFlowStore.getState();

        const selectedNodes = nodes.filter((n) => n.selected);
        selectedNodes.forEach((node) => removeNode(node.id));

        const selectedEdges = edges.filter((e) => e.selected);
        selectedEdges.forEach((edge) => removeEdge(edge.id));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const onSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        selected: params.nodes.some((sn) => sn.id === n.id),
      }))
    );
  }, []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        selectNodesOnDrag={false}
        onSelectionChange={onSelectionChange}
        snapToGrid
      >
        <Background gap={20} size={2} color="#d7dce0" bgColor="#f7f9fb" />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
