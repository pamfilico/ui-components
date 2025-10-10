import type { Meta, StoryObj } from "@storybook/react";
import { HomePageHeaderVariant2Component } from "../HomePageHeaderVariant2Component";
import HomeIcon from "@mui/icons-material/Home";
import DemoIcon from "@mui/icons-material/PlayCircleFilled";
import FAQIcon from "@mui/icons-material/Help";
import { Box, Typography } from "@mui/material";

/**
 * HomePageHeaderVariant2Component - Mobile header with FAB navigation
 */
const meta = {
  title: "Material/Header/Homepage/HomePageHeaderParentComponent/Mobile",
  component: HomePageHeaderVariant2Component,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
} satisfies Meta<typeof HomePageHeaderVariant2Component>;

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
 * Logged out state - No action button, only auth and navigation
 */
export const LoggedOut: Story = {
  args: {
    session: null,
    navItems: defaultNavItems,
    onSignIn: () => console.log("Sign in"),
    onSignOut: () => console.log("Sign out"),
  },
  render: (args) => (
    <Box>
      <HomePageHeaderVariant2Component {...args} />
      <Box sx={{ height: "200vh", p: 4 }}>
        <Typography variant="h5" sx={{ mt: 10 }}>
          Mobile header - Logged out
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Auth button (top-right), FAB navigation (left side)
        </Typography>
      </Box>
    </Box>
  ),
};

/**
 * Logged in state - Shows action button, auth button, and navigation (vertical left)
 */
export const LoggedIn: Story = {
  args: {
    session: {
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    },
    navItems: defaultNavItems,
    navigationOrientation: "vertical",
    navigationPlacement: "left-middle",
    onSignIn: () => console.log("Sign in"),
    onSignOut: () => console.log("Sign out"),
    onAppsClick: () => console.log("Apps clicked"),
    actionText: "Go to Apps",
  },
  render: (args) => (
    <Box>
      <HomePageHeaderVariant2Component {...args} />
      <Box sx={{ height: "200vh", p: 4 }}>
        <Typography variant="h5" sx={{ mt: 10 }}>
          Mobile header - Logged in (Left Placement)
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Action button (top-left), Auth button (top-right), FAB navigation (left side vertical)
        </Typography>
      </Box>
    </Box>
  ),
};

/**
 * Right placement - Navigation on right side (vertical)
 */
export const RightPlacement: Story = {
  args: {
    session: {
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    },
    navItems: defaultNavItems,
    navigationOrientation: "vertical",
    navigationPlacement: "right-middle",
    onSignIn: () => console.log("Sign in"),
    onSignOut: () => console.log("Sign out"),
    onAppsClick: () => console.log("Apps clicked"),
    actionText: "Go to Apps",
  },
  render: (args) => (
    <Box>
      <HomePageHeaderVariant2Component {...args} />
      <Box sx={{ height: "200vh", p: 4 }}>
        <Typography variant="h5" sx={{ mt: 10 }}>
          Mobile header - Right Placement
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Action button (top-left), Auth button (top-right), FAB navigation (right side vertical)
        </Typography>
      </Box>
    </Box>
  ),
};

/**
 * Top-left placement - Navigation at top-left (vertical)
 */
export const TopLeftPlacement: Story = {
  args: {
    session: {
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    },
    navItems: defaultNavItems,
    navigationOrientation: "vertical",
    navigationPlacement: "top-left",
    navigationMarginTop: 80,
    onSignIn: () => console.log("Sign in"),
    onSignOut: () => console.log("Sign out"),
    onAppsClick: () => console.log("Apps clicked"),
    actionText: "Go to Apps",
  },
  render: (args) => (
    <Box>
      <HomePageHeaderVariant2Component {...args} />
      <Box sx={{ height: "200vh", p: 4 }}>
        <Typography variant="h5" sx={{ mt: 10 }}>
          Mobile header - Top-Left Placement
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Action button (top-left), Auth button (top-right), FAB navigation (top-left below action button)
        </Typography>
      </Box>
    </Box>
  ),
};

/**
 * Bottom-left placement - Navigation at bottom-left (vertical)
 */
export const BottomLeftPlacement: Story = {
  args: {
    session: {
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    },
    navItems: defaultNavItems,
    navigationOrientation: "vertical",
    navigationPlacement: "bottom-left",
    navigationMarginBottom: 80,
    onSignIn: () => console.log("Sign in"),
    onSignOut: () => console.log("Sign out"),
    onAppsClick: () => console.log("Apps clicked"),
    actionText: "Go to Apps",
  },
  render: (args) => (
    <Box>
      <HomePageHeaderVariant2Component {...args} />
      <Box sx={{ height: "200vh", p: 4 }}>
        <Typography variant="h5" sx={{ mt: 10 }}>
          Mobile header - Bottom-Left Placement
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Action button (top-left), Auth button (top-right), FAB navigation (bottom-left vertical)
        </Typography>
      </Box>
    </Box>
  ),
};

/**
 * Horizontal navigation variant - Shows navigation in horizontal orientation at bottom
 */
export const HorizontalNavigation: Story = {
  args: {
    session: {
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    },
    navItems: defaultNavItems,
    navigationOrientation: "horizontal",
    onSignIn: () => console.log("Sign in"),
    onSignOut: () => console.log("Sign out"),
    onAppsClick: () => console.log("Apps clicked"),
    actionText: "Go to Apps",
  },
  render: (args) => (
    <Box>
      <HomePageHeaderVariant2Component {...args} />
      <Box sx={{ height: "200vh", p: 4 }}>
        <Typography variant="h5" sx={{ mt: 10 }}>
          Mobile header - Horizontal Navigation
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Action button (top-left), Auth button (top-right), FAB navigation (bottom center horizontal)
        </Typography>
      </Box>
    </Box>
  ),
};
