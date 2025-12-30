"use client";

import React, { useCallback, useMemo, useState, useRef } from "react";
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
  Menu,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Popover,
  Avatar,
  Badge,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
} from "@mui/material";
import {
  Today as TodayIcon,
  Link as LinkIcon,
  LinkOff as LinkOffIcon,
  MoreVert as MoreIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Groups as GroupsIcon,
  CalendarToday as CalendarIcon,
  UnfoldMore as ExpandAllIcon,
  UnfoldLess as CollapseAllIcon,
  KeyboardArrowRight as CollapsedIcon,
  KeyboardArrowDown as ExpandedIcon,
} from "@mui/icons-material";
import {
  format,
  differenceInDays,
  differenceInHours,
  addDays,
  addHours,
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
  isWithinInterval,
  isBefore,
  isAfter,
  addWeeks,
  addMonths,
  addQuarters,
} from "date-fns";
import { TaskBar } from "./TaskBar";
import { MilestoneMarker } from "./MilestoneMarker";
import { TaskSidebar } from "./TaskSidebar";

export type ViewMode = "day" | "week" | "month";
export type PriorityFilter = "all" | "low" | "medium" | "high";
export type StatusFilter = "all" | "not_started" | "in_progress" | "overdue" | "completed";
export type TaskStatus = "not_started" | "in_progress" | "overdue" | "completed";

export interface DateRangeFilter {
  startDate: Date | null;
  endDate: Date | null;
  includeStarting: boolean;
  includeEnding: boolean;
  includeOverlapping: boolean;
}

export type MilestoneType = "delivery" | "review" | "approval";

export interface GanttTask {
  id: string;
  name: string;
  start_datetime: string;
  end_datetime: string;
  progress?: number;
  assignee?: string; // Deprecated - use assignees instead
  assignees?: string[]; // Multiple assignees support
  color?: string;
  dependencies?: string[];
  description?: string;
  priority?: "low" | "medium" | "high";
  isMilestone?: boolean;
  milestoneType?: MilestoneType;
  // Hierarchy support
  parentId?: string;
  children?: string[];
  level?: number;
  isExpanded?: boolean;
}

export interface GanttMilestone {
  id: string;
  name: string;
  date: string;
  type?: MilestoneType;
  color?: string;
  description?: string;
}

export interface GanttChartProps {
  tasks: GanttTask[];
  milestones?: GanttMilestone[];
  onTaskUpdate?: (taskId: string, updates: Partial<GanttTask>) => void;
  onTaskDelete?: (taskId: string) => void;
  onDependencyAdd?: (sourceId: string, targetId: string) => void;
  onDependencyRemove?: (sourceId: string, targetId: string) => void;
  onTaskClick?: (task: GanttTask) => void;
  onMilestoneClick?: (milestone: GanttMilestone) => void;
  onMilestoneUpdate?: (milestoneId: string, updates: Partial<GanttMilestone>) => void;
  height?: number | string;
  readOnly?: boolean;
  viewMode?: ViewMode;
  showGrid?: boolean;
  showDependencies?: boolean;
  highlightWeekends?: boolean;
  highlightToday?: boolean;
  autoMoveDependencies?: boolean;
  hideCompleted?: boolean;
  onHideCompletedChange?: (value: boolean) => void;
  priorityFilter?: PriorityFilter;
  onPriorityFilterChange?: (value: PriorityFilter) => void;
  statusFilter?: StatusFilter;
  onStatusFilterChange?: (value: StatusFilter) => void;
  assigneeFilter?: string[];
  onAssigneeFilterChange?: (assignees: string[]) => void;
  dateRangeFilter?: DateRangeFilter | null;
  onDateRangeFilterChange?: (filter: DateRangeFilter | null) => void;
}

export const TASK_HEIGHT = 36;
const TIMELINE_HEIGHT = 50;
const SIDEBAR_WIDTH = 300;
const COLUMN_WIDTH = {
  day: 80,
  week: 120,
  month: 160,
};

