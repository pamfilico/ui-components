import type { Meta, StoryObj } from "@storybook/react";
import { MobileSectionNavigation } from "./MobileSectionNavigation";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactIcon from "@mui/icons-material/ContactMail";
import { Box, Typography } from "@mui/material";

/**
 * MobileSectionNavigation displays multiple floating action buttons for mobile navigation.
 * It accepts an array of navigation items and automatically sorts them by index.
 */
const meta = {
  title: "Material/Header/MobileSectionNavigation",
  component: MobileSectionNavigation,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
      description: "Array of navigation items to display",
    },
    onClick: {
      action: "clicked",
      description: "Callback function when a section button is clicked",
    },
  },
  args: {
    onClick: () => {},
  },
} satisfies Meta<typeof MobileSectionNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default navigation with three sections
 */
export const Default: Story = {
  args: {
    items: [
      {
        icon: <HomeIcon />,
        sectionId: "home",
        tooltipText: "Home",
        index: 0,
      },
      {
        icon: <InfoIcon />,
        sectionId: "about",
        tooltipText: "About",
        index: 1,
      },
      {
        icon: <ContactIcon />,
        sectionId: "contact",
        tooltipText: "Contact",
        index: 2,
      },
    ],
  },
};

/**
 * Multiple navigation items
 */
export const MultipleItems: Story = {
  args: {
    items: [
      {
        icon: <HomeIcon />,
        sectionId: "home",
        tooltipText: "Home",
        index: 0,
      },
      {
        icon: <InfoIcon />,
        sectionId: "about",
        tooltipText: "About",
        index: 1,
      },
      {
        icon: <ContactIcon />,
        sectionId: "contact",
        tooltipText: "Contact",
        index: 2,
      },
    ],
  },
};

/**
 * Auto-sorting demonstration - items will be sorted by index
 */
export const AutoSorted: Story = {
  args: {
    items: [
      {
        icon: <ContactIcon />,
        sectionId: "contact",
        tooltipText: "Contact (index 2)",
        index: 2,
      },
      {
        icon: <HomeIcon />,
        sectionId: "home",
        tooltipText: "Home (index 0)",
        index: 0,
      },
      {
        icon: <InfoIcon />,
        sectionId: "about",
        tooltipText: "About (index 1)",
        index: 1,
      },
    ],
  },
};

/**
 * With scrollable sections for testing
 */
export const WithScrollableSections: Story = {
  args: {
    items: [
      {
        icon: <HomeIcon />,
        sectionId: "section-1",
        tooltipText: "Section 1",
        index: 0,
      },
      {
        icon: <InfoIcon />,
        sectionId: "section-2",
        tooltipText: "Section 2",
        index: 1,
      },
      {
        icon: <ContactIcon />,
        sectionId: "section-3",
        tooltipText: "Section 3",
        index: 2,
      },
    ],
  },
  render: (args) => (
    <Box>
      <MobileSectionNavigation {...args} />
      <Box sx={{ mt: 15 }}>
        <Box id="section-1" sx={{ height: "50vh", backgroundColor: "#f0f0f0", p: 4, mb: 2 }}>
          <Typography variant="h4">Section 1</Typography>
          <Typography>This is the first section content.</Typography>
        </Box>
        <Box id="section-2" sx={{ height: "50vh", backgroundColor: "#e0e0e0", p: 4, mb: 2 }}>
          <Typography variant="h4">Section 2</Typography>
          <Typography>This is the second section content.</Typography>
        </Box>
        <Box id="section-3" sx={{ height: "50vh", backgroundColor: "#d0d0d0", p: 4 }}>
          <Typography variant="h4">Section 3</Typography>
          <Typography>This is the third section content.</Typography>
        </Box>
      </Box>
    </Box>
  ),
};
