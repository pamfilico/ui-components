# @pamfilico/uicomponents

A collection of reusable UI components for Material UI and other frameworks.

## Installation

```bash
npm install @pamfilico/uicomponents
```

## Quick Start

```tsx
import { AuthButtonVariant1, HeroSectionVariant1 } from "@pamfilico/uicomponents";
// Or use subpath imports for specific categories
import { AuthButtonVariant1 } from "@pamfilico/uicomponents/material/auth";
import { HeroSectionVariant1 } from "@pamfilico/uicomponents/material/hero";

function App() {
  return (
    <>
      <AuthButtonVariant1
        onLogin={() => console.log("Login clicked")}
        onSignup={() => console.log("Signup clicked")}
      />
      <HeroSectionVariant1
        title="Welcome to Our Platform"
        subtitle="Build amazing things"
      />
    </>
  );
}
```

## Components

### Authentication Components

Located at `@pamfilico/uicomponents/material/auth`

#### AuthButtonVariant1

A simple authentication button component.

```tsx
import { AuthButtonVariant1 } from "@pamfilico/uicomponents/material/auth";

<AuthButtonVariant1
  onLogin={() => handleLogin()}
  onSignup={() => handleSignup()}
/>
```

#### AuthButtonVariant2

Alternative authentication button variant.

```tsx
import { AuthButtonVariant2 } from "@pamfilico/uicomponents/material/auth";

<AuthButtonVariant2
  onLogin={() => handleLogin()}
  onSignup={() => handleSignup()}
/>
```

---

### Header Components

Located at `@pamfilico/uicomponents/material/header`

#### SectionNavigationVariant1

Navigation component for scrolling to different sections.

```tsx
import { SectionNavigationVariant1 } from "@pamfilico/uicomponents/material/header";

<SectionNavigationVariant1
  sections={[
    { id: "features", label: "Features" },
    { id: "pricing", label: "Pricing" },
    { id: "contact", label: "Contact" }
  ]}
/>
```

#### HeaderScrollToSectionButtonVariant1

Button component for smooth scrolling to sections.

```tsx
import { HeaderScrollToSectionButtonVariant1 } from "@pamfilico/uicomponents/material/header";

<HeaderScrollToSectionButtonVariant1
  targetId="features"
  label="View Features"
/>
```

#### HeaderScrollToSectionButtonVariant2

Alternative scroll button variant.

```tsx
import { HeaderScrollToSectionButtonVariant2 } from "@pamfilico/uicomponents/material/header";

<HeaderScrollToSectionButtonVariant2
  targetId="pricing"
  label="See Pricing"
/>
```

---

### Homepage Header Components

Located at `@pamfilico/uicomponents/material/header/homepage`

Complete homepage header layouts with multiple variants and sub-components.

#### HomePageHeaderVariant1Component

```tsx
import { HomePageHeaderVariant1Component } from "@pamfilico/uicomponents/material/header/homepage";

<HomePageHeaderVariant1Component />
```

#### HomePageHeaderVariant2Component

Multi-section header with top and bottom components.

```tsx
import { HomePageHeaderVariant2Component } from "@pamfilico/uicomponents/material/header/homepage";

<HomePageHeaderVariant2Component />
```

#### Sub-components

For more granular control:

```tsx
import {
  HomePageHeaderParentComponent,
  HomePageHeaderVariant2TopLeftComponent,
  HomePageHeaderVariant2TopRightComponent,
  HomePageHeaderVariant2BottomLeftComponent,
  HomePageHeaderVariant2BottomRightComponent
} from "@pamfilico/uicomponents/material/header/homepage";
```

---

### Hero Components

Located at `@pamfilico/uicomponents/material/hero`

#### HeroSectionVariant1

Hero section component for landing pages.

```tsx
import { HeroSectionVariant1 } from "@pamfilico/uicomponents/material/hero";

<HeroSectionVariant1
  title="Build Amazing Products"
  subtitle="The fastest way to ship your ideas"
  ctaText="Get Started"
  onCtaClick={() => router.push("/signup")}
/>
```

---

### Home Page Components

Located at `@pamfilico/uicomponents/material/home`

#### FeatureSectionVariant1

Feature showcase section with cards.

