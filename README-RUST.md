# Game Planner (Rust Edition)

A cross-platform action sequence planner for strategy games, built with Rust.

## Overview

Game Planner helps strategy game players create, manage, and optimize action sequences (build orders, move sequences, etc.). The application demonstrates this concept using Chess as the primary example, where you can plan move sequences and opening strategies.

**Key Concept**: This isn't just for storing opening moves - it's for planning complete action sequences in any game where move order and optimization matter. Whether it's Chess openings, StarCraft 2 build orders, or any strategy game, you can plan the entire sequence of actions.

## Features

### Core Library (`gameplanner-core`)
- **Game-agnostic data model**: Flexible architecture supporting any strategy game
- **Action sequence management**: Create, modify, and analyze action sequences
- **Resource tracking**: Track costs and timing for each action
- **Extensible design**: Easy to add new games
- **Zero unsafe code**: 100% safe Rust
- **Serialization**: JSON import/export via serde

### CLI Application (`gameplanner-cli`)
- **Interactive interface**: Browse moves, create sequences, view samples
- **Sample openings**: Pre-loaded with Italian Game, Ruy Lopez, Sicilian Defense
- **Custom sequences**: Build your own move sequences interactively
- **Cross-platform**: Works on Linux, macOS, and Windows

### Windows UI (`gameplanner-ui-windows`)
- **Native Win32 API**: Using the latest `windows` crate v0.58
- **Visual interface**: List view for available moves and build order
- **Interactive controls**: Add, remove, and clear buttons
- **Lightweight**: Direct Win32 API with no heavy framework dependencies
- **Windows-only**: Optional binary that only builds on Windows

## Project Structure

```
gameplanner/
├── gameplanner-core/       # Core Rust library
│   └── src/
│       ├── lib.rs          # Public API
│       ├── game.rs         # Game and GameItem types
│       ├── build_order.rs  # BuildOrder and BuildOrderStep types
│       └── chess.rs        # Chess game implementation
│
├── gameplanner-cli/        # CLI application
│   └── src/
│       └── main.rs         # Interactive terminal UI
│
├── gameplanner-ui-windows/ # Windows native UI
│   └── src/
│       └── main.rs         # Win32 window implementation
│
└── Cargo.toml              # Workspace configuration
```

## Building

### Prerequisites

- Rust 2021 edition or later (install from [rustup.rs](https://rustup.rs/))
- Windows SDK (for Windows UI only)

### Build Instructions

```bash
# Build everything
cargo build --release

# Build only the core library
cargo build --package gameplanner-core --release

# Build only the CLI
cargo build --package gameplanner-cli --release

# Build only the Windows UI (Windows only)
cargo build --package gameplanner-ui-windows --release
```

### Running

```bash
# Run the CLI
cargo run --package gameplanner-cli --release

# Run the Windows UI (Windows only)
cargo run --package gameplanner-ui-windows --release
```

## Usage

### CLI Demo

The CLI provides an interactive menu:

1. **View sample openings**: See pre-configured chess openings
   - Italian Game (e4 e5 Nf3 Nc6 Bc4)
   - Ruy Lopez (e4 e5 Nf3 Nc6 Bb5)
   - Sicilian Defense (e4 c5 Nf3 d6 d4)

2. **Create custom build order**: Build your own move sequences
   - Add moves by ID (e.g., "e4", "nf3", "bc4")
   - Remove moves
   - View total time/moves

3. **Exit**: Quit the application

### Library API

```rust
use gameplanner_core::{ChessGame, BuildOrder};

// Create a chess game
let game = ChessGame::create();

// Create a build order
let mut build_order = BuildOrder::new("My Opening");

// Add moves
if let Some(e4) = game.find_item("e4") {
    build_order.add_step(e4);
}
if let Some(e5) = game.find_item("e5") {
    build_order.add_step(e5);
}

// Access the sequence
for step in &build_order.steps {
    println!("{}. {}", step.step_number, step.item.name);
}
```

## Chess Implementation

The chess game includes:

- **Pawn moves**: e4, d4, c4, e5, d5, c5
- **Knight moves**: Nf3, Nc3, Nf6, Nc6
- **Bishop moves**: Bc4, Bb5, Bc5, Be7
- **Rook moves**: Re1, Rd1
- **Queen moves**: Qe2, Qd2
- **King moves**: Ke2
- **Special moves**: O-O (kingside castle), O-O-O (queenside castle)

Each move includes:
- Algebraic notation (ID)
- Full name
- Category (Pawn Opening, Knight Development, etc.)
- Description
- Time cost (1.0 move per action)

## CI/CD

The project includes GitHub Actions workflows:

- **Rust Build** (`.github/workflows/rust-build.yml`):
  - Linux: Full build, tests, clippy, formatting checks
  - macOS: Build and run
  - Windows: Build CLI and Windows UI

All workflows run automatically on push to main branches and pull requests.

[![Build Rust](../../actions/workflows/rust-build.yml/badge.svg)](../../actions/workflows/rust-build.yml)

## Adding New Games

To add a new game:

1. Create a new module in `gameplanner-core/src/`
2. Implement a `create()` function that returns a `Game`
3. Add game items with appropriate categories and costs
4. Export from `lib.rs`

Example:
```rust
pub struct MyGame;

impl MyGame {
    pub fn create() -> Game {
        let mut game = Game::new("mygame", "My Game")
            .with_description("Description");
        
        game.add_item(
            GameItem::new("action1", "Action 1", "Category")
                .with_description("Does something")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Resource", 100.0))
        );
        
        game
    }
}
```

## Future Enhancements

- [ ] GTK4 UI for Linux
- [ ] Advanced WinUI3 integration for Windows
- [ ] Web UI with WebAssembly
- [ ] More games (StarCraft 2, Age of Empires, etc.)
- [ ] AI-powered optimization suggestions
- [ ] Save/load sequences to files
- [ ] Sequence comparison and analysis
- [ ] Multi-player sequence sharing

## Migrating from C++

This is a complete rewrite from the C++ version. The Rust version offers:

- **Memory safety**: No segfaults or undefined behavior
- **Better ergonomics**: Pattern matching, Result types, Option types
- **Easier builds**: Cargo handles everything, no CMake complexity
- **Modern tooling**: cargo fmt, clippy, built-in testing
- **Cross-platform**: True cross-platform without platform-specific code (except UI)

The C++ code has been preserved in git history but is no longer maintained.

## Contributing

Contributions welcome! Areas of interest:
- New game implementations
- UI improvements
- Performance optimizations
- Documentation
- Tests

## License

MIT

## Architecture Notes

### Why Rust?
- Memory safety without garbage collection
- Excellent cross-platform support
- Modern language features
- Strong ecosystem (crates.io)
- Great tooling (cargo, rustfmt, clippy)

### Why Chess?
- Universal game everyone knows
- Clear sequence of moves
- Demonstrates the concept well
- Easy to understand and extend
- Shows both tactical (short-term) and strategic (long-term) planning

The architecture is designed to support any game where action sequences matter - Chess is just the first implementation.
