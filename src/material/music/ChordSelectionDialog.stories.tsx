import type { Meta, StoryObj } from "@storybook/nextjs";
import { useArgs } from "storybook/internal/preview-api";
import { fn } from "storybook/internal/test";
import { Button, Stack } from "@mui/material";
import React from "react";

import ChordSelectionDialog from "./ChordSelectionDialog";

const meta = {
  title: "Material/Music/ChordSelectionDialog",
  component: ChordSelectionDialog,
  parameters: {
    layout: "centered",
  },
  args: {
    open: true,
    onClose: fn(),
    onChordSelect: fn(),
  },
  argTypes: {
    onChordSelect: {
      action: "chord selected",
    },
  },
} satisfies Meta<typeof ChordSelectionDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultOpen: Story = {};

export const Interactive: Story = {
  args: {
    open: false,
  },
  render: (args) => {
    const [, updateArgs] = useArgs();

    const handleOpen = () => updateArgs({ open: true });

    const handleClose = () => {
      args.onClose();
      updateArgs({ open: false });
    };

    const handleChordSelect = (chord: string) => {
      args.onChordSelect(chord);
      updateArgs({ open: false });
    };

    return (
      <Stack spacing={2}>
        <Button variant="contained" onClick={handleOpen}>
          Choose chord
        </Button>
        <ChordSelectionDialog
          {...args}
          onClose={handleClose}
          onChordSelect={handleChordSelect}
        />
      </Stack>
    );
  },
};
