# Game Planner UI Mockup

## Main Window Layout

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ Game Planner                                                              ─  □  ✕    │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌──────────────┬──────────────────────────────────────────────────────────────────┐ │
│  │              │                                                                   │ │
│  │ Select Game  │  New Build Order                          [Clear] [Export]       │ │
│  │              │                                                                   │ │
│  ├──────────────┼─────────────────────┬─────────────────────────────────────────────┤ │
│  │              │                     │                                             │ │
│  │ ┏━━━━━━━━━━┓ │  Available Items    │  Build Order                                │ │
│  │ ┃StarCraft 2┃ │                     │                                             │ │
│  │ ┗━━━━━━━━━━┛ │  Search...          │  ┌─────────────────────────────────────┐    │ │
│  │              │  ┌─────────────────┐ │  │ 1. SCV (50 Minerals)                │    │ │
│  │ Hearts of    │  │ SCV [Worker]    │ │  │    Worker                [Remove]   │    │ │
│  │ Iron IV      │  │ Space Construct │ │  └─────────────────────────────────────┘    │ │
│  │              │  │ -ion Vehicle    │ │                                             │ │
│  │              │  │ 12s             │ │  ┌─────────────────────────────────────┐    │ │
│  │              │  │ 50 Minerals     │ │  │ 2. SCV (50 Minerals)                │    │ │
│  │              │  │ [Add to Build]  │ │  │    Worker                [Remove]   │    │ │
│  │              │  └─────────────────┘ │  └─────────────────────────────────────┘    │ │
│  │              │                     │                                             │ │
│  │              │  ┌─────────────────┐ │  ┌─────────────────────────────────────┐    │ │
│  │              │  │ Marine          │ │  │ 3. Supply Depot (100 Minerals)      │    │ │
│  │              │  │ [Infantry]      │ │  │    Structure             [Remove]   │    │ │
│  │              │  │ Basic Terran    │ │  └─────────────────────────────────────┘    │ │
│  │              │  │ infantry unit   │ │                                             │ │
│  │              │  │ 18s, 50 Min     │ │  ┌─────────────────────────────────────┐    │ │
│  │              │  │ [Add to Build]  │ │  │ 4. SCV (50 Minerals)                │    │ │
│  │              │  └─────────────────┘ │  │    Worker                [Remove]   │    │ │
│  │              │                     │  └─────────────────────────────────────┘    │ │
│  │              │  ┌─────────────────┐ │                                             │ │
│  │              │  │ Supply Depot    │ │  ┌─────────────────────────────────────┐    │ │
│  │              │  │ [Structure]     │ │  │ 5. Barracks (150 Minerals)          │    │ │
│  │              │  │ Provides supply │ │  │    Structure             [Remove]   │    │ │
│  │              │  │ 21s, 100 Min    │ │  └─────────────────────────────────────┘    │ │
│  │              │  │ [Add to Build]  │ │                                             │ │
│  │              │  └─────────────────┘ │  ┌─────────────────────────────────────┐    │ │
│  │              │                     │  │ 6. Marine (50 Minerals)             │    │ │
│  │              │  ┌─────────────────┐ │  │    Infantry              [Remove]   │    │ │
│  │              │  │ Barracks        │ │  └─────────────────────────────────────┘    │ │
│  │              │  │ [Structure]     │ │                                             │ │
│  │              │  │ Produces Terran │ │  ┌─────────────────────────────────────┐    │ │
│  │              │  │ infantry units  │ │  │ 7. Marine (50 Minerals)             │    │ │
│  │              │  │ 46s, 150 Min    │ │  │    Infantry              [Remove]   │    │ │
│  │              │  │ [Add to Build]  │ │  └─────────────────────────────────────┘    │ │
│  │              │  └─────────────────┘ │                                             │ │
│  │              │                     │                                             │ │
│  │              │         ⋮           │                  ⋮                          │ │
│  │              │                     │                                             │ │
│  └──────────────┴─────────────────────┴─────────────────────────────────────────────┘ │
│                                                                                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Left Sidebar (250px)
- **Header**: "Select Game" 
- **Game Cards**: Clickable list items
  - Currently selected: StarCraft 2 (highlighted)
  - Available: Hearts of Iron IV

### Middle Panel (300px)
- **Header**: "Available Items"
- **Search Box**: Filter items by name
- **Item List**: Scrollable cards showing:
  - Item name and category
  - Description
  - Build time and costs
  - "Add to Build Order" button

### Right Panel (Flexible)
- **Header Bar**: 
  - Editable build order name
  - Clear and Export buttons
- **Build Order List**: 
  - Sequential numbered steps
  - Item name and category
  - Cost summary
  - Individual Remove buttons

## Color Scheme (Fluent Design)

```
Background:     Light Gray (#F3F3F3) / Dark (#202020)
Cards:          White (#FFFFFF) / Dark Gray (#2B2B2B)
Selected:       System Accent Color (Blue by default)
Borders:        Light borders (#E0E0E0) / (#3F3F3F)
Text Primary:   Black (#000000) / White (#FFFFFF)
Text Secondary: Gray (#6B6B6B) / Light Gray (#ABABAB)
```

## Interactions

### 1. Game Selection
```
[Click on Hearts of Iron IV]
  ↓
Left sidebar updates selection
  ↓
Middle panel loads HoI4 items
  ↓
Right panel retains current build order
```

### 2. Adding Items
```
[Click "Add to Build Order" on Marine]
  ↓
Marine appears at bottom of build order
  ↓
Step numbers automatically update
  ↓
Empty state message disappears
```

### 3. Removing Items
```
[Click "Remove" on step 3]
  ↓
Step 3 (Supply Depot) is removed
  ↓
Steps 4-7 renumber to 3-6
```

### 4. Searching Items
```
[Type "mar" in search box]
  ↓
Item list filters to show:
  - Marine
  - Marauder
```

## Responsive Behavior

- **Minimum Width**: 1024px recommended
- **Middle Panel**: Fixed at 300px
- **Left Sidebar**: Fixed at 250px
- **Right Panel**: Flexible, grows with window

## Accessibility Features

- ✓ Full keyboard navigation (Tab, Arrow keys, Enter)
- ✓ Screen reader support (XAML AutomationProperties)
- ✓ High contrast theme support
- ✓ Focus indicators on all interactive elements
- ✓ Tooltip descriptions on hover

## Planned Features (Not Yet Implemented)

- [ ] Drag and drop to reorder steps
- [ ] Context menu on right-click
- [ ] Undo/Redo functionality
- [ ] Save/Load build orders
- [ ] Export to text/JSON
- [ ] Timing calculations
- [ ] Resource tracking graph
- [ ] Dark/Light theme toggle
