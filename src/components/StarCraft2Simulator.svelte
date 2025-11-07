<script lang="ts">
  import type { Game } from '../lib/game';
  import { GameLogic, type BuildOrderItem, type Race } from '../lib';
  import type { BuildOrder } from '../lib/buildOrder';

  export let game: Game;
  export let buildOrder: BuildOrder;

  let selectedRace: Race = 'Terran';
  let simulationResults: {
    gameTime: string;
    minerals: number;
    vespene: number;
    supply: number;
    events: Array<{ name: string; type: string; completionTime: string }>;
  } | null = null;
  let isSimulating = false;
  let errorMessage = '';

  function convertBuildOrderToGameLogicFormat(bo: BuildOrder): BuildOrderItem[] {
    return bo.steps.map(step => {
      // Determine type based on item category or name
      let type: 'unit' | 'structure' | 'upgrade' | 'action' = 'action';
      
      const itemName = step.item.name;
      const category = step.item.category.toLowerCase();
      
      if (category.includes('worker') || category.includes('infantry') || 
          category.includes('mechanical') || category.includes('air')) {
        type = 'unit';
      } else if (category.includes('structure') || category.includes('military') || 
                 category.includes('supply') || category.includes('resource') || 
                 category.includes('base')) {
        type = 'structure';
      } else if (category.includes('upgrade')) {
        type = 'upgrade';
      }

      return {
        name: itemName.replace(/\s+/g, ''),  // Remove spaces for lookup
        type: type
      };
    });
  }

  function runSimulation() {
    if (buildOrder.steps.length === 0) {
      errorMessage = 'Please add items to your build order first.';
      return;
    }

    isSimulating = true;
    errorMessage = '';
    simulationResults = null;

    try {
      // Convert build order to GameLogic format
      const gameLogicBuildOrder = convertBuildOrderToGameLogicFormat(buildOrder);
      
      // Create GameLogic instance
      const gameLogic = new GameLogic(selectedRace, gameLogicBuildOrder);
      
      // Run simulation
      gameLogic.simulate();
      
      // Extract results
      const events = gameLogic.eventLog.map(event => ({
        name: event.name,
        type: event.type,
        completionTime: formatGameTime(event.endFrame)
      }));

      simulationResults = {
        gameTime: gameLogic.getGameTime(),
        minerals: Math.floor(gameLogic.minerals),
        vespene: Math.floor(gameLogic.vespene),
        supply: gameLogic.supplyUsed,
        events: events
      };

      if (gameLogic.errorMessage) {
        errorMessage = gameLogic.errorMessage;
      }
    } catch (error) {
      errorMessage = `Simulation error: ${error instanceof Error ? error.message : String(error)}`;
    } finally {
      isSimulating = false;
    }
  }

  function formatGameTime(frame: number): string {
    const FRAMES_PER_SECOND = 22.4;
    const totalSeconds = Math.floor(frame / FRAMES_PER_SECOND);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
</script>

<div class="bg-white rounded-lg shadow-lg p-6 mt-6">
  <h2 class="text-2xl font-bold mb-4 text-gray-800">StarCraft 2 Build Order Simulator</h2>
  
  <div class="mb-6">
    <label for="race" class="block text-sm font-medium text-gray-700 mb-2">
      Select Race
    </label>
    <select
      id="race"
      bind:value={selectedRace}
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="Terran">Terran</option>
      <option value="Protoss">Protoss</option>
      <option value="Zerg">Zerg</option>
    </select>
  </div>

  <button
    on:click={runSimulation}
    disabled={isSimulating || buildOrder.steps.length === 0}
    class="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
  >
    {isSimulating ? 'Simulating...' : 'Run Simulation'}
  </button>

  {#if errorMessage}
    <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
      <p class="text-red-800 text-sm">{errorMessage}</p>
    </div>
  {/if}

  {#if simulationResults}
    <div class="mt-6 space-y-4">
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
        <h3 class="text-lg font-semibold text-green-900 mb-3">Simulation Results</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Final Game Time</p>
            <p class="text-xl font-bold text-green-700">{simulationResults.gameTime}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Supply Used</p>
            <p class="text-xl font-bold text-green-700">{simulationResults.supply}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Minerals</p>
            <p class="text-xl font-bold text-green-700">{simulationResults.minerals}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Vespene Gas</p>
            <p class="text-xl font-bold text-green-700">{simulationResults.vespene}</p>
          </div>
        </div>
      </div>

      {#if simulationResults.events.length > 0}
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 class="text-md font-semibold text-gray-800 mb-3">Build Timeline</h4>
          <div class="space-y-2 max-h-96 overflow-y-auto">
            {#each simulationResults.events as event}
              <div class="flex items-center gap-3 bg-white px-3 py-2 rounded border border-gray-200">
                <span class="font-mono text-sm text-blue-600 min-w-[4rem]">{event.completionTime}</span>
                <span class="font-medium">{event.name}</span>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{event.type}</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
