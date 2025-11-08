import { GameLogic } from './gamelogic';
import type { BuildOrderItem } from './gamelogic';
import type { Race } from './constants';
import { UNIT_DATA } from './constants';

/**
 * Supply building names by race
 */
const supplyUnitNameByRace: Record<Race, string> = {
  Terran: 'SupplyDepot',
  Protoss: 'Pylon',
  Zerg: 'Overlord'
};

/**
 * Determine the correct type for a given unit/structure name
 */
function getItemType(name: string): 'unit' | 'structure' | 'upgrade' | 'action' {
  const unitData = UNIT_DATA[name];
  if (!unitData) {
    return 'action'; // Default fallback
  }
  if (unitData.isStructure) return 'structure';
  if (unitData.isUnit) return 'unit';
  return 'action';
}

/**
 * OptimizeLogic class - handles build order optimization
 */
export class OptimizeLogic {
  race: Race;

  constructor(race: Race = 'Terran') {
    this.race = race;
  }

  /**
   * Adds supply to a build order wherever it's needed
   * gamelogic is assumed to have been run until the end
   * 
   * @param gamelogic - The game logic instance that has been simulated
   * @returns Tuple of [optimized GameLogic or undefined, number of supply added]
   */
  addSupply(gamelogic: GameLogic): [GameLogic | undefined, number] {
    const supplyItem = supplyUnitNameByRace[this.race];
    let addedSupply = 0;
    const maxSupplyToAdd = 15; // Prevent infinite loops

    // Clone the build order to avoid mutating the original
    const bo = [...gamelogic.buildOrder];
    
    // Keep trying to add supply until the build order completes or we hit the limit
    while (addedSupply < maxSupplyToAdd) {
      // Create a new GameLogic instance with the modified build order
      const testGameLogic = new GameLogic(this.race, bo);
      testGameLogic.simulate();
      
      // Check if we need supply
      // Supply is needed when there's an error and the requirement is the supply item
      const needsSupply = 
        testGameLogic.errorMessage &&
        testGameLogic.requirements.length === 1 &&
        testGameLogic.requirements[0] === supplyItem;
      
      if (!needsSupply) {
        // Build order completes without supply issues
        if (addedSupply > 0) {
          // We added supply and it worked
          return [testGameLogic, addedSupply];
        }
        // No supply was needed
        return [undefined, 0];
      }
      
      // Insert supply building before the item that needs it
      // boIndex points to the item that couldn't be built
      const insertPosition = Math.max(0, testGameLogic.boIndex - 1);
      const supplyType = getItemType(supplyItem);
      bo.splice(insertPosition, 0, { name: supplyItem, type: supplyType });
      addedSupply++;
    }
    
    // Reached max supply additions, return what we have
    if (addedSupply > 0) {
      const finalGameLogic = new GameLogic(this.race, bo);
      finalGameLogic.simulate();
      return [finalGameLogic, addedSupply];
    }
    
    return [undefined, 0];
  }

  /**
   * Removes all instances of an item from a build order
   * 
   * @param bo - Build order array to modify
   * @param itemName - Name of the item to remove
   * @returns Number of items removed
   */
  removeFromBO(bo: BuildOrderItem[], itemName: string): number {
    let removeCount = 0;
    for (let i = bo.length - 1; i >= 0; i--) {
      const item = bo[i];
      if (item && item.name === itemName) {
        bo.splice(i, 1);
        removeCount++;
      }
    }
    return removeCount;
  }
}
