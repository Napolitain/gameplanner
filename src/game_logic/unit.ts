import { Task } from './task';
import { ENERGY_REGEN_PER_FRAME, LARVA_SPAWN_INTERVAL, FRAMES_PER_SECOND } from './constants';

// Worker types for checking if unit is a worker
const WORKER_TYPES = new Set(['SCV', 'Probe', 'Drone']);

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
  
  /** Unit expiration frame (e.g., for MULE) - -1 means never expires */
  isAliveUntilFrame: number;
  
  /** Terran supply depot - has supply drop */
  hasSupplyDrop: boolean;
  
  /** Background tasks (e.g., Zerg larva tasks) */
  backgroundTask: Task[];
  
  /** Addon tasks (e.g., Terran reactor tasks) */
  addonTasks: Task[];

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
    this.isAliveUntilFrame = -1;
    this.hasSupplyDrop = false;
    this.backgroundTask = [];
    this.addonTasks = [];
  }

  /**
   * Checks if the unit is idle (no tasks or has available slots)
   */
  isIdle(): boolean {
    // If flying, not idle
    if (this.isFlying) {
      return false;
    }
    
    // Workers that are mining or scouting are not idle
    if (WORKER_TYPES.has(this.name) && (this.isMiningGas || this.isScouting)) {
      return false;
    }
    
    // Zerg structures with larva are considered idle if they have larva
    if (this.larvaCount > 0) {
      return true;
    }
    
    // Reactor allows 2 simultaneous tasks - check if reactor has space
    if (this.hasReactor) {
      return this.addonTasks.length < 2;
    }
    
    // For non-reactor units, idle means no tasks
    return this.tasks.length === 0;
  }

  /**
   * Checks if the unit is busy (has active tasks)
   */
  isBusy(): boolean {
    return this.tasks.length > 0 || this.backgroundTask.length > 0 || this.addonTasks.length > 0;
  }
  
  /**
   * Checks if this unit has an addon (techlab or reactor)
   */
  hasAddon(): boolean {
    return this.hasTechlab || this.hasReactor;
  }
  
  /**
   * Checks if this worker is mining minerals
   * Returns true only if the unit is a worker type (SCV, Probe, Drone),
   * has no tasks, is not mining gas, and is not scouting
   */
  isMiningMinerals(): boolean {
    return WORKER_TYPES.has(this.name) && !this.isMiningGas && !this.isScouting && this.tasks.length === 0;
  }
  
  /**
   * Checks if unit is still alive (for units with expiration like MULE)
   */
  isAlive(frame: number): boolean {
    return this.isAliveUntilFrame === -1 || frame < this.isAliveUntilFrame;
  }
  
  /**
   * Checks if chronoboost is currently active
   */
  hasChrono(frame: number): boolean {
    return this.hasChronoUntilFrame > frame;
  }
  
  /**
   * Activates chronoboost - automatically calculates when it should run out
   * Chronoboost lasts 20 seconds at normal speed
   */
  addChrono(startFrame: number): void {
    this.hasChronoUntilFrame = startFrame + 20 * FRAMES_PER_SECOND;
  }

  /**
   * Updates unit state each frame
   * - Regenerates energy
   * - Updates larva spawning
   * - Processes inject larvae
   * - Progresses tasks
   * - Expires chronoboost
   */
  update(currentFrame: number): void {
    // Regenerate energy
    this.energy = Math.min(200, this.energy + ENERGY_REGEN_PER_FRAME);
    
    // Update Zerg larva spawning
    if (this.isZergTownHall()) {
      // Initialize larva spawning for new hatchery
      if (this.nextLarvaSpawn === 0) {
        this.nextLarvaSpawn = currentFrame + LARVA_SPAWN_INTERVAL;
        if (this.larvaCount === 0) {
          this.larvaCount = 1;
        }
      }
      
      // Spawn larva when time has elapsed (only if below max)
      if (this.larvaCount < 3 && this.nextLarvaSpawn > 0 && currentFrame >= this.nextLarvaSpawn) {
        this.larvaCount++;
        this.nextLarvaSpawn = currentFrame + LARVA_SPAWN_INTERVAL;
      }
    }
    
    // Process inject larvae spawning
    if (this.hasInjectUntilFrame > 0 && currentFrame >= this.hasInjectUntilFrame) {
      this.larvaCount = Math.min(19, this.larvaCount + 4);
      this.hasInjectUntilFrame = 0;
    }
    
    // Expire chronoboost
    if (this.hasChronoUntilFrame > 0 && currentFrame >= this.hasChronoUntilFrame) {
      this.hasChronoUntilFrame = 0;
    }
    
    // Determine if chronoboost is active
    const progressRate = this.hasChrono(currentFrame) ? 1.5 : 1.0;
    
    // Update main tasks
    for (const task of this.tasks) {
      if (task) {
        task.progress += progressRate;
        
        // Note: Don't remove completed tasks here - GameLogic.checkCompletedTasks() 
        // will handle task removal after processing the results
      }
    }
    
    // Update background tasks (e.g., Zerg larva tasks)
    // Chronoboost affects larva production from chronoboosted hatcheries
    for (const task of this.backgroundTask) {
      if (task) {
        task.progress += progressRate;
      }
    }
    
    // Update addon tasks (e.g., Terran reactor tasks)
    // Chronoboost affects addon production when structure is chronoboosted
    for (const task of this.addonTasks) {
      if (task) {
        task.progress += progressRate;
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
   * @param task - The task to add
   * @param taskForReactor - If true, adds to reactor task queue
   * @param taskForLarva - If true, adds to background task queue (for larva)
   */
  addTask(task: Task, taskForReactor: boolean = false, taskForLarva: boolean = false): void {
    if (taskForReactor) {
      this.addonTasks.push(task);
    } else if (taskForLarva) {
      this.backgroundTask.push(task);
    } else {
      this.tasks.push(task);
    }
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
