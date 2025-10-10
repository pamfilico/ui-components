# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Overview

This is `@pamfilico/uicomponents` - a TypeScript/React component library built for Material UI. The package provides reusable UI components organized by framework (currently Material UI) with full TypeScript support, Storybook documentation, and Next.js compatibility.

## Commands

### Development
```bash
npm run dev              # Watch mode (tsc --watch)
npm run build           # Build TypeScript to dist/
npm run storybook       # Run Storybook dev server on port 6006
```

### Testing & Documentation
```bash
npm run build-storybook    # Build Storybook static site + fix GitHub Pages
npm run deploy-storybook   # Build and deploy Storybook to gh-pages branch
```

### Publishing
```bash
npm run release:patch   # Bump patch, build, publish (x.y.Z)
npm run release:minor   # Bump minor, build, publish (x.Y.0)
npm run release:major   # Bump major, build, publish (X.0.0)
```

### MSW Setup
```bash
npx msw init public/    # Initialize Mock Service Worker for Storybook
```

## Architecture

### Package Structure
- **src/material/**: Material UI component implementations organized by feature
  - `auth/`: Authentication buttons (AuthButtonVariant1, AuthButtonVariant2)
  - `header/`: Header components with `homepage/` submodule for specialized variants
  - `home/`: Home page sections (Hero, Features, FAQ, TrustedBy)
  - `hero/`: Hero section components
- **src/utils/**: Shared utilities (scroll, SEO)
- **dist/**: Compiled output (TypeScript → JavaScript + .d.ts declaration files)
- **.storybook/**: Storybook configuration with MSW and Material UI setup
- **docs/**: Comprehensive package templates and setup guides

### Component Organization Pattern
Each component follows this structure:
- `ComponentName.tsx` - Implementation with "use client" directive for Next.js
- `ComponentName.stories.tsx` - Storybook stories (optional, can be in `stories/` subdirectory)
- `index.ts` - Re-exports component and its types

### Export Strategy
The package uses subpath exports defined in [package.json](package.json):
- `@pamfilico/uicomponents` → main entry (all exports)
- `@pamfilico/uicomponents/material/auth` → auth components only
- `@pamfilico/uicomponents/material/header` → header components
- `@pamfilico/uicomponents/material/header/homepage` → homepage header variants
- `@pamfilico/uicomponents/material/home` → home page sections
- `@pamfilico/uicomponents/material/hero` → hero sections
- `@pamfilico/uicomponents/utils` → utility functions

When adding new component directories, update both `exports` in [package.json](package.json) and the main [src/index.ts](src/index.ts).

### TypeScript Configuration
- **Target**: ES2020, ESNext modules
- **Output**: [dist/](dist/) with declaration maps
- **Strict mode**: enabled
- **Module resolution**: bundler (for Next.js compatibility)
- **JSX**: react-jsx (automatic runtime)

Key: `declaration: true` and `declarationMap: true` generate `.d.ts` files for consumers.

## Component Development Guidelines

### Component File Pattern
```tsx
"use client"; // Required for Next.js App Router

import React from "react";
import { Button } from "@mui/material";

export interface ComponentNameProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

export function ComponentName({
  variant = 'primary',
  size = 'medium',
}: ComponentNameProps) {
  return <Button>{/* ... */}</Button>;
}
```

Always:
1. Use `"use client"` directive at the top
2. Export prop interfaces with the component
3. Provide sensible defaults for optional props
4. Use Material UI components and theming

### Storybook Stories Pattern
Stories should be co-located with components or in a `stories/` subdirectory:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta = {
  title: 'Material/Category/ComponentName',
  component: ComponentName,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'primary' },
};
```

### MSW (Mock Service Worker)
If components require API calls:
1. Create mock handlers in `src/mocks/handlers.ts`
2. Export handlers array using `http` from `msw`
3. Include handlers in story parameters: `parameters: { msw: { handlers } }`

MSW is initialized in [.storybook/preview.tsx](.storybook/preview.tsx) with GitHub Pages path detection.

## Adding New Components

1. **Create component file** in appropriate [src/material/](src/material/) subdirectory
2. **Export from index.ts** in that subdirectory
3. **Update parent exports** if creating new subdirectory (update [src/index.ts](src/index.ts))
4. **Add subpath export** to [package.json](package.json) `exports` field if new subdirectory
5. **Create Storybook story** for visual testing
6. **Build and test** with `npm run build`

## Peer Dependencies

Components require these packages in the consuming application:
- `@emotion/react` ^11.14.0
- `@emotion/styled` ^11.14.1
- `@mui/icons-material` ^7.3.1
- `@mui/material` ^7.3.1
- `next` ^15.0.0 (for "use client" directive)
- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0

These are listed as both peerDependencies and devDependencies.

## Important Notes

- **All components must use `"use client"`** for Next.js App Router compatibility
- **Always export types** alongside components for TypeScript consumers
- **Build before publishing** - release scripts handle this automatically
- **Test in Storybook** before publishing to catch visual regressions
- **Avoid hardcoded theme values** - use Material UI's `useTheme()` hook

## Documentation References

- [TEMPLATE_PACKAGE.md](docs/TEMPLATE_PACKAGE.md) - Comprehensive template for building UI packages (component patterns, i18n, testing)
- [STORYBOOK_PACKAGE_SETUP.md](docs/STORYBOOK_PACKAGE_SETUP.md) - Storybook + MSW + GitHub Pages deployment guide
