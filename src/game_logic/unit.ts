import { Task } from './task';
import { ENERGY_REGEN_PER_FRAME, LARVA_SPAWN_INTERVAL } from './constants';

/**
 * Unit class represents units, structures, or workers in the game
 */
export class Unit {
  /** Name of the unit (e.g., "CommandCenter", "SCV", "Marine") */
  name: string;
  
  /** Unique identifier */
  id: number;
  
  /** Current energy (for abilities) */
  energy: number;
  
  /** Queue of tasks this unit is performing */
  tasks: Task[];
  
  /** Worker state - mining gas */
  isMiningGas: boolean;
  
  /** Worker state - scouting */
  isScouting: boolean;
  
  /** Terran addon state - has techlab */
  hasTechlab: boolean;
  
  /** Terran addon state - has reactor */
  hasReactor: boolean;
  
  /** Terran building state - is flying */
  isFlying: boolean;
  
  /** Protoss chronoboost - accelerated until this frame */
  hasChronoUntilFrame: number;
  
  /** Zerg larva count (for Hatchery/Lair/Hive) */
  larvaCount: number;
  
  /** Zerg next larva spawn frame */
  nextLarvaSpawn: number;
  
  /** Zerg inject - spawning larvae until this frame */
  hasInjectUntilFrame: number;
  
  /** Race-specific resource accumulator for display */
  raceResourceAccumulator: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
    this.energy = 0;
    this.tasks = [];
    this.isMiningGas = false;
    this.isScouting = false;
    this.hasTechlab = false;
    this.hasReactor = false;
    this.isFlying = false;
    this.hasChronoUntilFrame = 0;
    this.larvaCount = 0;
    this.nextLarvaSpawn = 0;
    this.hasInjectUntilFrame = 0;
    this.raceResourceAccumulator = 0;
  }

  /**
   * Checks if the unit is idle (no tasks or has available slots)
   */
  isIdle(): boolean {
    // No tasks means idle
    if (this.tasks.length === 0) {
      return true;
    }
    
    // Reactor allows 2 simultaneous tasks
    if (this.hasReactor && this.tasks.length < 2) {
      return true;
    }
    
    // Zerg structures with larva are considered idle if they have larva
    if (this.larvaCount > 0) {
      return true;
    }
    
    return false;
  }

  /**
   * Checks if the unit is busy (has active tasks)
   */
  isBusy(): boolean {
    return !this.isIdle();
  }

  /**
   * Updates unit state each frame
   * - Regenerates energy
   * - Updates larva spawning
   * - Processes inject larvae
   * - Progresses tasks
   */
  update(currentFrame: number): void {
    // Regenerate energy
    this.energy = Math.min(200, this.energy + ENERGY_REGEN_PER_FRAME);
    
    // Update Zerg larva spawning
    if (this.isZergTownHall() && currentFrame >= this.nextLarvaSpawn) {
      if (this.larvaCount < 3) {
        this.larvaCount++;
        this.nextLarvaSpawn = currentFrame + LARVA_SPAWN_INTERVAL;
      }
    }
    
    // Process inject larvae spawning
    if (this.hasInjectUntilFrame > 0 && currentFrame >= this.hasInjectUntilFrame) {
      this.larvaCount = Math.min(19, this.larvaCount + 4);
      this.hasInjectUntilFrame = 0;
    }
    
    // Update tasks
    for (const task of this.tasks) {
      if (task) {
        // Apply chronoboost acceleration if active
        const progressRate = (this.hasChronoUntilFrame > currentFrame) ? 1.5 : 1.0;
        task.progress += progressRate;
        
        // Note: Don't remove completed tasks here - GameLogic.checkCompletedTasks() 
        // will handle task removal after processing the results
      }
    }
  }

  /**
   * Checks if this is a Zerg town hall (Hatchery, Lair, Hive)
   */
  private isZergTownHall(): boolean {
    return this.name === 'Hatchery' || this.name === 'Lair' || this.name === 'Hive';
  }

  /**
   * Adds a task to this unit
   */
  addTask(task: Task): void {
    this.tasks.push(task);
  }

  /**
   * Uses larva (Zerg)
   */
  useLarva(): void {
    if (this.larvaCount > 0) {
      this.larvaCount--;
    }
  }
}
