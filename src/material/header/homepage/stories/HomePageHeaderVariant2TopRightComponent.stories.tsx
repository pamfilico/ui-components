import type { Meta, StoryObj } from "@storybook/react";
import { HomePageHeaderVariant2TopRightComponent } from "../HomePageHeaderVariant2TopRightComponent";
import HomeIcon from "@mui/icons-material/Home";
import DemoIcon from "@mui/icons-material/PlayCircleFilled";
import FAQIcon from "@mui/icons-material/Help";
import { Box, Typography } from "@mui/material";

/**
 * HomePageHeaderVariant2TopRightComponent - Mobile header with top-right navigation
 */
const meta = {
  title: "Material/Header/Homepage/HomePageHeaderVariant2TopRightComponent",
  component: HomePageHeaderVariant2TopRightComponent,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
} satisfies Meta<typeof HomePageHeaderVariant2TopRightComponent>;

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
      <HomePageHeaderVariant2TopRightComponent {...args} />
      <Box sx={{ height: "200vh", p: 4 }}>
        <Typography variant="h5" sx={{ mt: 10 }}>
          Mobile header - Logged out (Top-Right)
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Auth button (top-right), FAB navigation (top-right vertical)
        </Typography>
      </Box>
    </Box>
  ),
};

/**
 * Logged in state - Shows action button, auth button, and navigation
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
    navigationMarginTop: 80,
    onSignIn: () => console.log("Sign in"),
    onSignOut: () => console.log("Sign out"),
    onAppsClick: () => console.log("Apps clicked"),
    actionText: "Go to Apps",
  },
  render: (args) => (
    <Box>
      <HomePageHeaderVariant2TopRightComponent {...args} />
      <Box sx={{ height: "200vh", p: 4 }}>
        <Typography variant="h5" sx={{ mt: 10 }}>
          Mobile header - Logged in (Top-Right)
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Action button (top-left), Auth button (top-right), FAB navigation (top-right below auth button)
        </Typography>
      </Box>
    </Box>
  ),
};
