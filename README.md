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

### Music Components

Located at `@pamfilico/uicomponents/material/music`

Components for chord chart editing and viewing with transposition and ChordPro support.

#### ChordEditorComponent

A rich text editor with inline chord support, transposition, and ChordPro-style bracket chord conversion.

```tsx
import { ChordEditorComponent } from "@pamfilico/uicomponents/material/music";

function SongEditor() {
  const handleContentChange = (content) => {
    console.log("Editor content:", content);
  };

  return (
    <ChordEditorComponent
      onContentChange={handleContentChange}
      isDarkMode={true}
      showControls={true}
      initialContent={[
        {
          type: "paragraph",
          content: [
            "Type lyrics here ",
            { type: "chord", props: { symbol: "C" } },
            " and more lyrics ",
            { type: "chord", props: { symbol: "G/B" } }
          ]
        }
      ]}
    />
  );
}
```

**Features:**
- Insert chords inline with lyrics
- Transpose all chords up/down by semitones
- Convert ChordPro-style `[C]` bracket chords to inline tokens
- Quick chord insertion with `@` trigger
- Dark/light mode support
- Help icon with usage instructions

#### ChordSelectionDialog

A dialog for selecting and inserting chords with a visual grid of common chords.

```tsx
import { ChordSelectionDialog } from "@pamfilico/uicomponents/material/music";

function MyComponent() {
  const [open, setOpen] = useState(false);

  const handleChordSelect = (chord) => {
    console.log("Selected chord:", chord);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Choose Chord</Button>
      <ChordSelectionDialog
        open={open}
        onClose={() => setOpen(false)}
        onChordSelect={handleChordSelect}
      />
    </>
  );
}
```

#### ReadOnlyBlockNoteViewer

A read-only viewer for displaying BlockNote content with chord tokens.

```tsx
import { ReadOnlyBlockNoteViewer } from "@pamfilico/uicomponents/material/music";

function SongDisplay({ songContent }) {
  return (
    <ReadOnlyBlockNoteViewer
      content={songContent}
      isDarkMode={false}
    />
  );
}
```

**Props:**
- `content`: BlockNote JSON content array
- `isDarkMode`: Boolean to toggle dark/light theme

#### SaveVersionComponent

A component for transposing chord charts and saving them in different keys. Accepts a custom key select component as a prop for maximum flexibility.

```tsx
import { SaveVersionComponent, SelectItemServerVariant1 } from "@pamfilico/uicomponents/material/music";

function SongVersionManager({ songId, songContent, originalKey }) {
  const handleSave = (versionData) => {
    console.log("Saving version:", versionData);
    // Save to your API
    fetch(`/api/songs/${songId}/versions`, {
      method: "POST",
      body: JSON.stringify(versionData.data)
    });
  };

  // Create your custom key select component
  const keySelectComponent = (
    <SelectItemServerVariant1
      valueItemId={null}
      onChange={() => {}}
      fetchOptions={async () => [
        { id: "C", name: "C" },
        { id: "D", name: "D" },
        { id: "E", name: "E" },
        { id: "F", name: "F" },
        { id: "G", name: "G" },
        { id: "A", name: "A" },
        { id: "B", name: "B" },
        // Add minor keys, sharps, flats...
      ]}
      label="Key"
    />
  );

  return (
    <SaveVersionComponent
      songId={songId}
      originalContent={songContent}
      originalKey={originalKey}
      keySelectComponent={keySelectComponent}
      onSave={handleSave}
      showControls={true}
      tActions={(key) => key} // Optional: translation function
      tLabels={(key) => key}  // Optional: translation function
      tMessages={(key) => key} // Optional: translation function
    />
  );
}
```

**Props:**
- `songId`: String identifier for the song
- `originalContent`: BlockNote JSON content array
- `originalKey`: String representing the original key (e.g., "C", "Dm")
- `keySelectComponent`: React element for key selection (required)
- `onSave`: Callback function when version is saved `(versionData) => void`
- `showControls`: Boolean to show/hide transpose controls (default: true)
- `tActions`: Optional translation function for action strings
- `tLabels`: Optional translation function for label strings
- `tMessages`: Optional translation function for message strings
- `className`: Optional CSS class name

**Features:**
- Live preview of transposed chord chart
- Transpose up/down with visual feedback
- Preview mode (read-only without controls)
- Customizable key selection through prop injection
- Internationalization support through translation functions

#### SelectItemServerVariant1

A generic autocomplete select component for server-side data fetching. Can be used for any dropdown that needs to fetch options from an API.

```tsx
import { SelectItemServerVariant1 } from "@pamfilico/uicomponents/material/music";

function GenreSelector() {
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);

  const fetchGenres = async () => {
    const response = await fetch("/api/genres");
    const genres = await response.json();
    return genres.map(g => ({ id: g.id, name: g.name }));
  };

  return (
    <SelectItemServerVariant1
      valueItemId={selectedGenreId}
      onChange={setSelectedGenreId}
      fetchOptions={fetchGenres}
      label="Select Genre"
      helperText="Choose a music genre"
      disabled={false}
    />
  );
}
```

**Props:**
- `valueItemId`: Currently selected item ID (string | null | undefined)
- `onChange`: Callback when selection changes `(itemId: string | null) => void`
- `fetchOptions`: Async function that returns `Promise<SelectItemOption[]>`
  - SelectItemOption: `{ id: string, name: string }`
- `label`: Optional label for the select input
- `helperText`: Optional helper text shown below the input
- `disabled`: Optional boolean to disable the select

**Use Cases:**
- Key selection for music transposition
- Genre/category selection
- Artist/band selection
- Any server-fetched dropdown options

**Utility Functions:**

The music package also exports utility functions for chord manipulation:

```tsx
import {
  transposeChordSymbol,
  parseChordSymbol,
  canonicalizeNote,
  transposeNote,
  SHARP_NOTES,
  ENHARMONIC,
  BRACKET_CHORD_REGEX
} from "@pamfilico/uicomponents/material/music";

// Transpose a chord
const transposed = transposeChordSymbol("C", 2); // Returns "D"

// Parse a chord symbol
const parsed = parseChordSymbol("Am7/G"); // { root: "A", quality: "m7", bass: "G", original: "Am7/G" }

// Canonicalize a note
const note = canonicalizeNote("Db"); // Returns "C#"

// Transpose a single note
const newNote = transposeNote("C", 2); // Returns "D"
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
import { ChordEditorComponent } from "@pamfilico/uicomponents/material/music";
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
