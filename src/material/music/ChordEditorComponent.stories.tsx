import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/internal/test";
import { Box, Typography, Paper } from "@mui/material";
import React from "react";

import ChordEditorComponent from "./ChordEditorComponent";

const meta = {
  title: "Material/Music/ChordEditorComponent",
  component: ChordEditorComponent,
  parameters: {
    layout: "padded",
  },
  args: {
    onContentChange: fn().mockImplementation((content: unknown) => {
      console.log('🎵 Content changed:', content);
      console.log('📝 Change detected at:', new Date().toISOString());
    }),
    isDarkMode: true,
    showControls: true,
  },
  argTypes: {
    isDarkMode: {
      control: "boolean",
      description: "Toggle dark/light mode for the editor",
    },
    showControls: {
      control: "boolean",
      description: "Show/hide the control buttons and instructions",
    },
    initialContent: {
      control: "object",
      description: "Initial content for the editor",
    },
    onContentChange: {
      action: "content changed",
    },
  },
} satisfies Meta<typeof ChordEditorComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialContent: [
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "C" } },
          "                               ",
          { type: "chord", props: { symbol: "G/B" } },
        ],
      },
      {
        type: "paragraph",
        content: "Type lyrics here and more lyrics",
      },
      {
        type: "paragraph",
        content: "",
      },
      {
        type: "paragraph",
        content: "You can also paste ChordPro-style text like: [Am]Hello [F]world [G]today",
      },
    ],
  },
};

export const EmptyEditor: Story = {
  args: {
    initialContent: [
      {
        type: "paragraph",
        content: "",
      },
    ],
  },
};

export const WithSampleSong: Story = {
  args: {
    onContentChange: fn().mockImplementation((content: unknown) => {
      console.log('🎵 Sample Song - Content changed:', content);
      console.log('💡 Tip: Use the +/- buttons to transpose all chords');
    }),
    initialContent: [
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "G" } },
          "                    ",
          { type: "chord", props: { symbol: "D" } },
        ],
      },
      {
        type: "paragraph",
        content: "Above all powers, above all kings",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "C" } },
          "                        ",
          { type: "chord", props: { symbol: "G" } },
        ],
      },
      {
        type: "paragraph",
        content: "Above all nature and all created things",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "Em" } },
          "                       ",
          { type: "chord", props: { symbol: "C" } },
        ],
      },
      {
        type: "paragraph",
        content: "Above all wisdom and all the ways of man",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "Am" } },
          "              ",
          { type: "chord", props: { symbol: "D" } },
          "                  ",
          { type: "chord", props: { symbol: "G" } },
        ],
      },
      {
        type: "paragraph",
        content: "You were here before the world began",
      },
    ],
  },
};

export const WithComplexChords: Story = {
  args: {
    onContentChange: fn().mockImplementation((content: unknown) => {
      console.log('🎼 Complex Chords - Content changed:', content);
      const contentStr = JSON.stringify(content);
      const chordMatches = contentStr.match(/"symbol":"([^"]*)"/g);
      if (chordMatches) {
        const chords = chordMatches.map(m => m.replace(/"symbol":"/, "").replace(/"/, ""));
        console.log('🎸 Current chords:', chords);
      }
    }),
    initialContent: [
      {
        type: "paragraph",
        content: "Jazz progression:",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "Cmaj7" } },
          "   ",
          { type: "chord", props: { symbol: "A7" } },
          "    ",
          { type: "chord", props: { symbol: "Dm7" } },
          "   ",
          { type: "chord", props: { symbol: "G7" } },
        ],
      },
      {
        type: "paragraph",
        content: "II - V - I progression in C major",
      },
      {
        type: "paragraph",
        content: "",
      },
      {
        type: "paragraph",
        content: "Slash chords:",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "F/C" } },
          "     ",
          { type: "chord", props: { symbol: "G/B" } },
          "     ",
          { type: "chord", props: { symbol: "Am/C" } },
          "    ",
          { type: "chord", props: { symbol: "D/F#" } },
        ],
      },
      {
        type: "paragraph",
        content: "Bass movement creates smooth voice leading",
      },
      {
        type: "paragraph",
        content: "",
      },
      {
        type: "paragraph",
        content: "Extended chords:",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "Em9" } },
          "     ",
          { type: "chord", props: { symbol: "Aadd9" } },
          "   ",
          { type: "chord", props: { symbol: "Dsus4" } },
          "   ",
          { type: "chord", props: { symbol: "G6" } },
        ],
      },
      {
        type: "paragraph",
        content: "Add color and texture to your progressions",
      },
    ],
  },
};

export const WithChordProInput: Story = {
  args: {
    onContentChange: fn().mockImplementation((content: unknown) => {
      console.log('🎹 ChordPro - Content changed:', content);
      console.log('📌 Action: Click "Convert [ ] chords" to transform bracket notation to inline chords');
    }),
    initialContent: [
      {
        type: "paragraph",
        content:
          "Paste ChordPro format text and click 'Convert [ ] chords' button:",
      },
      {
        type: "paragraph",
        content: "",
      },
      {
        type: "paragraph",
        content:
          "[Am]Amazing grace, how [F]sweet the sound that [C]saved a [G]wretch like [Am]me",
      },
      {
        type: "paragraph",
        content:
          "[Am]I once was [F]lost but [C]now I'm [G]found, was [Am]blind but [F]now I [Am]see",
      },
    ],
  },
};

