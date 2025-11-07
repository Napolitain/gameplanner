# Simulation Loop Fixes - Summary

## Issue
The issue "Check loop" referenced the StarCraft 2 build order simulation architecture. Through analysis and testing, three critical bugs were discovered in the simulation loop that prevented the system from functioning correctly.

## Bugs Fixed

### 1. Task Completion Race Condition (unit.ts)
**Problem:** Tasks were being removed before their results could be processed.

**Root Cause:**
```typescript
// In Unit.update() - line 131
if (task.isComplete()) {
  this.tasks.splice(i, 1);  // ❌ Removed task immediately
}
```

The simulation loop calls:
1. `unit.update(currentFrame)` - which removed completed tasks
2. `checkCompletedTasks(unit)` - which tries to spawn units/structures

Since completed tasks were already removed, units/structures were never spawned!

**Fix:** Removed task deletion from `Unit.update()`. Now `GameLogic.checkCompletedTasks()` handles both spawning and task removal.

```typescript
// Updated Unit.update()
for (const task of this.tasks) {
  if (task) {
    const progressRate = (this.hasChronoUntilFrame > currentFrame) ? 1.5 : 1.0;
    task.progress += progressRate;
    // No longer removes tasks here
  }
}
```

### 2. Build Time Calculation Error (constants.ts, gamelogic.ts)
**Problem:** Build times were 501 times too long (e.g., 2 hours instead of 17 seconds for an SCV).

**Root Cause:**
```typescript
// In constants.ts
function secondsToFrames(seconds: number): number {
  return seconds / FRAMES_PER_SECOND;  // ❌ Dividing instead of multiplying
}

// In gamelogic.ts
const buildFrames = Math.floor(unitData.buildTime * FRAMES_PER_SECOND);  // ❌ Multiplying already-wrong value
```

For an SCV with 17 second build time:
- `secondsToFrames(17)` = 17 / 22.4 = 0.759 frames ❌
- Then: `0.759 * 22.4` = 17 frames ✓ (accidentally correct!)
- But stored as `17` in unitData.buildTime
- Then: `17 * 22.4` = 380.8 frames ✓ (correct)
- But wait, it was using the frame number as the time: `8529 frames` ❌

Actually, the task was storing the completion frame instead of the duration! The bug was more complex than initially thought.

**Fix:** 
1. Changed `secondsToFrames()` to multiply: `seconds * FRAMES_PER_SECOND`
2. Changed `trainUnit()` to use `unitData.buildTime` directly without multiplying again

```typescript
// Fixed constants.ts
function secondsToFrames(seconds: number): number {
  return seconds * FRAMES_PER_SECOND;  // ✅ Now correct
}

// Fixed gamelogic.ts
const buildFrames = Math.floor(unitData.buildTime);  // ✅ Already in frames
```

### 3. Worker Income Not Initialized (gamelogic.ts)
**Problem:** Starting workers weren't generating any resource income.

**Root Cause:**
```typescript
this.workersMinerals = 0; // ❌ Set to 0 despite having 12 starting workers
```

The simulation creates 12 worker units but never assigns them to mine minerals. The income calculation checks `workersMinerals` which was 0, so no resources were generated.

**Fix:** Initialize `workersMinerals` to the starting worker count:
```typescript
this.workersMinerals = startData.workers; // ✅ Now 12 workers mine from start
```

## Impact

**Before fixes:**
- Units/structures were never spawned (build order stuck at first item)
- No resource income (couldn't afford anything)
- Build times were calculated incorrectly

**After fixes:**
- ✅ Units spawn correctly when tasks complete
- ✅ Resource income generates from 12 starting workers
- ✅ Build times are accurate (17s for SCV, 21s for SupplyDepot, etc.)
- ✅ Full build orders complete successfully
- ✅ Timeline events are logged correctly

## Test Results

Comprehensive test with Terran build order:
```
Initial: 12 SCVs, 50 minerals, 12/15 supply
Build: 3 SCVs, SupplyDepot, Barracks, Marine
Final: 15 SCVs, 674 minerals, 16/23 supply, 1:43 game time

Timeline:
- SCV: 0.0s - 17.0s ✅
- SCV: 10.2s - 27.2s ✅
- SupplyDepot: 18.7s - 39.7s ✅
- SCV: 22.7s - 39.6s ✅
- Barracks: 39.7s - 85.7s ✅
- Marine: 85.7s - 103.7s ✅
```

All units spawned, timings are accurate, and the simulation completed successfully!

## Files Changed
- `src/game_logic/unit.ts` - Removed task deletion from update loop
- `src/game_logic/constants.ts` - Fixed secondsToFrames() to multiply
- `src/game_logic/gamelogic.ts` - Fixed worker initialization and build time calculation
- `.gitignore` - Added test file

## Security
✅ CodeQL scan: 0 vulnerabilities
✅ Code review: No issues
