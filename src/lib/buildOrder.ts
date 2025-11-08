import type { GameItem } from './game';

/** Represents a single step in a build order/action sequence */
export interface BuildOrderStep {
  stepNumber: number;
  item: GameItem;
  notes: string;
}

/** Creates a new build order step */
export function createBuildOrderStep(
  stepNumber: number,
  item: GameItem,
  notes: string = ''
): BuildOrderStep {
  return { stepNumber, item, notes };
}

/** Represents a complete action sequence/build order */
export interface BuildOrder {
  name: string;
  steps: BuildOrderStep[];
}

/** Creates a new build order */
export function createBuildOrder(name: string): BuildOrder {
  return { name, steps: [] };
}

/** Adds a step to a build order */
export function addStep(buildOrder: BuildOrder, item: GameItem, notes: string = ''): void {
  const stepNumber = buildOrder.steps.length + 1;
  buildOrder.steps.push(createBuildOrderStep(stepNumber, item, notes));
}

/** Removes a step from a build order */
export function removeStep(buildOrder: BuildOrder, index: number): void {
  if (index >= 0 && index < buildOrder.steps.length) {
    buildOrder.steps.splice(index, 1);
    renumberSteps(buildOrder);
  }
}

/** Moves a step from one position to another */
export function moveStep(buildOrder: BuildOrder, from: number, to: number): void {
  if (from >= 0 && from < buildOrder.steps.length && 
      to >= 0 && to < buildOrder.steps.length && 
      from !== to) {
    const step = buildOrder.steps.splice(from, 1)[0];
    if (step) {
      buildOrder.steps.splice(to, 0, step);
      renumberSteps(buildOrder);
    }
  }
}

/** Clears all steps from a build order */
export function clearBuildOrder(buildOrder: BuildOrder): void {
  buildOrder.steps = [];
}

/** Renumbers all steps in a build order */
function renumberSteps(buildOrder: BuildOrder): void {
  buildOrder.steps.forEach((step, index) => {
    step.stepNumber = index + 1;
  });
}

/** Calculates the total time for a build order */
export function totalTime(buildOrder: BuildOrder): number {
  return buildOrder.steps.reduce((sum, step) => sum + step.item.timeCost, 0);
}

/** Result of build order validation */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/** Validation error with step information */
export interface ValidationError {
  stepNumber: number;
  message: string;
  item: GameItem;
}

/** Validation warning with step information */
export interface ValidationWarning {
  stepNumber: number;
  message: string;
  item: GameItem;
}

/** Validates a build order for resource constraints and requirements */
export function validateBuildOrder(buildOrder: BuildOrder): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Track resources across the build order
  const resourceTotals: Map<string, number> = new Map();
  
  buildOrder.steps.forEach((step) => {
    const { item, stepNumber } = step;
    
    // Check if item has resource costs
    item.resources.forEach(resource => {
      const currentTotal = resourceTotals.get(resource.name) || 0;
      const newTotal = currentTotal + resource.amount;
      resourceTotals.set(resource.name, newTotal);
      
      // Warn if resource costs are accumulating quickly
      if (resource.name === 'Minerals' && newTotal > 1000) {
        warnings.push({
          stepNumber,
          message: `High mineral cost accumulation: ${newTotal.toFixed(0)} total`,
          item
        });
      }
      if (resource.name === 'Gas' && newTotal > 500) {
        warnings.push({
          stepNumber,
          message: `High gas cost accumulation: ${newTotal.toFixed(0)} total`,
          item
        });
      }
    });
    
    // Check time cost validity
    if (item.timeCost <= 0) {
      errors.push({
        stepNumber,
        message: 'Invalid time cost: must be greater than 0',
        item
      });
    }
    
    // Check for empty or invalid item data
    if (!item.name || item.name.trim() === '') {
      errors.push({
        stepNumber,
        message: 'Invalid item: name is empty',
        item
      });
    }
  });
  
  // Check for empty build order
  if (buildOrder.steps.length === 0) {
    warnings.push({
      stepNumber: 0,
      message: 'Build order is empty',
      item: {
        id: '',
        name: '',
        category: '',
        description: '',
        timeCost: 0,
        resources: []
      }
    });
  }
  
  // Check for very long build orders
  if (buildOrder.steps.length > 100) {
    const lastStep = buildOrder.steps[buildOrder.steps.length - 1];
    warnings.push({
      stepNumber: buildOrder.steps.length,
      message: `Build order is very long (${buildOrder.steps.length} steps)`,
      item: lastStep ? lastStep.item : {
        id: '',
        name: '',
        category: '',
        description: '',
        timeCost: 0,
        resources: []
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/** Gets a summary of resource costs for a build order */
export function getResourceSummary(buildOrder: BuildOrder): Map<string, number> {
  const summary = new Map<string, number>();
  
  buildOrder.steps.forEach(step => {
    step.item.resources.forEach(resource => {
      const current = summary.get(resource.name) || 0;
      summary.set(resource.name, current + resource.amount);
    });
  });
  
  return summary;
}
