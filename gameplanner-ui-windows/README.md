# Game Planner - Windows UI

A native Windows application for planning game build orders and action sequences.

## Overview

This is a Windows-specific GUI application that provides a visual interface for the Game Planner library. It uses the `windows` crate to provide native Win32 API bindings for a lightweight, responsive user experience.

## Features

- **Native Windows UI**: Uses Win32 API for lightweight, fast performance
- **Available Moves List**: Browse all available game moves/items
- **Build Order Panel**: Visual representation of your build order
- **Simple Controls**: Add, remove, and clear items with button clicks
- **Responsive Layout**: Window resizes gracefully

## Requirements

- Windows 10 or later
- Windows SDK (automatically handled by Rust toolchain)

## Building

```bash
# Build the Windows UI
cargo build --package gameplanner-ui-windows --release

# Run the Windows UI
cargo run --package gameplanner-ui-windows --release
```

The built executable will be at `target/release/gameplanner-ui.exe`.

## Usage

1. **Browse Available Moves**: The left panel shows all available chess moves
2. **Add to Build Order**: Select a move and click "Add >>" to add it to your build order
3. **Remove from Build Order**: Select an item in the build order and click "<< Remove"
4. **Clear Build Order**: Click "Clear All" to start over

## Technical Details

### Architecture

The application uses:
- **Win32 API**: Native Windows controls (LISTBOX, BUTTON, STATIC)
- **gameplanner-core**: Cross-platform core library for game logic
- **windows crate v0.58**: Latest Windows API bindings for Rust

### Window Layout

```
┌─────────────────────────────────────────────────────────┐
│              Chess Game Planner                          │
├─────────────────────────────────────────────────────────┤
│ Available Moves:           │ Buttons │ Build Order:     │
│                            │         │                  │
│ ┌────────────────────────┐ │  Add >> │ ┌──────────────┐│
│ │ e4 - King's pawn       │ │         │ │ 1. e4        ││
│ │ d4 - Queen's pawn      │ │<< Remove│ │ 2. e5        ││
│ │ Nf3 - Develop knight   │ │         │ │ 3. Nf3       ││
│ │ ...                    │ │Clear All│ │              ││
│ └────────────────────────┘ │         │ └──────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Platform Support

This package is **Windows-only**. On non-Windows platforms, it will compile but display an error message when run. Use the CLI version (`gameplanner-cli`) for cross-platform support.

## Future Enhancements

Potential improvements:
- [ ] Double-click to add items
- [ ] Drag-and-drop reordering
- [ ] Save/load build orders
- [ ] Search/filter functionality
- [ ] Context menus
- [ ] Keyboard shortcuts
- [ ] More modern WinUI3 integration

## License

MIT
