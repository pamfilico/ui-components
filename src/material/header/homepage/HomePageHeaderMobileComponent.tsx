"use client";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import DemoIcon from "@mui/icons-material/PlayCircleFilled";
import FAQIcon from "@mui/icons-material/Help";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { MobileSectionNavigation } from "../MobileSectionNavigation";

export interface HomePageHeaderMobileComponentProps {
  session: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  } | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const HomePageHeaderMobileComponent: React.FC<HomePageHeaderMobileComponentProps> = ({
  session,
  onSignIn,
  onSignOut,
}) => {
  const mobileNavItems = [
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
    {
      icon: session ? <LogoutIcon /> : <LoginIcon />,
      sectionId: session ? "logout" : "login",
      tooltipText: session ? "Logout" : "Login",
      index: 3,
      onClick: () => {
        if (session) {
          onSignOut();
        } else {
          onSignIn();
        }
      },
    },
  ];

  return (
    <MobileSectionNavigation
      items={mobileNavItems}
      orientation="vertical"
    />
  );
};
