# UI Component Package Template

This document serves as a template and guide for creating new UI component packages in the @pamfilico monorepo, based on patterns from the feedback package.

## Table of Contents

1. [Package Structure](#package-structure)
2. [Configuration Files](#configuration-files)
3. [Component Organization](#component-organization)
4. [Storybook Setup](#storybook-setup)
5. [Internationalization (i18n)](#internationalization-i18n)
6. [TypeScript Patterns](#typescript-patterns)
7. [Testing with MSW](#testing-with-msw)
8. [Build and Release](#build-and-release)
9. [Documentation](#documentation)

---

## Package Structure

A typical UI component package should follow this structure:

```
packages/your-component/
├── .storybook/              # Storybook configuration
│   ├── main.ts             # Storybook addons and framework config
│   ├── preview.tsx         # Global decorators and theme setup
│   ├── preview-head.html   # Custom HTML head for Storybook
│   └── fix-github-pages.js # Script to fix asset paths for GitHub Pages
├── docs/                    # Package documentation
│   └── TEMPLATE_PACKAGE.md  # This file
├── public/                  # Static assets
│   └── mockServiceWorker.js # MSW service worker
├── src/
│   ├── locales/            # Internationalization files
│   │   ├── en.json
│   │   ├── el.json
│   │   └── index.ts        # Translation loader
│   ├── material/           # Material UI components (or other framework)
│   │   ├── ComponentName.tsx
│   │   ├── ComponentName.stories.tsx
│   │   └── index.ts        # Exports
│   ├── mocks/              # MSW mock handlers for Storybook
│   │   └── handlers.ts
│   ├── types/              # TypeScript type definitions
│   │   └── custom-types.d.ts
│   └── index.ts            # Main entry point
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

---

## Configuration Files

### package.json

Your `package.json` should include these key patterns:

```json
{
  "name": "@pamfilico/your-component",
  "version": "1.0.0",
  "description": "Description of your component package",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.js"
    },
    "./material": {
      "types": "./dist/material/index.d.ts",
      "import": "./dist/material/index.js",
      "require": "./dist/material/index.js"
    }
  },
  "typesVersions": {
    "*": {
      "material": [
        "./dist/material/index.d.ts"
      ]
    }
  },
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "release:patch": "npm version patch && npm run build && npm publish --access public",
    "release:minor": "npm version minor && npm run build && npm publish --access public",
    "release:major": "npm version major && npm run build && npm publish --access public",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build && node .storybook/fix-github-pages.js",
    "deploy-storybook": "npm run build-storybook && gh-pages -d storybook-static -b gh-pages --dotfiles"
  },
  "keywords": [
    "your-keywords",
    "react",
    "component"
  ],
  "author": "",
  "license": "MIT",
  "peerDependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^7.3.1",
    "@mui/material": "^7.3.1",
    "next": "^15.0.0",
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  },
  "devDependencies": {
    "@chromatic-com/storybook": "^4.1.1",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^7.3.1",
    "@mui/material": "^7.3.1",
    "@storybook/addon-a11y": "^9.1.10",
    "@storybook/addon-docs": "^9.1.10",
    "@storybook/addon-onboarding": "^9.1.10",
    "@storybook/addon-vitest": "^9.1.10",
    "@storybook/blocks": "^8.6.14",
    "@storybook/nextjs": "^9.1.10",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "gh-pages": "^6.3.0",
    "msw": "^2.11.3",
    "msw-storybook-addon": "^2.0.5",
    "next": "15.4.6",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "storybook": "^9.1.10",
    "typescript": "5.7.3"
  },
  "msw": {
    "workerDirectory": [
      "public"
    ]
  }
}
```

**Key Patterns:**

1. **Exports Field**: Use the `exports` field to define multiple entry points (main, material, etc.)
2. **typesVersions**: Ensure TypeScript can find types for subpath exports
3. **peerDependencies**: List runtime dependencies that consumers must have
4. **devDependencies**: Include all peerDependencies plus dev tools (Storybook, TypeScript)
5. **MSW Configuration**: Add `msw.workerDirectory` for Storybook mock service worker

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "allowSyntheticDefaultImports": true,
    "noImplicitReturns": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Key Settings:**

- `declaration: true` - Generate .d.ts files
- `declarationMap: true` - Generate source maps for TypeScript definitions
- `outDir: "./dist"` - Build output directory
- `rootDir: "./src"` - Source root (maintains directory structure in dist)
- `resolveJsonModule: true` - Import JSON files (for translations)

---

## Component Organization

### Component File Structure

Each component should follow this pattern:

**ComponentName.tsx** - The component implementation

```tsx
"use client"; // For Next.js App Router compatibility

import React, { useState, useEffect, useMemo } from "react";
import { Button, Box, useMediaQuery, useTheme } from "@mui/material";
import IconName from "@mui/icons-material/IconName";
import { getTranslations, type Locale } from "../locales";

// Export types first
export type PlacementType = 'top' | 'bottom' | 'left' | 'right';

export interface ComponentNameProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  locale?: string;
  onAction?: (data: any) => void;
  customProp?: string;
}

export function ComponentName({
  variant = 'primary',
  size = 'medium',
  locale = 'en',
  onAction,
  customProp,
}: ComponentNameProps) {
  const [state, setState] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Validate locale
  const validLocale: Locale = (locale === 'en' || locale === 'el') ? locale : 'en';
  const t = useMemo(() => getTranslations(validLocale), [validLocale]);

  // Component logic...

  return (
    <Box>
      <Button onClick={() => setState(!state)}>
        {t.componentName.buttonText}
      </Button>
    </Box>
  );
}
```

**Key Patterns:**

1. Use `"use client"` directive for Next.js compatibility
2. Export prop interfaces and types
3. Provide sensible defaults for all props
4. Use `useMemo` for translations to avoid recalculation
5. Use Material UI's responsive utilities (useMediaQuery, useTheme)
6. Validate and cast locale to known type

### Component Stories

**ComponentName.stories.tsx** - Storybook stories

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';
import { handlers } from '../mocks/handlers';

const meta = {
  title: 'Material/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'fullscreen', // or 'centered' or 'padded'
    msw: {
      handlers,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Visual variant of the component',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the component',
    },
    locale: {
      control: 'select',
      options: ['en', 'el'],
      description: 'Language locale (en: English, el: Greek)',
    },
    onAction: {
      action: 'action triggered',
      description: 'Callback when action is triggered',
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default variant showing basic usage.
 * This is the most common configuration.
 */
export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    locale: 'en',
  },
};

/**
 * Secondary variant with larger size.
 */
export const SecondaryLarge: Story = {
  args: {
    variant: 'secondary',
    size: 'large',
    locale: 'en',
  },
};

/**
 * Greek locale variant (Ελληνικά).
 */
export const GreekLocale: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    locale: 'el',
  },
};

/**
 * Mobile viewport simulation.
 */
export const MobileViewport: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Custom decorator example for special layout needs.
 */
export const WithCustomLayout: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        <Story />
      </div>
    ),
  ],
};
```

**Key Patterns:**

1. Use `satisfies Meta` for type safety
2. Include MSW handlers in parameters for API mocking
3. Use `tags: ['autodocs']` for automatic documentation
4. Document each story with JSDoc comments
5. Provide comprehensive argTypes with descriptions
6. Create stories for different states, variants, and locales
7. Include mobile viewport stories for responsive components

### Index Exports

**src/material/index.ts** - Export all components and types

```tsx
export { ComponentName } from "./ComponentName";
export type { ComponentNameProps, PlacementType } from "./ComponentName";

export { AnotherComponent } from "./AnotherComponent";
export type { AnotherComponentProps } from "./AnotherComponent";
```

**src/index.ts** - Main package entry

```tsx
// Re-export everything from material
export * from "./material";

// Or export specific subpaths
// Users can then import like: import { ComponentName } from "@pamfilico/package"
// or: import { ComponentName } from "@pamfilico/package/material"
```

---

## Storybook Setup

### .storybook/main.ts

```typescript
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {}
  },
  staticDirs: ["../public"],
};

export default config;
```

### .storybook/preview.tsx

```tsx
import type { Preview } from '@storybook/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';

// Initialize MSW for GitHub Pages compatibility
const isGitHubPages = typeof window !== 'undefined' &&
  window.location.pathname.startsWith('/your-package-name');

initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: isGitHubPages
      ? '/your-package-name/mockServiceWorker.js'
      : '/mockServiceWorker.js',
  },
});

// Create Material-UI theme (customize as needed)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-center" />
        <Story />
      </ThemeProvider>
    ),
  ],
  loaders: [mswLoader],
};

export default preview;
```

### .storybook/fix-github-pages.js

Script to fix asset paths for GitHub Pages deployment:

```javascript
const fs = require('fs');
const path = require('path');

const storybookStaticDir = path.join(__dirname, '..', 'storybook-static');

// Read and modify index.html
const indexPath = path.join(storybookStaticDir, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Fix asset paths
indexHtml = indexHtml.replace(/src="\/([^"]+)"/g, 'src="/your-package-name/$1"');
indexHtml = indexHtml.replace(/href="\/([^"]+)"/g, 'href="/your-package-name/$1"');

fs.writeFileSync(indexPath, indexHtml);
console.log('Fixed GitHub Pages asset paths');
```

### .storybook/preview-head.html

Optional custom HTML for Storybook:

```html
<style>
  /* Custom styles for Storybook */
  body {
    margin: 0;
  }
</style>
```

---

## Internationalization (i18n)

### Translation Files

Create JSON files for each supported locale:

**src/locales/en.json**

```json
{
  "componentName": {
    "buttonText": "Click Me",
    "title": "Component Title",
    "description": "Component description text",
    "errors": {
      "required": "This field is required",
      "invalid": "Invalid value"
    },
    "notifications": {
      "success": "Operation successful!",
      "error": "Operation failed. Please try again."
    }
  },
  "anotherComponent": {
    "label": "Label text",
    "placeholder": "Enter text..."
  }
}
```

**src/locales/el.json** (Greek example)

```json
{
  "componentName": {
    "buttonText": "Κάντε κλικ εδώ",
    "title": "Τίτλος Στοιχείου",
    "description": "Κείμενο περιγραφής στοιχείου",
    "errors": {
      "required": "Αυτό το πεδίο είναι υποχρεωτικό",
      "invalid": "Μη έγκυρη τιμή"
    },
    "notifications": {
      "success": "Η λειτουργία ολοκληρώθηκε με επιτυχία!",
      "error": "Η λειτουργία απέτυχε. Παρακαλώ δοκιμάστε ξανά."
    }
  },
  "anotherComponent": {
    "label": "Κείμενο ετικέτας",
    "placeholder": "Εισαγάγετε κείμενο..."
  }
}
```

### Translation Loader

**src/locales/index.ts**

```typescript
import enTranslations from './en.json';
import elTranslations from './el.json';

// Define supported locales
export type Locale = 'en' | 'el';

// Infer translation structure from English
export type Translations = typeof enTranslations;

// Translation registry
const translations: Record<Locale, Translations> = {
  en: enTranslations,
  el: elTranslations,
};

/**
 * Get translations for a specific locale.
 * Falls back to English if locale not found.
 */
export function getTranslations(locale: Locale = 'en'): Translations {
  return translations[locale] || translations.en;
}

// Named exports for direct access
export { enTranslations, elTranslations };
```

### Using Translations in Components

```tsx
import { useMemo } from 'react';
import { getTranslations, type Locale } from '../locales';

function MyComponent({ locale = 'en' }: { locale?: string }) {
  // Validate and cast locale
  const validLocale: Locale = (locale === 'en' || locale === 'el') ? locale : 'en';

  // Memoize translations
  const t = useMemo(() => getTranslations(validLocale), [validLocale]);

  return (
    <div>
      <h1>{t.componentName.title}</h1>
      <p>{t.componentName.description}</p>
      <button>{t.componentName.buttonText}</button>
    </div>
  );
}
```

---

## TypeScript Patterns

### Custom Type Definitions

**src/types/custom-types.d.ts**

```typescript
// Declare modules for third-party packages without types
declare module 'some-package-without-types' {
  export interface SomeInterface {
    method(): void;
  }
  export default function someFunction(): void;
}

// Augment existing types
declare module '@mui/material/styles' {
  interface Theme {
    customProperty?: string;
  }
}
```

### Component Prop Patterns

```typescript
// Use descriptive names for union types
export type Variant = 'primary' | 'secondary' | 'tertiary';
export type Size = 'small' | 'medium' | 'large';
export type Placement =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

// Interface for component props
export interface MyComponentProps {
  // Required props (no default)
  id: string;

  // Optional props with clear types
  variant?: Variant;
  size?: Size;
  placement?: Placement;

  // Callback props
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onAction?: (data: any) => void;

  // Complex object props
  meta?: Record<string, any> | null;
  config?: {
    enabled: boolean;
    options: string[];
  };

  // Style props
  className?: string;
  sx?: import('@mui/material').SxProps;
}
```

---

## Testing with MSW

### Mock Handlers

**src/mocks/handlers.ts**

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  // GET endpoint
  http.get('/api/v1/items', ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';

    return HttpResponse.json({
      success: true,
      data: {
        items: [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' },
        ],
        pagination: {
          page: parseInt(page),
          total: 10,
        },
      },
    });
  }),

  // POST endpoint
  http.post('/api/v1/items', async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json({
      success: true,
      data: {
        id: 'new-id',
        ...body,
      },
    });
  }),

  // Error simulation
  http.get('/api/v1/error', () => {
    return HttpResponse.json(
      {
        success: false,
        error: 'Something went wrong',
      },
      { status: 500 }
    );
  }),
];
```

### Using MSW in Stories

```tsx
// Override handlers per story
export const WithError: Story = {
  args: {
    apiUrl: '/api/v1/error',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/v1/items', () => {
          return HttpResponse.json(
            { success: false, error: 'Network error' },
            { status: 500 }
          );
        }),
      ],
    },
  },
};
```

---

## Build and Release

### Building the Package

```bash
# Development mode (watch)
npm run dev

