<script lang="ts">
  import type { Game, GameItem } from '../lib/game';

  export let game: Game;
  export let onActionClick: (item: GameItem) => void;

  // Group items by category
  $: categories = (() => {
    const cats = new Map<string, GameItem[]>();
    
    game.items.forEach(item => {
      if (!cats.has(item.category)) {
        cats.set(item.category, []);
      }
      cats.get(item.category)!.push(item);
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
