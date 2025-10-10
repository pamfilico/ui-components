"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import { MobileHeaderScrollToSectionButton } from "./MobileHeaderScrollToSectionButton";
import { scrollToSection } from "../../utils";

export interface MobileSectionNavigationItem {
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
  tooltipText: string;
  /**
   * Index for sorting and positioning (will be sorted by this value)
   */
  index: number;
}

export interface MobileSectionNavigationProps {
  /**
   * Array of navigation items to display
   */
  items: MobileSectionNavigationItem[];
  /**
   * Currently active section ID (optional)
   */
  activeSection?: string;
  /**
   * Orientation of the navigation buttons
   * @default "vertical"
   */
  orientation?: "horizontal" | "vertical";
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
 * MobileSectionNavigation - A container for mobile navigation FABs
 * Displays multiple floating action buttons for section navigation on mobile devices
 * Items are automatically sorted by their index property
 * Manages active section state and scrolling internally
 */
export const MobileSectionNavigation: React.FC<MobileSectionNavigationProps> = ({
  items,
  activeSection: externalActiveSection,
  orientation = "vertical",
  onClick,
  sx,
}) => {
  const [internalActiveSection, setInternalActiveSection] = useState("");

  // Use external activeSection if provided, otherwise use internal state
  const activeSection = externalActiveSection ?? internalActiveSection;

  // Sort items by index
  const sortedItems = [...items].sort((a, b) => a.index - b.index);

  const handleClick = (sectionId: string) => {
    // Update internal state
    setInternalActiveSection(sectionId);

    // Call external onClick if provided
    if (onClick) {
      onClick(sectionId);
    } else {
      // Otherwise, scroll to section by default
      scrollToSection(sectionId);
    }
  };

  const defaultSx = {
    display: "flex",
    flexDirection: orientation === "vertical" ? "column" : "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    ...sx,
  };

  return (
    <Box sx={defaultSx}>
      {sortedItems.map((item, arrayIndex) => (
        <MobileHeaderScrollToSectionButton
          key={item.sectionId}
          icon={item.icon}
          sectionId={item.sectionId}
          index={item.index}
          tooltip={item.tooltipText}
          isActive={activeSection === item.sectionId}
          orientation={orientation}
          onClick={handleClick}
        />
      ))}
    </Box>
  );
};
