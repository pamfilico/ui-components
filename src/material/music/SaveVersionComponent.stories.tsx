import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import SaveVersionComponent from "./SaveVersionComponent";
import SelectItemServerVariant1 from "./SelectItemServerVariant1";
import { Box } from "@mui/material";

// Mock key options for demo
const mockKeyOptions = [
  { id: "1", name: "C" },
  { id: "2", name: "C#" },
  { id: "3", name: "D" },
  { id: "4", name: "Eb" },
  { id: "5", name: "E" },
  { id: "6", name: "F" },
  { id: "7", name: "F#" },
  { id: "8", name: "G" },
  { id: "9", name: "Ab" },
  { id: "10", name: "A" },
  { id: "11", name: "Bb" },
  { id: "12", name: "B" },
  { id: "13", name: "Cm" },
  { id: "14", name: "Dm" },
  { id: "15", name: "Em" },
  { id: "16", name: "Fm" },
  { id: "17", name: "Gm" },
  { id: "18", name: "Am" },
];

const meta = {
  title: "Material/Music/SaveVersionComponent",
  component: SaveVersionComponent,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "A component for transposing and saving chord chart versions with different keys. Includes real-time transposition preview and semitone fine-tuning.",
      },
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
        <Story />
      </Box>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof SaveVersionComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample BlockNote content with various chord symbols
const sampleChordContent = [
  {
    type: "paragraph",
    content: [
      "Intro: ",
      { type: "chord", props: { symbol: "C" } },
      " - ",
      { type: "chord", props: { symbol: "Am" } },
      " - ",
      { type: "chord", props: { symbol: "F" } },
      " - ",
      { type: "chord", props: { symbol: "G" } },
    ],
  },
  {
    type: "paragraph",
    content: [
      "Verse: ",
      { type: "chord", props: { symbol: "C" } },
      " When I find myself in ",
      { type: "chord", props: { symbol: "G/B" } },
      " times of trouble",
    ],
  },
  {
    type: "paragraph",
    content: [
      { type: "chord", props: { symbol: "Am" } },
      " Mother Mary ",
      { type: "chord", props: { symbol: "F" } },
      " comes to me",
    ],
  },
  {
    type: "paragraph",
    content: [
      { type: "chord", props: { symbol: "C" } },
      " Speaking words of ",
      { type: "chord", props: { symbol: "G" } },
      " wisdom, let it ",
      { type: "chord", props: { symbol: "F" } },
      " be ",
      { type: "chord", props: { symbol: "C/E" } },
      " ",
      { type: "chord", props: { symbol: "Dm" } },
      " ",
      { type: "chord", props: { symbol: "C" } },
    ],
  },
];

const complexChordContent = [
  {
    type: "paragraph",
    content: [
      "Jazz Progression: ",
      { type: "chord", props: { symbol: "Cmaj7" } },
      " - ",
      { type: "chord", props: { symbol: "Em7" } },
      " - ",
      { type: "chord", props: { symbol: "A7" } },
      " - ",
      { type: "chord", props: { symbol: "Dm7" } },
      " - ",
      { type: "chord", props: { symbol: "G13" } },
    ],
  },
  {
    type: "paragraph",
    content: [
      "Bridge: ",
      { type: "chord", props: { symbol: "F#m7b5" } },
      " to ",
      { type: "chord", props: { symbol: "B7alt" } },
      " resolving to ",
      { type: "chord", props: { symbol: "Em7" } },
    ],
  },
  {
    type: "paragraph",
    content: [
      "Turnaround: ",
      { type: "chord", props: { symbol: "C6" } },
      " - ",
      { type: "chord", props: { symbol: "A7#5" } },
      " - ",
      { type: "chord", props: { symbol: "Dm9" } },
      " - ",
      { type: "chord", props: { symbol: "G7sus4" } },
    ],
  },
];

const greekSongContent = [
  {
    type: "paragraph",
    content: [
      "Εισαγωγή: ",
      { type: "chord", props: { symbol: "Dm" } },
      " - ",
      { type: "chord", props: { symbol: "Gm" } },
      " - ",
      { type: "chord", props: { symbol: "A7" } },
      " - ",
      { type: "chord", props: { symbol: "Dm" } },
    ],
  },
  {
    type: "paragraph",
    content: [
      "Στίχος: ",
      { type: "chord", props: { symbol: "Dm" } },
      " Όταν σε κοιτάζω ",
      { type: "chord", props: { symbol: "Gm" } },
      " στα μάτια",
    ],
  },
  {
    type: "paragraph",
    content: [
      { type: "chord", props: { symbol: "C" } },
      " Βλέπω τη θάλασσα ",
      { type: "chord", props: { symbol: "F" } },
      " και τον ουρανό",
    ],
  },
];

/**
 * Default story showing basic transposition functionality
 */
export const Default: Story = {
  args: {
    songId: "song-123",
    originalContent: sampleChordContent,
    originalKey: "C",
    showControls: true,
    keySelectComponent: (
      <SelectItemServerVariant1
        valueItemId={null}
        onChange={() => {}}
        fetchOptions={async () => mockKeyOptions}
        label="Key"
      />
    ),
    onSave: (versionData) => {
      console.log("Version saved:", versionData);
      alert(`Version saved in key: ${versionData?.data?.key || "unknown"}`);
    },
  },
};

/**
 * Story with complex jazz chords
 */
