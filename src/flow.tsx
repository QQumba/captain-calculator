import { useState, useCallback, useEffect, useRef } from 'react';
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
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import MediumOil from './assets/Medium_Oil.png';
import SteamH from './assets/SteamHp.png';
import Diesel from './assets/Diesel.png';
import Exhaust from './assets/Exhaust.png';
import Worker from './assets/Worker.png';
import Maintenance from './assets/Maintenance.png';
import Electricity from './assets/Electricity.png';

const nodeTypes = {
  recipe: RecipeNode,
};

const oilRecipe: Recipe = {
  recipeId: 'oil',
  machineId: 'distillation',
  inputs: [
    {
      materialId: 'oil',
      icon: MediumOil,
      amountTotal: 60,
      amountUsed: 0,
      type: 'input',
    },
    {
      materialId: 'steam',
      icon: SteamH,
      amountTotal: 9,
      amountUsed: 0,
      type: 'input',
    },
  ],
  outputs: [
    {
      materialId: 'diesel',
      icon: Diesel,
      amountTotal: 36,
      amountUsed: 0,
      type: 'output',
    },
    {
      materialId: 'exhaust',
      icon: Exhaust,
      amountTotal: 16,
      amountUsed: 0,
      type: 'output',
    },
  ],
};

const initialNodes = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: 'oil_refining',
    type: 'recipe',
  },
  {
    id: 'n2',
    position: { x: 400, y: 20 },
    data: 'oil_refining',
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
        <Background gap={10} color="#d7dce0" bgColor="#f7f9fb" />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

type Recipe = {
  recipeId: string;
  machineId: string;
  inputs: MaterialData[];
  outputs: MaterialData[];
};

function RecipeNode({ data }: { data: string }) {
  return (
    <div className="rounded bg-white border border-neutral-200 flex flex-col items-center min-w-60">
      <div className="py-2 font-light">Distillation (Stage I)</div>
      <div className="flex w-full px-4">
        <div className="content-none border-t border-neutral-300 grow h-[1px]"></div>
      </div>
      <div className="flex justify-between w-full py-4 leading-2">
        <div className="flex flex-col gap-2">
          {data.inputs.map((x) => (
            <MaterialInfo key={x.materialId} {...x} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {data.outputs.map((x) => (
            <MaterialInfo key={x.materialId} {...x} />
          ))}
        </div>
      </div>
      <div className="flex w-full px-4">
        <div className="content-none border-t border-neutral-300 grow h-[1px]"></div>
      </div>
      <div className="py-2">
        <div className="flex text-neutral-600 gap-2">
          <div className="flex items-center gap-1 bg-neutral-100 rounded px-1">
            <div>0</div>
            <img
              className="invert opacity-60 w-[16px] h-[16px]"
              src={Worker}
              alt="Worker"
            />
          </div>
          <div className="flex items-center gap-1 bg-neutral-100 rounded px-1">
            <div>0</div>
            <img
              className="invert opacity-60 w-[16px] h-[16px]"
              src={Electricity}
              alt="Electricity"
            />
          </div>
          <div className="flex items-center gap-1 bg-neutral-100 rounded px-1">
            <div>0</div>
            <img
              className="invert opacity-60 w-[16px] h-[16px]"
              src={Maintenance}
              alt="Maintenance"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TextWithLine() {
  return (
    <div className="text-[9px] text-neutral-500 flex items-center gap-1 w-full px-2">
      <div className="content-none border-t border-neutral-200 grow h-[1px]"></div>
      <div>Inputs & Outputs</div>
      <div className="content-none border-t border-neutral-300 grow h-[1px]"></div>
    </div>
  );
}

type MaterialType = 'input' | 'output';

type MaterialData = {
  materialId: string;
  icon: string;
  amountTotal: number;
  amountUsed: number;
  type: MaterialType;
};

function MaterialInfo(data: MaterialData) {
  const handleRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(-12);

  useEffect(() => {
    if (handleRef.current) {
      const offsetDirection = data.type === 'input' ? -1 : 1;
      setOffset((handleRef.current.offsetWidth / 2) * offsetDirection);
    }
  }, [data.amountUsed]);

  return (
    <div
      className="flex items-center gap-1 font-(family-name:--font-numeric)"
      style={{ transform: `translateX(${offset}px)` }}
    >
      {data.type === 'input' ? inputLayout() : outputLayout()}
    </div>
  );

  function inputLayout() {
    return (
      <>
        <div ref={handleRef}>
          <MaterialHandle {...data} />
        </div>
        <MaterialAmount {...data} />
        <MaterialIcon {...data} />
      </>
    );
  }

  function outputLayout() {
    return (
      <>
        <MaterialIcon {...data} />
        <MaterialAmount {...data} />
        <div ref={handleRef}>
          <MaterialHandle {...data} />
        </div>
      </>
    );
  }
}

function MaterialIcon(data: MaterialData) {
  return (
    <div className="h-[24px] w-[24px] p-[2px] border border-neutral-300 rounded-sm">
      <img className="h-full w-full" src={data.icon} alt={data.materialId} />
    </div>
  );
}

function MaterialAmount(data: MaterialData) {
  return (
    <div className="h-[24px] min-w-[24px] p-[2px] border border-neutral-300 rounded-sm flex items-center justify-center text-neutral-500">
      {data.amountTotal}
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

function MaterialHandle(data: MaterialData) {
  const color = data.type === 'input' ? 'bg-[#00a41b]' : 'bg-[#db0000]';
  const handleType = data.type === 'input' ? 'target' : 'source';
  const position = data.type === 'input' ? Position.Left : Position.Right;

  return (
    <Handle
      type={handleType}
      position={position}
      style={handleReset}
      id={data.materialId}
    >
      <div
        className={`text-neutral-100 min-w-[24px] h-[24px] ${color} flex items-center justify-center rounded-sm border border-[#ffffff60]`}
      >
        {data.amountUsed}
      </div>
    </Handle>
  );
}
