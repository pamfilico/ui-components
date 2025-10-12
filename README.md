# @pamfilico/uicomponents

A collection of reusable UI components for Material UI and other frameworks.

## Status

This package is currently being set up. See [docs/TEMPLATE_PACKAGE.md](docs/TEMPLATE_PACKAGE.md) for the package structure template and development guidelines.

## Installation

```bash
npm install @pamfilico/uicomponents
```

## Usage

### Music Components

The package includes music-related components for chord chart editing and viewing:

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

### Utility Functions

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

## Development

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Build the package
npm run build

# Run Storybook
npm run storybook
```

## Documentation

- [Package Template Guide](docs/TEMPLATE_PACKAGE.md) - Comprehensive guide for building UI component packages
- [Storybook Documentation](docs/STORYBOOK_PACKAGE_SETUP.md) - Storybook setup guide

## License

MIT