export const JazzChords: Story = {
  args: {
    songId: "jazz-song-456",
    originalContent: complexChordContent,
    originalKey: "C",
    showControls: true,
    keySelectComponent: (
      <SelectItemServerVariant1
        valueItemId={null}
        onChange={() => {}}
        fetchOptions={async () => mockKeyOptions}
        label="Key"
      />
    ),
    onSave: (versionData) => {
      console.log("Jazz version saved:", versionData);
    },
  },
};

/**
 * Story in a minor key
 */
export const MinorKey: Story = {
  args: {
    songId: "minor-song-789",
    originalContent: greekSongContent,
    originalKey: "Dm",
    showControls: true,
    keySelectComponent: (
      <SelectItemServerVariant1
        valueItemId={null}
        onChange={() => {}}
        fetchOptions={async () => mockKeyOptions}
        label="Key"
      />
    ),
    onSave: (versionData) => {
      console.log("Minor key version saved:", versionData);
    },
  },
};

/**
 * Story without controls (preview only mode)
 */
export const PreviewOnly: Story = {
  args: {
    songId: "preview-song-101",
    originalContent: sampleChordContent,
    originalKey: "G",
    showControls: false,
    keySelectComponent: (
      <SelectItemServerVariant1
        valueItemId={null}
        onChange={() => {}}
        fetchOptions={async () => mockKeyOptions}
        label="Key"
      />
    ),
    onSave: undefined,
  },
};

/**
 * Story with sharp key
 */
export const SharpKey: Story = {
  args: {
    songId: "sharp-song-202",
    originalContent: [
      {
        type: "paragraph",
        content: [
          "Country in F#: ",
          { type: "chord", props: { symbol: "F#" } },
          " - ",
          { type: "chord", props: { symbol: "C#" } },
          " - ",
          { type: "chord", props: { symbol: "D#m" } },
          " - ",
          { type: "chord", props: { symbol: "B" } },
        ],
      },
    ],
    originalKey: "F#",
    showControls: true,
    keySelectComponent: (
      <SelectItemServerVariant1
        valueItemId={null}
        onChange={() => {}}
        fetchOptions={async () => mockKeyOptions}
        label="Key"
      />
    ),
  },
};

/**
 * Story with flat key
 */
export const FlatKey: Story = {
  args: {
    songId: "flat-song-303",
    originalContent: [
      {
        type: "paragraph",
        content: [
          "Blues in Bb: ",
          { type: "chord", props: { symbol: "Bb7" } },
          " - ",
          { type: "chord", props: { symbol: "Eb7" } },
          " - ",
          { type: "chord", props: { symbol: "Bb7" } },
          " - ",
          { type: "chord", props: { symbol: "F7" } },
        ],
      },
    ],
    originalKey: "Bb",
    showControls: true,
    keySelectComponent: (
      <SelectItemServerVariant1
        valueItemId={null}
        onChange={() => {}}
        fetchOptions={async () => mockKeyOptions}
        label="Key"
      />
    ),
  },
};

/**
 * Empty content story (new song)
 */
export const EmptyContent: Story = {
  args: {
    songId: "empty-song-404",
    originalContent: [
      {
        type: "paragraph",
        content: "Start typing your chord chart here...",
      },
    ],
    originalKey: "C",
    showControls: true,
    keySelectComponent: (
      <SelectItemServerVariant1
        valueItemId={null}
        onChange={() => {}}
        fetchOptions={async () => mockKeyOptions}
        label="Key"
      />
    ),
    onSave: (versionData) => {
      console.log("Empty version saved:", versionData);
    },
  },
};

/**
 * Story with custom styling
 */
export const CustomStyling: Story = {
  args: {
    songId: "styled-song-505",
    originalContent: sampleChordContent,
    originalKey: "E",
    showControls: true,
    className: "custom-save-version",
    keySelectComponent: (
      <SelectItemServerVariant1
        valueItemId={null}
        onChange={() => {}}
        fetchOptions={async () => mockKeyOptions}
        label="Key"
      />
    ),
  },
  decorators: [
    (Story) => (
      <>
        <style>
          {`
            .custom-save-version {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 24px;
              border-radius: 12px;
            }
            .custom-save-version * {
              color: white !important;
            }
            .custom-save-version .MuiOutlinedInput-root {
              border-color: rgba(255, 255, 255, 0.5);
            }
          `}
        </style>
        <Story />
      </>
    ),
  ],
};

/**
 * Story simulating loading state
 */
export const LoadingState: Story = {
  args: {
    songId: "loading-song-606",
    originalContent: sampleChordContent,
    originalKey: "A",
    showControls: true,
    keySelectComponent: (
      <SelectItemServerVariant1
        valueItemId={null}
        onChange={() => {}}
        fetchOptions={async () => mockKeyOptions}
        label="Key"
      />
    ),
    onSave: async (versionData) => {
      // Simulate a slow save
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Slow save completed:", versionData);
    },
  },
};

/**
 * Story with error handling
 */
export const ErrorHandling: Story = {
  args: {
    songId: "error-song-707",
    originalContent: sampleChordContent,
    originalKey: "D",
    showControls: true,
    keySelectComponent: (
      <SelectItemServerVariant1
        valueItemId={null}
        onChange={() => {}}
        fetchOptions={async () => mockKeyOptions}
        label="Key"
      />
    ),
    onSave: () => {
      throw new Error("Failed to save version!");
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates error handling when save fails.",
      },
    },
  },
};