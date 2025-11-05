# Getting Started with Game Planner

Welcome to Game Planner! This guide will help you get started with building and using the application.

## Quick Start

### Prerequisites

- **C++ Compiler**: GCC 10+, Clang 12+, or MSVC (Visual Studio 2022)
- **CMake**: 3.20 or later
- **Git**: For cloning the repository

### Building the Core Library (All Platforms)

```bash
# Clone the repository
git clone https://github.com/Napolitain/gameplanner.git
cd gameplanner

# Create build directory
mkdir build
cd build

# Configure and build
cmake ..
cmake --build .

# Run the demo
./examples/GamePlannerDemo
```

You should see output showing the available games and sample build orders!

## Windows UI (WinUI3)

### Additional Prerequisites

- Windows 10 (version 1809 or later) or Windows 11
- Visual Studio 2022 with:
  - "Desktop development with C++" workload
  - Windows App SDK (C++ Templates)
  - C++/WinRT extension

### Building with Visual Studio

**Note**: The WinUI3 application requires additional setup beyond what's currently provided in this repository. To build a complete WinUI3 app:

1. Open Visual Studio 2022
2. Create a new "Blank App, Packaged (WinUI 3 in Desktop)" project
3. Copy the files from the `winui/` directory into your project
4. Add a reference to the `GamePlannerLib` static library
5. Build and run

### Using the Windows UI

Once built, the application will:

1. **Launch**: Opens with the main window
2. **Select Game**: Click on a game in the left sidebar (StarCraft 2 or Hearts of Iron IV)
3. **Browse Items**: Scroll through available items in the middle panel
4. **Search**: Use the search box to filter items
5. **Add to Build**: Click "Add to Build Order" on any item
6. **Manage Build**: Use Remove buttons or Clear to manage your build order
7. **Export**: (Future) Export your build order to share or save

## Understanding the Demo

The demo application (`GamePlannerDemo`) demonstrates the core library functionality:

### What the Demo Does

1. Loads all available games using `GameFactory::CreateAllGames()`
2. Displays each game's items with details
3. Creates sample build orders for each game
4. Shows how to programmatically use the API

### Demo Output Explained

```
=== StarCraft 2 ===
Real-time strategy game by Blizzard Entertainment

Available Items (9 total):

  SCV [Worker]                    ← Item name and category
    Space Construction Vehicle    ← Description
    Build Time: 12s               ← How long it takes to build
    Cost: 50 Minerals             ← Resource requirements
```

Then it shows a sample build order:

```
Build Order: Opening Build
Total Steps: 7

Steps:
   1. SCV (50 Minerals)           ← Step number, item, and cost
   2. SCV (50 Minerals)
   3. Supply Depot (100 Minerals)
   ...
```

## Using the Library in Your Code

### Basic Example

```cpp
#include "GamePlanner.h"
#include "GameFactory.h"

int main() {
    // Load games
    auto games = gameplanner::GameFactory::CreateAllGames();
    
    // Select a game
    auto sc2 = games[0];  // StarCraft 2
    
    // Create a build order
    gameplanner::BuildOrder myBuild("Reaper Opening");
    
    // Add some steps
    auto scv = sc2->FindItem("scv");
    auto supplyDepot = sc2->FindItem("supply_depot");
    auto barracks = sc2->FindItem("barracks");
    
    myBuild.AddStep(scv);
    myBuild.AddStep(scv);
    myBuild.AddStep(supplyDepot);
    myBuild.AddStep(barracks);
    
    // Access the build order
    for (const auto& step : myBuild.GetSteps()) {
        std::cout << std::format("{}. {}\n", 
                                 step->GetStepNumber(), 
                                 step->GetItem()->GetName());
    }
    
    return 0;
}
```

### Key Classes

- **`Game`**: Represents a game (e.g., StarCraft 2)
- **`GameItem`**: An item that can be built (e.g., Marine, Supply Depot)
- **`BuildOrder`**: A sequence of build steps
- **`BuildOrderStep`**: A single step in a build order
- **`GameFactory`**: Creates games with predefined items

## Project Structure

```
gameplanner/
├── lib/                    # Core C++ library
│   ├── include/            # Public headers
│   │   ├── GamePlanner.h   # Main data structures
│   │   └── GameFactory.h   # Game creation
│   └── src/                # Implementation
│       └── GameFactory.cpp # Game definitions
├── winui/                  # Windows UI application
├── examples/               # Demo applications
│   └── demo.cpp            # Console demo
├── docs/                   # Documentation
└── build/                  # Build output (created by CMake)
```

## Next Steps

### For Users

1. **Explore the Demo**: Run `GamePlannerDemo` to see what's possible
2. **Try the UI**: Build the WinUI3 app to use the graphical interface
3. **Create Build Orders**: Plan your strategies for StarCraft 2 or Hearts of Iron IV

### For Developers

1. **Read the Architecture**: See `docs/ARCHITECTURE.md`
2. **Add a New Game**: Follow `docs/ADDING_GAMES.md`
3. **Extend the Library**: Add new features to the core library
4. **Improve the UI**: Enhance the Windows interface or add Linux support

## Common Issues

### CMake Configuration Fails

**Problem**: CMake can't find a C++ compiler

**Solution**: 
- Windows: Install Visual Studio with C++ support
- Linux: Install GCC (`sudo apt install g++`)
- macOS: Install Xcode Command Line Tools

### Build Fails with C++23 Errors

**Problem**: Compiler doesn't support C++23

**Solution**: Update your compiler:
- GCC 13+ 
- Clang 16+
- MSVC (Visual Studio 2022)

### WinUI3 App Won't Build

**Problem**: Missing Windows App SDK

**Solution**: 
1. Open Visual Studio Installer
2. Modify Visual Studio 2022
3. Add "Windows App SDK C++ Templates"
4. Restart Visual Studio

## Getting Help

- **Documentation**: Check the `docs/` directory
- **Issues**: Report bugs on GitHub
- **Examples**: Look at `examples/demo.cpp` for usage patterns

## Contributing

We welcome contributions! See `CONTRIBUTING.md` (if available) or submit a pull request.

## What's Next?

- **Add More Games**: See `docs/ADDING_GAMES.md`
- **Extend Features**: Add timing calculations, resource tracking, validation
- **Build a UI**: Help build the Linux UI with GTK or Qt
- **Share Your Builds**: Export and share your optimized build orders

Happy planning! 🎮
