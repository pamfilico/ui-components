"use client";
import React from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { HomePageHeaderVariant1Component } from "./HomePageHeaderVariant1Component";
import { HomePageHeaderVariant2TopLeftComponent } from "./HomePageHeaderVariant2TopLeftComponent";
import { HomePageHeaderVariant2TopRightComponent } from "./HomePageHeaderVariant2TopRightComponent";
import { HomePageHeaderVariant2BottomLeftComponent } from "./HomePageHeaderVariant2BottomLeftComponent";
import { HomePageHeaderVariant2BottomRightComponent } from "./HomePageHeaderVariant2BottomRightComponent";

export interface NavItem {
  text?: string;
  icon?: React.ReactNode;
  sectionId: string;
  tooltipText?: string;
  index: number;
  onClick?: (sectionId: string) => void;
}

export interface HomePageHeaderParentComponentProps {
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
  mobileToolbarPlacement?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  mobileToolbarMarginTop?: number;
  mobileToolbarMarginBottom?: number;
  desktopVariant?: React.ComponentType<any>;
  mobileVariant?: React.ComponentType<any>;
  hideLogo?: boolean;
}

/**
 * HomePageHeaderParentComponent - Complete homepage header with desktop and mobile variants
 * Manages both desktop navigation bar and mobile floating action buttons
 * Uses media query to detect screen size and render appropriate variant
 */
export const HomePageHeaderParentComponent: React.FC<HomePageHeaderParentComponentProps> = ({
  session,
  onSignIn,
  onSignOut,
  onLogoClick,
  onAppsClick,
  logoSrc,
  title,
  appsButtonText,
  navItems,
  mobileToolbarPlacement = "top-left",
  mobileToolbarMarginTop = 80,
  mobileToolbarMarginBottom = 80,
  desktopVariant: DesktopVariant = HomePageHeaderVariant1Component,
  mobileVariant: MobileVariant,
  hideLogo = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Determine mobile variant based on placement if not explicitly provided
  const placementVariantMap = {
    "top-left": HomePageHeaderVariant2TopLeftComponent,
    "top-right": HomePageHeaderVariant2TopRightComponent,
    "bottom-left": HomePageHeaderVariant2BottomLeftComponent,
    "bottom-right": HomePageHeaderVariant2BottomRightComponent,
  };

  const MobileVariantComponent = MobileVariant || placementVariantMap[mobileToolbarPlacement];

  const desktopProps = {
    session,
    onSignIn,
    onSignOut,
    onLogoClick,
    onAppsClick,
    logoSrc,
    title,
    appsButtonText,
    navItems,
    hideLogo,
  };

  const mobileProps = {
    session,
    onSignIn,
    onSignOut,
    onAppsClick,
    actionText: appsButtonText,
    navItems,
    navigationMarginTop: mobileToolbarMarginTop,
    navigationMarginBottom: mobileToolbarMarginBottom,
  };

  return (
    <>
      {!isMobile ? (
        <DesktopVariant {...desktopProps} />
      ) : (
        <MobileVariantComponent {...mobileProps} />
      )}
    </>
  );
};
