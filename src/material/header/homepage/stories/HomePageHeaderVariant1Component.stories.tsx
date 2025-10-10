import type { Meta, StoryObj } from "@storybook/react";
import { HomePageHeaderVariant1Component } from "../HomePageHeaderVariant1Component";
import HomeIcon from "@mui/icons-material/Home";
import DemoIcon from "@mui/icons-material/PlayCircleFilled";
import FAQIcon from "@mui/icons-material/Help";
import { Box, Typography } from "@mui/material";

/**
 * HomePageHeaderVariant1Component - Desktop header with text navigation
 */
const meta = {
  title: "Material/Header/Homepage/HomePageHeaderParentComponent/Desktop",
  component: HomePageHeaderVariant1Component,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  globals: {
    viewport: { value: "desktop", isRotated: false },
  },
} satisfies Meta<typeof HomePageHeaderVariant1Component>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultNavItems = [
  {
    text: "Home",
    icon: <HomeIcon />,
    sectionId: "home",
    tooltipText: "Home",
    index: 0,
  },
  {
    text: "Demo",
    icon: <DemoIcon />,
    sectionId: "demo",
    tooltipText: "Demo",
    index: 1,
  },
  {
    text: "FAQ",
    icon: <FAQIcon />,
    sectionId: "faq",
    tooltipText: "FAQ",
    index: 2,
  },
];

/**
 * Default desktop header (logged out)
 */
export const Default: Story = {
  args: {
    session: null,
    navItems: defaultNavItems,
    onSignIn: () => console.log("Sign in"),
    onSignOut: () => console.log("Sign out"),
    onLogoClick: () => console.log("Logo clicked"),
    onAppsClick: () => console.log("Apps clicked"),
  },
  render: (args) => (
    <Box>
      <HomePageHeaderVariant1Component {...args} />
      <Box sx={{ height: "200vh", p: 4 }}>
        <Typography variant="h5" sx={{ mt: 10 }}>
          Desktop header with text navigation
        </Typography>
      </Box>
    </Box>
  ),
};

/**
 * Logged in desktop header
 */
export const LoggedIn: Story = {
  args: {
    session: {
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
        image: "https://i.pravatar.cc/150?img=12",
      },
    },
    navItems: defaultNavItems,
    onSignIn: () => console.log("Sign in"),
    onSignOut: () => console.log("Sign out"),
    onLogoClick: () => console.log("Logo clicked"),
    onAppsClick: () => console.log("Apps clicked"),
  },
  render: (args) => (
    <Box>
      <HomePageHeaderVariant1Component {...args} />
      <Box sx={{ height: "200vh", p: 4 }}>
        <Typography variant="h5" sx={{ mt: 10 }}>
          Desktop header with logged in user
        </Typography>
      </Box>
    </Box>
  ),
};

/**
 * Logged in desktop header without logo
 */
export const LoggedInNoLogo: Story = {
  args: {
    session: {
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
        image: "https://i.pravatar.cc/150?img=12",
      },
    },
    navItems: defaultNavItems,
    onSignIn: () => console.log("Sign in"),
    onSignOut: () => console.log("Sign out"),
    onLogoClick: () => console.log("Logo clicked"),
    onAppsClick: () => console.log("Apps clicked"),
    hideLogo: true,
  },
  render: (args) => (
    <Box>
      <HomePageHeaderVariant1Component {...args} />
      <Box sx={{ height: "200vh", p: 4 }}>
        <Typography variant="h5" sx={{ mt: 10 }}>
          Desktop header with logged in user (no logo)
        </Typography>
      </Box>
    </Box>
  ),
};
