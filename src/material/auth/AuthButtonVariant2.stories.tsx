import type { Meta, StoryObj } from "@storybook/react";
import { AuthButtonVariant2 } from "./AuthButtonVariant2";

/**
 * AuthButtonVariant2 displays either a login or logout icon button based on the session state.
 * It's commonly used in mobile navigation and compact layouts with tooltips.
 */
const meta = {
  title: "Material/Auth/AuthButtonVariant2",
  component: AuthButtonVariant2,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    session: {
      control: "object",
      description: "Session object containing user information",
    },
    onSignIn: {
      action: "signIn",
      description: "Callback function when sign in button is clicked",
    },
    onSignOut: {
      action: "signOut",
      description: "Callback function when sign out button is clicked",
    },
    loginTooltip: {
      control: "text",
      description: "Tooltip text for login button",
    },
    logoutTooltip: {
      control: "text",
      description: "Tooltip text for logout button",
    },
  },
  args: {
    onSignIn: () => {},
    onSignOut: () => {},
  },
} satisfies Meta<typeof AuthButtonVariant2>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state showing the login icon when no session is present
 */
export const LoggedOut: Story = {
  args: {
    session: null,
  },
};

/**
 * State showing the logout icon when a user session is active
 */
export const LoggedIn: Story = {
  args: {
    session: {
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    },
  },
};

/**
 * Custom tooltip for login button
 */
export const CustomLoginTooltip: Story = {
  args: {
    session: null,
    loginTooltip: "Sign In to Your Account",
  },
};

/**
 * Custom tooltip for logout button
 */
export const CustomLogoutTooltip: Story = {
  args: {
    session: {
      user: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
      },
    },
    logoutTooltip: "Sign Out from Your Account",
  },
};

/**
 * Custom styling applied to the icon button
 */
export const CustomStyle: Story = {
  args: {
    session: null,
    sx: {
      backgroundColor: "primary.main",
      color: "white",
      "&:hover": {
        backgroundColor: "primary.dark",
      },
      borderRadius: 2,
      p: 1.5,
    },
  },
};

/**
 * Dark background demonstration
 */
export const OnDarkBackground: Story = {
  args: {
    session: null,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
