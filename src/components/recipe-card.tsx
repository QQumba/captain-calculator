import {
  type IngredientDescriptor,
  type RecipeDescriptor,
} from '@/data/recipes';

import arrow from '../assets/arrow.svg';
import plus from '../assets/plus.svg';
import { useFlowStore } from '@/stores/chart-store';
import { getMachine } from '@/data/machines';
import { getMaterial } from '@/data/materials';
import type { RecipeNodeMaterialData } from './recipe-node';

export default function RecipeCard({ recipe }: { recipe: RecipeDescriptor }) {
  const machine = getMachine(recipe.machineId);
  const { addNode } = useFlowStore();

  function getMaterialData(): RecipeNodeMaterialData[] {
    const inputs: RecipeNodeMaterialData[] = recipe.inputs.map((input) => ({
      materialId: input.materialId,
      amountTotal: input.amount,
      amountUsed: 0,
      type: 'input',
    }));

    const outputs: RecipeNodeMaterialData[] = recipe.outputs.map((output) => ({
      materialId: output.materialId,
      amountTotal: output.amount,
      amountUsed: 0,
      type: 'output',
    }));

    return inputs.concat(outputs);
  }

  return (
    <div
      className="rounded bg-white shadow border border-neutral-200 flex items-center w-full p-2 text-xs select-none hover:shadow hover:cursor-pointer hover:bg-neutral-50 transition-all gap-1"
      onClick={() =>
        addNode({
          data: {
            recipeId: recipe.recipeId,
            materials: getMaterialData(),
          },
          type: 'recipe',
        })
      }
    >
      <div className="h-[48px] w-[48px] bg-slate-100 border-2 border-slate-300 rounded p-0.5">
        <img src={machine.icon} alt="" />
      </div>
      <div className="flex items-center grow gap-1">
        {recipe.inputs.map((x, i) => (
          <Ingredient
            key={x.materialId}
            ingredientDescriptor={x}
            last={recipe.inputs.length - 1 === i}
          ></Ingredient>
        ))}
        <div className="w-[16px]">
          <img src={arrow} alt="" />
        </div>
        {recipe.outputs.map((x, i) => (
          <Ingredient
            key={x.materialId}
            ingredientDescriptor={x}
            last={recipe.outputs.length - 1 === i}
          ></Ingredient>
        ))}
      </div>
    </div>
  );
}

function Ingredient({
  ingredientDescriptor,
  last,
}: {
  ingredientDescriptor: IngredientDescriptor;
  last: boolean;
}) {
  const material = getMaterial(ingredientDescriptor.materialId);

  return (
    <div className="flex items-center gap-1">
      <div className="flex flex-col items-center">
        <div className="h-[32px] w-[32px] p-[2px]">
          <img src={material.icon} alt="" />
        </div>
        <div>{ingredientDescriptor.amount}</div>
      </div>
      {!last && (
        <div className="w-[16px]">
          <img src={plus} alt="" />
        </div>
      )}
    </div>
  );
}
