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
