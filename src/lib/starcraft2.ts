import { createGame, createGameItem, createResource, type Game } from './game';

/** Creates the StarCraft 2 game with common Terran build orders */
export function createStarCraft2Game(): Game {
  const game = createGame(
    'starcraft2',
    'StarCraft 2',
    'Real-time strategy game - plan your build orders and unit compositions'
  );

  // Workers
  game.items.push(
    createGameItem(
      'scv',
      'SCV',
      'Worker',
      'Build a Supply Collection Vehicle (worker unit)',
      17.0,
      [createResource('Minerals', 50)]
    )
  );

  // Supply
  game.items.push(
    createGameItem(
      'supply-depot',
      'Supply Depot',
      'Supply',
      'Build a Supply Depot to increase supply cap',
      21.0,
      [createResource('Minerals', 100)]
    )
  );

  // Barracks units and structures
  game.items.push(
    createGameItem(
      'barracks',
      'Barracks',
      'Military Structure',
      'Build a Barracks to train infantry units',
      46.0,
      [createResource('Minerals', 150)]
    )
  );

  game.items.push(
    createGameItem(
      'marine',
      'Marine',
      'Infantry',
      'Train a Marine infantry unit',
      18.0,
      [createResource('Minerals', 50)]
    )
  );

  game.items.push(
    createGameItem(
      'marauder',
      'Marauder',
      'Infantry',
      'Train a Marauder infantry unit',
      21.0,
      [createResource('Minerals', 100), createResource('Gas', 25)]
    )
  );

  game.items.push(
    createGameItem(
      'reaper',
      'Reaper',
      'Infantry',
      'Train a Reaper infantry unit',
      32.0,
      [createResource('Minerals', 50), createResource('Gas', 50)]
    )
  );

  // Factory units and structures
  game.items.push(
    createGameItem(
      'factory',
      'Factory',
      'Military Structure',
      'Build a Factory to produce mechanical units',
      43.0,
      [createResource('Minerals', 150), createResource('Gas', 100)]
    )
  );

  game.items.push(
    createGameItem(
      'hellion',
      'Hellion',
      'Mechanical',
      'Train a Hellion light vehicle',
      21.0,
      [createResource('Minerals', 100)]
    )
  );

  game.items.push(
    createGameItem(
      'siege-tank',
      'Siege Tank',
      'Mechanical',
      'Train a Siege Tank heavy vehicle',
      32.0,
      [createResource('Minerals', 150), createResource('Gas', 125)]
    )
  );

  // Starport units and structures
  game.items.push(
    createGameItem(
      'starport',
      'Starport',
      'Military Structure',
      'Build a Starport to produce air units',
      36.0,
      [createResource('Minerals', 150), createResource('Gas', 100)]
    )
  );

  game.items.push(
    createGameItem(
      'medivac',
      'Medivac',
      'Air',
      'Train a Medivac dropship',
      30.0,
      [createResource('Minerals', 100), createResource('Gas', 100)]
    )
  );

  game.items.push(
    createGameItem(
      'viking',
      'Viking',
      'Air',
      'Train a Viking fighter',
      30.0,
      [createResource('Minerals', 150), createResource('Gas', 75)]
    )
  );

  game.items.push(
    createGameItem(
      'banshee',
      'Banshee',
      'Air',
      'Train a Banshee bomber',
      43.0,
      [createResource('Minerals', 150), createResource('Gas', 100)]
    )
  );

  // Gas and tech
  game.items.push(
    createGameItem(
      'refinery',
      'Refinery',
      'Resource',
      'Build a Refinery to harvest vespene gas',
      21.0,
      [createResource('Minerals', 75)]
    )
  );

  game.items.push(
    createGameItem(
      'command-center',
      'Command Center',
      'Base',
      'Build a Command Center (expansion)',
      71.0,
      [createResource('Minerals', 400)]
    )
  );

  game.items.push(
    createGameItem(
      'orbital-command',
      'Orbital Command',
      'Base Upgrade',
      'Upgrade Command Center to Orbital Command',
      25.0,
      [createResource('Minerals', 150)]
    )
  );

  return game;
}
