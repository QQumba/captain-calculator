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
  } = useFlowStore();

  useEffect(() => {
    setNodes(initialNodes);
  }, []);

  // const [nodes, setNodes] = useState(initialNodes);
  // const [edges, setEdges] = useState(initialEdges);

  // const onNodesChange = useCallback(
  //   (
  //     changes: NodeChange<{
  //       id: string;
  //       position: { x: number; y: number };
  //       data: { label: string };
  //     }>[]
  //   ) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
  //   []
  // );
  // const onEdgesChange = useCallback(
  //   (changes: EdgeChange<{ id: string; source: string; target: string }>[]) =>
  //     setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
  //   []
  // );

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
      >
        <Background gap={10} color="#d7dce0" bgColor="#f7f9fb" />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
