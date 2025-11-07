# Game Planner

A modern web-based build order planner for strategy games, built with Astro, Svelte, TypeScript, and Tailwind CSS.

## Overview

Game Planner is a static web application designed to help strategy game players create, manage, and optimize build orders. The application allows users to:

- Browse available moves and actions by category
- View sample chess openings (Italian Game, Ruy Lopez, Sicilian Defense)
- Create custom build orders interactively
- Visualize and manage build order sequences
- Track move counts and timings

The application is built as a static website that can be deployed to GitHub Pages or any static hosting service.

## Technology Stack

- **Framework**: [Astro](https://astro.build/) - Static Site Generator
- **UI Components**: [Svelte](https://svelte.dev/) - Reactive UI framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## Features

- **Interactive Build Order Creator**: Add, remove, and manage moves in your build order
- **Sample Openings**: Pre-configured chess opening sequences (Italian Game, Ruy Lopez, Sicilian Defense)
- **Move Browser**: Browse all available moves organized by category
- **Responsive Design**: Modern, mobile-friendly interface with Tailwind CSS
- **Type-Safe**: Full TypeScript implementation for reliability
- **Static Site**: Fast, deployable anywhere without server requirements

### Supported Games

- **Chess**: 21 different moves including:
  - Pawn openings (e4, d4, c4)
  - Knight development (Nf3, Nc3, Nf6, Nc6)
  - Bishop development (Bc4, Bb5, Bc5, Be7)
  - Special moves (castling, etc.)

## Project Structure

```
gameplanner/
├── src/
│   ├── components/          # Svelte components
│   │   ├── MovesList.svelte
│   │   ├── OpeningDisplay.svelte
│   │   └── BuildOrderCreator.svelte
│   ├── layouts/             # Astro layouts
│   │   └── Layout.astro
│   ├── lib/                 # TypeScript core logic
│   │   ├── game.ts          # Game data models
│   │   ├── buildOrder.ts    # Build order management
│   │   └── chess.ts         # Chess game implementation
│   └── pages/               # Astro pages
│       └── index.astro      # Main page
├── public/                  # Static assets
│   └── favicon.svg
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Building

### Prerequisites

- Node.js 18+ or later
- npm or yarn

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:4321`

### Production Build

```bash
# Build static site
npm run build

# Preview production build
npm run preview
```

The built site will be in the `dist/` directory, ready for deployment.

## Deployment to GitHub Pages

The project is configured for deployment to GitHub Pages. A GitHub Actions workflow automatically builds and deploys the site when changes are pushed to the main branch.

The site will be available at: `https://napolitain.github.io/gameplanner/`

## Core Data Model

The application uses a simple, extensible data model:

```typescript
// Game item (move, action, unit, etc.)
interface GameItem {
  id: string;
  name: string;
  category: string;
  description: string;
  timeCost: number;
  resources: Resource[];
}

// Build order step
interface BuildOrderStep {
  stepNumber: number;
  item: GameItem;
  notes: string;
}

// Complete build order
interface BuildOrder {
  name: string;
  steps: BuildOrderStep[];
}
```

## Adding New Games

To add a new game:

1. Create a new file in `src/lib/` (e.g., `starcraft.ts`)
2. Define your game items following the `chess.ts` pattern
3. Export a creation function like `createStarCraftGame()`
4. Update `src/pages/index.astro` to include your new game

## Future Enhancements

- [ ] Save/load build orders to localStorage
- [ ] Export build orders to JSON/text
- [ ] Support for multiple games (StarCraft 2, Age of Empires, etc.)
- [ ] Timing calculations and resource tracking
- [ ] Build order validation
- [ ] Dark mode support
- [ ] Community sharing features

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:
- New game support
- Bug fixes
- Feature enhancements
- Documentation improvements

## License

MIT License

## Acknowledgments

Inspired by:
- [BurnySC2's SC2 Planner](https://burnysc2.github.io/sc2-planner/)
- Various build order tools in the strategy gaming community

---

Built with ❤️ using Astro, Svelte, TypeScript, and Tailwind CSS
