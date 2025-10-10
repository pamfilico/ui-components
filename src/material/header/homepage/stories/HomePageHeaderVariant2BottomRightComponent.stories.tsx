import type { Meta, StoryObj } from "@storybook/react";
import { HomePageHeaderVariant2BottomRightComponent } from "../HomePageHeaderVariant2BottomRightComponent";
import HomeIcon from "@mui/icons-material/Home";
import DemoIcon from "@mui/icons-material/PlayCircleFilled";
import FAQIcon from "@mui/icons-material/Help";
import { Box, Typography } from "@mui/material";

/**
 * HomePageHeaderVariant2BottomRightComponent - Mobile header with bottom-right navigation
 */
const meta = {
  title: "Material/Header/Homepage/HomePageHeaderVariant2BottomRightComponent",
  component: HomePageHeaderVariant2BottomRightComponent,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
} satisfies Meta<typeof HomePageHeaderVariant2BottomRightComponent>;

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
      <HomePageHeaderVariant2BottomRightComponent {...args} />
      <Box sx={{ height: "200vh", p: 4 }}>
        <Typography variant="h5" sx={{ mt: 10 }}>
          Mobile header - Logged out (Bottom-Right)
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Auth button (top-right), FAB navigation (bottom-right vertical reversed)
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
    navigationMarginBottom: 80,
    onSignIn: () => console.log("Sign in"),
    onSignOut: () => console.log("Sign out"),
    onAppsClick: () => console.log("Apps clicked"),
    actionText: "Go to Apps",
  },
  render: (args) => (
    <Box>
      <HomePageHeaderVariant2BottomRightComponent {...args} />
      <Box sx={{ height: "200vh", p: 4 }}>
        <Typography variant="h5" sx={{ mt: 10 }}>
          Mobile header - Logged in (Bottom-Right)
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Action button (top-left), Auth button (top-right), FAB navigation (bottom-right vertical reversed)
        </Typography>
      </Box>
    </Box>
  ),
};
