<script lang="ts">
  import type { Game, GameItem } from '../lib/game';
  import type { BuildOrder } from '../lib/buildOrder';
  import { UNIT_DATA } from '../lib/constants';

  export let game: Game;
  export let buildOrder: BuildOrder;
  export let onActionClick: (item: GameItem) => void;

  // Helper function to convert item name to UNIT_DATA key
  function getUnitDataKey(name: string): string {
    return name.replace(/\s+/g, '');
  }

  // Get set of completed structures from build order
  $: completedStructures = (() => {
    const structures = new Set<string>();
    
    // Add starting structures for Terran
    structures.add('CommandCenter');
    
    // Add structures from build order
    buildOrder.steps.forEach(step => {
      const unitKey = getUnitDataKey(step.item.name);
      const unitData = UNIT_DATA[unitKey];
      if (unitData && unitData.isStructure) {
        structures.add(unitKey);
      }
    });
    
    return structures;
  })();

  // Check if an item's requirements are met
  function isItemAvailable(item: GameItem): boolean {
    // For StarCraft 2, check tech requirements
    if (game.id !== 'starcraft2') {
      return true;
    }

    const unitKey = getUnitDataKey(item.name);
    const unitData = UNIT_DATA[unitKey];
    
    if (!unitData) {
      // If no unit data, allow it (might be from other games)
      return true;
    }

    // Check if all requirements are met
    if (unitData.requires && unitData.requires.length > 0) {
      return unitData.requires.every(req => completedStructures.has(req));
    }

    return true;
  }

  // Group items by category and filter by availability
  $: categories = (() => {
    // Explicitly depend on completedStructures for reactivity
    const _ = completedStructures;
    const cats = new Map<string, GameItem[]>();
    
    game.items.forEach(item => {
      // Only include available items
      if (isItemAvailable(item)) {
        if (!cats.has(item.category)) {
          cats.set(item.category, []);
        }
        cats.get(item.category)!.push(item);
      }
    });
    
    return Array.from(cats.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  })();
</script>

<div class="space-y-6">
  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
    <p class="text-sm text-gray-700">
      <span class="font-semibold">Click on any action below</span> to add it to your build order.
    </p>
  </div>

  {#each categories as [category, items]}
    <div class="bg-white rounded-lg shadow-md p-4">
      <h3 class="text-lg font-bold text-gray-800 mb-3 border-b-2 border-blue-500 pb-2">
        {category}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {#each items as item}
          <button
            on:click={() => onActionClick(item)}
            class="text-left px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-100 border border-gray-300 hover:border-blue-400 rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
          >
            <div class="font-semibold text-gray-900">{item.name}</div>
            <div class="text-xs text-gray-600 mt-1">{item.description}</div>
            {#if item.resources.length > 0}
              <div class="text-xs text-gray-500 mt-1">
                {item.resources.map(r => `${r.name}: ${r.amount}`).join(', ')}
              </div>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/each}
</div>
