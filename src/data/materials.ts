import mediumOil from '../assets/Medium_Oil.png';
import crudeOil from '../assets/Crude_Oil.png';
import heavyOil from '../assets/Heavy_Oil.png';
import lightOil from '../assets/Light_Oil.png';
import sourWater from '../assets/Sour_Water.png';
import steamHigh from '../assets/SteamHp.png';
import diesel from '../assets/Diesel.png';
import exhaust from '../assets/Exhaust.png';
import naphta from '../assets/Naphtha.png';
import fuelGas from '../assets/Fuel_Gas.png';

type Material = {
  materialId: string;
  icon: string;
  type: 'unit' | 'bulk' | 'fluid' | 'molten';
};

export function getMaterial(materialId: string): Material {
  const material = materials.find((x) => x.materialId == materialId);
  if (!material) {
    throw new Error(`${materialId} not found`);
  }
  return material;
}

const materials: Material[] = [
  {
    materialId: 'crude_oil',
    icon: crudeOil,
    type: 'fluid',
  },
  {
    materialId: 'medium_oil',
    icon: mediumOil,
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
    materialId: 'naphta',
    icon: naphta,
    type: 'fluid',
  },
  {
    materialId: 'fuel_gas',
    icon: fuelGas,
    type: 'fluid',
  },
  {
    materialId: 'steam_high',
    icon: steamHigh,
    type: 'fluid',
  },
  {
    materialId: 'sour_water',
    icon: sourWater,
    type: 'fluid',
  },
  {
    materialId: 'diesel',
    icon: diesel,
    type: 'fluid',
  },
  {
    materialId: 'exhaust',
    icon: exhaust,
    type: 'fluid',
  },
];