```tsx
import { FeatureSectionVariant1 } from "@pamfilico/uicomponents/material/home";

<FeatureSectionVariant1
  features={[
    {
      title: "Fast",
      description: "Lightning quick performance",
      icon: <SpeedIcon />
    },
    {
      title: "Secure",
      description: "Enterprise-grade security",
      icon: <LockIcon />
    }
  ]}
/>
```

#### FeatureCardVariant1

Individual feature card component.

```tsx
import { FeatureCardVariant1 } from "@pamfilico/uicomponents/material/home";

<FeatureCardVariant1
  title="Real-time Sync"
  description="Stay up to date with instant synchronization"
  icon={<SyncIcon />}
/>
```

#### FaqSectionVariant1

FAQ section with accordion-style questions.

```tsx
import { FaqSectionVariant1 } from "@pamfilico/uicomponents/material/home";

<FaqSectionVariant1
  faqs={[
    {
      question: "How does it work?",
      answer: "Our platform uses advanced technology..."
    },
    {
      question: "What's included?",
      answer: "You get access to all features..."
    }
  ]}
/>
```

#### TrustedByApplicationsSectionVariant1

Showcase logos of companies/applications using your product.

```tsx
import { TrustedByApplicationsSectionVariant1 } from "@pamfilico/uicomponents/material/home";

<TrustedByApplicationsSectionVariant1
  applications={[
    { name: "Company A", logo: "/logos/company-a.png" },
    { name: "Company B", logo: "/logos/company-b.png" }
  ]}
/>
```

---

### Utilities

Located at `@pamfilico/uicomponents/utils`

Utility functions for common tasks.

```tsx
import { scrollToSection, generateSeoMetadata } from "@pamfilico/uicomponents/utils";

// Smooth scroll to a section
scrollToSection("features");

// Generate SEO metadata for Next.js
const metadata = generateSeoMetadata({
  title: "My Page",
  description: "Page description"
});
```

---

## Subpath Exports

The package supports multiple import paths for better organization:

```tsx
// Main entry (exports everything)
import { AuthButtonVariant1 } from "@pamfilico/uicomponents";

// Category-specific imports
import { AuthButtonVariant1 } from "@pamfilico/uicomponents/material/auth";
import { SectionNavigationVariant1 } from "@pamfilico/uicomponents/material/header";
import { HomePageHeaderVariant1Component } from "@pamfilico/uicomponents/material/header/homepage";
import { HeroSectionVariant1 } from "@pamfilico/uicomponents/material/hero";
import { FeatureSectionVariant1 } from "@pamfilico/uicomponents/material/home";
import { scrollToSection } from "@pamfilico/uicomponents/utils";
```

---

## Features

- 🎨 **Material UI Components** - Built with Material UI for consistent theming
- 📱 **Responsive Design** - All components adapt to mobile, tablet, and desktop
- 🔧 **TypeScript Support** - Full type definitions included
- ⚛️ **Next.js Compatible** - All components use "use client" directive
- 📦 **Tree-shakeable** - Import only what you need with subpath exports
- 🎯 **Storybook Documentation** - Interactive component demos and documentation
- 🌐 **Framework Agnostic Architecture** - Organized by framework for future expansion

---

## Development

See [TEMPLATE_PACKAGE.md](docs/TEMPLATE_PACKAGE.md) for comprehensive development guidelines and patterns.

```bash
# Install dependencies
npm install

# Start development mode (watch)
npm run dev

# Build the package
npm run build

# Run Storybook
npm run storybook

# Build and deploy Storybook
npm run deploy-storybook
```

---

## Documentation

- [TEMPLATE_PACKAGE.md](docs/TEMPLATE_PACKAGE.md) - Comprehensive guide for building UI component packages
- [STORYBOOK_PACKAGE_SETUP.md](docs/STORYBOOK_PACKAGE_SETUP.md) - Storybook setup and deployment guide
- [CLAUDE.md](CLAUDE.md) - Development guidelines for working with this codebase

---

## Peer Dependencies

This package requires the following dependencies in your project:

```json
{
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1",
  "@mui/icons-material": "^7.3.1",
  "@mui/material": "^7.3.1",
  "next": "^15.0.0",
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0"
}
```

---

## License

MIT
