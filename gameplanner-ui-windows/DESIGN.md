# Windows UI - Visual Design

This document describes the visual layout of the Game Planner Windows UI.

## Window Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│                         Chess Game Planner                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Available Moves:                  Buttons      Build Order:           │
│  ┌─────────────────────────────┐              ┌──────────────────────┐│
│  │ e4 - King's pawn opening    │              │                      ││
│  │ d4 - Queen's pawn opening   │              │                      ││
│  │ c4 - English Opening        │              │                      ││
│  │ e5 - Symmetrical response   │              │                      ││
│  │ d5 - Advance pawn to d5     │   ┌────────┐ │                      ││
│  │ c5 - Sicilian Defense        │   │ Add >> │ │                      ││
│  │ Nf3 - Develop knight to f3  │   └────────┘ │                      ││
│  │ Nc3 - Develop knight to c3  │              │                      ││
│  │ Nf6 - Develop knight to f6  │   ┌────────┐ │                      ││
│  │ Nc6 - Develop knight to c6  │   │<< Rmove│ │                      ││
│  │ Bc4 - Italian Game          │   └────────┘ │                      ││
│  │ Bb5 - Ruy Lopez             │              │                      ││
│  │ Bc5 - Develop bishop to c5  │   ┌────────┐ │                      ││
│  │ Be7 - Develop bishop to e7  │   │Clear   │ │                      ││
│  │ Re1 - Move rook to e1       │   │  All   │ │                      ││
│  │ Rd1 - Move rook to d1       │   └────────┘ │                      ││
│  │ Qe2 - Move queen to e2      │              │                      ││
│  │ Qd2 - Move queen to d2      │              │                      ││
│  │ Ke2 - Move king to e2       │              │                      ││
│  │ O-O - Castle kingside       │              │                      ││
│  │ O-O-O - Castle queenside    │              │                      ││
│  └─────────────────────────────┘              └──────────────────────┘│
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

## With Build Order Example

```
┌────────────────────────────────────────────────────────────────────────┐
│                         Chess Game Planner                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Available Moves:                  Buttons      Build Order:           │
│  ┌─────────────────────────────┐              ┌──────────────────────┐│
│  │ e4 - King's pawn opening    │◄─Selected    │ 1. e4                ││
│  │ d4 - Queen's pawn opening   │              │ 2. e5                ││
│  │ c4 - English Opening        │              │ 3. Nf3               ││
│  │ e5 - Symmetrical response   │              │ 4. Nc6               ││
│  │ d5 - Advance pawn to d5     │   ┌────────┐ │ 5. Bc4               ││◄─Selected
│  │ c5 - Sicilian Defense        │   │ Add >> │ │                      ││
│  │ Nf3 - Develop knight to f3  │   └────────┘ │                      ││
│  │ Nc3 - Develop knight to c3  │              │                      ││
│  │ Nf6 - Develop knight to f6  │   ┌────────┐ │                      ││
│  │ Nc6 - Develop knight to c6  │   │<< Rmove│ │                      ││
│  │ Bc4 - Italian Game          │   └────────┘ │                      ││
│  │ Bb5 - Ruy Lopez             │              │                      ││
│  │ Bc5 - Develop bishop to c5  │   ┌────────┐ │                      ││
│  │ Be7 - Develop bishop to e7  │   │Clear   │ │                      ││
│  │ Re1 - Move rook to e1       │   │  All   │ │                      ││
│  │ Rd1 - Move rook to d1       │   └────────┘ │                      ││
│  │ Qe2 - Move queen to e2      │              │                      ││
│  │ Qd2 - Move queen to d2      │              │                      ││
│  │ Ke2 - Move king to e2       │              │                      ││
│  │ O-O - Castle kingside       │              │                      ││
│  │ O-O-O - Castle queenside    │              │                      ││
│  └─────────────────────────────┘              └──────────────────────┘│
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

## User Interactions

### Adding Moves to Build Order:
1. Click on a move in the "Available Moves" list (left panel)
2. Click the "Add >>" button
3. The move appears in the "Build Order" list (right panel)

### Removing Moves from Build Order:
1. Click on a move in the "Build Order" list (right panel)
2. Click the "<< Remove" button
3. The move is removed and the list is renumbered

### Clearing the Build Order:
1. Click the "Clear All" button
2. All moves are removed from the "Build Order" list

## Window Controls

- **Title**: Static text displaying "Chess Game Planner"
- **Available Moves List**: LISTBOX control showing all 21 chess moves
- **Build Order List**: LISTBOX control showing selected moves in sequence
- **Add Button**: Adds selected item from available moves to build order
- **Remove Button**: Removes selected item from build order
- **Clear All Button**: Clears entire build order

## Technical Implementation

- **Window Class**: GamePlannerWindow
- **Controls**: Native Win32 STATIC, LISTBOX, and BUTTON controls
- **Size**: Initial 900x600 pixels
- **Resizable**: Yes, with responsive layout
- **Style**: Standard Windows window with system theme
