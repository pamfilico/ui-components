"use client";
import React from "react";
import { Box } from "@mui/material";
import { MobileHeaderScrollToSectionButton } from "./MobileHeaderScrollToSectionButton";

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
   * Whether this button is in active state
   */
  isActive?: boolean;
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
 */
export const MobileSectionNavigation: React.FC<MobileSectionNavigationProps> = ({
  items,
  onClick,
  sx,
}) => {
  // Sort items by index
  const sortedItems = [...items].sort((a, b) => a.index - b.index);

  const defaultSx = {
    display: "flex",
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
          isActive={item.isActive}
          onClick={onClick}
        />
      ))}
    </Box>
  );
};
