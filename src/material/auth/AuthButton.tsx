"use client";
import React from "react";
import { Button } from "@mui/material";

export interface AuthButtonProps {
  /**
   * Session object containing user information
   */
  session?: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  } | null;
  /**
   * Callback function when sign in button is clicked
   */
  onSignIn: () => void;
  /**
   * Callback function when sign out button is clicked
   */
  onSignOut: () => void;
  /**
   * Text to display for login button
   */
  loginText?: string;
  /**
   * Text to display for logout button
   */
  logoutText?: string;
  /**
   * Custom styles for the button
   */
  sx?: any;
}

/**
 * AuthButton component that displays either a login or logout button
 * based on the session state
 */
export const AuthButton: React.FC<AuthButtonProps> = ({
  session,
  onSignIn,
  onSignOut,
  loginText = "Login",
  logoutText = "Logout",
  sx,
}) => {
  const defaultSx = {
    color: "#e4e5ea",
    my: 2,
    display: "block",
    fontWeight: "bold",
    ...sx,
  };

  if (session) {
    return (
      <Button sx={defaultSx} onClick={onSignOut}>
        {logoutText}
      </Button>
    );
  }

  return (
    <Button sx={defaultSx} onClick={onSignIn}>
      {loginText}
    </Button>
  );
};
