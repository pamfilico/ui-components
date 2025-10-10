"use client";
import React from "react";
import { Fab, Tooltip } from "@mui/material";
import { scrollToSection } from "../../utils";

export interface MobileHeaderScrollToSectionButtonProps {
  /**
   * The icon to display in the FAB
   */
  icon: React.ReactNode;
  /**
   * The ID of the section to scroll to
   */
  sectionId: string;
  /**
   * The index for positioning (multiplied by 56px for spacing)
   */
  index: number;
  /**
   * Tooltip text to display on hover
   */
  tooltip: string;
  /**
   * Whether this button is in active state
   */
  isActive?: boolean;
  /**
   * Orientation of the button positioning
   * @default "vertical"
   */
  orientation?: "horizontal" | "vertical";
  /**
   * Custom styles for the FAB
   */
  sx?: any;
  /**
   * Callback function when button is clicked (optional, will use scrollToSection by default)
   */
  onClick?: (sectionId: string) => void;
}

/**
 * MobileHeaderScrollToSectionButton - A floating action button for mobile navigation
 * Displays as a fixed positioned FAB with an icon, used for single-page scrolling navigation
 */
export const MobileHeaderScrollToSectionButton: React.FC<MobileHeaderScrollToSectionButtonProps> = ({
  icon,
  sectionId,
  index,
  tooltip,
  isActive = false,
  orientation = "vertical",
  sx,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(sectionId);
    } else {
      scrollToSection(sectionId);
    }
  };

  const defaultSx = orientation === "vertical"
    ? {
        position: "fixed",
        top: `calc(12% + ${index * 56}px)`,
        left: "5%",
        transform: "translateY(0)",
        mt: 0,
        display: { xs: "flex", md: "none" },
        backgroundColor: isActive ? "secondary.main" : "primary.main",
        "&:hover": {
          backgroundColor: isActive ? "secondary.dark" : "primary.dark",
        },
        ...sx,
      }
    : {
        position: "fixed",
        top: "12%",
        left: `calc(10% + ${index * 56}px)`,
        transform: "translateX(-50%)",
        mt: 0,
        marginHorizontal: 5,
        display: { xs: "flex", md: "none" },
        backgroundColor: isActive ? "secondary.main" : "primary.main",
        "&:hover": {
          backgroundColor: isActive ? "secondary.dark" : "primary.dark",
        },
        ...sx,
      };

  return (
    <Tooltip title={tooltip} arrow>
      <Fab
        color={isActive ? "secondary" : "primary"}
        aria-label="scroll"
        size="small"
        sx={defaultSx}
        onClick={handleClick}
      >
        {icon}
      </Fab>
    </Tooltip>
  );
};
