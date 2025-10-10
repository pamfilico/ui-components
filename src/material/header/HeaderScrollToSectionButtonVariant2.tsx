"use client";
import React from "react";
import { Fab, Tooltip } from "@mui/material";
import { scrollToSection } from "../../utils";

export interface HeaderScrollToSectionButtonVariant2Props {
  /**
   * The icon to display in the FAB
   */
  icon: React.ReactNode;
  /**
   * The ID of the section to scroll to
   */
  sectionId: string;
  /**
   * Tooltip text to display on hover
   */
  tooltip: string;
  /**
   * Whether this button is in active state
   */
  isActive?: boolean;
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
 * HeaderScrollToSectionButtonVariant2 - A floating action button for navigation
 * Displays as a fixed positioned FAB with an icon, used for single-page scrolling navigation
 */
export const HeaderScrollToSectionButtonVariant2: React.FC<HeaderScrollToSectionButtonVariant2Props> = ({
  icon,
  sectionId,
  tooltip,
  isActive = false,
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

  const defaultSx = {
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
