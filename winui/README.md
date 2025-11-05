# WinUI3 Application for Game Planner

This directory contains the Windows UI application built with WinUI3.

## Prerequisites

- Windows 10 SDK (10.0.19041.0 or later)
- Visual Studio 2022 with:
  - Desktop development with C++
  - Windows App SDK
  - C++ WinRT templates

## Building

The WinUI3 application requires Windows and Visual Studio for building.

### Using Visual Studio:
1. Open the solution file in Visual Studio 2022
2. Set GamePlannerApp as the startup project
3. Build and run (F5)

### Using CMake (Advanced):
```bash
cmake -B build -S . -G "Visual Studio 17 2022"
cmake --build build --config Debug
```

## Project Structure

- `MainWindow.xaml` - Main application window with left sidebar and build order area
- `MainWindow.xaml.h/cpp` - Main window code-behind
- `App.xaml` - Application definition
- `App.xaml.h/cpp` - Application code-behind
- `Package.appxmanifest` - Application manifest

## Features

- Left sidebar for game selection
- Main area for creating and managing build orders
- Drag and drop support for reordering steps
- Integration with GamePlannerLib for game data
