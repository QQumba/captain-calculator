import oilIcon from '../assets/Medium_Oil.png';
import crudeOil from '../assets/Crude_Oil.png';
import heavyOil from '../assets/Heavy_Oil.png';
import lightOil from '../assets/Light_Oil.png';
import sourWater from '../assets/Sour_Water.png';
import steamIcon from '../assets/SteamHp.png';
import dieselIcon from '../assets/Diesel.png';
import exhaustIcon from '../assets/Exhaust.png';
import refinery_1 from '../assets/Distillation_(Stage_I).png';
import refinery_2 from '../assets/Distillation_(Stage_II).png';

export type RecipeDescriptor = {
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

export type Machine = {
  machineId: string;
  name: string;
  energyConsumption: number;
  workers: number;
  maintenance: number;
  icon: string;
};

export type IngredientDescriptor = {
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
    recipeId: 'crude_oil_refining',
    machineId: 'refinery_1',
    inputs: [
      {
        materialId: 'crude_oil',
        amount: 60,
      },
      {
        materialId: 'steam',
        amount: 6,
      },
    ],
    outputs: [
      {
        materialId: 'medium_oil',
        amount: 48,
      },
      {
        materialId: 'heavy_oil',
        amount: 12,
      },
      {
        materialId: 'sour_water',
        amount: 18,
      },
    ],
  },
  {
    recipeId: 'medium_oil_refining',
    machineId: 'refinery_2',
    inputs: [
      {
        materialId: 'medium_oil',
        amount: 48,
      },
      {
        materialId: 'steam',
        amount: 3,
      },
    ],
    outputs: [
      {
        materialId: 'diesel',
        amount: 36,
      },
      {
        materialId: 'light_oil',
        amount: 30,
      },
    ],
  },
];

export function getRecipeIds() {
  return recipes.map((x) => x.recipeId);
}

export function getRecipe(recipeId: string): RecipeDescriptor {
  return recipes.find((x) => x.recipeId == recipeId)!;
}

const materials: Material[] = [
  {
    materialId: 'crude_oil',
    icon: crudeOil,
    type: 'fluid',
  },
  {
    materialId: 'medium_oil',
    icon: oilIcon,
    type: 'fluid',
  },
  {
    materialId: 'light_oil',
    icon: lightOil,
    type: 'fluid',
  },
  {
    materialId: 'heavy_oil',
    icon: heavyOil,
    type: 'fluid',
  },
  {
    materialId: 'steam',
    icon: steamIcon,
    type: 'fluid',
  },
  {
    materialId: 'sour_water',
    icon: sourWater,
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

export function getMaterial(materialId: string): Material {
  const material = materials.find((x) => x.materialId == materialId);
  if (!material) {
    throw new Error(`${materialId} not found`);
  }
  return material;
}

const machines: Machine[] = [
  {
    machineId: 'refinery_1',
    name: 'Distillation (Stage I)',
    energyConsumption: 0,
    workers: 6,
    maintenance: 3,
    icon: refinery_1,
  },
  {
    machineId: 'refinery_2',
    name: 'Distillation (Stage II)',
    energyConsumption: 0,
    workers: 8,
    maintenance: 3,
    icon: refinery_2,
  },
];

export function getMachine(machineId: string): Machine {
  return machines.find((x) => x.machineId == machineId)!;
}

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
