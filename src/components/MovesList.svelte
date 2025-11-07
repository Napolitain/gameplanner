<script lang="ts">
  import type { Game, GameItem } from '../lib/game';

  export let game: Game;

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

<div class="bg-white rounded-lg shadow-lg p-6">
  <h2 class="text-2xl font-bold mb-4 text-gray-800">Available Moves ({game.items.length} total)</h2>
  
  <div class="space-y-6">
    {#each categories as [category, items]}
      <div class="border-l-4 border-blue-500 pl-4">
        <h3 class="text-lg font-semibold text-blue-700 mb-2">[{category}]</h3>
        <ul class="space-y-2">
          {#each items as item}
            <li class="text-gray-700">
              <span class="font-medium">{item.name}</span>
              <span class="text-gray-500"> - {item.description}</span>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</div>
