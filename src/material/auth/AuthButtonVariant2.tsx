"use client";
import React from "react";
import { IconButton, Tooltip, Paper } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

export interface AuthButtonVariant2Props {
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
   * Tooltip text for login button
   */
  loginTooltip?: string;
  /**
   * Tooltip text for logout button
   */
  logoutTooltip?: string;
  /**
   * Custom styles for the icon button
   */
  sx?: any;
}

/**
 * AuthButtonVariant2 component that displays either a login or logout icon button
 * based on the session state, with tooltips
 */
export const AuthButtonVariant2: React.FC<AuthButtonVariant2Props> = ({
  session,
  onSignIn,
  onSignOut,
  loginTooltip = "Login",
  logoutTooltip = "Logout",
  sx,
}) => {
  const defaultSx = {
    color: "primary.main",
    ...sx,
  };

  if (session) {
    return (
      <Tooltip title={logoutTooltip} arrow>
        <Paper
          elevation={3}
          sx={{
            borderRadius: "50%",
            display: "inline-flex",
          }}
        >
          <IconButton sx={defaultSx} onClick={onSignOut} aria-label={logoutTooltip}>
            <LogoutIcon />
          </IconButton>
        </Paper>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={loginTooltip} arrow>
      <Paper
        elevation={3}
        sx={{
          borderRadius: "50%",
          display: "inline-flex",
        }}
      >
        <IconButton sx={defaultSx} onClick={onSignIn} aria-label={loginTooltip}>
          <LoginIcon />
        </IconButton>
      </Paper>
    </Tooltip>
  );
};
