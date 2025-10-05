export type RecipeDescriptor = {
  recipeId: string;
  machineId: string;
  energyConsumptionMultiplier?: number;
  inputs: IngredientDescriptor[];
  outputs: IngredientDescriptor[];
};

export type IngredientDescriptor = {
  materialId: string;
  amount: number;
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
        materialId: 'steam_high',
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
        materialId: 'steam_high',
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
  {
    recipeId: 'light_oil_refining',
    machineId: 'refinery_3',
    inputs: [
      {
        materialId: 'light_oil',
        amount: 30,
      },
      {
        materialId: 'steam_high',
        amount: 3,
      },
    ],
    outputs: [
      {
        materialId: 'naphta',
        amount: 24,
      },
      {
        materialId: 'fuel_gas',
        amount: 12,
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
