<script lang="ts">
  import type { Game } from '../lib/game';
  import { findGameItem } from '../lib/game';
  import { createBuildOrder, addStep } from '../lib/buildOrder';
  import type { BuildOrder } from '../lib/buildOrder';
  
  export let game: Game;
  export let openingName: string;
  export let moveIds: string[];

  $: buildOrder = (() => {
    const bo = createBuildOrder(openingName);
    moveIds.forEach(moveId => {
      const item = findGameItem(game, moveId);
      if (item) {
        addStep(bo, item);
      }
    });
    return bo;
  })();
</script>

<div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
  <h3 class="text-xl font-bold mb-3 text-blue-900">{openingName}</h3>
  <ol class="space-y-1">
    {#each buildOrder.steps as step, index}
      {@const moveNum = Math.floor(index / 2) + 1}
      {@const color = index % 2 === 0 ? 'White' : 'Black'}
      <li class="text-gray-800">
        <span class="font-semibold">{moveNum}. {color}</span>
        <span class="mx-2">-</span>
        <span class="font-medium text-blue-700">{step.item.name}</span>
        <span class="text-gray-600 text-sm"> ({step.item.description})</span>
      </li>
    {/each}
  </ol>
  <p class="mt-3 text-sm text-gray-600 font-medium">Total moves: {buildOrder.steps.length}</p>
</div>
