import { createGame, createGameItem, createResource, type Game } from './game';

/** Creates the Chess game with all available moves */
export function createChessGame(): Game {
  const game = createGame(
    'chess',
    'Chess',
    'Classic chess game - plan your move sequences and opening strategies'
  );

  // Pawn moves
  game.items.push(
    createGameItem(
      'e4',
      'e4',
      'Pawn Opening',
      "King's pawn opening - advance pawn to e4",
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  game.items.push(
    createGameItem(
      'd4',
      'd4',
      'Pawn Opening',
      "Queen's pawn opening - advance pawn to d4",
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  game.items.push(
    createGameItem(
      'c4',
      'c4',
      'Pawn Opening',
      'English Opening - advance pawn to c4',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  game.items.push(
    createGameItem(
      'e5',
      'e5',
      'Pawn Response',
      'Symmetrical response - advance pawn to e5',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  game.items.push(
    createGameItem(
      'd5',
      'd5',
      'Pawn Response',
      'Advance pawn to d5',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  game.items.push(
    createGameItem(
      'c5',
      'c5',
      'Pawn Response',
      'Sicilian Defense - advance pawn to c5',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  // Knight moves
  game.items.push(
    createGameItem(
      'nf3',
      'Nf3',
      'Knight Development',
      'Develop knight to f3',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  game.items.push(
    createGameItem(
      'nc3',
      'Nc3',
      'Knight Development',
      'Develop knight to c3',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  game.items.push(
    createGameItem(
      'nf6',
      'Nf6',
      'Knight Development',
      'Develop knight to f6',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  game.items.push(
    createGameItem(
      'nc6',
      'Nc6',
      'Knight Development',
      'Develop knight to c6',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  // Bishop moves
  game.items.push(
    createGameItem(
      'bc4',
      'Bc4',
      'Bishop Development',
      'Italian Game - develop bishop to c4',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  game.items.push(
    createGameItem(
      'bb5',
      'Bb5',
      'Bishop Development',
      'Ruy Lopez - develop bishop to b5',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  game.items.push(
    createGameItem(
      'bc5',
      'Bc5',
      'Bishop Development',
      'Develop bishop to c5',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  game.items.push(
    createGameItem(
      'be7',
      'Be7',
      'Bishop Development',
      'Develop bishop to e7',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  // Rook moves
  game.items.push(
    createGameItem(
      're1',
      'Re1',
      'Rook Activation',
      'Move rook to e1',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  game.items.push(
    createGameItem(
      'rd1',
      'Rd1',
      'Rook Activation',
      'Move rook to d1',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  // Queen moves
  game.items.push(
    createGameItem(
      'qe2',
      'Qe2',
      'Queen Development',
      'Move queen to e2',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  game.items.push(
    createGameItem(
      'qd2',
      'Qd2',
      'Queen Development',
      'Move queen to d2',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  // King moves
  game.items.push(
    createGameItem(
      'ke2',
      'Ke2',
      'King Move',
      'Move king to e2 (unusual)',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  // Special moves
  game.items.push(
    createGameItem(
      'o-o',
      'O-O',
      'Castling',
      'Castle kingside',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  game.items.push(
    createGameItem(
      'o-o-o',
      'O-O-O',
      'Castling',
      'Castle queenside',
      1.0,
      [createResource('Move Number', 1.0)]
    )
  );

  return game;
}

/** Italian Game sample opening */
export function getItalianGameSample(): string[] {
  return ['e4', 'e5', 'nf3', 'nc6', 'bc4', 'bc5'];
}

/** Ruy Lopez sample opening */
export function getRuyLopezSample(): string[] {
  return ['e4', 'e5', 'nf3', 'nc6', 'bb5'];
}

/** Sicilian Defense sample opening */
export function getSicilianDefenseSample(): string[] {
  return ['e4', 'c5', 'nf3', 'nc6', 'd4'];
}