export const LightMode: Story = {
  args: {
    isDarkMode: false,
    initialContent: [
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "C" } },
          "     ",
          { type: "chord", props: { symbol: "Am" } },
          "    ",
          { type: "chord", props: { symbol: "F" } },
          "     ",
          { type: "chord", props: { symbol: "G" } },
        ],
      },
      {
        type: "paragraph",
        content: "Light mode example",
      },
    ],
  },
};

export const WithoutControls: Story = {
  args: {
    showControls: false,
    initialContent: [
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "G" } },
          "     ",
          { type: "chord", props: { symbol: "Em" } },
          "    ",
          { type: "chord", props: { symbol: "C" } },
          "     ",
          { type: "chord", props: { symbol: "D" } },
        ],
      },
      {
        type: "paragraph",
        content: "Editor without control buttons",
      },
    ],
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [content, setContent] = React.useState<unknown>(null);
    const [changeCount, setChangeCount] = React.useState(0);
    const [lastChangeType, setLastChangeType] = React.useState<string>("");

    const detectChangeType = (newContent: unknown) => {
      const contentStr = JSON.stringify(newContent);
      if (contentStr.includes("chord")) {
        const chordMatches = contentStr.match(/"symbol":"([^"]*)"/g);
        if (chordMatches) {
          const chords = chordMatches.map(m => m.replace(/"symbol":"/, "").replace(/"/, ""));
          return `Chords detected: ${chords.join(", ")}`;
        }
      }
      return "Text edit";
    };

    return (
      <Box sx={{ p: 2 }}>
        <ChordEditorComponent
          {...args}
          onContentChange={(newContent) => {
            console.log('🎸 Interactive story - Content changed:', newContent);
            console.log('📊 Change #', changeCount + 1, 'at:', new Date().toLocaleTimeString());

            const changeType = detectChangeType(newContent);
            console.log('🎼 Change type:', changeType);

            setContent(newContent);
            setChangeCount(prev => prev + 1);
            setLastChangeType(changeType);
            args.onContentChange?.(newContent);
          }}
        />

        <Paper sx={{ mt: 3, p: 2, backgroundColor: "background.paper" }}>
          <Typography variant="h6" gutterBottom>
            Editor Output (JSON) - Changes: {changeCount}
          </Typography>
          {lastChangeType && (
            <Typography variant="body2" color="primary" gutterBottom>
              Last change: {lastChangeType}
            </Typography>
          )}
          <Box
            component="pre"
            sx={{
              p: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              overflow: "auto",
              maxHeight: 300,
              fontSize: 12,
              fontFamily: "monospace",
            }}
          >
            {JSON.stringify(content, null, 2)}
          </Box>
        </Paper>
      </Box>
    );
  },
  args: {
    initialContent: [
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "C" } },
          "     ",
          { type: "chord", props: { symbol: "G/B" } },
          "    ",
          { type: "chord", props: { symbol: "Am" } },
          "     ",
          { type: "chord", props: { symbol: "F" } },
        ],
      },
      {
        type: "paragraph",
        content: "Interactive demo - edit text and see JSON output below",
      },
    ],
  },
};

export const GreekSong: Story = {
  args: {
    initialContent: [
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "Dm" } },
          "                                     ",
          { type: "chord", props: { symbol: "Gm" } },
        ],
      },
      {
        type: "paragraph",
        content: "Στην υγειά μας ρε παιδιά στην υγειά μας",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "A7" } },
          "                ",
          { type: "chord", props: { symbol: "Dm" } },
        ],
      },
      {
        type: "paragraph",
        content: "Και του χρόνου να 'μαστε πάλι εδώ",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "Gm" } },
          "              ",
          { type: "chord", props: { symbol: "C" } },
        ],
      },
      {
        type: "paragraph",
        content: "Με κρασί και με τραγούδια",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "F" } },
          "            ",
          { type: "chord", props: { symbol: "A7" } },
          "         ",
          { type: "chord", props: { symbol: "Dm" } },
        ],
      },
      {
        type: "paragraph",
        content: "Με χαρά και με καλή καρδιά",
      },
    ],
  },
};

export const MultipleVerses: Story = {
  args: {
    initialContent: [
      {
        type: "heading",
        props: { level: 3 },
        content: "Verse 1",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "C" } },
          "                        ",
          { type: "chord", props: { symbol: "G/B" } },
        ],
      },
      {
        type: "paragraph",
        content: "When I find myself in times of trouble",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "Am" } },
          "             ",
          { type: "chord", props: { symbol: "F" } },
        ],
      },
      {
        type: "paragraph",
        content: "Mother Mary comes to me",
      },
      { type: "paragraph", content: "" },
      {
        type: "heading",
        props: { level: 3 },
        content: "Chorus",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "C" } },
          "           ",
          { type: "chord", props: { symbol: "G" } },
        ],
      },
      {
        type: "paragraph",
        content: "Let it be, let it be",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "F" } },
          "           ",
          { type: "chord", props: { symbol: "C" } },
        ],
      },
      {
        type: "paragraph",
        content: "Let it be, let it be",
      },
      { type: "paragraph", content: "" },
      {
        type: "heading",
        props: { level: 3 },
        content: "Verse 2",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "C" } },
          "                     ",
          { type: "chord", props: { symbol: "G/B" } },
        ],
      },
      {
        type: "paragraph",
        content: "And when the broken hearted people",
      },
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "Am" } },
          "              ",
          { type: "chord", props: { symbol: "F" } },
        ],
      },
      {
        type: "paragraph",
        content: "Living in the world agree",
      },
    ],
  },
};