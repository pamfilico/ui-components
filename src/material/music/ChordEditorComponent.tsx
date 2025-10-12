"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Divider,
  IconButton,
  Popover,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  BlockNoteSchema,
  defaultInlineContentSpecs,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  createReactInlineContentSpec,
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import ChordSelectionDialog from "./ChordSelectionDialog";

// =============================
// Chord utilities
// =============================
const SHARP_NOTES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
] as const;

const ENHARMONIC: Record<string, string> = {
  "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#",
  "E#": "F", "B#": "C", "Cb": "B", "Fb": "E",
};

const BRACKET_CHORD_REGEX = /\[([A-G](?:#{1,2}|b{1,2})?(?:[^\]\/]*))(?:\/([A-G](?:#{1,2}|b{1,2})?))?\]/g;

type ParsedChord = {
  root: string;
  quality: string;
  bass?: string;
  original: string;
};

function parseChordSymbol(symbol: string): ParsedChord | null {
  const re = /^([A-G])(#{1,2}|b{1,2})?([^/]*?)(?:\/([A-G])(#{1,2}|b{1,2})?)?$/;
  const m = symbol.trim().match(re);
  if (!m) return null;
  const [, r, acc = "", quality = "", bassR, bassAcc = ""] = m;
  const rootRaw = (r + acc) as string;
  const bassRaw = bassR ? (bassR + bassAcc) : undefined;
  const root = canonicalizeNote(rootRaw);
  const bass = bassRaw ? canonicalizeNote(bassRaw) : undefined;
  return { root, quality, bass, original: symbol };
}

function canonicalizeNote(n: string): string {
  if (ENHARMONIC[n]) return ENHARMONIC[n];
  const m = n.match(/^([A-G])(b+|#+)?$/);
  if (!m) return n;
  const [, letter, acc = ""] = m;
  let idx = SHARP_NOTES.indexOf(letter as typeof SHARP_NOTES[number]);
  if (idx < 0) return n;
  const delta = [...acc].reduce((sum, ch) => sum + (ch === "#" ? 1 : -1), 0);
  idx = (idx + delta + 12) % 12;
  return SHARP_NOTES[idx];
}

function transposeNote(note: string, steps: number, preferSharps = true): string {
  const canon = canonicalizeNote(note);
  let idx = SHARP_NOTES.indexOf(canon as typeof SHARP_NOTES[number]);
  if (idx < 0) return note;
  idx = (idx + steps + 12) % 12;
  const sharp = SHARP_NOTES[idx];
  if (preferSharps) return sharp;
  const flatMap: Record<string, string> = {
    "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab", "A#": "Bb",
  };
  return flatMap[sharp] ?? sharp;
}

function transposeChordSymbol(symbol: string, steps: number, preferSharps = true): string {
  const parsed = parseChordSymbol(symbol);
  if (!parsed) return symbol;
  const root = transposeNote(parsed.root, steps, preferSharps);
  const bass = parsed.bass ? transposeNote(parsed.bass, steps, preferSharps) : undefined;
  return bass ? `${root}${parsed.quality}/${bass}` : `${root}${parsed.quality}`;
}

// =============================
// Custom inline content for chords
// =============================
export const Chord = createReactInlineContentSpec(
  {
    type: "chord",
    propSchema: {
      symbol: { default: "C" },
    },
    content: "none",
    draggable: false,
  } as const,
  {
    render: (props) => {
      const sym = props.inlineContent.props.symbol;
      return (
        <span
          contentEditable={false}
          className="align-text-top inline-flex select-none items-center rounded bg-amber-100 px-1 text-xs font-semibold tracking-tight text-amber-900 shadow-sm"
          title="Chord"
          data-drag-handle
        >
          {sym}
        </span>
      );
    },
  }
);

// Create a schema that includes our custom inline content type
const useChordSchema = () =>
  useMemo(
    () =>
      BlockNoteSchema.create({
        inlineContentSpecs: {
          ...defaultInlineContentSpecs,
          chord: Chord,
        },
      }),
    []
  );

// =============================
// Main Chord Editor Component
// =============================
export interface ChordEditorComponentProps {
  initialContent?: any[];
  onContentChange?: (content: any) => void;
  isDarkMode?: boolean;
  showControls?: boolean;
}

const ChordEditorComponent: React.FC<ChordEditorComponentProps> = ({
  initialContent = [
    {
      type: "paragraph",
      content: [
        "Type lyrics here ",
        { type: "chord", props: { symbol: "C" } },
        " and more lyrics ",
        { type: "chord", props: { symbol: "G/B" } },
        " — try transposing with the buttons above.",
      ],
    },
    { type: "paragraph" },
    {
      type: "paragraph",
      content:
        "You can also paste ChordPro-style text like: [Am]Hello [F]world [G]today",
    },
  ],
  onContentChange,
  isDarkMode = true,
  showControls = true,
}) => {
  const [chordDialogOpen, setChordDialogOpen] = useState(false);
  const [preferSharps, setPreferSharps] = useState(true);
  const [helpAnchorEl, setHelpAnchorEl] = useState<HTMLButtonElement | null>(null);

  const schema = useChordSchema();
  const editor = useCreateBlockNote({
    schema,
    initialContent,
  });

  // Notify parent of content changes
  React.useEffect(() => {
    const handleChange = () => {
      if (onContentChange) {
        onContentChange(editor.document);
      }
    };

    editor.onChange(handleChange);
  }, [editor, onContentChange]);

  /** Insert a chord token at caret */
  const insertChord = useCallback(
    (symbol: string) => {
      editor.insertInlineContent([{ type: "chord", props: { symbol } }, " "]);
    },
    [editor]
  );

  /** Convert [C#m7/G#] style bracket chords into <chord/> tokens */
  const convertBracketChords = useCallback(() => {
    const blocks = editor.document;

    setTimeout(() => {
      blocks.forEach((block) => {
        const c = (block as any).content;
        const newContent: any[] = [];
        let hasChanges = false;

        const pushParsedFromString = (text: string) => {
          if (!text) return;
          let lastIndex = 0;
          let foundChords = false;

          text.replace(BRACKET_CHORD_REGEX, (m, chordBody: string, slashBass?: string, offset?: number) => {
            foundChords = true;
            const idx = (offset ?? 0);
            const before = text.slice(lastIndex, idx);
            if (before) newContent.push({ type: "text", text: before, styles: {} });
            const chordText = slashBass ? `${chordBody}/${slashBass}` : chordBody;
            newContent.push({ type: "chord", props: { symbol: chordText } } as any);
            lastIndex = idx + m.length;
            return m;
          });

          if (foundChords) {
            hasChanges = true;
            const tail = text.slice(lastIndex);
            if (tail) newContent.push({ type: "text", text: tail, styles: {} });
          } else if (text) {
            newContent.push({ type: "text", text: text, styles: {} });
          }
        };

        if (typeof c === "string") {
          pushParsedFromString(c);
          if (hasChanges) {
            editor.updateBlock(block, { content: newContent.length ? newContent : c } as any);
          }
          return;
        }

        if (Array.isArray(c)) {
          for (const item of c) {
            if (typeof item === "string") {
              pushParsedFromString(item);
            } else if ((item as any).type === "text") {
              pushParsedFromString((item as any).text ?? "");
            } else {
              newContent.push(item);
            }
          }
          if (hasChanges && newContent.length) {
            editor.updateBlock(block, { content: newContent } as any);
          }
        }
      });
    }, 0);
  }, [editor]);

  /** Transpose all <chord/> tokens by N semitones */
  const transposeAll = useCallback(
    (steps: number) => {
      const blocks = editor.document;
      (blocks as any[]).forEach((block: any) => {
        const c = block.content;
        if (!Array.isArray(c)) return;
        const next: any[] = c.map((item: any) => {
          if (item && typeof item === "object" && item.type === "chord") {
            const sym = item.props?.symbol ?? "";
            const newSym = transposeChordSymbol(sym, steps, preferSharps);
            return { ...item, props: { ...item.props, symbol: newSym } };
          }
          return item;
        });
        editor.updateBlock(block, { content: next } as any);
      });
    },
    [editor, preferSharps]
  );

  // Quick chord suggestion menu with '@' -> inserts a few common chords
  const chordItems: DefaultReactSuggestionItem[] = useMemo(
    () =>
      ["C", "G", "Am", "F", "Dm", "Em", "Bb", "E7", "F#m", "G/B"].map(
        (ch) => ({
          title: ch,
          onItemClick: () => insertChord(ch),
        })
      ),
    [insertChord]
  );

  // Note: Editor content is available via onContentChange callback
  // To expose methods like getContent, transposeAll, etc. via ref,
  // this component would need to use React.forwardRef

  return (
    <>
      {showControls && (
        <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setChordDialogOpen(true)}
            title="Insert chord at caret"
          >
            + Chord
          </Button>

          <Divider orientation="vertical" flexItem />

          <Button
            variant="outlined"
            size="small"
            onClick={() => transposeAll(-1)}
            title="Transpose down a semitone"
          >
            −
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => transposeAll(1)}
            title="Transpose up a semitone"
          >
            +
          </Button>

          <FormControlLabel
            control={
              <Checkbox
                checked={preferSharps}
                onChange={(e) => setPreferSharps(e.target.checked)}
                size="small"
              />
            }
            label="Prefer sharps (C# over Db)"
            sx={{ ml: 2 }}
          />

          <Divider orientation="vertical" flexItem />

          <Button
            variant="outlined"
            size="small"
            onClick={convertBracketChords}
            title="Convert [C] bracket chords into inline chord tokens"
          >
            Convert [ ] chords
          </Button>
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        {showControls && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <Typography variant="h6" sx={{ color: isDarkMode ? '#e0e0e0' : undefined }}>
              Chord Chart Editor
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => setHelpAnchorEl(e.currentTarget)}
              sx={{ color: isDarkMode ? '#9a9a9a' : 'text.secondary' }}
              title="Show help"
            >
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        <Box
          sx={{
            border: isDarkMode ? '1px solid #3a3a3a' : '1px solid #e0e0e0',
            borderRadius: 1,
            maxHeight: '70vh',
            overflow: 'auto',
            '& .bn-container': {
              minHeight: 400,
              backgroundColor: isDarkMode ? '#1a1a1a' : undefined,
            },
            '& .bn-editor': {
              backgroundColor: isDarkMode ? '#1a1a1a' : undefined,
              color: isDarkMode ? '#e0e0e0' : undefined,
            },
            '& .bn-block': {
              color: isDarkMode ? '#e0e0e0' : undefined,
            }
          }}
        >
          <BlockNoteView editor={editor} formattingToolbar sideMenu={false} slashMenu tableHandles={false}>
            <SuggestionMenuController
              triggerCharacter={"@"}
              getItems={async (query) => chordItems.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase())
              )}
            />
          </BlockNoteView>
        </Box>
      </Box>

      <Popover
        open={Boolean(helpAnchorEl)}
        anchorEl={helpAnchorEl}
        onClose={() => setHelpAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, maxWidth: 400 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            How to use the Chord Chart Editor
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Type lyrics normally. Insert chords inline using [C]-style
            markup and click <strong>Convert [ ] chords</strong>, or use the <strong>+ Chord</strong> button.
            Use <strong>+/−</strong> to transpose all chords instantly.
            You can also type <strong>@</strong> to get a quick chord menu.
          </Typography>
        </Box>
      </Popover>

      <ChordSelectionDialog
        open={chordDialogOpen}
        onClose={() => setChordDialogOpen(false)}
        onChordSelect={(chord) => {
          insertChord(chord);
          setChordDialogOpen(false);
        }}
      />
    </>
  );
};

export default ChordEditorComponent;
export { useChordSchema };
export { transposeChordSymbol, parseChordSymbol, canonicalizeNote, transposeNote };
export { SHARP_NOTES, ENHARMONIC, BRACKET_CHORD_REGEX };
export type { ParsedChord };