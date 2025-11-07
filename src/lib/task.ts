/**
 * Task class represents a single action being performed by a unit
 */
export class Task {
  /** Total frames required to complete this task */
  totalFramesRequired: number;
  
  /** Current progress in frames */
  progress: number;
  
  /** What spawns when this task completes */
  newWorker?: string;
  newUnit?: string;
  newStructure?: string;
  newUpgrade?: string;
  morphToUnit?: string;
  
  /** Frame when task started */
  startFrame: number;
  
  /** Supply when task started */
  startSupply: number;
  
  /** Build order index ID */
  id: number;

  constructor(
    totalFramesRequired: number,
    startFrame: number,
    startSupply: number,
    id: number,
    result?: {
      newWorker?: string;
      newUnit?: string;
      newStructure?: string;
      newUpgrade?: string;
      morphToUnit?: string;
    }
  ) {
    this.totalFramesRequired = totalFramesRequired;
    this.progress = 0;
    this.startFrame = startFrame;
    this.startSupply = startSupply;
    this.id = id;
    
    if (result) {
      if (result.newWorker !== undefined) this.newWorker = result.newWorker;
      if (result.newUnit !== undefined) this.newUnit = result.newUnit;
      if (result.newStructure !== undefined) this.newStructure = result.newStructure;
      if (result.newUpgrade !== undefined) this.newUpgrade = result.newUpgrade;
      if (result.morphToUnit !== undefined) this.morphToUnit = result.morphToUnit;
    }
  }

  /**
   * Checks if the task is complete
   */
  isComplete(): boolean {
    return this.progress >= this.totalFramesRequired;
  }
}
