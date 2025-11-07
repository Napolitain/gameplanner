import { Unit } from './unit';
import { Task } from './task';
import { Event } from './event';
import { calculateMineralIncome, calculateVespeneIncome } from './income';
import type { Race } from './constants';
import { RACE_STARTING_DATA, FRAMES_PER_SECOND, UNIT_DATA, LARVA_SPAWN_INTERVAL } from './constants';

/**
 * Build order item interface
 */
export interface BuildOrderItem {
  name: string;
  type: 'unit' | 'structure' | 'upgrade' | 'action';
}

/**
 * GameLogic class - the heart of the simulation engine
 * Manages all game state and executes build order simulation frame by frame
 */
export class GameLogic {
  // Race
  race: Race;
  
  // Resources
  minerals: number;
  vespene: number;
  raceSpecificResource: number; // chronoboost energy, larva count, or MULE count
  
  // Supply
  supplyUsed: number;
  supplyLeft: number;
  supplyCap: number;
  
  // Workers
  workersMinerals: number;
  workersVespene: number;
  workersScouting: number;
  
  // Units - three sets
  units: Set<Unit>;
  idleUnits: Set<Unit>;
  busyUnits: Set<Unit>;
  
  // Progression
  frame: number;
  boIndex: number; // build order index
  
  // History
  eventLog: Event[];
  resourceHistory: Array<{ frame: number; minerals: number; vespene: number; supply: number }>;
  unitsCountArray: Array<{ frame: number; units: number }>;
  
  // Build order
  buildOrder: BuildOrderItem[];
  
  // Settings
  workerStartDelay: number; // frames
  idleLimit: number; // frames
  
  // Error tracking
  errorMessage: string;
  requirements: string[];
  
  // Tech tree
  completedStructures: Set<string>;
  completedUpgrades: Set<string>;
  
  // Unit ID counter
  private nextUnitId: number;

  constructor(race: Race, buildOrder: BuildOrderItem[] = []) {
    this.race = race;
    this.buildOrder = buildOrder;
    
    // Initialize starting state
    const startData = RACE_STARTING_DATA[race];
    this.minerals = startData.minerals;
    this.vespene = startData.vespene;
    this.supplyUsed = startData.supply;
    this.supplyCap = startData.supplyCap;
    this.supplyLeft = this.supplyCap - this.supplyUsed;
    
    this.raceSpecificResource = 0;
    this.workersMinerals = startData.workers; // Starting workers mine after delay
    this.workersVespene = 0;
    this.workersScouting = 0;
    
    this.units = new Set();
    this.idleUnits = new Set();
    this.busyUnits = new Set();
    
    this.frame = 0;
    this.boIndex = 0;
    
    this.eventLog = [];
    this.resourceHistory = [];
    this.unitsCountArray = [];
    
    this.workerStartDelay = Math.floor(6 * FRAMES_PER_SECOND); // 6 seconds default
    this.idleLimit = Math.floor(90 * FRAMES_PER_SECOND); // 90 seconds default
    
    this.errorMessage = '';
    this.requirements = [];
    
    this.completedStructures = new Set();
    this.completedUpgrades = new Set();
    
    this.nextUnitId = 1;
    
    // Initialize starting units
    this.initializeStartingUnits();
  }

  /**
   * Initialize race-specific starting conditions
   */
  private initializeStartingUnits(): void {
    const startData = RACE_STARTING_DATA[this.race];
    
    // Add town hall
    const townHall = new Unit(startData.townHall, this.nextUnitId++);
    if (this.race === 'Zerg') {
      townHall.larvaCount = 3;
      townHall.nextLarvaSpawn = this.frame + LARVA_SPAWN_INTERVAL;
    }
    this.units.add(townHall);
    this.idleUnits.add(townHall);
    this.completedStructures.add(startData.townHall);
    
    // Add starting workers
    for (let i = 0; i < startData.workers; i++) {
      const worker = new Unit(startData.worker, this.nextUnitId++);
      this.units.add(worker);
      // Workers start mining after delay
    }
    
    // Zerg starts with 1 Overlord
    if (this.race === 'Zerg' && startData.overlay) {
      const overlord = new Unit(startData.overlay, this.nextUnitId++);
      this.units.add(overlord);
      this.idleUnits.add(overlord);
    }
  }

