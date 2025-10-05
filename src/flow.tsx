import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  Background,
  Controls,
  MiniMap,
  type OnSelectionChangeParams,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { RecipeNode } from './components/recipe-node';
import { useFlowStore } from './stores/chart-store';

const nodeTypes = {
  recipe: RecipeNode,
};

const initialNodes = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { recipeId: 'crude_oil_refining' },
    type: 'recipe',
  },
  {
    id: 'n2',
    position: { x: 400, y: 20 },
    data: { recipeId: 'crude_oil_refining' },
    type: 'recipe',
  },
];

const initialEdges = [
  {
    id: 'n1-n2',
    source: 'n1',
    sourceHandle: 'diesel',
    target: 'n2',
    targetHandle: 'oil',
    animated: true,
  },
];

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
    setNodes(initialNodes);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete') {
        const { nodes, removeNode } = useFlowStore.getState();
        const selected = nodes.filter((n) => n.selected);
        selected.forEach((node) => removeNode(node.id));
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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        selectNodesOnDrag={false}
        onSelectionChange={onSelectionChange}
      >
        <Background gap={10} color="#d7dce0" bgColor="#f7f9fb" />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
