/**
 * Game Logic Module - Core simulation engine for StarCraft 2 build order planning
 * 
 * This module provides the business logic interface and core functions for simulating
 * StarCraft 2 build orders frame-by-frame at game speed "Faster" (22.4 FPS).
 */

export { GameLogic } from './gamelogic';
export type { BuildOrderItem } from './gamelogic';

export { Unit } from './unit';
export { Task } from './task';
export { Event } from './event';

export { 
  calculateMineralIncome, 
  calculateVespeneIncome,
  calculateMuleIncome,
  distributeWorkers 
} from './income';

export type { Race, UnitData } from './constants';
export { 
  FRAMES_PER_SECOND,
  ENERGY_REGEN_PER_FRAME,
  LARVA_SPAWN_INTERVAL,
  MAX_NATURAL_LARVA,
  MAX_INJECT_LARVA,
  INITIAL_ENERGY,
  QUEEN_INITIAL_ENERGY,
  RACE_STARTING_DATA,
  UNIT_DATA
} from './constants';
