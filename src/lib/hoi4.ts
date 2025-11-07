import { createGame, createGameItem, createResource, type Game } from './game';

/** Creates the Hearts of Iron 4 game with common production orders */
export function createHeartsOfIron4Game(): Game {
  const game = createGame(
    'hoi4',
    'Hearts of Iron 4',
    'Grand strategy game - plan your production and division templates'
  );

  // Infantry divisions
  game.items.push(
    createGameItem(
      'infantry-division',
      'Infantry Division',
      'Division',
      'Train an Infantry Division',
      90.0,
      [createResource('Manpower', 10000), createResource('Infantry Equipment', 100)]
    )
  );

  game.items.push(
    createGameItem(
      'motorized-division',
      'Motorized Division',
      'Division',
      'Train a Motorized Infantry Division',
      90.0,
      [createResource('Manpower', 12000), createResource('Motorized Equipment', 50)]
    )
  );

  game.items.push(
    createGameItem(
      'mechanized-division',
      'Mechanized Division',
      'Division',
      'Train a Mechanized Infantry Division',
      90.0,
      [createResource('Manpower', 12000), createResource('Mechanized Equipment', 50)]
    )
  );

  // Armor divisions
  game.items.push(
    createGameItem(
      'light-tank-division',
      'Light Tank Division',
      'Armor',
      'Train a Light Tank Division',
      120.0,
      [createResource('Manpower', 6000), createResource('Light Tanks', 50)]
    )
  );

  game.items.push(
    createGameItem(
      'medium-tank-division',
      'Medium Tank Division',
      'Armor',
      'Train a Medium Tank Division',
      120.0,
      [createResource('Manpower', 6000), createResource('Medium Tanks', 50)]
    )
  );

  game.items.push(
    createGameItem(
      'heavy-tank-division',
      'Heavy Tank Division',
      'Armor',
      'Train a Heavy Tank Division',
      120.0,
      [createResource('Manpower', 6000), createResource('Heavy Tanks', 50)]
    )
  );

  // Production
  game.items.push(
    createGameItem(
      'infantry-equipment',
      'Infantry Equipment',
      'Equipment Production',
      'Produce Infantry Equipment',
      30.0,
      [createResource('Production', 0.5)]
    )
  );

  game.items.push(
    createGameItem(
      'artillery',
      'Artillery',
      'Equipment Production',
      'Produce Artillery',
      45.0,
      [createResource('Production', 1.5)]
    )
  );

  game.items.push(
    createGameItem(
      'anti-tank',
      'Anti-Tank Gun',
      'Equipment Production',
      'Produce Anti-Tank Guns',
      45.0,
      [createResource('Production', 1.5)]
    )
  );

  game.items.push(
    createGameItem(
      'support-equipment',
      'Support Equipment',
      'Equipment Production',
      'Produce Support Equipment',
      30.0,
      [createResource('Production', 0.5)]
    )
  );

  // Vehicles
  game.items.push(
    createGameItem(
      'light-tank',
      'Light Tank',
      'Armor Production',
      'Produce Light Tanks',
      60.0,
      [createResource('Production', 2.5)]
    )
  );

  game.items.push(
    createGameItem(
      'medium-tank',
      'Medium Tank',
      'Armor Production',
      'Produce Medium Tanks',
      90.0,
      [createResource('Production', 5.0)]
    )
  );

  game.items.push(
    createGameItem(
      'heavy-tank',
      'Heavy Tank',
      'Armor Production',
      'Produce Heavy Tanks',
      120.0,
      [createResource('Production', 7.5)]
    )
  );

  // Air force
  game.items.push(
    createGameItem(
      'fighter',
      'Fighter',
      'Air Production',
      'Produce Fighter aircraft',
      60.0,
      [createResource('Production', 2.0)]
    )
  );

  game.items.push(
    createGameItem(
      'cas',
      'Close Air Support',
      'Air Production',
      'Produce Close Air Support aircraft',
      60.0,
      [createResource('Production', 2.0)]
    )
  );

  game.items.push(
    createGameItem(
      'tactical-bomber',
      'Tactical Bomber',
      'Air Production',
      'Produce Tactical Bomber',
      75.0,
      [createResource('Production', 3.0)]
    )
  );

  game.items.push(
    createGameItem(
      'strategic-bomber',
      'Strategic Bomber',
      'Air Production',
      'Produce Strategic Bomber',
      90.0,
      [createResource('Production', 4.0)]
    )
  );

  // Navy
  game.items.push(
    createGameItem(
      'destroyer',
      'Destroyer',
      'Naval Production',
      'Produce Destroyer',
      365.0,
      [createResource('Production', 3.5)]
    )
  );

  game.items.push(
    createGameItem(
      'submarine',
      'Submarine',
      'Naval Production',
      'Produce Submarine',
      365.0,
      [createResource('Production', 2.5)]
    )
  );

  game.items.push(
    createGameItem(
      'battleship',
      'Battleship',
      'Naval Production',
      'Produce Battleship',
      1095.0,
      [createResource('Production', 10.0)]
    )
  );

  return game;
}
