import type { Meta, StoryObj } from "@storybook/react";
import { MessageDialogComponentVariant1 } from "../MessageDialogComponentVariant1";
import { useState } from "react";
import { Button } from "@mui/material";

const meta = {
  title: "Material/Dialogs/MessageDialogComponentVariant1",
  component: MessageDialogComponentVariant1,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MessageDialogComponentVariant1>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper to handle dialog state for stories
const DialogWrapper = (args: any) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <MessageDialogComponentVariant1 {...args} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export const Default: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    title: "Information",
    message: "This is a simple message dialog with plain text.",
    useMarkdown: false,
    closeButtonText: "Close",
  } as any,
};

export const WithMarkdown: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    title: "Pricing Explanation",
    message: `### Usage-Based Pricing

Our pricing model is simple and fair:

- **Pay only for what you use**
- No hidden fees
- Cancel anytime

**Example:**
- 1 vehicle used = 3€
- 5 vehicles used = 15€

Minimum monthly charge: **10€**`,
    useMarkdown: true,
    closeButtonText: "Got it",
  } as any,
};

export const NoTitle: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    message: "This dialog has no title, just a message.",
    useMarkdown: false,
    closeButtonText: "Close",
  } as any,
};

export const LongContent: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    title: "Terms and Conditions",
    message: `## Terms of Service

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Section 1: User Agreement

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Section 2: Privacy Policy

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

### Section 3: Liability

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
    useMarkdown: true,
    closeButtonText: "Accept",
  } as any,
};

export const CustomButtonText: Story = {
  render: (args) => <DialogWrapper {...args} />,
  args: {
    title: "Confirmation",
    message: "Are you sure you want to proceed with this action?",
    useMarkdown: false,
    closeButtonText: "OK, I understand",
  } as any,
};
