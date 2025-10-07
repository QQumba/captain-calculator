import mediumOil from '../assets/Medium_Oil.png';
import crudeOil from '../assets/Crude_Oil.png';
import heavyOil from '../assets/Heavy_Oil.png';
import lightOil from '../assets/Light_Oil.png';
import sourWater from '../assets/Sour_Water.png';
import water from '../assets/Water.png';
import steamHigh from '../assets/SteamHp.png';
import diesel from '../assets/Diesel.png';
import exhaust from '../assets/Exhaust.png';
import naphta from '../assets/Naphtha.png';
import fuelGas from '../assets/Fuel_Gas.png';

type Material = {
  materialId: string;
  name: string;
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
    name: 'Crude Oil',
    icon: crudeOil,
    type: 'fluid',
  },
  {
    materialId: 'medium_oil',
    name: 'Medium Oil',
    icon: mediumOil,
    type: 'fluid',
  },
  {
    materialId: 'light_oil',
    name: 'Light Oil',
    icon: lightOil,
    type: 'fluid',
  },
  {
    materialId: 'heavy_oil',
    name: 'Heavy Oil',
    icon: heavyOil,
    type: 'fluid',
  },
  {
    materialId: 'naphta',
    name: 'Naphta',
    icon: naphta,
    type: 'fluid',
  },
  {
    materialId: 'fuel_gas',
    name: 'Fuel Gas',
    icon: fuelGas,
    type: 'fluid',
  },
  {
    materialId: 'steam_high',
    name: 'Steam High',
    icon: steamHigh,
    type: 'fluid',
  },
  {
    materialId: 'sour_water',
    name: 'Sour Water',
    icon: sourWater,
    type: 'fluid',
  },
  {
    materialId: 'water',
    name: 'Water',
    icon: water,
    type: 'fluid',
  },
  {
    materialId: 'diesel',
    name: 'Diesel',
    icon: diesel,
    type: 'fluid',
  },
  {
    materialId: 'exhaust',
    name: 'Exhaust',
    icon: exhaust,
    type: 'fluid',
  },
];
