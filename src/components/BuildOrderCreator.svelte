<script lang="ts">
  import type { Game } from '../lib/game';
  import { findGameItem } from '../lib/game';
  import { createBuildOrder, addStep, removeStep, clearBuildOrder, totalTime } from '../lib/buildOrder';
  import type { BuildOrder } from '../lib/buildOrder';

  export let game: Game;

  let buildOrderName: string = 'My Build Order';
  let selectedMoveId: string = '';
  let buildOrder: BuildOrder = createBuildOrder(buildOrderName);

  function handleAddMove() {
    if (!selectedMoveId) return;
    
    const item = findGameItem(game, selectedMoveId);
    if (item) {
      addStep(buildOrder, item);
      buildOrder = buildOrder; // Trigger reactivity
      selectedMoveId = '';
    }
  }

  function handleRemoveLast() {
    if (buildOrder.steps.length > 0) {
      removeStep(buildOrder, buildOrder.steps.length - 1);
      buildOrder = buildOrder; // Trigger reactivity
    }
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

<div class="bg-white rounded-lg shadow-lg p-6">
  <h2 class="text-2xl font-bold mb-4 text-gray-800">Create Custom Build Order</h2>
  
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
    <label for="moveSelect" class="block text-sm font-medium text-gray-700 mb-2">
      Add Move
    </label>
    <div class="flex gap-2">
      <select
        id="moveSelect"
        class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        bind:value={selectedMoveId}
      >
        <option value="">-- Select a move --</option>
        {#each game.items as item}
          <option value={item.id}>{item.name} - {item.description}</option>
        {/each}
      </select>
      <button
        on:click={handleAddMove}
        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={!selectedMoveId}
      >
        Add
      </button>
    </div>
  </div>

  <div class="mb-6">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold text-gray-800">Current Sequence</h3>
      <div class="flex gap-2">
        <button
          on:click={handleRemoveLast}
          class="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={buildOrder.steps.length === 0}
        >
          Remove Last
        </button>
        <button
          on:click={handleClear}
          class="px-4 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={buildOrder.steps.length === 0}
        >
          Clear All
        </button>
      </div>
    </div>

    {#if buildOrder.steps.length === 0}
      <div class="text-center py-8 text-gray-500 italic bg-gray-50 rounded-md">
        (empty - add moves to start building your sequence)
      </div>
    {:else}
      <div class="bg-gray-50 rounded-md p-4">
        <ol class="space-y-2">
          {#each buildOrder.steps as step}
            <li class="flex items-center gap-2">
              <span class="font-bold text-blue-600 min-w-[2rem]">{step.stepNumber}.</span>
              <span class="font-medium">{step.item.name}</span>
              <span class="text-gray-500 text-sm">- {step.item.description}</span>
            </li>
          {/each}
        </ol>
        <div class="mt-4 pt-4 border-t border-gray-300">
          <p class="text-sm font-medium text-gray-700">
            Total time: <span class="text-blue-600">{totalTime(buildOrder).toFixed(1)}</span> moves
          </p>
        </div>
      </div>
    {/if}
  </div>
</div>