  /**
   * Run the simulation frame by frame
   */
  simulate(): void {
    const maxFrames = 20 * 60 * FRAMES_PER_SECOND; // 20 minutes
    let idleFrames = 0;
    
    while (this.frame < maxFrames && this.boIndex < this.buildOrder.length) {
      // Calculate and add income
      this.updateIncome();
      
      // Update unit states
      this.updateUnits();
      
      // Execute build order actions
      const executed = this.executeBuildOrder();
      
      // Check idle condition
      if (!executed && this.idleUnits.size === this.units.size) {
        idleFrames++;
        if (idleFrames > this.idleLimit) {
          break; // Too much idle time
        }
      } else {
        idleFrames = 0;
      }
      
      // Record history
      if (this.frame % 22 === 0) { // Record every second
        this.recordHistory();
      }
      
      this.frame++;
    }
    
    // Check if build order is complete
    if (this.boIndex >= this.buildOrder.length) {
      // Wait for all units to be idle
      while (this.busyUnits.size > 0 && this.frame < maxFrames) {
        this.updateUnits();
        this.frame++;
      }
    }
  }

  /**
   * Calculate and add income each frame
   */
  private updateIncome(): void {
    // Workers on minerals after start delay
    let activeWorkers = 0;
    if (this.frame >= this.workerStartDelay) {
      activeWorkers = this.workersMinerals;
    }
    
    // Calculate mineral income
    const mineralIncome = calculateMineralIncome(activeWorkers);
    this.minerals += mineralIncome;
    
    // Calculate vespene income
    const vespeneIncome = calculateVespeneIncome(this.workersVespene);
    this.vespene += vespeneIncome;
    
    // Update supply
    this.supplyLeft = this.supplyCap - this.supplyUsed;
  }

  /**
   * Update all units each frame
   */
  private updateUnits(): void {
    this.idleUnits.clear();
    this.busyUnits.clear();
    
    for (const unit of this.units) {
      unit.update(this.frame);
      
      // Update idle/busy sets
      if (unit.isIdle()) {
        this.idleUnits.add(unit);
      } else {
        this.busyUnits.add(unit);
      }
      
      // Check for completed tasks
      this.checkCompletedTasks(unit);
    }
  }

  /**
   * Check and handle completed tasks for a unit
   */
  private checkCompletedTasks(unit: Unit): void {
    // Check main tasks
    for (let i = unit.tasks.length - 1; i >= 0; i--) {
      const task = unit.tasks[i];
      if (task && task.isComplete()) {
        this.processCompletedTask(task, unit);
        unit.tasks.splice(i, 1);
      }
    }
    
    // Check background tasks (e.g., Zerg larva tasks)
    for (let i = unit.backgroundTask.length - 1; i >= 0; i--) {
      const task = unit.backgroundTask[i];
      if (task && task.isComplete()) {
        this.processCompletedTask(task, unit);
        unit.backgroundTask.splice(i, 1);
      }
    }
    
    // Check addon tasks (e.g., Terran reactor tasks)
    for (let i = unit.addonTasks.length - 1; i >= 0; i--) {
      const task = unit.addonTasks[i];
      if (task && task.isComplete()) {
        this.processCompletedTask(task, unit);
        unit.addonTasks.splice(i, 1);
      }
    }
  }
  
  /**
   * Process a completed task - spawn units/structures, create events
   */
  private processCompletedTask(task: Task, unit: Unit): void {
    // Spawn worker
    if (task.newWorker) {
      const worker = new Unit(task.newWorker, this.nextUnitId++);
      this.units.add(worker);
      this.supplyUsed++;
      this.workersMinerals++;
    }
    
    // Spawn unit
    if (task.newUnit) {
      const newUnit = new Unit(task.newUnit, this.nextUnitId++);
      this.units.add(newUnit);
      this.supplyUsed += UNIT_DATA[task.newUnit]?.supplyCost || 0;
      
      // Special case: Queen starts with 25 energy
      if (task.newUnit === 'Queen') {
        newUnit.energy = 25;
      }
      
      // Special case: Zergling spawns 2 units
      if (task.newUnit === 'Zergling') {
        const secondZergling = new Unit(task.newUnit, this.nextUnitId++);
        this.units.add(secondZergling);
      }
    }
    
    // Spawn structure
    if (task.newStructure) {
      const structure = new Unit(task.newStructure, this.nextUnitId++);
      structure.energy = 50; // Most structures start with 50 energy
      this.units.add(structure);
      this.completedStructures.add(task.newStructure);
      
      // Update supply cap for supply structures
      if (task.newStructure.includes('Depot') || 
          task.newStructure.includes('Pylon') ||
          task.newStructure.includes('Overlord')) {
        this.supplyCap += 8; // Most supply structures add 8
      }
    }
    
    // Mark upgrade as researched
    if (task.newUpgrade) {
      this.completedUpgrades.add(task.newUpgrade);
    }
    
    // Handle morph to unit
    if (task.morphToUnit) {
      unit.name = task.morphToUnit;
      unit.energy = 50;
    }
    
    // Create completion event
    const event = new Event(
      task.newWorker || task.newUnit || task.newStructure || task.newUpgrade || task.morphToUnit || 'action',
      task.newWorker ? 'worker' : task.newUnit ? 'unit' : task.newStructure ? 'structure' : 'upgrade',
      task.startFrame,
      this.frame,
      task.startSupply,
      task.id
    );
    this.eventLog.push(event);
  }

