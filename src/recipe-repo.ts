import oilIcon from './assets/Medium_Oil.png';
import steamIcon from './assets/SteamHp.png';
import dieselIcon from './assets/Diesel.png';
import exhaustIcon from './assets/Exhaust.png';

type RecipeDescriptor = {
  recipeId: string;
  machineId: string;
  energyConsumptionMultiplier?: number;
  inputs: IngredientDescriptor[];
  outputs: IngredientDescriptor[];
};

type RecipeData = {
  recipeId: string;
  machine: Machine;
  energyConsumptionMultiplier?: number;
  inputs: IngredientData[];
  outputs: IngredientData[];
};

type Machine = {
  machineId: string;
  energyConsumption: number;
  workers: number;
  maintenance: number;
};

type IngredientDescriptor = {
  materialId: string;
  amount: number;
};

type IngredientData = {
  material: Material;
  amount: number;
};

type Material = {
  materialId: string;
  icon: string;
  type: 'unit' | 'bulk' | 'fluid' | 'molten';
};

const recipes: RecipeDescriptor[] = [
  {
    recipeId: 'oil_refining',
    machineId: 'refinery_2',
    inputs: [
      {
        materialId: 'oil',
        amount: 60,
      },
      {
        materialId: 'steam',
        amount: 9,
      },
    ],
    outputs: [
      {
        materialId: 'diesel',
        amount: 36,
      },
      {
        materialId: 'exhaust',
        amount: 16,
      },
    ],
  },
];

const materials: Material[] = [
  {
    materialId: 'oil',
    icon: oilIcon,
    type: 'fluid',
  },
  {
    materialId: 'steam',
    icon: steamIcon,
    type: 'fluid',
  },
  {
    materialId: 'diesel',
    icon: dieselIcon,
    type: 'fluid',
  },
  {
    materialId: 'exhaust',
    icon: exhaustIcon,
    type: 'fluid',
  },
];

const machines: Machine[] = [
  {
    machineId: 'refinery_2',
    energyConsumption: 3,
    workers: 2,
    maintenance: 1,
  },
];

export function getRecipeData(recipeId: string): RecipeData | null {
  const descriptor = recipes.find((x) => x.recipeId == recipeId);
  if (!descriptor) {
    return null;
  }

  const machine = machines.find((x) => x.machineId == descriptor.machineId);
  if (!machine) {
    return null;
  }

  const recipeData: RecipeData = {
    recipeId: recipeId,
    machine: machine,
    inputs: [],
    outputs: [],
  };

  try {
    recipeData.inputs = getIngredients(descriptor.inputs);
    recipeData.outputs = getIngredients(descriptor.outputs);
  } catch {
    return null;
  }

  return recipeData;
}

function getIngredients(
  ingredientDescriptors: IngredientDescriptor[]
): IngredientData[] {
  return ingredientDescriptors.map((descriptor) => {
    const material = materials.find(
      (x) => x.materialId == descriptor.materialId
    );

    if (!material) {
      throw Error;
    }

    const ingredientData: IngredientData = {
      material: material,
      amount: descriptor.amount,
    };

    return ingredientData;
  });
}
