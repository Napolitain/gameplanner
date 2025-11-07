<script lang="ts">
  import type { Game } from '../lib/game';

  export let games: Game[];
  export let selectedGameId: string;
  export let onGameSelect: (gameId: string) => void;
</script>

<aside class="w-64 bg-white shadow-lg h-screen sticky top-0 overflow-y-auto">
  <div class="p-6">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Select Game</h2>
    <nav class="space-y-3">
      {#each games as game}
        <button
          on:click={() => onGameSelect(game.id)}
          class="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 {selectedGameId === game.id 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}"
        >
          <div class="font-semibold">{game.name}</div>
          <div class="text-xs mt-1 {selectedGameId === game.id ? 'text-blue-100' : 'text-gray-600'}">
            {game.items.length} actions
          </div>
        </button>
      {/each}
    </nav>
  </div>
</aside>
