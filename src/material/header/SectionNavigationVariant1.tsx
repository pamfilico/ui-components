"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import { HeaderScrollToSectionButtonVariant2 } from "./HeaderScrollToSectionButtonVariant2";
import { scrollToSection } from "../../utils";

export interface SectionNavigationVariant1Item {
  /**
   * The text to display (for desktop variant)
   */
  text?: string;
  /**
   * The icon to display in the FAB (for mobile variant)
   */
  icon?: React.ReactNode;
  /**
   * The ID of the section to scroll to
   */
  sectionId: string;
  /**
   * Tooltip text to display on hover
   */
  tooltipText?: string;
  /**
   * Index for sorting and positioning (will be sorted by this value)
   */
  index: number;
  /**
   * Optional onClick handler for this specific item
   * If provided, overrides the default scrollToSection behavior
   */
  onClick?: (sectionId: string) => void;
}

export interface SectionNavigationVariant1Props {
  /**
   * Array of navigation items to display
   */
  items: SectionNavigationVariant1Item[];
  /**
   * Currently active section ID (optional)
   */
  activeSection?: string;
  /**
   * Callback function when a section button is clicked (optional)
   */
  onClick?: (sectionId: string) => void;
  /**
   * Custom styles for the container Box
   */
  sx?: any;
}

/**
 * SectionNavigationVariant1 - A container for navigation FABs
 * Displays multiple floating action buttons for section navigation
 * Items are automatically sorted by their index property
 * Manages active section state and scrolling internally
 */
export const SectionNavigationVariant1: React.FC<SectionNavigationVariant1Props> = ({
  items,
  activeSection: externalActiveSection,
  onClick,
  sx,
}) => {
  const [internalActiveSection, setInternalActiveSection] = useState("");

  // Use external activeSection if provided, otherwise use internal state
  const activeSection = externalActiveSection ?? internalActiveSection;

  // Sort items by index
  const sortedItems = [...items].sort((a, b) => a.index - b.index);

  const handleClick = (sectionId: string, itemOnClick?: (sectionId: string) => void) => {
    // Update internal state
    setInternalActiveSection(sectionId);

    // Priority: item-specific onClick > global onClick > default scrollToSection
    if (itemOnClick) {
      itemOnClick(sectionId);
    } else if (onClick) {
      onClick(sectionId);
    } else {
      // Default behavior: scroll to section
      scrollToSection(sectionId);
    }
  };

  const defaultSx = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    ...sx,
  };

  return (
    <Box sx={defaultSx}>
      {sortedItems.map((item, arrayIndex) => (
        <HeaderScrollToSectionButtonVariant2
          key={item.sectionId}
          icon={item.icon || <></>}
          sectionId={item.sectionId}
          tooltip={item.tooltipText || item.text || ""}
          isActive={activeSection === item.sectionId}
          onClick={(sectionId) => handleClick(sectionId, item.onClick)}
        />
      ))}
    </Box>
  );
};