// Helper function to calculate task status
export function calculateTaskStatus(task: GanttTask): TaskStatus {
  const now = new Date();
  const startDate = parseISO(task.start_datetime);
  const endDate = parseISO(task.end_datetime);
  
  if (!isValid(startDate) || !isValid(endDate)) {
    return "not_started";
  }
  
  const progress = task.progress || 0;
  
  // Task is completed
  if (progress === 100) {
    return "completed";
  }
  
  // Task hasn't started yet
  if (now < startDate) {
    return "not_started";
  }
  
  // Task is overdue
  if (now > endDate && progress < 100) {
    return "overdue";
  }
  
  // Task is in progress
  return "in_progress";
}

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

export function GanttChart({
  tasks,
  milestones = [],
  onTaskUpdate,
  onTaskDelete,
  onDependencyAdd,
  onDependencyRemove,
  onTaskClick,
  onMilestoneClick,
  onMilestoneUpdate,
  height = "100vh",
  readOnly = false,
  viewMode: initialViewMode = "week",
  showGrid = true,
  showDependencies = true,
  highlightWeekends = true,
  highlightToday = true,
  autoMoveDependencies = false,
  hideCompleted: initialHideCompleted = false,
  onHideCompletedChange,
  priorityFilter: initialPriorityFilter = "all",
  onPriorityFilterChange,
  statusFilter: initialStatusFilter = "all",
  onStatusFilterChange,
  assigneeFilter: initialAssigneeFilter = [],
  onAssigneeFilterChange,
  dateRangeFilter: initialDateRangeFilter = null,
  onDateRangeFilterChange,
}: GanttChartProps) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [linkingMode, setLinkingMode] = useState(false);
  const [linkSource, setLinkSource] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null);
  const [hideCompleted, setHideCompleted] = useState(initialHideCompleted);
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>(initialPriorityFilter);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatusFilter);
  const [assigneeFilter, setAssigneeFilter] = useState<string[]>(initialAssigneeFilter);
  const [assigneeFilterAnchor, setAssigneeFilterAnchor] = useState<null | HTMLElement>(null);
  const [assigneeSearch, setAssigneeSearch] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter | null>(initialDateRangeFilter);
  const [dateRangeAnchor, setDateRangeAnchor] = useState<null | HTMLElement>(null);
  const [tempDateRange, setTempDateRange] = useState<DateRangeFilter>({
    startDate: null,
    endDate: null,
    includeStarting: true,
    includeEnding: true,
    includeOverlapping: true,
  });
  
  // Hierarchy state
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [expandLevel, setExpandLevel] = useState<number | null>(null);

  const columnWidth = COLUMN_WIDTH[viewMode];
  
  // Get unique assignees from all tasks
  const allAssignees = useMemo(() => {
    const assignees = new Set<string>();
    tasks.forEach(task => {
      // Support both single assignee (legacy) and multiple assignees
      if (task.assignees && task.assignees.length > 0) {
        task.assignees.forEach(a => assignees.add(a));
      } else if (task.assignee) {
        assignees.add(task.assignee);
      }
    });
    return Array.from(assignees).sort();
  }, [tasks]);
  
  // Count tasks per assignee
  const assigneeTaskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allAssignees.forEach(assignee => {
      counts[assignee] = tasks.filter(t => {
        if (t.assignees && t.assignees.length > 0) {
          return t.assignees.includes(assignee);
        }
        return t.assignee === assignee;
      }).length;
    });
    counts["_unassigned"] = tasks.filter(t => !t.assignee && (!t.assignees || t.assignees.length === 0)).length;
    return counts;
  }, [tasks, allAssignees]);

  // Process hierarchy - build parent-child relationships and calculate visibility
  const { visibleTasks, taskHierarchy } = useMemo(() => {
    // Build hierarchy map
    const hierarchyMap = new Map<string, GanttTask[]>();
    const taskMap = new Map<string, GanttTask>();
    
    tasks.forEach(task => {
      taskMap.set(task.id, task);
      if (task.parentId) {
        const siblings = hierarchyMap.get(task.parentId) || [];
        siblings.push(task);
        hierarchyMap.set(task.parentId, siblings);
      }
    });
    
    // Calculate task levels
    const calculateLevel = (taskId: string, visited = new Set<string>()): number => {
      if (visited.has(taskId)) return 0;
      visited.add(taskId);
      
      const task = taskMap.get(taskId);
      if (!task || !task.parentId) return 0;
      
      return 1 + calculateLevel(task.parentId, visited);
    };
    
    // Determine which tasks are visible based on expansion state
    const visibleTaskIds = new Set<string>();
    const processTask = (taskId: string, parentExpanded = true) => {
      const task = taskMap.get(taskId);
      if (!task) return;
      
      // Add task if parent is expanded or it's a root task
      if (parentExpanded) {
        visibleTaskIds.add(taskId);
      }
      
      // Process children if this task is expanded
      const isExpanded = expandedTasks.has(taskId);
      const children = hierarchyMap.get(taskId) || [];
      children.forEach(child => {
        processTask(child.id, parentExpanded && isExpanded);
      });
    };
    
    // Process all root tasks (tasks without parents)
    tasks.forEach(task => {
      if (!task.parentId) {
        processTask(task.id);
      }
    });
    
    // Filter to visible tasks and add calculated levels
    const visible = tasks
      .filter(task => visibleTaskIds.has(task.id))
      .map(task => ({
        ...task,
        level: calculateLevel(task.id),
        children: hierarchyMap.get(task.id)?.map(c => c.id) || []
      }));
    
    return { visibleTasks: visible, taskHierarchy: hierarchyMap };
  }, [tasks, expandedTasks]);

  // Filter tasks based on completion status, priority, status, and assignees (exclude milestone tasks)
  const filteredTasks = useMemo(() => {
    let filtered = visibleTasks.filter(task => !task.isMilestone);
    
    // Filter by completion status
    if (hideCompleted) {
      filtered = filtered.filter(task => task.progress !== 100);
    }
    
    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => {
        const status = calculateTaskStatus(task);
        return status === statusFilter;
      });
    }
    
    // Filter by assignees
    if (assigneeFilter.length > 0) {
      filtered = filtered.filter(task => {
        const hasNoAssignees = !task.assignee && (!task.assignees || task.assignees.length === 0);
        
        if (assigneeFilter.includes("_unassigned")) {
          if (hasNoAssignees) return true;
        }
        
        // Check multiple assignees
        if (task.assignees && task.assignees.length > 0) {
          return task.assignees.some(a => assigneeFilter.includes(a));
        }
        // Fallback to single assignee (legacy)
        if (task.assignee && assigneeFilter.includes(task.assignee)) {
          return true;
        }
        
        return false;
      });
    }
    
    // Filter by date range
    if (dateRangeFilter && dateRangeFilter.startDate && dateRangeFilter.endDate) {
      filtered = filtered.filter(task => {
        const taskStart = parseISO(task.start_datetime);
        const taskEnd = parseISO(task.end_datetime);
        if (!isValid(taskStart) || !isValid(taskEnd)) return false;
        
        const rangeStart = dateRangeFilter.startDate!;
        const rangeEnd = dateRangeFilter.endDate!;
        
        let matchesFilter = false;
        
        // Check if task starts within range
        if (dateRangeFilter.includeStarting) {
          matchesFilter = matchesFilter || isWithinInterval(taskStart, { start: rangeStart, end: rangeEnd });
        }
        
        // Check if task ends within range
        if (dateRangeFilter.includeEnding) {
          matchesFilter = matchesFilter || isWithinInterval(taskEnd, { start: rangeStart, end: rangeEnd });
        }
        
        // Check if task overlaps with range
        if (dateRangeFilter.includeOverlapping) {
          const taskOverlaps = (
            (isBefore(taskStart, rangeEnd) || isSameDay(taskStart, rangeEnd)) &&
            (isAfter(taskEnd, rangeStart) || isSameDay(taskEnd, rangeStart))
          );
          matchesFilter = matchesFilter || taskOverlaps;
        }
        
        return matchesFilter;
      });
    }
    
    return filtered;
  }, [visibleTasks, hideCompleted, priorityFilter, statusFilter, assigneeFilter, dateRangeFilter]);

  // Handle toggle for hide completed
  const handleHideCompletedChange = useCallback((value: boolean) => {
    setHideCompleted(value);
    onHideCompletedChange?.(value);
  }, [onHideCompletedChange]);
  
  // Handle priority filter change
  const handlePriorityFilterChange = useCallback((value: PriorityFilter) => {
    setPriorityFilter(value);
    onPriorityFilterChange?.(value);
  }, [onPriorityFilterChange]);
  
  // Handle status filter change
  const handleStatusFilterChange = useCallback((value: StatusFilter) => {
    setStatusFilter(value);
    onStatusFilterChange?.(value);
  }, [onStatusFilterChange]);
  
  // Handle assignee filter changes
  const handleAssigneeToggle = useCallback((assignee: string) => {
    setAssigneeFilter(prev => {
      const newFilter = prev.includes(assignee)
        ? prev.filter(a => a !== assignee)
        : [...prev, assignee];
      onAssigneeFilterChange?.(newFilter);
      return newFilter;
    });
  }, [onAssigneeFilterChange]);
  
  const handleAssigneeSelectAll = useCallback(() => {
    const allWithUnassigned = [...allAssignees, "_unassigned"];
    setAssigneeFilter(allWithUnassigned);
    onAssigneeFilterChange?.(allWithUnassigned);
  }, [allAssignees, onAssigneeFilterChange]);
  
  const handleAssigneeClear = useCallback(() => {
    setAssigneeFilter([]);
    onAssigneeFilterChange?.([]);
  }, [onAssigneeFilterChange]);
  
  const removeAssigneeFilter = useCallback((assignee: string) => {
    const newFilter = assigneeFilter.filter(a => a !== assignee);
    setAssigneeFilter(newFilter);
    onAssigneeFilterChange?.(newFilter);
  }, [assigneeFilter, onAssigneeFilterChange]);
  
  // Filtered assignees based on search
  const filteredAssignees = useMemo(() => {
    const searchLower = assigneeSearch.toLowerCase();
    return allAssignees.filter(assignee => 
      assignee.toLowerCase().includes(searchLower)
    );
  }, [allAssignees, assigneeSearch]);
  
  // Hierarchy handlers
  const handleToggleExpand = useCallback((taskId: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }, []);
  
  const handleExpandAll = useCallback(() => {
    const allParentIds = new Set<string>();
    tasks.forEach(task => {
      if (task.children && task.children.length > 0) {
        allParentIds.add(task.id);
      }
    });
    setExpandedTasks(allParentIds);
  }, [tasks]);
  
  const handleCollapseAll = useCallback(() => {
    setExpandedTasks(new Set());
  }, []);
  
  const handleExpandToLevel = useCallback((level: number) => {
    const expandIds = new Set<string>();
    tasks.forEach(task => {
      const taskLevel = task.level || 0;
      if (taskLevel < level && task.children && task.children.length > 0) {
        expandIds.add(task.id);
      }
    });
    setExpandedTasks(expandIds);
    setExpandLevel(level);
  }, [tasks]);
  
  // Date range filter handlers
  const handleDateRangeApply = useCallback(() => {
    if (tempDateRange.startDate && tempDateRange.endDate) {
      setDateRangeFilter(tempDateRange);
      onDateRangeFilterChange?.(tempDateRange);
    }
    setDateRangeAnchor(null);
  }, [tempDateRange, onDateRangeFilterChange]);
  
  const handleDateRangeClear = useCallback(() => {
    setDateRangeFilter(null);
    onDateRangeFilterChange?.(null);
    setTempDateRange({
      startDate: null,
      endDate: null,
      includeStarting: true,
      includeEnding: true,
      includeOverlapping: true,
    });
    setDateRangeAnchor(null);
  }, [onDateRangeFilterChange]);
  
  const setQuickDateRange = useCallback((preset: string) => {
    const today = new Date();
    let start: Date;
    let end: Date;
    
    switch (preset) {
      case "thisWeek":
        start = startOfWeek(today);
        end = endOfWeek(today);
        break;
      case "next7Days":
        start = today;
        end = addDays(today, 7);
        break;
      case "thisMonth":
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      case "nextQuarter":
        start = today;
        end = addQuarters(today, 1);
        break;
      default:
        return;
    }
    
    const range: DateRangeFilter = {
      startDate: start,
      endDate: end,
      includeStarting: true,
      includeEnding: true,
      includeOverlapping: true,
    };
    
    setTempDateRange(range);
    setDateRangeFilter(range);
    onDateRangeFilterChange?.(range);
  }, [onDateRangeFilterChange]);

  // Handle cascading updates when a parent task is moved
  const handleTaskUpdateWithDependencies = useCallback((taskId: string, updates: Partial<GanttTask>) => {
    if (!onTaskUpdate) return;
    
    // Update the main task
    onTaskUpdate(taskId, updates);
    
    // If auto-move is enabled and dates changed, update dependent tasks
    if (autoMoveDependencies && (updates.start_datetime || updates.end_datetime)) {
      const originalTask = tasks.find(t => t.id === taskId);
      if (!originalTask) return;
      
      const originalStart = parseISO(originalTask.start_datetime);
      const originalEnd = parseISO(originalTask.end_datetime);
      
      let timeDiff = 0;
      
      if (updates.start_datetime && updates.end_datetime) {
        // Task was dragged (both dates changed)
        const newStart = parseISO(updates.start_datetime);
        timeDiff = differenceInHours(newStart, originalStart);
      } else if (updates.end_datetime) {
        // End date was resized - shift dependents based on end date change
        const newEnd = parseISO(updates.end_datetime);
        timeDiff = differenceInHours(newEnd, originalEnd);
      }
      
      if (timeDiff === 0) return;
      
      // Find all dependent tasks (tasks that depend on this task)
      const dependentTasks = tasks.filter(t => 
        t.dependencies && t.dependencies.includes(taskId)
      );
      
      // Recursively update dependent tasks
      const updateDependentTask = (depTask: GanttTask, shift: number) => {
        const depStart = parseISO(depTask.start_datetime);
        const depEnd = parseISO(depTask.end_datetime);
        
        const newDepStart = addHours(depStart, shift);
        const newDepEnd = addHours(depEnd, shift);
        
        // Update this dependent task
        onTaskUpdate(depTask.id, {
          start_datetime: newDepStart.toISOString(),
          end_datetime: newDepEnd.toISOString(),
        });
        
        // Find and update tasks dependent on this task (cascading)
        const nextDependents = tasks.filter(t => 
          t.dependencies && t.dependencies.includes(depTask.id)
        );
        
        nextDependents.forEach(nextDep => {
          updateDependentTask(nextDep, shift);
        });
      };
      
      // Update all dependent tasks
      dependentTasks.forEach(depTask => {
        updateDependentTask(depTask, timeDiff);
      });
    }
  }, [tasks, onTaskUpdate, autoMoveDependencies]);

  const { minDate, columns } = useMemo(() => {
    // Consider both tasks and milestones for date range calculation
    const allDates = [];
    
    if (filteredTasks.length > 0) {
      allDates.push(...filteredTasks.flatMap(t => [
        parseISO(t.start_datetime),
        parseISO(t.end_datetime),
      ]).filter(isValid));
    }
    
    if (milestones.length > 0) {
      allDates.push(...milestones.map(m => parseISO(m.date)).filter(isValid));
    }
    
    if (allDates.length === 0) {
      const today = new Date();
      return {
        minDate: startOfMonth(today),
        maxDate: endOfMonth(addDays(today, 30)),
        columns: [],
      };
    }

    const min = new Date(Math.min(...allDates.map(d => d.getTime())));
    const max = new Date(Math.max(...allDates.map(d => d.getTime())));

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
  }, [filteredTasks, viewMode, milestones]);
  
  // Calculate milestone positions
  const milestonePositions = useMemo(() => {
    return milestones.map(milestone => {
      const date = parseISO(milestone.date);
      if (!isValid(date)) return null;
      
      let diff: number;
      switch (viewMode) {
        case "day":
          diff = differenceInHours(date, minDate) / 24;
          break;
        case "week":
          diff = differenceInDays(date, minDate) / 7;
          break;
        case "month":
          diff = differenceInDays(date, minDate) / 30;
          break;
      }
      
      return {
        ...milestone,
        position: diff * columnWidth,
      };
    }).filter((m): m is (GanttMilestone & { position: number }) => m !== null);
  }, [milestones, minDate, columnWidth, viewMode]);

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
    
    filteredTasks.forEach((task, index) => {
      const startDate = parseISO(task.start_datetime);
      const endDate = task.isMilestone ? startDate : parseISO(task.end_datetime);
      if (!isValid(startDate) || !isValid(endDate)) return;
      
      let diff: number;
      let duration: number;
      
      switch (viewMode) {
        case "day":
          diff = differenceInHours(startDate, minDate) / 24;
          duration = task.isMilestone ? 0 : differenceInHours(endDate, startDate) / 24;
          break;
        case "week":
          diff = differenceInDays(startDate, minDate) / 7;
          duration = task.isMilestone ? 0 : differenceInDays(endDate, startDate) / 7;
          break;
        case "month":
          diff = differenceInDays(startDate, minDate) / 30;
          duration = task.isMilestone ? 0 : differenceInDays(endDate, startDate) / 30;
          break;
      }
      
      positions[task.id] = {
        x: diff * columnWidth,
        y: TIMELINE_HEIGHT + index * (TASK_HEIGHT + 20) + TASK_HEIGHT / 2,
        width: task.isMilestone ? 0 : Math.max(duration * columnWidth, columnWidth / 2),
      };
    });
    
    return positions;
  }, [filteredTasks, minDate, viewMode, columnWidth]);

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
          
          <Divider orientation="vertical" flexItem />
          
          <RadioGroup
            row
            value={priorityFilter}
            onChange={(e) => handlePriorityFilterChange(e.target.value as PriorityFilter)}
            sx={{ gap: 1 }}
          >
            <FormControlLabel
              value="all"
              control={<Radio size="small" />}
              label="All"
              sx={{ m: 0 }}
            />
            <FormControlLabel
              value="high"
              control={<Radio size="small" sx={{ color: theme.palette.error.main, '&.Mui-checked': { color: theme.palette.error.main } }} />}
              label="High"
              sx={{ m: 0 }}
            />
            <FormControlLabel
              value="medium"
              control={<Radio size="small" sx={{ color: theme.palette.warning.main, '&.Mui-checked': { color: theme.palette.warning.main } }} />}
              label="Medium"
              sx={{ m: 0 }}
            />
            <FormControlLabel
              value="low"
              control={<Radio size="small" sx={{ color: theme.palette.success.main, '&.Mui-checked': { color: theme.palette.success.main } }} />}
              label="Low"
              sx={{ m: 0 }}
            />
          </RadioGroup>
          
          <Divider orientation="vertical" flexItem />
          
          <Button
            variant={assigneeFilter.length > 0 ? "contained" : "outlined"}
            size="small"
            startIcon={<FilterIcon />}
            endIcon={assigneeFilter.length > 0 ? (
              <Badge badgeContent={assigneeFilter.length} color="secondary" />
            ) : null}
            onClick={(e) => setAssigneeFilterAnchor(e.currentTarget)}
            sx={{ textTransform: "none" }}
          >
            Assignees
          </Button>
          
          <Button
            variant={dateRangeFilter ? "contained" : "outlined"}
            size="small"
            startIcon={<CalendarIcon />}
            onClick={(e) => setDateRangeAnchor(e.currentTarget)}
            sx={{ textTransform: "none" }}
          >
            Date Range
          </Button>
          
          <Divider orientation="vertical" flexItem />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={hideCompleted}
                onChange={(e) => handleHideCompletedChange(e.target.checked)}
                size="small"
              />
            }
            label="Hide Completed"
            sx={{ m: 0 }}
          />
          
          <Divider orientation="vertical" flexItem />
          
          <RadioGroup
            row
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value as StatusFilter)}
            sx={{ gap: 1 }}
          >
            <FormControlLabel
              value="all"
              control={<Radio size="small" />}
              label="All"
              sx={{ m: 0 }}
            />
            <FormControlLabel
              value="not_started"
              control={<Radio size="small" sx={{ color: theme.palette.grey[500], '&.Mui-checked': { color: theme.palette.grey[500] } }} />}
              label="Not Started"
              sx={{ m: 0 }}
            />
            <FormControlLabel
              value="in_progress"
              control={<Radio size="small" sx={{ color: theme.palette.info.main, '&.Mui-checked': { color: theme.palette.info.main } }} />}
              label="In Progress"
              sx={{ m: 0 }}
            />
            <FormControlLabel
              value="overdue"
              control={<Radio size="small" sx={{ color: theme.palette.error.main, '&.Mui-checked': { color: theme.palette.error.main } }} />}
              label="Overdue"
              sx={{ m: 0 }}
            />
            <FormControlLabel
              value="completed"
              control={<Radio size="small" sx={{ color: theme.palette.success.main, '&.Mui-checked': { color: theme.palette.success.main } }} />}
              label="Completed"
              sx={{ m: 0 }}
            />
          </RadioGroup>
          
          {(hideCompleted || priorityFilter !== "all" || statusFilter !== "all" || assigneeFilter.length > 0 || dateRangeFilter) && filteredTasks.length !== tasks.length && (
            <Typography variant="caption" color="text.secondary">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </Typography>
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
        
        {/* Active filter chips */}
        {(assigneeFilter.length > 0 || dateRangeFilter) && (
          <Stack direction="row" spacing={1} sx={{ px: 2, py: 1, flexWrap: "wrap", gap: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "center" }}>
              Filtered by:
            </Typography>
            {assigneeFilter.map(assignee => (
              <Chip
                key={assignee}
                label={assignee === "_unassigned" ? "Unassigned" : assignee}
                size="small"
                avatar={assignee === "_unassigned" ? <GroupsIcon /> : <Avatar sx={{ width: 20, height: 20 }}>{assignee[0]}</Avatar>}
                onDelete={() => removeAssigneeFilter(assignee)}
                deleteIcon={<CloseIcon />}
              />
            ))}
            {dateRangeFilter && dateRangeFilter.startDate && dateRangeFilter.endDate && (
              <Chip
                label={`${format(dateRangeFilter.startDate, "MMM d")} - ${format(dateRangeFilter.endDate, "MMM d")}`}
                size="small"
                icon={<CalendarIcon />}
                onDelete={handleDateRangeClear}
                deleteIcon={<CloseIcon />}
              />
            )}
            <Button size="small" onClick={() => {
              handleAssigneeClear();
              if (dateRangeFilter) handleDateRangeClear();
            }} sx={{ textTransform: "none" }}>
              Clear All
            </Button>
          </Stack>
        )}
      </Paper>
      
      {/* Assignee Filter Popover */}
      <Popover
        open={Boolean(assigneeFilterAnchor)}
        anchorEl={assigneeFilterAnchor}
        onClose={() => setAssigneeFilterAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="subtitle2" gutterBottom>
            Filter by Assignee
          </Typography>
          
          <TextField
            fullWidth
            size="small"
            placeholder="Search assignees..."
            value={assigneeSearch}
            onChange={(e) => setAssigneeSearch(e.target.value)}
            sx={{ mb: 2 }}
            slotProps={{
              input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              },
            }}
          />
          
          <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
            {filteredAssignees.map(assignee => (
              <FormControlLabel
                key={assignee}
                control={
                  <Checkbox
                    size="small"
                    checked={assigneeFilter.includes(assignee)}
                    onChange={() => handleAssigneeToggle(assignee)}
                  />
                }
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 24, height: 24 }}>{assignee[0]}</Avatar>
                    <Typography variant="body2">{assignee}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({assigneeTaskCounts[assignee]})
                    </Typography>
                  </Stack>
                }
                sx={{ width: "100%", m: 0, mb: 1 }}
              />
            ))}
            
            {assigneeTaskCounts["_unassigned"] > 0 && (
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={assigneeFilter.includes("_unassigned")}
                    onChange={() => handleAssigneeToggle("_unassigned")}
                  />
                }
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <GroupsIcon sx={{ width: 24, height: 24 }} />
                    <Typography variant="body2">Unassigned</Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({assigneeTaskCounts["_unassigned"]})
                    </Typography>
                  </Stack>
                }
                sx={{ width: "100%", m: 0 }}
              />
            )}
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Button size="small" onClick={handleAssigneeSelectAll}>
              Select All
            </Button>
            <Button size="small" onClick={handleAssigneeClear}>
              Clear
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => setAssigneeFilterAnchor(null)}
            >
              Apply
            </Button>
          </Stack>
        </Box>
      </Popover>
      
      {/* Date Range Filter Popover */}
      <Popover
        open={Boolean(dateRangeAnchor)}
        anchorEl={dateRangeAnchor}
        onClose={() => setDateRangeAnchor(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, width: 320 }}>
          <Typography variant="subtitle2" gutterBottom>
            Filter by Date Range
          </Typography>
          
          <Stack spacing={2}>
            <TextField
              fullWidth
              size="small"
              label="From"
              type="date"
              value={tempDateRange.startDate ? format(tempDateRange.startDate, "yyyy-MM-dd") : ""}
              onChange={(e) => setTempDateRange(prev => ({
                ...prev,
                startDate: e.target.value ? new Date(e.target.value) : null,
              }))}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            
            <TextField
              fullWidth
              size="small"
              label="To"
              type="date"
              value={tempDateRange.endDate ? format(tempDateRange.endDate, "yyyy-MM-dd") : ""}
              onChange={(e) => setTempDateRange(prev => ({
                ...prev,
                endDate: e.target.value ? new Date(e.target.value) : null,
              }))}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            
            <Divider />
            
            <Typography variant="body2">Quick Filters:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button size="small" onClick={() => setQuickDateRange("thisWeek")}>
                This Week
              </Button>
              <Button size="small" onClick={() => setQuickDateRange("next7Days")}>
                Next 7 Days
              </Button>
              <Button size="small" onClick={() => setQuickDateRange("thisMonth")}>
                This Month
              </Button>
              <Button size="small" onClick={() => setQuickDateRange("nextQuarter")}>
                Next Quarter
              </Button>
            </Stack>
            
            <Divider />
            
            <Typography variant="body2">Include tasks that:</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={tempDateRange.includeStarting}
                  onChange={(e) => setTempDateRange(prev => ({
                    ...prev,
                    includeStarting: e.target.checked,
                  }))}
                />
              }
              label="Start in range"
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={tempDateRange.includeEnding}
                  onChange={(e) => setTempDateRange(prev => ({
                    ...prev,
                    includeEnding: e.target.checked,
                  }))}
                />
              }
              label="End in range"
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={tempDateRange.includeOverlapping}
                  onChange={(e) => setTempDateRange(prev => ({
                    ...prev,
                    includeOverlapping: e.target.checked,
                  }))}
                />
              }
              label="Overlap with range"
            />
            
            <Divider />
            
            <Stack direction="row" spacing={1} justifyContent="space-between">
              <Button size="small" onClick={handleDateRangeClear}>
                Clear
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleDateRangeApply}
                disabled={!tempDateRange.startDate || !tempDateRange.endDate}
              >
                Apply
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Popover>
      
      {/* Main content area with sidebar and chart */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Task sidebar */}
        <TaskSidebar
          tasks={tasks}
          expandedTasks={expandedTasks}
          onToggleExpand={handleToggleExpand}
          selectedTaskId={selectedTaskId}
          onTaskClick={handleTaskClick}
          width={SIDEBAR_WIDTH}
        />
        
        {/* Gantt chart area */}
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
          
          {/* Milestone markers below timeline */}
          {milestonePositions.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: TIMELINE_HEIGHT - 20,
                left: 0,
                width: columns.length * columnWidth,
                height: 20,
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                borderBottom: `1px solid ${theme.palette.divider}`,
                zIndex: 5,
                pointerEvents: "auto",
              }}
            >
              {milestonePositions.map((milestone) => (
                <MilestoneMarker
                  key={milestone.id}
                  milestone={milestone}
                  position={milestone.position}
                  columnWidth={columnWidth}
                  viewMode={viewMode}
                  minDate={minDate}
                  onClick={() => onMilestoneClick?.(milestone)}
                  onUpdate={(updates) => onMilestoneUpdate?.(milestone.id, updates)}
                  readOnly={readOnly}
                />
              ))}
            </Box>
          )}
        </Box>
        
        <Box
          sx={{
            position: "relative",
            minHeight: filteredTasks.length * (TASK_HEIGHT + 20) + 100,
            width: columns.length * columnWidth,
            paddingTop: milestonePositions.length > 0 ? "20px" : 0,
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
          
          {/* Milestone vertical lines */}
          {milestonePositions.map((milestone) => (
            <Box
              key={`line-${milestone.id}`}
              sx={{
                position: "absolute",
                left: milestone.position,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: milestone.type === "delivery" 
                  ? theme.palette.error.main
                  : milestone.type === "review"
                  ? theme.palette.success.main
                  : milestone.type === "approval"
                  ? theme.palette.warning.main
                  : theme.palette.primary.main,
                opacity: 0.3,
                pointerEvents: "none",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: -2,
                  right: -2,
                  top: 0,
                  bottom: 0,
                  backgroundColor: "inherit",
                  opacity: 0.2,
                },
              }}
            />
          ))}
          
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
              {filteredTasks.map(task => {
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
          
          {filteredTasks.map((task, index) => {
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
                  onUpdate={(updates) => handleTaskUpdateWithDependencies(task.id, updates)}
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
    </Box>
  );
}

export default GanttChart;