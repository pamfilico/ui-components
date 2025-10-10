"use client";
import React from "react";
import { HomePageHeaderDesktopComponent } from "./HomePageHeaderDesktopComponent";
import { HomePageHeaderMobileComponent } from "./HomePageHeaderMobileComponent";

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
}

/**
 * HomePageHeaderParentComponent - Complete homepage header with desktop and mobile variants
 * Manages both desktop navigation bar and mobile floating action buttons
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
}) => {
  return (
    <>
      <HomePageHeaderDesktopComponent
        session={session}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        onLogoClick={onLogoClick}
        onAppsClick={onAppsClick}
        logoSrc={logoSrc}
        title={title}
        appsButtonText={appsButtonText}
      />
      <HomePageHeaderMobileComponent
        session={session}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
      />
    </>
  );
};
