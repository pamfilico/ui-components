"use client";

import React, { useCallback, useMemo, useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  LinearProgress,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  CalendarMonth as CalendarIcon,
  Today as TodayIcon,
  MoreVert as MoreIcon,
  Link as LinkIcon,
  LinkOff as LinkOffIcon,
} from "@mui/icons-material";
import {
  format,
  differenceInDays,
  differenceInHours,
  addDays,
  addHours,
  startOfDay,
  endOfDay,
  parseISO,
  isValid,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isWeekend,
  isSameDay,
  getDay,
  getMonth,
} from "date-fns";

export type ViewMode = "day" | "week" | "month";

export interface GanttTask {
  id: string;
  name: string;
  start_datetime: string;
  end_datetime: string;
  progress?: number;
  assignee?: string;
  color?: string;
  dependencies?: string[];
  description?: string;
  priority?: "low" | "medium" | "high";
}

export interface GanttChartVariant2Props {
  tasks: GanttTask[];
  onTaskUpdate?: (taskId: string, updates: Partial<GanttTask>) => void;
  onTaskDelete?: (taskId: string) => void;
  onDependencyAdd?: (sourceId: string, targetId: string) => void;
  onDependencyRemove?: (sourceId: string, targetId: string) => void;
  onTaskClick?: (task: GanttTask) => void;
  height?: number | string;
  readOnly?: boolean;
  viewMode?: ViewMode;
  showGrid?: boolean;
  showDependencies?: boolean;
  highlightWeekends?: boolean;
  highlightToday?: boolean;
  autoMoveDependencies?: boolean;
}

const TASK_HEIGHT = 36;
const HEADER_HEIGHT = 60;
const TIMELINE_HEIGHT = 50;
const COLUMN_WIDTH = {
  day: 80,
  week: 120,
  month: 160,
};

interface TaskBarProps {
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

const TaskBar: React.FC<TaskBarProps> = ({
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
    low: theme.palette.success.light,
    medium: theme.palette.warning.light,
    high: theme.palette.error.light,
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
          backgroundColor: task.color || theme.palette.primary.main,
          borderRadius: 1,
          overflow: "hidden",
          position: "relative",
          border: isSelected ? `2px solid ${theme.palette.secondary.main}` : "none",
          transition: "all 0.2s",
          "&:hover": {
            boxShadow: theme.shadows[4],
          },
        }}
        onMouseDown={(e) => handleMouseDown(e, "drag")}
      >
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
            color: theme.palette.getContrastText(task.color || theme.palette.primary.main),
          }}
        >
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
          {width > 200 && task.priority && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: priorityColor[task.priority],
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

const DependencyArrow: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  onRemove?: () => void;
  readOnly?: boolean;
}> = ({ from, to, onRemove, readOnly }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  const path = `M ${from.x} ${from.y} C ${from.x + 50} ${from.y}, ${to.x - 50} ${to.y}, ${to.x} ${to.y}`;
  
  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={theme.palette.grey[400]}
        strokeWidth={isHovered ? 3 : 2}
        markerEnd="url(#arrowhead)"
      />
      {!readOnly && (
        <path
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth={20}
          style={{ cursor: "pointer" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onRemove}
        />
      )}
    </g>
  );
};

