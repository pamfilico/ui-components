import type { Meta, StoryObj } from "@storybook/nextjs";
import { Box, Typography, Paper } from "@mui/material";
import React from "react";

import ReadOnlyBlockNoteViewer from "./ReadOnlyBlockNoteViewer";

const meta = {
  title: "Material/Music/ReadOnlyBlockNoteViewer",
  component: ReadOnlyBlockNoteViewer,
  parameters: {
    layout: "padded",
  },
  args: {
    isDarkMode: true,
  },
  argTypes: {
    isDarkMode: {
      control: "boolean",
      description: "Toggle dark/light mode for the viewer",
    },
    content: {
      control: "object",
      description: "BlockNote JSON content to display",
    },
  },
} satisfies Meta<typeof ReadOnlyBlockNoteViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: [
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
        content: "This is a read-only view of BlockNote content",
      },
      {
        type: "paragraph",
        content: "You can display chord sheets and lyrics without editing capabilities",
      },
    ],
  },
};

export const EmptyContent: Story = {
  args: {
    content: [
      {
        type: "paragraph",
        content: "",
      },
    ],
  },
};

export const SampleSong: Story = {
  args: {
    content: [
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

export const ComplexJazzChords: Story = {
  args: {
    content: [
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

export const LightMode: Story = {
  args: {
    isDarkMode: false,
    content: [
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
        content: "Light mode example - no editing controls visible",
      },
    ],
  },
};

export const GreekSong: Story = {
  args: {
    content: [
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

export const WithStructuredSong: Story = {
  args: {
    content: [
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
    ],
  },
};

export const InvalidContent: Story = {
  args: {
    content: "invalid json string",
  },
};

export const StringifiedJSON: Story = {
  args: {
    content: JSON.stringify([
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "Am" } },
          "     ",
          { type: "chord", props: { symbol: "F" } },
          "     ",
          { type: "chord", props: { symbol: "C" } },
          "     ",
          { type: "chord", props: { symbol: "G" } },
        ],
      },
      {
        type: "paragraph",
        content: "This content was passed as a JSON string and will be parsed automatically",
      },
    ]),
  },
};

export const Comparison: Story = {
  render: (args) => {
    const sampleContent = [
      {
        type: "paragraph",
        content: [
          { type: "chord", props: { symbol: "C" } },
          "     ",
          { type: "chord", props: { symbol: "G" } },
          "     ",
          { type: "chord", props: { symbol: "Am" } },
          "     ",
          { type: "chord", props: { symbol: "F" } },
        ],
      },
      {
        type: "paragraph",
        content: "Same content displayed in both light and dark modes",
      },
    ];

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          ReadOnlyBlockNoteViewer - Mode Comparison
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mt: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Dark Mode (Default)
            </Typography>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, height: 300 }}>
              <ReadOnlyBlockNoteViewer
                content={sampleContent}
                isDarkMode={true}
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Light Mode
            </Typography>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, height: 300 }}>
              <ReadOnlyBlockNoteViewer
                content={sampleContent}
                isDarkMode={false}
              />
            </Box>
          </Paper>
        </Box>

        <Paper sx={{ mt: 3, p: 2, backgroundColor: "background.paper" }}>
          <Typography variant="h6" gutterBottom>
            Content JSON
          </Typography>
          <Box
            component="pre"
            sx={{
              p: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
              overflow: "auto",
              maxHeight: 200,
              fontSize: 12,
              fontFamily: "monospace",
            }}
          >
            {JSON.stringify(sampleContent, null, 2)}
          </Box>
        </Paper>
      </Box>
    );
  },
};