/** Represents a resource type (e.g., time, material cost) */
export interface Resource {
  name: string;
  amount: number;
}

/** Creates a new resource */
export function createResource(name: string, amount: number): Resource {
  return { name, amount };
}

/** Represents a single action/move that can be performed in a game */
export interface GameItem {
  id: string;
  name: string;
  category: string;
  description: string;
  timeCost: number;
  resources: Resource[];
}

/** Creates a new game item */
export function createGameItem(
  id: string,
  name: string,
  category: string,
  description: string = '',
  timeCost: number = 1.0,
  resources: Resource[] = []
): GameItem {
  return { id, name, category, description, timeCost, resources };
}

/** Represents a game with its rules and available actions */
export interface Game {
  id: string;
  name: string;
  description: string;
  items: GameItem[];
}

/** Creates a new game */
export function createGame(
  id: string,
  name: string,
  description: string = '',
  items: GameItem[] = []
): Game {
  return { id, name, description, items };
}

/** Finds a game item by ID */
export function findGameItem(game: Game, id: string): GameItem | undefined {
  return game.items.find((item) => item.id === id);
}
