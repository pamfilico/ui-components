"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  LinearProgress,
  useTheme,
  alpha,
} from "@mui/material";
import { 
  DragIndicator as DragIcon,
  Flag as FlagIcon
} from "@mui/icons-material";
import {
  differenceInDays,
  differenceInHours,
  addDays,
  parseISO,
  isValid,
} from "date-fns";
import { GanttTask, ViewMode, TaskStatus, TASK_HEIGHT, calculateTaskStatus } from "./GanttChart";

export interface TaskBarProps {
  task: GanttTask;
  startDate: Date;
  endDate: Date;
  columnWidth: number;
  viewMode: ViewMode;
  minDate: Date;
  onUpdate?: (updates: Partial<GanttTask>) => void;
  onDelete?: () => void;
  onClick?: () => void;
  readOnly?: boolean;
  isSelected?: boolean;
}

export const TaskBar: React.FC<TaskBarProps> = ({
  task,
  startDate,
  endDate,
  columnWidth,
  viewMode,
  minDate,
  onUpdate,
  onDelete,
  onClick,
  readOnly,
  isSelected,
}) => {
  const theme = useTheme();
  const barRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<"left" | "right" | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [originalDates, setOriginalDates] = useState({ start: "", end: "" });

  const calculatePosition = useCallback(() => {
    let diff: number;
    let duration: number;
    
    switch (viewMode) {
      case "day":
        diff = differenceInHours(startDate, minDate) / 24;
        duration = differenceInHours(endDate, startDate) / 24;
        break;
      case "week":
        diff = differenceInDays(startDate, minDate) / 7;
        duration = differenceInDays(endDate, startDate) / 7;
        break;
      case "month":
        diff = differenceInDays(startDate, minDate) / 30;
        duration = differenceInDays(endDate, startDate) / 30;
        break;
    }
    
    const left = diff * columnWidth;
    const width = Math.max(duration * columnWidth, columnWidth / 2);
    
    return { left, width };
  }, [startDate, endDate, minDate, columnWidth, viewMode]);

  const { left, width } = calculatePosition();

  const handleMouseDown = useCallback((e: React.MouseEvent, type: "drag" | "resize-left" | "resize-right") => {
    if (readOnly) return;
    e.preventDefault();
    e.stopPropagation();
    
    setDragStartX(e.clientX);
    setOriginalDates({
      start: task.start_datetime,
      end: task.end_datetime,
    });
    
    if (type === "drag") {
      setIsDragging(true);
    } else {
      setIsResizing(type === "resize-left" ? "left" : "right");
    }
  }, [readOnly, task]);

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX;
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
      
      const startDateParsed = parseISO(originalDates.start);
      const endDateParsed = parseISO(originalDates.end);
      
      if (!isValid(startDateParsed) || !isValid(endDateParsed)) return;
      
      if (isDragging) {
        const newStartDate = addDays(startDateParsed, daysDelta);
        const newEndDate = addDays(endDateParsed, daysDelta);
        onUpdate?.({
          start_datetime: newStartDate.toISOString(),
          end_datetime: newEndDate.toISOString(),
        });
      } else if (isResizing === "left") {
        const newStartDate = addDays(startDateParsed, daysDelta);
        if (newStartDate < endDateParsed) {
          onUpdate?.({ start_datetime: newStartDate.toISOString() });
        }
      } else if (isResizing === "right") {
        const newEndDate = addDays(endDateParsed, daysDelta);
        if (newEndDate > startDateParsed) {
          onUpdate?.({ end_datetime: newEndDate.toISOString() });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStartX, originalDates, columnWidth, viewMode, onUpdate]);

  const priorityColor = {
    low: theme.palette.success.main,
    medium: theme.palette.warning.main,
    high: theme.palette.error.main,
  };

  const priorityBackgroundTint = {
    low: alpha(theme.palette.success.main, 0.08),
    medium: alpha(theme.palette.warning.main, 0.08),
    high: alpha(theme.palette.error.main, 0.12),
  };

  // Calculate task status
  const taskStatus = calculateTaskStatus(task);
  
  // Status colors
  const statusColors: Record<TaskStatus, string> = {
    not_started: theme.palette.grey[500],
    in_progress: theme.palette.info.main,
    overdue: theme.palette.error.main,
    completed: theme.palette.success.main,
  };

  // Determine task background based on priority
  const getTaskBackground = () => {
    if (task.color) return task.color;
    if (task.priority) return priorityBackgroundTint[task.priority];
    return theme.palette.primary.main;
  };

  return (
    <Box
      ref={barRef}
      onClick={onClick}
      sx={{
        position: "absolute",
        left: `${left}px`,
        width: `${width}px`,
        height: TASK_HEIGHT,
        top: "50%",
        transform: "translateY(-50%)",
        cursor: readOnly ? "pointer" : isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
    >
      <Paper
        elevation={isSelected ? 6 : 2}
        sx={{
          height: "100%",
          backgroundColor: getTaskBackground(),
          borderRadius: 1,
          overflow: "hidden",
          position: "relative",
          border: isSelected ? `2px solid ${theme.palette.secondary.main}` : "none",
          transition: "all 0.2s",
          // Add red glow effect for high priority
          ...(task.priority === "high" && {
            boxShadow: `0 0 12px ${alpha(theme.palette.error.main, 0.4)}`,
          }),
          "&:hover": {
            boxShadow: task.priority === "high" 
              ? `0 0 16px ${alpha(theme.palette.error.main, 0.6)}` 
              : theme.shadows[4],
          },
        }}
        onMouseDown={(e) => handleMouseDown(e, "drag")}
      >
        {/* Priority stripe indicator on left edge */}
        {task.priority && (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: priorityColor[task.priority],
              zIndex: 1,
            }}
          />
        )}
        {task.progress !== undefined && (
          <LinearProgress
            variant="determinate"
            value={task.progress}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              backgroundColor: alpha(theme.palette.common.black, 0.1),
              "& .MuiLinearProgress-bar": {
                backgroundColor: theme.palette.success.main,
              },
            }}
          />
        )}
        
        <Box
          sx={{
            p: 0.5,
            px: 1,
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: task.color 
              ? theme.palette.getContrastText(task.color)
              : task.priority 
                ? theme.palette.text.primary
                : theme.palette.getContrastText(theme.palette.primary.main),
          }}
        >
          {/* Priority flag icon for all priorities */}
          {task.priority && (
            <FlagIcon 
              sx={{ 
                fontSize: 16, 
                color: priorityColor[task.priority],
                marginLeft: 0.5,
              }} 
            />
          )}
          {!readOnly && width > 100 && (
            <DragIcon fontSize="small" sx={{ opacity: 0.6, fontSize: 16 }} />
          )}
          <Typography
            variant="body2"
            noWrap
            sx={{
              flex: 1,
              fontWeight: 500,
              fontSize: "0.8rem",
            }}
          >
            {task.name}
          </Typography>
          {width > 150 && task.assignee && (
            <Chip
              label={task.assignee}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.7rem",
                backgroundColor: alpha(theme.palette.background.paper, 0.2),
                color: "inherit",
              }}
            />
          )}
          {/* Status dot indicator */}
          {width > 40 && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: statusColors[taskStatus],
                border: `1px solid ${alpha(theme.palette.common.black, 0.2)}`,
                marginLeft: "auto",
                marginRight: 0.5,
                flexShrink: 0,
              }}
            />
          )}
        </Box>
        
        {!readOnly && (
          <>
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 6,
                cursor: "ew-resize",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.common.white, 0.3),
                },
              }}
              onMouseDown={(e) => handleMouseDown(e, "resize-left")}
            />
            <Box
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 6,
                cursor: "ew-resize",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.common.white, 0.3),
                },
              }}
              onMouseDown={(e) => handleMouseDown(e, "resize-right")}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default TaskBar;