  /**
   * Try to execute the next build order item
   */
  private executeBuildOrder(): boolean {
    if (this.boIndex >= this.buildOrder.length) {
      return false;
    }
    
    const item = this.buildOrder[this.boIndex];
    if (!item) return false;
    
    // Try to execute the item
    let success = false;
    
    if (item.type === 'unit' || item.type === 'structure') {
      success = this.trainUnit(item.name);
    } else if (item.type === 'upgrade') {
      success = this.researchUpgrade(item.name);
    } else if (item.type === 'action') {
      success = this.executeAction(item.name);
    }
    
    if (success) {
      this.boIndex++;
      return true;
    }
    
    return false;
  }

  /**
   * Attempt to train a unit or build a structure
   */
  private trainUnit(name: string): boolean {
    const unitData = UNIT_DATA[name];
    if (!unitData) {
      this.errorMessage = `Unknown unit: ${name}`;
      return false;
    }
    
    // Check requirements
    if (unitData.requires) {
      for (const req of unitData.requires) {
        if (!this.completedStructures.has(req)) {
          this.requirements.push(req);
          this.errorMessage = `Requires: ${req}`;
          return false;
        }
      }
    }
    
    // Check affordability
    if (this.minerals < unitData.mineralCost) {
      return false;
    }
    if (this.vespene < unitData.vespeneCost) {
      return false;
    }
    if (unitData.supplyCost > 0 && this.supplyLeft < unitData.supplyCost) {
      return false;
    }
    
    // Find idle trainer that can train this unit
    // Simplified: In a full implementation, would need to:
    // - Check unit type vs trainer type (e.g., Marines from Barracks)
    // - Handle Zerg larva consumption
    // - Handle Terran reactors (2 simultaneous units)
    // - Handle Protoss probe structures (probe continues mining)
    const firstIdle = this.idleUnits.values().next().value as Unit;
    if (!firstIdle) {
      this.errorMessage = 'No idle production structure available';
      return false;
    }
    
    // Deduct resources
    this.minerals -= unitData.mineralCost;
    this.vespene -= unitData.vespeneCost;
    
    // Create task
    const buildFrames = Math.floor(unitData.buildTime);
    const taskResult: {
      newWorker?: string;
      newUnit?: string;
      newStructure?: string;
    } = {};
    
    if (unitData.isWorker) taskResult.newWorker = name;
    if (unitData.isUnit) taskResult.newUnit = name;
    if (unitData.isStructure) taskResult.newStructure = name;
    
    const task = new Task(
      buildFrames,
      this.frame,
      this.supplyUsed,
      this.boIndex,
      taskResult
    );
    
    // Add task to trainer
    firstIdle.addTask(task);
    
    return true;
  }

  /**
   * Attempt to research an upgrade
   */
  private researchUpgrade(name: string): boolean {
    // Note: Upgrade system not yet implemented
    // This is a simplified version - full implementation would require upgrade data
    this.errorMessage = `Upgrade system not yet implemented: ${name}`;
    return false;
  }

  /**
   * Execute a custom action
   */
  private executeAction(name: string): boolean {
    // Handle worker management actions
    if (name === 'worker_to_gas') {
      if (this.workersMinerals > 0) {
        this.workersMinerals--;
        this.workersVespene++;
        return true;
      }
    }
    if (name === 'worker_to_mins') {
      if (this.workersVespene > 0) {
        this.workersVespene--;
        this.workersMinerals++;
        return true;
      }
    }
    
    return false;
  }

  /**
   * Record history snapshot
   */
  private recordHistory(): void {
    this.resourceHistory.push({
      frame: this.frame,
      minerals: this.minerals,
      vespene: this.vespene,
      supply: this.supplyUsed
    });
    
    this.unitsCountArray.push({
      frame: this.frame,
      units: this.units.size
    });
  }

  /**
   * Get current game time in MM:SS format
   */
  getGameTime(): string {
    const totalSeconds = Math.floor(this.frame / FRAMES_PER_SECOND);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
