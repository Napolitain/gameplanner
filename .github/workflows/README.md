# Continuous Integration & Deployment

This directory contains GitHub Actions workflows for building and testing the Game Planner application.

## Workflows

### 1. Build Core Library and CLI Demo (`build-library.yml`)

Builds the cross-platform C++ core library and demo application on multiple platforms:

- **Linux (GCC 14)**: Ubuntu 24.04 with GCC 14.2
- **macOS (Clang)**: macOS 14 with latest Clang
- **Windows (MinGW GCC 14)**: Windows with MSYS2/MinGW GCC 14

**Triggers:**
- Push to `main`, `develop`, or `copilot/**` branches
- Pull requests to `main` or `develop`

**Artifacts:**
- `gameplanner-linux-gcc14`: Linux library and demo executable
- `gameplanner-macos`: macOS library and demo executable
- `gameplanner-windows-mingw`: Windows library and demo executable

**What it does:**
1. Checks out the code
2. Installs GCC 14 (or uses platform default)
3. Configures CMake with C++23 support
4. Builds the core library (`GamePlannerLib`)
5. Builds the demo application (`GamePlannerDemo`)
6. Runs the demo to verify functionality
7. Uploads build artifacts

### 2. Build WinUI3 Application (`build-winui.yml`)

Validates the Windows UI build on Windows with Visual Studio:

- **Windows (MSVC)**: Windows with Visual Studio 2022

**Triggers:**
- Push to `main`, `develop`, or `copilot/**` branches
- Pull requests to `main` or `develop`

**Artifacts:**
- `gameplanner-windows-msvc`: Windows library built with MSVC

**What it does:**
1. Checks out the code
2. Sets up MSBuild and Visual Studio environment
3. Configures CMake with Visual Studio generator
4. Builds the core library with MSVC
5. Attempts to build the demo (if available)
6. Provides notes about WinUI3 requirements

**Note:** The WinUI3 application requires a complete Visual Studio project setup (`.vcxproj`/`.sln` files) and Windows App SDK. The current code provides a template structure. See `winui/README.md` for more details.

## Compiler Requirements

The project uses C++23 features, specifically `std::print` and `std::println`, which require:

- **GCC 14+**: First version with `<print>` header support
- **Clang 18+**: Full C++23 support (may need libc++ from Clang)
- **MSVC 19.40+**: Visual Studio 2022 17.10 or later

## Running Locally

To build locally with the same configuration as CI:

### Linux (GCC 14)
```bash
sudo apt-get install gcc-14 g++-14 cmake
mkdir build && cd build
CXX=g++-14 CC=gcc-14 cmake ..
cmake --build .
./examples/GamePlannerDemo
```

### macOS
```bash
brew install cmake
mkdir build && cd build
cmake ..
cmake --build .
./examples/GamePlannerDemo
```

### Windows (MinGW via MSYS2)
```bash
# In MSYS2 UCRT64 shell
pacman -S mingw-w64-ucrt-x86_64-gcc mingw-w64-ucrt-x86_64-cmake make
mkdir build && cd build
cmake .. -G "Unix Makefiles"
cmake --build .
./examples/GamePlannerDemo.exe
```

### Windows (Visual Studio)
```bash
# In Developer Command Prompt
mkdir build && cd build
cmake .. -G "Visual Studio 17 2022" -A x64
cmake --build . --config Release
.\examples\Release\GamePlannerDemo.exe
```

## Build Status

Check the Actions tab in the GitHub repository to see the latest build status for each platform.

## Adding New Workflows

To add a new workflow:

1. Create a new `.yml` file in `.github/workflows/`
2. Define the workflow triggers and jobs
3. Test locally first if possible
4. Commit and push to trigger the workflow

## Troubleshooting

### Build fails with "print: No such file or directory"
- Ensure you're using GCC 14+ or equivalent compiler
- Check compiler version: `g++ --version`

### CMake can't find compiler
- Make sure compiler is in PATH
- Specify compiler explicitly: `CXX=g++-14 CC=gcc-14 cmake ..`

### WinUI3 build fails
- WinUI3 requires complete Visual Studio project files
- See `winui/README.md` for setup instructions
- The library can still be built and used independently

## Future Enhancements

- [ ] Add code coverage reporting
- [ ] Add static analysis (cppcheck, clang-tidy)
- [ ] Add performance benchmarks
- [ ] Add deployment workflows
- [ ] Add release automation
- [ ] Add documentation generation (Doxygen)
