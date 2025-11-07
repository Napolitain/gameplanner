/**
 * Game constants and race-specific data
 */

export type Race = 'Terran' | 'Protoss' | 'Zerg';

/**
 * Frames per second at game speed "Faster"
 */
export const FRAMES_PER_SECOND = 22.4;

/**
 * Energy regeneration per frame
 */
export const ENERGY_REGEN_PER_FRAME = 0.03515625;

/**
 * Larva spawn interval in frames (10.71 seconds)
 */
export const LARVA_SPAWN_INTERVAL = 240;

/**
 * Maximum natural larva per hatchery
 */
export const MAX_NATURAL_LARVA = 3;

/**
 * Maximum larva per hatchery with injects
 */
export const MAX_INJECT_LARVA = 19;

/**
 * Starting resources and supply by race
 */
export const RACE_STARTING_DATA: Record<Race, {
  minerals: number;
  vespene: number;
  supply: number;
  supplyCap: number;
  workers: number;
  townHall: string;
  worker: string;
  supplyStructure: string;
  overlay?: string; // Zerg overlay
}> = {
  Terran: {
    minerals: 50,
    vespene: 0,
    supply: 12,
    supplyCap: 15,
    workers: 12,
    townHall: 'CommandCenter',
    worker: 'SCV',
    supplyStructure: 'SupplyDepot'
  },
  Protoss: {
    minerals: 50,
    vespene: 0,
    supply: 12,
    supplyCap: 15,
    workers: 12,
    townHall: 'Nexus',
    worker: 'Probe',
    supplyStructure: 'Pylon'
  },
  Zerg: {
    minerals: 50,
    vespene: 0,
    supply: 13,
    supplyCap: 14,
    workers: 12,
    townHall: 'Hatchery',
    worker: 'Drone',
    supplyStructure: 'Overlord',
    overlay: 'Overlord'
  }
};

/**
 * Unit/structure data including costs and build times
 */
export interface UnitData {
  name: string;
  mineralCost: number;
  vespeneCost: number;
  supplyCost: number;
  buildTime: number; // in seconds
  isWorker: boolean;
  isStructure: boolean;
  isUnit: boolean;
  requires?: string[]; // Tech requirements
}

/**
 * Helper to convert game time in seconds to frames
 */
function secondsToFrames(seconds: number): number {
  return seconds / FRAMES_PER_SECOND;
}

/**
 * Sample unit data (simplified - full data would be much larger)
 */
export const UNIT_DATA: Record<string, UnitData> = {
  // Terran
  SCV: {
    name: 'SCV',
    mineralCost: 50,
    vespeneCost: 0,
    supplyCost: 1,
    buildTime: secondsToFrames(17),
    isWorker: true,
    isStructure: false,
    isUnit: false
  },
  Marine: {
    name: 'Marine',
    mineralCost: 50,
    vespeneCost: 0,
    supplyCost: 1,
    buildTime: secondsToFrames(18),
    isWorker: false,
    isStructure: false,
    isUnit: true,
    requires: ['Barracks']
  },
  CommandCenter: {
    name: 'CommandCenter',
    mineralCost: 400,
    vespeneCost: 0,
    supplyCost: 0,
    buildTime: secondsToFrames(71),
    isWorker: false,
    isStructure: true,
    isUnit: false
  },
  SupplyDepot: {
    name: 'SupplyDepot',
    mineralCost: 100,
    vespeneCost: 0,
    supplyCost: 0,
    buildTime: secondsToFrames(21),
    isWorker: false,
    isStructure: true,
    isUnit: false
  },
  Barracks: {
    name: 'Barracks',
    mineralCost: 150,
    vespeneCost: 0,
    supplyCost: 0,
    buildTime: secondsToFrames(46),
    isWorker: false,
    isStructure: true,
    isUnit: false,
    requires: ['SupplyDepot']
  },
  // Add more units as needed
};
