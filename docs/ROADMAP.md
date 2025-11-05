# Game Planner Roadmap

This document outlines the planned features and improvements for Game Planner.

## Current Status (v1.0)

✅ **Completed Features**:
- Cross-platform C++ core library
- Game-agnostic data model
- Build order management
- WinUI3 application structure
- StarCraft 2 game data
- Hearts of Iron IV game data
- Console demo application
- Comprehensive documentation

## Short Term (v1.1 - v1.2)

### Core Library Enhancements
- [ ] **Build order validation**: Check for prerequisites and impossibilities
- [ ] **Timing calculations**: Calculate when each step completes
- [ ] **Resource tracking**: Track cumulative resource costs
- [ ] **Save/Load system**: JSON serialization for build orders
- [ ] **Build order templates**: Predefined build orders for common strategies

### UI Improvements
- [ ] **Complete WinUI3 integration**: Fully functional data binding
- [ ] **Drag and drop**: Reorder build steps by dragging
- [ ] **Export functionality**: Export to text, JSON, image
- [ ] **Undo/Redo**: Full undo/redo support
- [ ] **Keyboard shortcuts**: Quick navigation and actions
- [ ] **Visual timeline**: Show timing and overlaps graphically

### Game Content
- [ ] **Expand StarCraft 2**: Add Protoss and Zerg races
- [ ] **Expand Hearts of Iron**: Add naval and air production
- [ ] **Add Age of Empires II**: Complete civilization support
- [ ] **Add Factorio**: Production chain planning
- [ ] **Add more games**: Community suggestions

## Medium Term (v1.3 - v2.0)

### Multi-Platform Support
- [ ] **Linux UI**: GTK4 or Qt6 implementation
- [ ] **macOS UI**: Native macOS interface
- [ ] **Web version**: Browser-based planner with WebAssembly
- [ ] **Mobile apps**: iOS and Android versions

### Advanced Features
- [ ] **Resource graphs**: Visual representation of resource usage over time
- [ ] **Build comparison**: Compare multiple build orders side-by-side
- [ ] **AI suggestions**: ML-based optimization suggestions
- [ ] **Game simulation**: Simulate build execution with timing
- [ ] **Benchmarking**: Compare builds against optimal timings
- [ ] **Build notes**: Rich text notes for each step or build

### Data Management
- [ ] **Cloud sync**: Sync builds across devices
- [ ] **Build sharing**: Share builds with community
- [ ] **Community repository**: Browse and download popular builds
- [ ] **Version control**: Track changes to build orders
- [ ] **Import/Export**: Support for other planner formats

### Game-Specific Features
- [ ] **Prerequisites system**: Automatically track tech requirements
- [ ] **Worker tracking**: Calculate optimal worker distribution (RTS games)
- [ ] **Supply management**: Track supply/population limits
- [ ] **Upgrade paths**: Show available upgrade progressions
- [ ] **Counter suggestions**: Suggest counters based on opponent's strategy

## Long Term (v2.1+)

### Professional Features
- [ ] **Team collaboration**: Multi-user editing and sharing
- [ ] **Live game overlay**: In-game overlay showing build order
- [ ] **Replay analysis**: Import game replays and analyze build execution
- [ ] **Statistics tracking**: Track build order success rates
- [ ] **Pro builds database**: Curated builds from professional players
- [ ] **Tournament support**: Prepare and share builds for competitive play

### Technical Improvements
- [ ] **Plugin system**: Allow community-created game modules
- [ ] **Scripting support**: Lua or Python scripting for advanced automation
- [ ] **API/SDK**: Public API for third-party integrations
- [ ] **Mod support**: Support for game mods and custom content
- [ ] **Performance optimization**: Handle 1000+ item games efficiently
- [ ] **Offline mode**: Full functionality without internet

### Community Features
- [ ] **User profiles**: Track builds and achievements
- [ ] **Rating system**: Rate and review build orders
- [ ] **Comments and discussions**: Discuss strategies on builds
- [ ] **Build challenges**: Community challenges and competitions
- [ ] **Video integration**: Link builds to YouTube guides
- [ ] **Streaming integration**: Display builds on Twitch/YouTube

