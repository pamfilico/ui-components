"use client";
import React from "react";
import { Button } from "@mui/material";
import { scrollToSection } from "../../utils";

export interface HeaderScrollToSectionButtonProps {
  /**
   * The text to display on the button
   */
  text: string;
  /**
   * The ID of the section to scroll to
   */
  sectionId: string;
  /**
   * Whether to highlight the button (active state)
   */
  highlight?: boolean;
  /**
   * Whether to capitalize the text
   */
  capitalize?: boolean;
  /**
   * Custom styles for the button
   */
  sx?: any;
  /**
   * Callback function when button is clicked (optional, will use scrollToSection by default)
   */
  onClick?: (sectionId: string) => void;
}

/**
 * HeaderScrollToSectionButton component that smoothly scrolls to a section on the page
 * Commonly used in navigation headers for single-page applications
 */
export const HeaderScrollToSectionButtonVariant1: React.FC<HeaderScrollToSectionButtonProps> = ({
  text,
  sectionId,
  highlight = false,
  capitalize = true,
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
    my: { xs: 1, md: 2 },
    mx: { xs: 0.5, md: 1 },
    display: "block",
    fontWeight: "bold",
    fontSize: { xs: "0.75rem", md: "1rem" },
    padding: { xs: "4px 8px", md: "8px 16px" },
    borderRadius: 2,
    textTransform: capitalize ? "uppercase" : "none",
    backgroundColor: highlight ? "rgba(255, 255, 255, 0.2)" : "transparent",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
    },
    ...sx,
  };

  return (
    <Button sx={defaultSx} onClick={handleClick}>
      {text}
    </Button>
  );
};
