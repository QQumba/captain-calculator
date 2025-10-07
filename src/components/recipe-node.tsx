import { getRecipe } from '../data/recipes';
import worker from '../assets/Worker.png';
import maintenance from '../assets/Maintenance.png';
import electricity from '../assets/Electricity.png';
import { useEffect, useRef, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Trash2 } from 'lucide-react';
import { useFlowStore } from '@/stores/chart-store';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { getMachine, type Machine } from '@/data/machines';
import { getMaterial } from '@/data/materials';

type MaterialType = 'input' | 'output';

export type RecipeNodeData = {
  recipeId: string;
  materials: RecipeNodeMaterialData[];
};

export type RecipeNodeMaterialData = {
  materialId: string;
  type: MaterialType;
  amountTotal: number;
  amountUsed: number;
};

export function RecipeNode({
  id,
  data,
  selected,
}: {
  id: string;
  data: RecipeNodeData;
  selected: boolean;
}) {
  const { removeNode } = useFlowStore();

  const recipe = getRecipe(data.recipeId);
  const machine = getMachine(recipe.machineId);

  return (
    <div
      className={`rounded border-2 flex flex-col items-center min-w-60 transition-colors hover:shadow ${
        selected ? 'border-blue-400 bg-blue-50' : 'border-neutral-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-around gap-2 w-full px-4">
        <div className="h-[32px] w-[32px] p-[2px]">
          <img src={machine.icon} alt="" />
        </div>
        <div className="py-2 font-light">{machine.name}</div>
        <Trash2
          className="h-4 w-4 text-red-600 cursor-pointer hover:text-red-700 transition-colors"
          onClick={() => removeNode(id!)}
        ></Trash2>
      </div>
      <div className="flex w-full px-4">
        <div className="content-none border-t border-neutral-300 grow h-[1px]"></div>
      </div>
      <div className="flex justify-between w-full py-4 leading-2">
        <div className="flex flex-col gap-2">
          {data.materials
            .filter((x) => x.type === 'input')
            .map((x) => (
              <IngredientInfo key={x.materialId} {...x} />
            ))}
        </div>
        <div className="flex flex-col gap-2">
          {data.materials
            .filter((x) => x.type === 'output')
            .map((x) => (
              <IngredientInfo key={x.materialId} {...x} />
            ))}
        </div>
      </div>
      <div className="flex w-full px-4">
        <div className="content-none border-t border-neutral-300 grow h-[1px]"></div>
      </div>
      <MachineInfo machine={machine}></MachineInfo>
    </div>
  );
}

function MachineInfo({ machine }: { machine: Machine }) {
  return (
    <div className="flex gap-2 py-2">
      <MachineInfoElement
        icon={worker}
        text={machine.workers.toString()}
      ></MachineInfoElement>
      <MachineInfoElement
        icon={electricity}
        text={machine.energyConsumption.toString()}
      ></MachineInfoElement>
      <MachineInfoElement
        icon={maintenance}
        text={machine.maintenance.toString()}
      ></MachineInfoElement>
    </div>
  );

  function MachineInfoElement({ icon, text }: { icon: string; text: string }) {
    return (
      <div className="rounded-xs border border-neutral-300 px-1 py-0.5 text-sm">
        <div className="flex items-center gap-1 opacity-60">
          <div>{text}</div>
          <img
            className="invert w-[14px] h-[14px]"
            src={icon}
            alt="Maintenance"
          />
        </div>
      </div>
    );
  }
}

// function IngredientGroup({ ingredients }: { ingredients: IngredientData[] }) {
//   return (
//     <div className="flex flex-col gap-2">
//       {ingredients.map((x) => (
//         <IngredientInfo
//           key={x.material.materialId}
//           {...x.material}
//           type={'output'}
//           amountTotal={x.amount}
//           amountUsed={0}
//         />
//       ))}
//     </div>
//   );
// }

function IngredientInfo(data: RecipeNodeMaterialData) {
  const handleRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(-12);
  const amountUsed = 0;
  const material = getMaterial(data.materialId);

  useEffect(() => {
    if (handleRef.current) {
      const offsetDirection = data.type === 'input' ? -1 : 1;
      setOffset((handleRef.current.offsetWidth / 2) * offsetDirection);
    }
  }, [amountUsed]);

  return (
    <div
      className="flex items-center gap-1 font-(family-name:--font-numeric) text-sm leading-2"
      style={{ transform: `translateX(${offset}px)` }}
    >
      {data.type === 'input' ? inputLayout() : outputLayout()}
    </div>
  );

  function inputLayout() {
    return (
      <>
        <div ref={handleRef}>
          <MaterialHandle
            type={data.type}
            materialId={data.materialId}
            amountUsed={data.amountUsed}
          />
        </div>
        <MaterialAmount amount={data.amountTotal} />
        <MaterialIcon icon={material.icon} name={material.name} />
      </>
    );
  }

  function outputLayout() {
    return (
      <>
        <MaterialIcon icon={material.icon} name={material.name} />
        <MaterialAmount amount={data.amountTotal} />
        <div ref={handleRef}>
          <MaterialHandle
            type={data.type}
            materialId={data.materialId}
            amountUsed={data.amountUsed}
          />
        </div>
      </>
    );
  }
}

function MaterialIcon({ icon, name }: { icon: string; name: string }) {
  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <div className="h-[24px] w-[24px] p-[4px] border border-neutral-300 rounded-xs">
          <img className="h-full w-full" src={icon} />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{name}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function MaterialAmount({ amount }: { amount: number }) {
  return (
    <div className="h-[24px] min-w-[24px] p-[2px] border border-neutral-300 rounded-xs flex items-center justify-center text-neutral-500">
      {amount}
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
  minWidth: '24px',
};

function MaterialHandle({
  type,
  materialId,
  amountUsed,
}: {
  type: MaterialType;
  materialId: string;
  amountUsed: number;
}) {
  const color = type === 'input' ? 'bg-[#00a41b]' : 'bg-[#db0000]';
  const handleType = type === 'input' ? 'target' : 'source';
  const position = type === 'input' ? Position.Left : Position.Right;

  return (
    <Handle
      type={handleType}
      position={position}
      style={handleReset}
      id={materialId}
    >
      <div
        className={`text-neutral-100 min-w-[24px] h-[24px] ${color} flex items-center justify-center rounded-xs`}
      >
        {amountUsed}
      </div>
    </Handle>
  );
}
