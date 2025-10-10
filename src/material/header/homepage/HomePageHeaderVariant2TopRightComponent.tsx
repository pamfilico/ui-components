"use client";
import React from "react";
import { Box, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DemoIcon from "@mui/icons-material/PlayCircleFilled";
import FAQIcon from "@mui/icons-material/Help";
import { SectionNavigationVariant1 } from "../SectionNavigationVariant1";
import { AuthButtonVariant2 } from "../../auth";

export interface NavItem {
  text?: string;
  icon?: React.ReactNode;
  sectionId: string;
  tooltipText?: string;
  index: number;
  onClick?: (sectionId: string) => void;
}

export interface HomePageHeaderVariant2TopRightComponentProps {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  } | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onAppsClick?: () => void;
  actionText?: string;
  navItems?: NavItem[];
  navigationMarginTop?: number;
}

export const HomePageHeaderVariant2TopRightComponent: React.FC<HomePageHeaderVariant2TopRightComponentProps> = ({
  session,
  onSignIn,
  onSignOut,
  onAppsClick,
  actionText = "Go to Apps",
  navigationMarginTop = 80,
  navItems = [
    {
      icon: <HomeIcon />,
      sectionId: "herosection",
      tooltipText: "Home",
      index: 0,
    },
    {
      icon: <DemoIcon />,
      sectionId: "carousel_demo_section",
      tooltipText: "Demo",
      index: 1,
    },
    {
      icon: <FAQIcon />,
      sectionId: "faq_section",
      tooltipText: "FAQ",
      index: 2,
    },
  ],
}) => {
  return (
    <>
      {/* Action Button - Top Left */}
      {session && onAppsClick && (
        <Box
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
          }}
        >
          <Button
            variant="contained"
            onClick={onAppsClick}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "white",
              fontWeight: 600,
              textTransform: "none",
              px: 2,
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
          >
            {actionText}
          </Button>
        </Box>
      )}

      {/* Auth Button - Top Right */}
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1300,
        }}
      >
        <AuthButtonVariant2
          session={session}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
        />
      </Box>

      {/* Navigation - Top Right */}
      <Box
        sx={{
          position: "fixed",
          top: navigationMarginTop,
          right: 16,
          zIndex: 1200,
        }}
      >
        <SectionNavigationVariant1
          items={navItems}
          sx={{ gap: 1 }}
        />
      </Box>
    </>
  );
};
