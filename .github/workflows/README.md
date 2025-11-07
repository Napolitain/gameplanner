# Continuous Integration & Deployment

This directory contains GitHub Actions workflows for building and deploying the Game Planner web application.

## Workflow

### Deploy to GitHub Pages (`deploy.yml`)

Builds and deploys the Astro static site to GitHub Pages:

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Permissions:**
- Contents: read
- Pages: write
- ID token: write

**What it does:**
1. Checks out the code
2. Sets up Node.js 20
3. Installs npm dependencies (`npm ci`)
4. Builds the Astro site (`npm run build`)
5. Uploads build artifacts to GitHub Pages
6. Deploys to GitHub Pages

**Deployment URL:**
- https://napolitain.github.io/gameplanner/

## Running Locally

### Prerequisites
- Node.js 18+ or later
- npm

### Development Commands

```bash
# Install dependencies
npm install

# Start development server (localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run astro check
```

## Project Structure

```
src/
├── components/          # Svelte components
│   ├── MovesList.svelte
│   ├── OpeningDisplay.svelte
│   └── BuildOrderCreator.svelte
├── layouts/            # Astro layouts
│   └── Layout.astro
├── lib/                # TypeScript core logic
│   ├── game.ts
│   ├── buildOrder.ts
│   └── chess.ts
└── pages/              # Astro pages
    └── index.astro
```

## Technology Stack

- **Astro**: Static site generator
- **Svelte**: Reactive UI components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling

## Build Output

The build process generates a static site in the `dist/` directory:
- Optimized HTML, CSS, and JavaScript
- Pre-rendered pages for fast loading
- Minified assets for production
- Ready for deployment to any static host

## Deployment

### GitHub Pages
The site automatically deploys to GitHub Pages when changes are pushed to `main`.

### Manual Deployment
You can also deploy manually to any static hosting service:
1. Run `npm run build`
2. Upload the `dist/` directory to your host

### Supported Hosts
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any static file server

## Troubleshooting

### Build fails with TypeScript errors
- Run `npm run astro check` to see detailed errors
- Fix type errors in your TypeScript files

### Dependencies out of date
- Run `npm update` to update dependencies
- Check `package.json` for version compatibility

### Pages not loading correctly
- Check the `base` setting in `astro.config.mjs`
- Ensure it matches your deployment path

## Future Enhancements

- [ ] Automated testing with Vitest
- [ ] E2E testing with Playwright
- [ ] Performance monitoring
- [ ] Accessibility testing
- [ ] Bundle size optimization
- [ ] PWA support

