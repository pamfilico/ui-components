import type { Meta, StoryObj } from "@storybook/react";
import { AuthButton } from "./AuthButton";

/**
 * AuthButton displays either a login or logout button based on the session state.
 * It's commonly used in navigation headers and authentication flows.
 */
const meta = {
  title: "Material/Auth/AuthButton",
  component: AuthButton,
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
    loginText: {
      control: "text",
      description: "Text to display for login button",
    },
    logoutText: {
      control: "text",
      description: "Text to display for logout button",
    },
  },
  args: {
    onSignIn: () => {},
    onSignOut: () => {},
  },
} satisfies Meta<typeof AuthButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state showing the login button when no session is present
 */
export const LoggedOut: Story = {
  args: {
    session: null,
  },
};

/**
 * State showing the logout button when a user session is active
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
 * Custom text for login button
 */
export const CustomLoginText: Story = {
  args: {
    session: null,
    loginText: "Sign In",
  },
};

/**
 * Custom text for logout button
 */
export const CustomLogoutText: Story = {
  args: {
    session: {
      user: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
      },
    },
    logoutText: "Sign Out",
  },
};

/**
 * Custom styling applied to the button
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
      px: 3,
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
