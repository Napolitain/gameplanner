<script lang="ts">
  import type { Game } from '../lib/game';
  import GameSidebar from './GameSidebar.svelte';
  import BuildOrderCreator from './BuildOrderCreator.svelte';

  export let games: Game[];

  let selectedGameId: string = games[0]?.id || 'chess';

  $: selectedGame = games.find(g => g.id === selectedGameId) || games[0];

  function handleGameSelect(gameId: string) {
    selectedGameId = gameId;
  }
</script>

<div class="flex min-h-screen bg-gray-100">
  <GameSidebar 
    games={games} 
    selectedGameId={selectedGameId}
    onGameSelect={handleGameSelect}
  />
  
  <main class="flex-1 overflow-y-auto">
    <div class="container mx-auto px-6 py-8">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">🎮 Game Planner</h1>
        <p class="text-lg text-gray-600 mb-4">Plan your build orders and strategies</p>
        {#if selectedGame}
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 max-w-3xl mx-auto rounded-lg">
            <p class="text-lg font-semibold text-blue-900">{selectedGame.name}</p>
            <p class="text-gray-700">{selectedGame.description}</p>
          </div>
        {/if}
      </header>

      {#if selectedGame}
        <BuildOrderCreator game={selectedGame} />
      {/if}
    </div>

    <footer class="text-center text-gray-600 mt-8 pb-8">
      <p class="text-sm">Built with Astro, Svelte, TypeScript, and Tailwind CSS</p>
      <p class="text-xs mt-2">Game Planner v0.1.0 - MIT License</p>
    </footer>
  </main>
</div>
