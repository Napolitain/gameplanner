# Game Planner

A cross-platform build order planner for strategy games, built with C++ and WinUI3.

## Overview

Game Planner is an application designed to help strategy game players create, manage, and optimize build orders. Similar to tools like BurnySC2's SC2 Planner, this application allows users to:

- Select from multiple supported games
- Browse available units, buildings, and actions
- Create custom build orders by adding items in sequence
- Visualize and manage the build order timeline

The application is architected with a cross-platform C++ core library and a Windows-native WinUI3 user interface.

## Features

### Core Library (Cross-Platform)
- **Game-agnostic data model**: Flexible architecture supporting multiple strategy games
- **Build order management**: Create, modify, and export build orders
- **Resource tracking**: Track costs and requirements for each item
- **Extensible design**: Easy to add new games and items

### Windows UI (WinUI3)
- **Left sidebar**: Game selection with visual game list
- **Item browser**: Searchable list of available items with categories
- **Build order panel**: Interactive build order creation and management
- **Modern design**: Fluent Design System with WinUI3

### Supported Games
- **StarCraft 2**: Terran units, structures, and upgrades
- **Hearts of Iron IV**: Division templates, production, and research

## Project Structure

```
gameplanner/
├── lib/                    # Cross-platform C++ library
│   ├── include/
│   │   ├── GamePlanner.h   # Core data structures
│   │   └── GameFactory.h   # Game data factory
│   └── src/
│       └── GameFactory.cpp # Game implementations
├── winui/                  # Windows WinUI3 application
│   ├── MainWindow.xaml     # Main UI layout
│   ├── MainWindow.xaml.h/cpp
│   ├── App.xaml
│   ├── App.xaml.h/cpp
│   └── Package.appxmanifest
└── CMakeLists.txt          # Build configuration
```

## Building

### Prerequisites

#### For Core Library (All Platforms)
- CMake 3.20 or later
- C++23 compatible compiler
  - Windows: Visual Studio 2022
  - Linux: GCC 13+ or Clang 16+
  - macOS: Xcode 15+

#### For Windows UI
- Windows 10 SDK (10.0.19041.0 or later)
- Visual Studio 2022 with:
  - Desktop development with C++
  - Windows App SDK
  - C++/WinRT extensions

### Build Instructions

#### Core Library Only (Cross-Platform)
```bash
mkdir build
cd build
cmake ..
cmake --build .
```

#### Windows Application
The WinUI3 application requires Visual Studio 2022:

1. Open the project in Visual Studio 2022
2. Ensure Windows App SDK is installed
3. Set the startup project to the WinUI application
4. Build and run (F5)

**Note**: WinUI3 applications are best built using Visual Studio. CMake support for WinUI3 is limited.

## Architecture

### Core Data Model

The application uses a hierarchical data model:

```
Game
├── GameItem (units, buildings, actions)
│   ├── Resources (costs)
│   ├── Build time
│   └── Category
└── Build order
    └── BuildOrderStep
        └── GameItem reference
```

### Key Classes

- **`Game`**: Represents a game with its items and rules
- **`GameItem`**: A buildable unit, structure, or action
- **`BuildOrder`**: A sequence of build steps
- **`BuildOrderStep`**: A single step in a build order
- **`GameFactory`**: Factory for creating game data

## Adding New Games

To add a new game:

1. Open `lib/src/GameFactory.cpp`
2. Create a new factory method following the existing pattern:
   ```cpp
   std::shared_ptr<Game> GameFactory::CreateYourGame() {
       auto game = std::make_shared<Game>("game_id", "Game Name");
       // Add items...
       return game;
   }
   ```
3. Add the game to `CreateAllGames()`:
   ```cpp
   games.push_back(CreateYourGame());
   ```

## Future Enhancements

- [ ] Linux UI support (GTK4 or Qt)
- [ ] macOS UI support
- [ ] Save/load build orders to file
- [ ] Export build orders to various formats
- [ ] Timing calculations and resource tracking
- [ ] Build order validation
- [ ] Templates and preset build orders
- [ ] Community sharing features

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:
- New game support
- Bug fixes
- Feature enhancements
- Documentation improvements

## License

[Add your license here]

## Acknowledgments

Inspired by:
- [BurnySC2's SC2 Planner](https://burnysc2.github.io/sc2-planner/)
- Various build order tools in the strategy gaming community