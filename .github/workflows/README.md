# Continuous Integration & Deployment

This directory contains GitHub Actions workflows for building and testing the Game Planner Rust application.

## Workflow

### Rust Build & Test (`rust-build.yml`)

Builds and tests the Rust codebase on multiple platforms:

- **Linux (Ubuntu latest)**: Full build with tests, clippy linting, and formatting checks
- **macOS (latest)**: Build and run tests
- **Windows (latest)**: Build all packages including Windows UI

**Triggers:**
- Push to `main`, `develop`, or `copilot/**` branches
- Pull requests to `main` or `develop`

**Artifacts:**
- `gameplanner-linux-rust`: Linux CLI binary and library
- `gameplanner-macos-rust`: macOS CLI binary and library
- `gameplanner-windows-rust`: Windows CLI, Windows UI, and library

**What it does:**
1. Checks out the code
2. Installs Rust toolchain (stable)
3. Caches cargo dependencies for faster builds
4. Runs formatting checks (`cargo fmt --check`)
5. Runs Clippy linting (`cargo clippy`)
6. Builds all packages in release mode
7. Runs all tests
8. Runs the CLI demo to verify functionality
9. Uploads build artifacts

## Running Locally

### Prerequisites
- Rust (install from [rustup.rs](https://rustup.rs/))
- Windows SDK (for Windows UI builds on Windows only)

### Build Commands

```bash
# Build everything
cargo build --release

# Build only core library
cargo build --package gameplanner-core --release

# Build only CLI
cargo build --package gameplanner-cli --release

# Build only Windows UI (Windows only)
cargo build --package gameplanner-ui-windows --release

# Run tests
cargo test --all

# Run clippy
cargo clippy --all-targets --all-features -- -D warnings

# Check formatting
cargo fmt --all -- --check

# Fix formatting
cargo fmt --all
```

### Running the Demo

```bash
# Interactive CLI
cargo run --package gameplanner-cli --release

# Windows UI (Windows only)
cargo run --package gameplanner-ui-windows --release
```

## Code Quality

### Formatting
All code must pass `cargo fmt` checks. Run `cargo fmt --all` before committing.

### Linting
All code must pass `cargo clippy` with no warnings. Run:
```bash
cargo clippy --all-targets --all-features -- -D warnings
```

### Testing
All tests must pass. Run:
```bash
cargo test --all
```

## Caching

The workflow uses GitHub Actions caching for:
- Cargo registry (~/.cargo/registry)
- Cargo git dependencies (~/.cargo/git)
- Build artifacts (target/)

This significantly speeds up builds by reusing dependencies.

## Troubleshooting

### Build fails with "cannot find crate"
- Clear cargo cache and rebuild
- Check Cargo.toml dependencies

### Windows UI build fails
- Ensure Windows SDK is installed
- Check that windows crate is properly configured

### Clippy warnings
- Fix all clippy warnings before pushing
- Use `#[allow(clippy::...)]` only for false positives

### Test failures
- Run tests locally: `cargo test --all`
- Check test output for specific failures

## Future Enhancements

- [ ] Code coverage reporting (tarpaulin)
- [ ] Benchmark suite
- [ ] Security audit (cargo-audit)
- [ ] Dependency updates bot (dependabot)
- [ ] Performance regression tests
- [ ] Documentation generation and hosting
