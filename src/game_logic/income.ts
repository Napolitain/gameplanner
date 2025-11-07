/**
 * Income calculation helpers for minerals and vespene gas
 */

/**
 * Calculates mineral income per frame based on worker count
 * Considers saturation, close vs far patches, and triple-stacking
 * 
 * @param workerCount Number of workers on minerals
 * @returns Minerals per frame
 */
export function calculateMineralIncome(workerCount: number): number {
  if (workerCount === 0) return 0;
  
  // Optimal saturation at 16 workers, full saturation at 24 workers
  // Each base has 8 patches: 5 close, 3 far
  // Mining rates (per minute at optimal):
  // - 1 worker on close patch: ~60 minerals/min
  // - 1 worker on far patch: ~50 minerals/min
  // - 2 workers on patch (saturated): ~120 minerals/min
  // - 3 workers on patch (oversaturated): ~140 minerals/min
  
  // At 22.4 frames per second:
  const framesPerMinute = 22.4 * 60;
  
  let mineralsPerFrame = 0;
  
  // First 16 workers (optimal - 2 per patch)
  if (workerCount <= 16) {
    // Close patches (5): ~60 minerals/min per worker
    const closeWorkers = Math.min(workerCount, 10);
    mineralsPerFrame += (closeWorkers * 60) / framesPerMinute;
    
    // Far patches (3): ~50 minerals/min per worker
    const farWorkers = Math.max(0, workerCount - 10);
    mineralsPerFrame += (farWorkers * 50) / framesPerMinute;
  } else {
    // Optimal saturation
    mineralsPerFrame += (10 * 60) / framesPerMinute; // 10 workers on close
    mineralsPerFrame += (6 * 50) / framesPerMinute;  // 6 workers on far
    
    // Additional workers (oversaturated, diminishing returns)
    const extraWorkers = workerCount - 16;
    // Oversaturated workers add ~20 minerals/min each (diminishing)
    mineralsPerFrame += (extraWorkers * 20) / framesPerMinute;
  }
  
  return mineralsPerFrame;
}

/**
 * Calculates vespene income per frame based on worker count
 * Optimal saturation is 3 workers per geyser
 * 
 * @param workerCount Number of workers on gas
 * @returns Vespene per frame
 */
export function calculateVespeneIncome(workerCount: number): number {
  if (workerCount === 0) return 0;
  
  // Optimal saturation: 3 workers per geyser
  // Mining rate: ~114 gas/min per geyser (3 workers)
  // Or ~38 gas/min per worker
  
  const framesPerMinute = 22.4 * 60;
  
  // Each worker mines ~38 gas/min
  const vespenePerFrame = (workerCount * 38) / framesPerMinute;
  
  return vespenePerFrame;
}

/**
 * Calculates MULE mining income (Terran)
 * MULEs mine at 225 minerals/minute
 * 
 * @returns Minerals per frame for one MULE
 */
export function calculateMuleIncome(): number {
  const framesPerMinute = 22.4 * 60;
  return 225 / framesPerMinute;
}

/**
 * Distributes workers optimally across multiple bases
 * Priority: fill mineral lines to 16 first, then gas, then oversaturate
 * 
 * @param totalWorkers Total workers available
 * @param baseCount Number of bases
 * @param geysersPerBase Geysers per base
 * @returns Distribution object
 */
export function distributeWorkers(
  totalWorkers: number,
  baseCount: number,
  geysersPerBase: number
): { minerals: number; gas: number } {
  let remainingWorkers = totalWorkers;
  let workersOnMinerals = 0;
  let workersOnGas = 0;
  
  // First priority: 16 workers on minerals per base
  const optimalMinWorkers = Math.min(remainingWorkers, baseCount * 16);
  workersOnMinerals += optimalMinWorkers;
  remainingWorkers -= optimalMinWorkers;
  
  // Second priority: 3 workers per geyser
  const totalGeysers = baseCount * geysersPerBase;
  const optimalGasWorkers = Math.min(remainingWorkers, totalGeysers * 3);
  workersOnGas += optimalGasWorkers;
  remainingWorkers -= optimalGasWorkers;
  
  // Third priority: oversaturate minerals
  workersOnMinerals += remainingWorkers;
  
  return { minerals: workersOnMinerals, gas: workersOnGas };
}
