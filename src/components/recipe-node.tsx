import {
  getMachine,
  getMaterial,
  getRecipe,
  type IngredientDescriptor,
  type Machine,
} from '../data/recipe-repo';
import Worker from '../assets/Worker.png';
import Maintenance from '../assets/Maintenance.png';
import Electricity from '../assets/Electricity.png';
import { useEffect, useRef, useState } from 'react';
import { Handle, Position, useNodeId } from '@xyflow/react';
import { Trash2 } from 'lucide-react';
import { useFlowStore } from '@/stores/chart-store';
import { Tooltip, TooltipTrigger } from './ui/tooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';

type IngredientType = 'input' | 'output';

// type IngredientData = {
//   materialId: string;
//   icon: string;
//   amountTotal: number;
//   amountUsed: number;
//   type: IngredientType;
// };

export function RecipeNode({
  id,
  data,
  selected,
}: {
  id: string;
  data: { recipeId: string };
  selected: boolean;
}) {
  const { removeNode } = useFlowStore();

  const recipe = getRecipe(data.recipeId);
  const machine = getMachine(recipe.machineId);

  return (
    <div
      className={`rounded border flex flex-col items-center min-w-60 transition-colors bg-white border-neutral-200 outline-2 ${
        selected ? 'outline-blue-400' : 'outline-transparent'
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
          {recipe.inputs.map((x) => (
            <IngredientInfo key={x.materialId} ingredient={x} type={'input'} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {recipe.outputs.map((x) => (
            <IngredientInfo key={x.materialId} ingredient={x} type={'output'} />
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
        icon={Worker}
        text={machine.workers.toString()}
      ></MachineInfoElement>
      <MachineInfoElement
        icon={Electricity}
        text={machine.energyConsumption.toString()}
      ></MachineInfoElement>
      <MachineInfoElement
        icon={Maintenance}
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
            className="invert w-[16px] h-[16px]"
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

function IngredientInfo({
  ingredient,
  type,
}: {
  ingredient: IngredientDescriptor;
  type: IngredientType;
}) {
  const handleRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(-12);
  const amountUsed = 0;
  const material = getMaterial(ingredient.materialId);

  useEffect(() => {
    if (handleRef.current) {
      const offsetDirection = type === 'input' ? -1 : 1;
      setOffset((handleRef.current.offsetWidth / 2) * offsetDirection);
    }
  }, [amountUsed]);

  return (
    <div
      className="flex items-center gap-1 font-(family-name:--font-numeric) text-sm leading-2"
      style={{ transform: `translateX(${offset}px)` }}
    >
      {type === 'input' ? inputLayout() : outputLayout()}
    </div>
  );

  function inputLayout() {
    return (
      <>
        <div ref={handleRef}>
          <MaterialHandle
            type={type}
            materialId={ingredient.materialId}
            amountUsed={0}
          />
        </div>
        <MaterialAmount amount={ingredient.amount} />
        <MaterialIcon icon={material.icon} />
      </>
    );
  }

  function outputLayout() {
    return (
      <>
        <MaterialIcon icon={material.icon} />
        <MaterialAmount amount={ingredient.amount} />
        <div ref={handleRef}>
          <MaterialHandle
            type={type}
            materialId={ingredient.materialId}
            amountUsed={0}
          />
        </div>
      </>
    );
  }
}

function MaterialIcon({ icon }: { icon: string }) {
  return (
    <Tooltip delayDuration={50}>
      <TooltipTrigger asChild>
        <div className="h-[24px] w-[24px] p-[4px] border border-neutral-300 rounded-xs">
          <img className="h-full w-full" src={icon} />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>hello</p>
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
  type: IngredientType;
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
