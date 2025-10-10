"use client";
import React from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { HomePageHeaderVariant1Component } from "./HomePageHeaderVariant1Component";
import { HomePageHeaderVariant2TopLeftComponent } from "./HomePageHeaderVariant2TopLeftComponent";

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
  mobileToolbarMarginTop?: number;
  desktopVariant?: React.ComponentType<any>;
  mobileVariant?: React.ComponentType<any>;
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
  mobileToolbarMarginTop = 80,
  desktopVariant: DesktopVariant = HomePageHeaderVariant1Component,
  mobileVariant: MobileVariant = HomePageHeaderVariant2TopLeftComponent,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
  };

  const mobileProps = {
    session,
    onSignIn,
    onSignOut,
    onAppsClick,
    actionText: appsButtonText,
    navItems,
    navigationMarginTop: mobileToolbarMarginTop,
  };

  return (
    <>
      {!isMobile ? (
        <DesktopVariant {...desktopProps} />
      ) : (
        <MobileVariant {...mobileProps} />
      )}
    </>
  );
};
