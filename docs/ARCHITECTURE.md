# Architecture Documentation

## Overview

Game Planner is designed with a clear separation between the core game logic (cross-platform C++ library) and the user interface (platform-specific). This architecture allows for:

1. **Code Reuse**: Core logic is shared across all platforms
2. **Platform-Native UIs**: Each platform can have an optimized UI
3. **Testability**: Core logic can be tested independently
4. **Extensibility**: Easy to add new games or UI platforms

## Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (Platform-Specific)          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐    │
│  │   WinUI3    │  │  GTK4/Qt     │  │   macOS     │    │
│  │   (Windows) │  │   (Linux)    │  │   (Future)  │    │
│  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘    │
│         └─────────────────┼──────────────────┘          │
└───────────────────────────┼─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Core Library (Cross-Platform C++)           │
│                                                          │
│  ┌─────────────────┐  ┌──────────────────────────┐     │
│  │  GameFactory    │  │    Data Model            │     │
│  │                 │  │  • Game                  │     │
│  │  Creates games  │  │  • GameItem              │     │
│  │  with items     │  │  • BuildOrder            │     │
│  │                 │  │  • BuildOrderStep        │     │
│  └─────────────────┘  └──────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

## Core Library Design

### Data Model Classes

#### `Resource`
Represents a resource type with name and amount.
```cpp
struct Resource {
    std::string name;
    double amount;
};
```

#### `GameItem`
Represents any buildable entity in a game.
- **Properties**: ID, name, category, build time, costs, description
- **Purpose**: Generic representation of units, buildings, technologies, etc.
- **Usage**: Immutable after creation; shared via `shared_ptr`

#### `Game`
Represents a complete game with its rules and items.
- **Properties**: ID, name, description, items collection
- **Methods**: 
  - `AddItem()`: Add a new item to the game
  - `FindItem()`: Locate an item by ID
- **Usage**: Created by GameFactory; contains all available items

#### `BuildOrderStep`
Represents one step in a build order.
- **Properties**: GameItem reference, step number, optional notes
- **Purpose**: Wraps a GameItem with build-order-specific metadata
- **Usage**: Created and managed by BuildOrder class

#### `BuildOrder`
Manages a complete build order sequence.
- **Properties**: Name, steps collection
- **Methods**:
  - `AddStep()`: Append a new item to the order
  - `RemoveStep()`: Remove a step by index
  - `MoveStep()`: Reorder steps (drag and drop support)
  - `Clear()`: Remove all steps
- **Features**: Automatic step renumbering on modifications

### Factory Pattern

The `GameFactory` class uses the Factory pattern to create game instances:

```cpp
class GameFactory {
public:
    static std::shared_ptr<Game> CreateStarCraft2Game();
    static std::shared_ptr<Game> CreateHeartsOfIronGame();
    static std::vector<std::shared_ptr<Game>> CreateAllGames();
};
```

**Benefits**:
- Centralizes game data creation
- Easy to add new games
- Keeps game definitions separate from UI
- Facilitates testing with mock games

## Memory Management

The architecture uses modern C++ smart pointers:

- **`std::shared_ptr<Game>`**: Games are shared between factory and UI
- **`std::shared_ptr<GameItem>`**: Items are shared; multiple build orders can reference the same item
- **`std::shared_ptr<BuildOrderStep>`**: Steps own their lifecycle within a BuildOrder
- **No manual `new`/`delete`**: All memory is managed automatically

**Benefits**:
- No memory leaks
- Safe sharing of objects
- Clear ownership semantics
- Exception-safe

## UI Integration Points

### WinUI3 Integration

The WinUI3 application integrates with the core library through:

1. **Data Loading**: Calls `GameFactory::CreateAllGames()` at startup
2. **Game Selection**: Stores current game in `currentGame_` member
3. **Item Display**: Converts `GameItem` collection to WinRT observable collections
4. **Build Order Management**: Wraps `BuildOrder` class, refreshing UI on changes

**Key Files**:
- `MainWindow.xaml`: UI layout and structure
- `MainWindow.xaml.h/cpp`: Code-behind integrating core library
- `pch.h`: Precompiled headers for WinRT and core library

### Future Linux UI Integration

