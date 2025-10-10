"use client";
import React from "react";
import { AppBar, Toolbar, Box, Button, Avatar } from "@mui/material";
import { AuthButtonVariant1 } from "../../auth";
import { HeaderScrollToSectionButtonVariant1 } from "../HeaderScrollToSectionButtonVariant1";

export interface NavItem {
  text?: string;
  icon?: React.ReactNode;
  sectionId: string;
  tooltipText?: string;
  index: number;
  onClick?: (sectionId: string) => void;
}

export interface HomePageHeaderVariant1ComponentProps {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  } | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onLogoClick: () => void;
  onAppsClick: () => void;
  logoSrc?: string;
  title?: string;
  appsButtonText?: string;
  navItems?: NavItem[];
}

export const HomePageHeaderVariant1Component: React.FC<HomePageHeaderVariant1ComponentProps> = ({
  session,
  onSignIn,
  onSignOut,
  onLogoClick,
  onAppsClick,
  logoSrc = "/icon.png",
  title = "Admin Panel",
  appsButtonText = "Go to Apps",
  navItems = [{ text: "Home", sectionId: "herosection", index: 0 }],
}) => {
  const sortedNavItems = [...navItems].sort((a, b) => a.index - b.index);

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar sx={{ minHeight: { xs: 64, md: 70 } }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 0 }}>
            <Avatar
              src={logoSrc}
              alt="logo"
              sx={{
                width: { xs: 36, md: 40 },
                height: { xs: 36, md: 40 },
                mr: 1,
              }}
            />
            <Button
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: { xs: "1rem", md: "1.25rem" },
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
              onClick={onLogoClick}
            >
              {title}
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {sortedNavItems.map((item) => (
            <HeaderScrollToSectionButtonVariant1
              key={item.sectionId}
              text={item.text || item.tooltipText || ""}
              sectionId={item.sectionId}
              onClick={item.onClick}
            />
          ))}

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {session && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "none",
                  px: { xs: 2, md: 3 },
                  py: 1,
                  borderRadius: 2,
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(255, 255, 255, 0.2)",
                  },
                  transition: "all 0.3s ease",
                }}
                onClick={onAppsClick}
              >
                {appsButtonText}
              </Button>
            )}
            <AuthButtonVariant1
              session={session}
              onSignIn={onSignIn}
              onSignOut={onSignOut}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ minHeight: { xs: 64, md: 70 } }} />
    </>
  );
};
