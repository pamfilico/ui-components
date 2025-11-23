"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Tooltip, Typography, useTheme, alpha } from "@mui/material";
import { 
  Flag as FlagIcon,
  CheckCircle as CheckIcon,
  RadioButtonChecked as DeliveryIcon,
} from "@mui/icons-material";
import { GanttMilestone, MilestoneType, ViewMode } from "./GanttChart";
import { addDays, addHours, differenceInDays, differenceInHours } from "date-fns";

export interface MilestoneMarkerProps {
  milestone: GanttMilestone;
  position: number;
  columnWidth: number;
  viewMode: ViewMode;
  minDate: Date;
  onClick?: () => void;
  onUpdate?: (updates: Partial<GanttMilestone>) => void;
  readOnly?: boolean;
}

export const MilestoneMarker: React.FC<MilestoneMarkerProps> = ({
  milestone,
  position,
  columnWidth,
  viewMode,
  minDate,
  onClick,
  onUpdate,
  readOnly,
}) => {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [originalDate, setOriginalDate] = useState("");
  const [hasMoved, setHasMoved] = useState(false);
  
  // Milestone colors based on type
  const getMilestoneColor = (type?: MilestoneType) => {
    switch (type) {
      case "delivery":
        return theme.palette.error.main;
      case "review":
        return theme.palette.success.main;
      case "approval":
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  // Get milestone icon based on type
  const getMilestoneIcon = (type?: MilestoneType) => {
    const color = getMilestoneColor(type);
    const iconProps = {
      sx: { 
        fontSize: 16,
        color,
      }
    };
    
    switch (type) {
      case "delivery":
        // Diamond shape using rotated square
        return (
          <Box
            sx={{
              width: 10,
              height: 10,
              backgroundColor: color,
              transform: "rotate(45deg)",
              border: `1px solid ${theme.palette.background.paper}`,
            }}
          />
        );
      case "review":
        return <CheckIcon {...iconProps} />;
      case "approval":
        return <FlagIcon {...iconProps} />;
      default:
        // Default triangle
        return (
          <Box
            sx={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderBottom: `10px solid ${color}`,
            }}
          />
        );
    }
  };
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (readOnly || !onUpdate) return;
    e.preventDefault();
    e.stopPropagation();
    
    setDragStartX(e.clientX);
    setOriginalDate(milestone.date);
    setIsDragging(true);
    setHasMoved(false);
  }, [readOnly, onUpdate, milestone.date]);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!hasMoved && onClick) {
      onClick();
    }
  }, [hasMoved, onClick]);
  
  useEffect(() => {
    if (!isDragging || !onUpdate) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX;
      
      // Only start dragging if moved more than 5 pixels
      if (Math.abs(deltaX) > 5) {
        setHasMoved(true);
      }
      
      let daysDelta: number;
      
      switch (viewMode) {
        case "day":
          daysDelta = deltaX / columnWidth;
          break;
        case "week":
          daysDelta = (deltaX / columnWidth) * 7;
          break;
        case "month":
          daysDelta = (deltaX / columnWidth) * 30;
          break;
      }
      
      const originalDateParsed = new Date(originalDate);
      const newDate = addDays(originalDateParsed, daysDelta);
      
      onUpdate({ date: newDate.toISOString() });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStartX, originalDate, columnWidth, viewMode, onUpdate]);
  
  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="body2" fontWeight="bold">{milestone.name}</Typography>
          {milestone.description && (
            <Typography variant="caption">{milestone.description}</Typography>
          )}
          {milestone.type && (
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              Type: {milestone.type.charAt(0).toUpperCase() + milestone.type.slice(1)}
            </Typography>
          )}
        </Box>
      }
      placement="bottom"
    >
      <Box
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        sx={{
          position: "absolute",
          left: `${position}px`,
          top: "50%",
          transform: "translateX(-50%)",
          cursor: readOnly ? "pointer" : isDragging ? "grabbing" : "grab",
          zIndex: isDragging ? 20 : 10,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          userSelect: "none",
          pointerEvents: "auto",
        }}
      >
        {getMilestoneIcon(milestone.type)}
        
        {/* Milestone label */}
        <Typography
          variant="caption"
          sx={{
            px: 0.5,
            whiteSpace: "nowrap",
            fontSize: "0.65rem",
            fontWeight: 500,
            color: getMilestoneColor(milestone.type),
          }}
        >
          {milestone.name}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default MilestoneMarker;