For GTK4 or Qt:
1. Link against `GamePlannerLib` static library
2. Use same data model classes
3. Implement platform-specific UI code
4. Follow same pattern: load games, display items, manage build order

## Extensibility

### Adding a New Game

1. **Create Factory Method**:
   ```cpp
   std::shared_ptr<Game> GameFactory::CreateNewGame() {
       auto game = std::make_shared<Game>("id", "Name");
       // Add items...
       return game;
   }
   ```

2. **Add to CreateAllGames()**:
   ```cpp
   games.push_back(CreateNewGame());
   ```

3. **No UI Changes Required**: Existing UI automatically displays the new game

### Adding New Item Properties

To extend `GameItem` with new properties:

1. Add member variable to class
2. Add getter/setter methods
3. Update `GameFactory` to set the property
4. UI can optionally display the new property

**Example**: Adding prerequisites
```cpp
class GameItem {
    // ...
    void AddPrerequisite(const std::string& itemId);
    const std::vector<std::string>& GetPrerequisites() const;
private:
    std::vector<std::string> prerequisites_;
};
```

### Adding New Features

The architecture supports:
- **Timing Calculations**: Add methods to calculate cumulative time
- **Resource Tracking**: Add methods to sum costs across build order
- **Validation**: Add methods to check prerequisites and resources
- **Serialization**: Add save/load functionality to BuildOrder
- **Optimizations**: Add algorithms to suggest improvements

## Testing Strategy

### Unit Testing Core Library
```cpp
TEST(GameTest, FindItem) {
    auto game = GameFactory::CreateStarCraft2Game();
    auto scv = game->FindItem("scv");
    EXPECT_NE(scv, nullptr);
    EXPECT_EQ(scv->GetName(), "SCV");
}

TEST(BuildOrderTest, AddRemoveSteps) {
    BuildOrder order;
    auto item = std::make_shared<GameItem>("id", "Name");
    order.AddStep(item);
    EXPECT_EQ(order.GetSteps().size(), 1);
    order.RemoveStep(0);
    EXPECT_EQ(order.GetSteps().size(), 0);
}
```

### Integration Testing
- Test UI interactions with real game data
- Verify data binding updates correctly
- Test search and filter functionality

### Manual Testing
- Verify visual appearance on Windows 10/11
- Test with different themes (Light/Dark)
- Verify accessibility features
- Test with different DPI settings

## Performance Considerations

### Current Scale
- 2 games with ~10 items each
- Build orders typically < 100 steps
- Performance is not a concern at this scale

### Future Scale
- 10+ games with 100+ items each
- Build orders with 500+ steps
- May need:
  - Virtual scrolling for large item lists
  - Efficient search/filter algorithms
  - Caching of computed values (timing, costs)

### Optimization Opportunities
- Use `string_view` for read-only string operations
- Implement move semantics for large collections
- Add lazy loading for game data
- Cache filtered item lists

## Build System

### CMake Structure
```
CMakeLists.txt (root)
├── lib/CMakeLists.txt (static library)
├── examples/CMakeLists.txt (demo app)
└── winui/CMakeLists.txt (WinUI3 app - stub)
```

### Build Targets
- **GamePlannerLib**: Static library with core logic
- **GamePlannerDemo**: Console demo application
- **GamePlannerApp**: WinUI3 Windows application (requires VS)

### Dependencies
- **Core Library**: C++23 standard library with `<print>` support (requires GCC 14+ or equivalent)
- **WinUI3 App**: Windows SDK, WinRT, Windows App SDK

## Future Directions

### Additional Platforms
1. **Linux UI**: GTK4 or Qt6 implementation
2. **Web UI**: WebAssembly + React/Vue
3. **Mobile**: iOS/Android with native UIs

### Advanced Features
1. **Cloud Sync**: Save build orders to cloud
2. **Community Sharing**: Share builds with other users
3. **AI Suggestions**: ML-based build order optimization
4. **Game Simulation**: Simulate build execution with timing
5. **Multi-game Support**: Compare build orders across games

### Architecture Evolution
- Consider plugin system for games
- Add scripting support (Lua/Python)
- Implement undo/redo system
- Add real-time collaboration features