export function GanttChartVariant2({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onDependencyAdd,
  onDependencyRemove,
  onTaskClick,
  height = 600,
  readOnly = false,
  viewMode: initialViewMode = "week",
  showGrid = true,
  showDependencies = true,
  highlightWeekends = true,
  highlightToday = true,
  autoMoveDependencies = false,
}: GanttChartVariant2Props) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [linkingMode, setLinkingMode] = useState(false);
  const [linkSource, setLinkSource] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null);

  const columnWidth = COLUMN_WIDTH[viewMode];

  const { minDate, maxDate, columns } = useMemo(() => {
    if (tasks.length === 0) {
      const today = new Date();
      return {
        minDate: startOfMonth(today),
        maxDate: endOfMonth(addDays(today, 30)),
        columns: [],
      };
    }

    const dates = tasks.flatMap(t => [
      parseISO(t.start_datetime),
      parseISO(t.end_datetime),
    ]).filter(isValid);

    const min = new Date(Math.min(...dates.map(d => d.getTime())));
    const max = new Date(Math.max(...dates.map(d => d.getTime())));

    let adjustedMin: Date;
    let adjustedMax: Date;
    let cols: Date[] = [];

    switch (viewMode) {
      case "day":
        adjustedMin = addDays(min, -2);
        adjustedMax = addDays(max, 7);
        cols = eachDayOfInterval({ start: adjustedMin, end: adjustedMax });
        break;
      case "week":
        adjustedMin = startOfWeek(addDays(min, -7));
        adjustedMax = endOfWeek(addDays(max, 14));
        cols = eachWeekOfInterval({ start: adjustedMin, end: adjustedMax });
        break;
      case "month":
        adjustedMin = startOfMonth(addDays(min, -30));
        adjustedMax = endOfMonth(addDays(max, 60));
        cols = eachMonthOfInterval({ start: adjustedMin, end: adjustedMax });
        break;
    }

    return {
      minDate: adjustedMin,
      maxDate: adjustedMax,
      columns: cols,
    };
  }, [tasks, viewMode]);

  const handleTaskClick = (task: GanttTask) => {
    setSelectedTaskId(task.id);
    setSelectedTask(task);
    
    if (linkingMode) {
      if (!linkSource) {
        setLinkSource(task.id);
      } else if (linkSource !== task.id) {
        onDependencyAdd?.(linkSource, task.id);
        setLinkingMode(false);
        setLinkSource(null);
      }
    } else {
      onTaskClick?.(task);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const scrollToToday = () => {
    if (containerRef.current) {
      const today = new Date();
      const daysSinceMin = differenceInDays(today, minDate);
      const scrollPosition = daysSinceMin * (columnWidth / (viewMode === "week" ? 7 : viewMode === "month" ? 30 : 1));
      containerRef.current.scrollLeft = scrollPosition - containerRef.current.clientWidth / 2;
    }
  };

  const taskPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; width: number }> = {};
    
    tasks.forEach((task, index) => {
      const startDate = parseISO(task.start_datetime);
      const endDate = parseISO(task.end_datetime);
      if (!isValid(startDate) || !isValid(endDate)) return;
      
      let diff: number;
      let duration: number;
      
      switch (viewMode) {
        case "day":
          diff = differenceInDays(startDate, minDate);
          duration = differenceInDays(endDate, startDate) + 1;
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
      
      positions[task.id] = {
        x: diff * columnWidth,
        y: TIMELINE_HEIGHT + index * (TASK_HEIGHT + 20) + TASK_HEIGHT / 2,
        width: Math.max(duration * columnWidth, columnWidth / 2),
      };
    });
    
    return positions;
  }, [tasks, minDate, viewMode, columnWidth]);

  return (
    <Box sx={{ height, display: "flex", flexDirection: "column" }}>
      <Paper elevation={1} sx={{ p: 1, borderRadius: 0 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>
          
          <Divider orientation="vertical" flexItem />
          
          <Tooltip title="Scroll to Today">
            <IconButton onClick={scrollToToday} size="small">
              <TodayIcon />
            </IconButton>
          </Tooltip>
          
          {!readOnly && (
            <Tooltip title={linkingMode ? "Cancel Linking" : "Add Dependency"}>
              <IconButton
                onClick={() => {
                  setLinkingMode(!linkingMode);
                  setLinkSource(null);
                }}
                size="small"
                color={linkingMode ? "primary" : "default"}
              >
                {linkingMode ? <LinkOffIcon /> : <LinkIcon />}
              </IconButton>
            </Tooltip>
          )}
          
          <Box sx={{ flex: 1 }} />
          
          {selectedTask && (
            <>
              <Typography variant="body2" color="text.secondary">
                Selected: {selectedTask.name}
              </Typography>
              <IconButton onClick={handleMenuClick} size="small">
                <MoreIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => {
                  if (selectedTask) {
                    onTaskClick?.(selectedTask);
                  }
                  handleMenuClose();
                }}>
                  View Details
                </MenuItem>
                {!readOnly && (
                  <MenuItem onClick={() => {
                    if (selectedTask) {
                      onTaskDelete?.(selectedTask.id);
                      setSelectedTask(null);
                      setSelectedTaskId(null);
                    }
                    handleMenuClose();
                  }}>
                    Delete Task
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </Stack>
      </Paper>
      
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          position: "relative",
          overflow: "auto",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            height: TIMELINE_HEIGHT,
          }}
        >
          <Box sx={{ display: "flex", height: "100%" }}>
            {columns.map((col, index) => {
              const isToday = isSameDay(col, new Date());
              const isWeekendDay = isWeekend(col);
              
              return (
                <Box
                  key={index}
                  sx={{
                    width: columnWidth,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    backgroundColor:
                      isToday && highlightToday
                        ? alpha(theme.palette.primary.main, 0.1)
                        : isWeekendDay && highlightWeekends && viewMode === "day"
                        ? alpha(theme.palette.grey[500], 0.05)
                        : "transparent",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="caption" fontWeight={isToday ? 600 : 400}>
                    {viewMode === "day"
                      ? format(col, "EEE")
                      : viewMode === "week"
                      ? format(col, "MMM d")
                      : format(col, "MMM yyyy")}
                  </Typography>
                  {viewMode === "day" && (
                    <Typography variant="caption" color="text.secondary">
                      {format(col, "d")}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
        
        <Box
          sx={{
            position: "relative",
            minHeight: tasks.length * (TASK_HEIGHT + 20) + 100,
            width: columns.length * columnWidth,
          }}
        >
          {showGrid && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: "none",
              }}
            >
              {columns.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "absolute",
                    left: index * columnWidth,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    backgroundColor: theme.palette.divider,
                    opacity: 0.3,
                  }}
                />
              ))}
            </Box>
          )}
          
          {showDependencies && (
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3, 0 6"
                    fill={theme.palette.grey[500]}
                  />
                </marker>
              </defs>
              {tasks.map(task => {
                if (!task.dependencies) return null;
                return task.dependencies.map(depId => {
                  const fromPos = taskPositions[depId];
                  const toPos = taskPositions[task.id];
                  if (!fromPos || !toPos) return null;
                  
                  return (
                    <DependencyArrow
                      key={`${depId}-${task.id}`}
                      from={{ x: fromPos.x + fromPos.width, y: fromPos.y }}
                      to={{ x: toPos.x, y: toPos.y }}
                      onRemove={() => onDependencyRemove?.(depId, task.id)}
                      readOnly={readOnly}
                    />
                  );
                });
              })}
            </svg>
          )}
          
          {tasks.map((task, index) => {
            const startDate = parseISO(task.start_datetime);
            const endDate = parseISO(task.end_datetime);
            if (!isValid(startDate) || !isValid(endDate)) return null;
            
            return (
              <Box
                key={task.id}
                sx={{
                  position: "absolute",
                  top: TIMELINE_HEIGHT + index * (TASK_HEIGHT + 20),
                  left: 0,
                  right: 0,
                  height: TASK_HEIGHT,
                }}
              >
                <TaskBar
                  task={task}
                  startDate={startDate}
                  endDate={endDate}
                  columnWidth={columnWidth}
                  viewMode={viewMode}
                  minDate={minDate}
                  onUpdate={(updates) => onTaskUpdate?.(task.id, updates)}
                  onDelete={() => onTaskDelete?.(task.id)}
                  onClick={() => handleTaskClick(task)}
                  readOnly={readOnly}
                  isSelected={selectedTaskId === task.id}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default GanttChartVariant2;