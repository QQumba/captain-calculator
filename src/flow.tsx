import { useState, useCallback } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  Background,
  Controls,
  BackgroundVariant,
  MiniMap,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import MediumOil from './assets/Medium_Oil.png';
import SteamH from './assets/SteamHp.png';
import Diesel from './assets/Diesel.png';
import Exhaust from './assets/Exhaust.png';

const nodeTypes = {
  recipe: RecipeNode,
};

const initialNodes = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
    type: 'recipe',
  },
  {
    id: 'n2',
    position: { x: 400, y: 20 },
    data: { label: 'Node 2' },
    type: 'recipe',
  },
];
const initialEdges = [
  { id: 'n1-n2', source: 'n1', target: 'n2', animated: true },
];

export default function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (
      changes: NodeChange<{
        id: string;
        position: { x: number; y: number };
        data: { label: string };
      }>[]
    ) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<{ id: string; source: string; target: string }>[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

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
        <Background gap={5} color="#ebebeb" bgColor="#f7f9fb" />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

function RecipeNode() {
  return (
    <div className="rounded bg-white border border-neutral-200 flex flex-col items-center min-w-60">
      <div className="px-2 py-1 font-light">Distillation (Stage I)</div>
      <div className="text-[9px] text-neutral-500 flex items-center gap-1 w-full">
        <div className="content-none border-t border-neutral-200 grow h-[1px]"></div>
        <div>Inputs & Outputs</div>
        <div className="content-none border-t border-neutral-300 grow h-[1px]"></div>
      </div>
      <div className="flex justify-between w-full py-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1 ml-[-7px]">
            <InputHandle />
            <div className="h-[24px] w-[24px] p-[2px] border border-neutral-300 rounded-sm">
              <img className="h-full w-full" src={MediumOil} alt="Medium Oil" />
            </div>
            <div className="h-[24px] min-w-[70px] p-[4px] border border-neutral-300 rounded-sm flex items-center justify-center text-neutral-500">
              0/60
            </div>
          </div>
          <div className="flex items-center gap-1 ml-[-7px]">
            <InputHandle />
            <div className="h-[24px] w-[24px] p-[2px] border border-neutral-300 rounded-sm">
              <img className="h-full w-full" src={SteamH} alt="Steam High" />
            </div>
            <div className="h-[24px] min-w-[70px] p-[4px] border border-neutral-300 rounded-sm flex items-center justify-center text-neutral-500">
              0/3
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1 mr-[-12px]">
            <div className="h-[24px] min-w-[70px] p-[2px] border border-dashed border-neutral-300 rounded-sm flex items-center justify-center text-neutral-500">
              0
            </div>
            <div className="h-[24px] w-[24px] p-[2px] border border-dashed border-neutral-300 rounded-sm">
              <img className="h-full w-full" src={Diesel} alt="Diesel" />
            </div>
            <OutputHandle />
          </div>
          <div className="flex items-center gap-1 mr-[-12px]">
            <div className="h-[24px] min-w-[70px] p-[2px] border border-dashed border-neutral-300 rounded-sm flex items-center justify-center text-neutral-500">
              999/999
            </div>
            <div className="h-[24px] w-[24px] p-[2px] border border-dashed border-neutral-300 rounded-sm">
              <img className="h-full w-full" src={Exhaust} alt="Diesel" />
            </div>
            <OutputHandle />
          </div>
        </div>
      </div>
    </div>
  );
}

const handleReset = {
  borderRadius: '1px',
  backgroundColor: 'transparent',
  border: 'none',
  display: 'flex',
  justifyItems: 'center',
  height: 'auto',
  width: 'auto',
  position: 'static',
  transform: 'none',
};

function InputHandle() {
  return (
    <div>
      <Handle type={'target'} position={Position.Left} style={handleReset}>
        <div className="text-white bg-[#00c421] w-[14px] h-[14px] flex items-center justify-center rounded-full border-2"></div>
      </Handle>
    </div>
  );
}

function OutputHandle() {
  return (
    <Handle type={'source'} position={Position.Right} style={handleReset}>
      <div className="text-white bg-[#db0000] w-[24px] h-[24px] flex items-center justify-center rounded-sm">
        0
      </div>
    </Handle>
  );
}