# Production build
npm run build
```

The build output will be in the `dist/` directory with the following structure:

```
dist/
├── index.js
├── index.d.ts
├── index.d.ts.map
├── material/
│   ├── ComponentName.js
│   ├── ComponentName.d.ts
│   ├── ComponentName.d.ts.map
│   ├── index.js
│   └── index.d.ts
└── locales/
    ├── index.js
    └── index.d.ts
```

### Release Process

```bash
# Patch release (1.0.0 -> 1.0.1)
npm run release:patch

# Minor release (1.0.0 -> 1.1.0)
npm run release:minor

# Major release (1.0.0 -> 2.0.0)
npm run release:major
```

Each release script:
1. Bumps the version in package.json
2. Builds the package
3. Publishes to npm with public access

### Storybook Deployment

```bash
# Build Storybook
npm run build-storybook

# Deploy to GitHub Pages
npm run deploy-storybook
```

---

## Documentation

### README.md Structure

Your README should include:

1. **Package Title and Description**
   - Brief overview
   - Key features

2. **Installation**
   - npm/yarn install commands
   - Peer dependency notes

3. **Quick Start**
   - Basic usage example
   - Import statements

4. **Components**
   - Each component documented separately
   - Props table
   - Usage examples
   - Live Storybook link

5. **API Requirements** (if applicable)
   - Backend endpoints
   - Request/response schemas
   - Authentication

6. **Features**
   - Bullet list of capabilities
   - Screenshots/GIFs

7. **Configuration**
   - Environment variables
   - Custom setup

8. **License**

### Component Documentation

Use JSDoc comments for inline documentation:

```tsx
/**
 * A button component with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <MyButton variant="primary" size="large" onClick={handleClick}>
 *   Click me
 * </MyButton>
 * ```
 */
