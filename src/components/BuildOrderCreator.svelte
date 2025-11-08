<script lang="ts">
  import type { Game, GameItem } from '../lib/game';
  import { 
    createBuildOrder, 
    addStep, 
    removeStep, 
    clearBuildOrder, 
    totalTime, 
    validateBuildOrder,
    getResourceSummary 
  } from '../lib/buildOrder';
  import type { BuildOrder, ValidationResult } from '../lib/buildOrder';
  import ActionBlocks from './ActionBlocks.svelte';
  import StarCraft2Simulator from './StarCraft2Simulator.svelte';

  export let game: Game;

  let buildOrderName: string = 'My Build Order';
  let buildOrder: BuildOrder = createBuildOrder(buildOrderName);
  let validationResult: ValidationResult | null = null;
  let showValidation = false;

  function handleAddAction(item: GameItem) {
    addStep(buildOrder, item);
    buildOrder = buildOrder; // Trigger reactivity
    // Auto-validate after adding
    if (showValidation) {
      validationResult = validateBuildOrder(buildOrder);
    }
  }

  function handleRemoveStep(index: number) {
    removeStep(buildOrder, index);
    buildOrder = buildOrder; // Trigger reactivity
    // Auto-validate after removing
    if (showValidation) {
      validationResult = validateBuildOrder(buildOrder);
    }
  }

  function handleClear() {
    clearBuildOrder(buildOrder);
    buildOrder = buildOrder; // Trigger reactivity
    validationResult = null;
  }

  function handleNameChange(e: Event) {
    const target = e.target as HTMLInputElement;
    buildOrderName = target.value;
    buildOrder.name = buildOrderName;
  }

  function handleValidate() {
    validationResult = validateBuildOrder(buildOrder);
    showValidation = true;
  }

  function toggleValidation() {
    showValidation = !showValidation;
    if (showValidation) {
      validationResult = validateBuildOrder(buildOrder);
    }
  }

  // Reactive statement to update validation when needed
  $: if (showValidation && buildOrder) {
    validationResult = validateBuildOrder(buildOrder);
  }

  // Get resource summary
  $: resourceSummary = getResourceSummary(buildOrder);
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
          <div class="mt-4 pt-4 border-t border-gray-300 space-y-2">
            <p class="text-sm font-medium text-gray-700">
              Total time: <span class="text-blue-600">{totalTime(buildOrder).toFixed(1)}</span> units
            </p>
            
            {#if resourceSummary.size > 0}
              <div class="text-sm text-gray-700">
                <span class="font-medium">Resources:</span>
                {#each Array.from(resourceSummary.entries()) as [name, amount]}
                  <span class="ml-2 text-blue-600">{name}: {amount.toFixed(0)}</span>
                {/each}
              </div>
            {/if}
            
            <div class="flex gap-2 mt-3">
              <button
                on:click={toggleValidation}
                class="px-4 py-2 {showValidation ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                {showValidation ? 'Hide Validation' : 'Validate Build Order'}
              </button>
            </div>
          </div>
        </div>
      {/if}
      
      {#if showValidation && validationResult}
        <div class="mt-4 space-y-2">
          {#if validationResult.isValid && validationResult.warnings.length === 0}
            <div class="bg-green-50 border border-green-200 rounded-md p-3">
              <p class="text-sm text-green-800 font-medium">✓ Build order is valid with no warnings</p>
            </div>
          {/if}
          
          {#if validationResult.errors.length > 0}
            <div class="bg-red-50 border border-red-200 rounded-md p-3">
              <p class="text-sm font-medium text-red-800 mb-2">Errors:</p>
              <ul class="space-y-1">
                {#each validationResult.errors as error}
                  <li class="text-sm text-red-700">
                    Step {error.stepNumber} ({error.item.name}): {error.message}
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
          
          {#if validationResult.warnings.length > 0}
            <div class="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p class="text-sm font-medium text-yellow-800 mb-2">Warnings:</p>
              <ul class="space-y-1">
                {#each validationResult.warnings as warning}
                  <li class="text-sm text-yellow-700">
                    {#if warning.stepNumber === 0}
                      {warning.message}
                    {:else}
                      Step {warning.stepNumber} ({warning.item.name}): {warning.message}
                    {/if}
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <ActionBlocks game={game} onActionClick={handleAddAction} />

  {#if game.id === 'starcraft2'}
    <StarCraft2Simulator game={game} buildOrder={buildOrder} />
  {/if}
</div>
