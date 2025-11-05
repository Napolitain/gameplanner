# Game Planner UI Design

## Application Layout

The Game Planner application follows a three-panel layout inspired by modern strategy game planners:

### 1. Left Sidebar - Game Selection (250px wide)
- **Header**: "Select Game" title
- **Game List**: Vertical list of available games with:
  - Game name (bold, 16pt)
  - Game description (secondary text, 12pt)
  - Visual selection indicator
  
Currently supported games:
- StarCraft 2
- Hearts of Iron IV

### 2. Middle Panel - Available Items (300px wide)
- **Header**: "Available Items" with search box
- **Search**: Real-time filtering of items
- **Item Cards**: Each item displays:
  - Item name (bold, 14pt)
  - Category badge (11pt, secondary color)
  - Description (12pt, wrapped text)
  - Cost information
  - "Add to Build Order" button

### 3. Right Panel - Build Order (Remaining width)
- **Header**: Build order name (editable) + action buttons (Clear, Export)
- **Build Steps**: Sequential list of selected items showing:
  - Step number (bold)
  - Item name and category
  - Cost summary
  - Remove button
  - Empty state message when no steps added

## Color Scheme
Following Windows Fluent Design System:
- Background: System layer fill colors
- Cards: Card background with subtle borders
- Text: Primary and secondary text colors from theme
- Accents: System accent color for primary actions

## Interactions

### Adding Items
1. User browses or searches items in the middle panel
2. Clicks "Add to Build Order" button
3. Item appears at the bottom of the build order list
4. Empty state disappears once first item is added

### Managing Build Order
- **Remove**: Click "Remove" button on any step
- **Clear All**: Click "Clear" button in the header
- **Reorder**: (Future) Drag and drop steps to reorder
- **Edit Name**: Click on build order name to edit

### Game Switching
1. Click on a game in the left sidebar
2. Available items panel updates with new game's items
3. Current build order is preserved (or cleared with warning)

## Technical Implementation

### XAML Structure
```
Window
├── Grid (2 columns)
    ├── Left Sidebar (Grid)
    │   ├── Header (TextBlock)
    │   └── Games List (ListView)
    └── Main Content (Grid)
        ├── Top Bar (Grid)
        │   ├── Build Order Name (TextBox)
        │   └── Actions (Buttons)
        └── Content Area (Grid, 2 columns)
            ├── Items Panel (ScrollViewer)
            │   ├── Search (TextBox)
            │   └── Items (ItemsRepeater)
            └── Build Order Panel (ScrollViewer)
                └── Steps (StackPanel)
```

### Data Binding
- Games ListView → `std::vector<std::shared_ptr<Game>>`
- Items ItemsRepeater → `std::vector<std::shared_ptr<GameItem>>`
- Build Order → `BuildOrder` class with steps collection

## Future UI Enhancements

1. **Timing Visualization**: Timeline showing when each action completes
2. **Resource Tracker**: Running totals of resources needed/available
3. **Templates**: Save and load preset build orders
4. **Dark/Light Theme**: Full theme switching support
5. **Export Options**: Export to text, JSON, or image format
6. **Validation**: Highlight impossible or inefficient sequences
7. **Tooltips**: Extended information on hover
8. **Keyboard Shortcuts**: Quick add/remove with keyboard
9. **Multi-select**: Add multiple items at once
10. **Notes**: Add custom notes to each step

## Accessibility
- Full keyboard navigation support
- Screen reader compatible XAML structure
- High contrast theme support
- Adjustable text sizes
- Focus indicators on all interactive elements
