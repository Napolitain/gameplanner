<script lang="ts">
  import type { Game, GameItem } from '../lib/game';
  import { createBuildOrder, addStep, removeStep, clearBuildOrder, totalTime } from '../lib/buildOrder';
  import type { BuildOrder } from '../lib/buildOrder';
  import ActionBlocks from './ActionBlocks.svelte';
  import StarCraft2Simulator from './StarCraft2Simulator.svelte';

  export let game: Game;

  let buildOrderName: string = 'My Build Order';
  let buildOrder: BuildOrder = createBuildOrder(buildOrderName);

  function handleAddAction(item: GameItem) {
    addStep(buildOrder, item);
    buildOrder = buildOrder; // Trigger reactivity
  }

  function handleRemoveStep(index: number) {
    removeStep(buildOrder, index);
    buildOrder = buildOrder; // Trigger reactivity
  }

  function handleClear() {
    clearBuildOrder(buildOrder);
    buildOrder = buildOrder; // Trigger reactivity
  }

  function handleNameChange(e: Event) {
    const target = e.target as HTMLInputElement;
    buildOrderName = target.value;
    buildOrder.name = buildOrderName;
  }
</script>

<div class="space-y-6">
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Build Order</h2>
    
    <div class="mb-6">
      <label for="buildOrderName" class="block text-sm font-medium text-gray-700 mb-2">
        Build Order Name
      </label>
      <input
        id="buildOrderName"
        type="text"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={buildOrderName}
        on:input={handleNameChange}
      />
    </div>

    <div class="mb-6">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold text-gray-800">Current Sequence</h3>
        <button
          on:click={handleClear}
          class="px-4 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={buildOrder.steps.length === 0}
        >
          Clear All
        </button>
      </div>

      {#if buildOrder.steps.length === 0}
        <div class="text-center py-8 text-gray-500 italic bg-gray-50 rounded-md">
          (empty - click actions below to start building your sequence)
        </div>
      {:else}
        <div class="bg-gray-50 rounded-md p-4">
          <ol class="space-y-2">
            {#each buildOrder.steps as step, index}
              <li class="flex items-center gap-2 bg-white px-3 py-2 rounded border border-gray-200 hover:border-blue-300 transition-colors">
                <span class="font-bold text-blue-600 min-w-[2rem]">{step.stepNumber}.</span>
                <span class="font-medium flex-1">{step.item.name}</span>
                <span class="text-gray-500 text-sm flex-1">- {step.item.description}</span>
                <button
                  on:click={() => handleRemoveStep(index)}
                  class="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                  title="Remove this step"
                >
                  ×
                </button>
              </li>
            {/each}
          </ol>
          <div class="mt-4 pt-4 border-t border-gray-300">
            <p class="text-sm font-medium text-gray-700">
              Total time: <span class="text-blue-600">{totalTime(buildOrder).toFixed(1)}</span> units
            </p>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <ActionBlocks game={game} onActionClick={handleAddAction} />

  {#if game.id === 'starcraft2'}
    <StarCraft2Simulator game={game} buildOrder={buildOrder} />
  {/if}
</div>
