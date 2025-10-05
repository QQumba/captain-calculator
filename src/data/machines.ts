import refinery_1 from '../assets/Distillation_(Stage_I).png';
import refinery_2 from '../assets/Distillation_(Stage_II).png';
import refinery_3 from '../assets/Distillation_(Stage_III).png';

export type Machine = {
  machineId: string;
  name: string;
  energyConsumption: number;
  workers: number;
  maintenance: number;
  icon: string;
};

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
  {
    machineId: 'refinery_3',
    name: 'Distillation (Stage III)',
    energyConsumption: 0,
    workers: 8,
    maintenance: 3,
    icon: refinery_3,
  },
];

export function getMachine(machineId: string): Machine {
  return machines.find((x) => x.machineId == machineId)!;
}