export function MyButton({
  /**
   * Visual variant of the button
   * @default 'primary'
   */
  variant = 'primary',

  /**
   * Size of the button
   * @default 'medium'
   */
  size = 'medium',

  /**
   * Click handler
   */
  onClick,

  children,
}: MyButtonProps) {
  // Implementation
}
```

---

## Checklist for New Packages

- [ ] Set up package.json with proper exports and scripts
- [ ] Configure TypeScript (tsconfig.json)
- [ ] Set up Storybook (.storybook/ directory)
- [ ] Create component directory structure (src/material/ or src/framework/)
- [ ] Implement components with TypeScript types
- [ ] Add Storybook stories for each component
- [ ] Set up internationalization (src/locales/)
- [ ] Add MSW handlers for API mocking (src/mocks/)
- [ ] Write comprehensive README.md
- [ ] Test build output
- [ ] Deploy Storybook to GitHub Pages
- [ ] Publish to npm

---

## Best Practices

1. **Always export types** alongside components
2. **Use "use client"** directive for Next.js compatibility
3. **Provide sensible defaults** for all optional props
4. **Support internationalization** from the start
5. **Write stories for all variants** and states
6. **Mock API calls** with MSW in Storybook
7. **Use Material UI patterns** consistently
8. **Document props** with JSDoc comments
9. **Test responsive behavior** with viewport stories
10. **Keep components focused** - single responsibility principle

---

## Additional Resources

- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [MSW Documentation](https://mswjs.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v9/commands/npm-publish)