### Internationalization
- [ ] **Multi-language support**: UI in multiple languages
- [ ] **Localized game data**: Items and descriptions in multiple languages
- [ ] **Region-specific content**: Builds popular in different regions
- [ ] **RTL support**: Right-to-left language support

## Game Support Roadmap

### Priority 1 (Next 3 months)
- Expand StarCraft 2 (all 3 races)
- Add Age of Empires II
- Add Command & Conquer

### Priority 2 (3-6 months)
- Add Factorio
- Add Civilization VI
- Add Total War series

### Priority 3 (6-12 months)
- Add Stellaris
- Add They Are Billions
- Add Frostpunk
- Add RimWorld

### Community Requests
Games will be prioritized based on:
- Community votes
- Contributor interest
- Data availability
- Game popularity

## Technical Debt & Quality

### Code Quality
- [ ] **Unit tests**: Comprehensive test suite for core library
- [ ] **Integration tests**: UI integration testing
- [ ] **Performance benchmarks**: Establish baseline performance metrics
- [ ] **Code coverage**: Achieve 80%+ test coverage
- [ ] **Static analysis**: Regular static analysis and linting
- [ ] **Documentation**: API documentation with Doxygen

### Security
- [ ] **Input validation**: Sanitize all user inputs
- [ ] **Secure storage**: Encrypt saved build orders if cloud sync added
- [ ] **Security audit**: Regular security reviews
- [ ] **Dependency scanning**: Monitor for vulnerable dependencies

### Accessibility
- [ ] **WCAG compliance**: Meet WCAG 2.1 Level AA standards
- [ ] **Screen reader optimization**: Enhanced screen reader support
- [ ] **High contrast themes**: Full high contrast mode support
- [ ] **Keyboard navigation**: 100% keyboard accessible
- [ ] **Configurable UI**: User-adjustable fonts, spacing, colors

## Architecture Evolution

### Planned Refactoring
- [ ] **Event system**: Implement observer pattern for UI updates
- [ ] **Command pattern**: Implement for undo/redo support
- [ ] **Strategy pattern**: Flexible game-specific logic
- [ ] **Repository pattern**: Abstract data persistence layer
- [ ] **Dependency injection**: More testable architecture

### New Components
- [ ] **Simulation engine**: Separate component for build execution simulation
- [ ] **Data validation**: Schema validation for game data
- [ ] **Analytics module**: Track usage and optimize UX
- [ ] **Notification system**: Alerts and updates
- [ ] **Theme engine**: Dynamic theming system

## Release Schedule

### Version Timeline
- **v1.0**: Initial release (Current)
- **v1.1**: Q1 2024 - Core enhancements
- **v1.2**: Q2 2024 - UI improvements
- **v1.3**: Q3 2024 - Linux support
- **v2.0**: Q4 2024 - Major feature release
- **v2.1+**: 2025+ - Advanced features

### Release Criteria
Each release must meet:
- All features implemented and tested
- No known critical bugs
- Documentation updated
- Backward compatibility maintained (or migration path provided)
- Performance benchmarks met

## How to Contribute

### Feature Requests
1. Open a GitHub issue with "Feature Request" label
2. Describe the feature and use case
3. Discuss with maintainers and community
4. If approved, it will be added to the roadmap

### Game Additions
1. See `docs/ADDING_GAMES.md` for tutorial
2. Ensure data accuracy (verify against game)
3. Submit pull request with comprehensive item coverage
4. Include example build orders

### Code Contributions
1. Check roadmap for priority features
2. Discuss implementation approach in issue
3. Fork and create feature branch
4. Submit pull request with tests
5. Respond to review feedback

## Community Input

This roadmap is a living document. We welcome:
- Feature suggestions
- Priority changes based on user needs
- Game addition requests
- Bug reports and fixes
- Documentation improvements

**Have input?** Open an issue or discussion on GitHub!

## Notes

- Timelines are estimates and may change
- Features may be reordered based on community needs
- Breaking changes will be communicated clearly
- We maintain backward compatibility when possible

---

Last Updated: 2024-11-05
Version: 1.0
