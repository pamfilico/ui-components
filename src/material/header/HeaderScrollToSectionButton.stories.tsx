import type { Meta, StoryObj } from "@storybook/react";
import { HeaderScrollToSectionButton } from "./HeaderScrollToSectionButton";
import { Box, Typography } from "@mui/material";

/**
 * HeaderScrollToSectionButton provides smooth scrolling navigation to different sections on a page.
 * It's commonly used in single-page application headers for navigation.
 */
const meta = {
  title: "Material/Header/HeaderScrollToSectionButton",
  component: HeaderScrollToSectionButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "The text to display on the button",
    },
    sectionId: {
      control: "text",
      description: "The ID of the section to scroll to",
    },
    highlight: {
      control: "boolean",
      description: "Whether to highlight the button (active state)",
    },
    capitalize: {
      control: "boolean",
      description: "Whether to capitalize the text",
    },
    onClick: {
      action: "clicked",
      description: "Callback function when button is clicked",
    },
  },
  args: {
    onClick: () => {},
  },
} satisfies Meta<typeof HeaderScrollToSectionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state with standard text
 */
export const Default: Story = {
  args: {
    text: "About",
    sectionId: "about-section",
  },
};

/**
 * Highlighted/active state
 */
export const Highlighted: Story = {
  args: {
    text: "Features",
    sectionId: "features-section",
    highlight: true,
  },
};

/**
 * Without text capitalization
 */
export const NoCapitalize: Story = {
  args: {
    text: "Contact Us",
    sectionId: "contact-section",
    capitalize: false,
  },
};

/**
 * Custom styling
 */
export const CustomStyle: Story = {
  args: {
    text: "Pricing",
    sectionId: "pricing-section",
    sx: {
      backgroundColor: "secondary.main",
      color: "white",
      "&:hover": {
        backgroundColor: "secondary.dark",
      },
    },
  },
};

/**
 * Example with multiple buttons in a navigation bar
 */
export const NavigationBar: Story = {
  args: {
    text: "Home",
    sectionId: "home",
  },
  render: (args) => (
    <Box sx={{ display: "flex", gap: 1, backgroundColor: "#1976d2", p: 2, borderRadius: 1 }}>
      <HeaderScrollToSectionButton
        text="Home"
        sectionId="home"
        highlight={true}
      />
      <HeaderScrollToSectionButton
        text="About"
        sectionId="about"
      />
      <HeaderScrollToSectionButton
        text="Services"
        sectionId="services"
      />
      <HeaderScrollToSectionButton
        text="Contact"
        sectionId="contact"
      />
    </Box>
  ),
};

/**
 * Example with demo sections to scroll to
 */
export const WithScrollableSections: Story = {
  args: {
    text: "Section 1",
    sectionId: "section-1",
  },
  render: (args) => (
    <Box>
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, backgroundColor: "#1976d2", p: 2, zIndex: 1000, display: "flex", gap: 1 }}>
        <HeaderScrollToSectionButton
          text="Section 1"
          sectionId="section-1"
        />
        <HeaderScrollToSectionButton
          text="Section 2"
          sectionId="section-2"
        />
        <HeaderScrollToSectionButton
          text="Section 3"
          sectionId="section-3"
        />
      </Box>
      <Box sx={{ mt: 10 }}>
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
  parameters: {
    layout: "fullscreen",
  },
};
