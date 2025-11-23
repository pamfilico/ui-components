"use client";

import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  Avatar,
  AvatarGroup,
  useTheme,
  alpha,
} from "@mui/material";
import {
  KeyboardArrowRight as CollapsedIcon,
  KeyboardArrowDown as ExpandedIcon,
} from "@mui/icons-material";
import { GanttTask } from "./GanttChart";

export interface TaskSidebarProps {
  tasks: GanttTask[];
  expandedTasks: Set<string>;
  onToggleExpand: (taskId: string) => void;
  selectedTaskId?: string | null;
  onTaskClick?: (task: GanttTask) => void;
  width?: number;
}

export const TaskSidebar: React.FC<TaskSidebarProps> = ({
  tasks,
  expandedTasks,
  onToggleExpand,
  selectedTaskId,
  onTaskClick,
  width = 300,
}) => {
  const theme = useTheme();

  // Build task hierarchy map
  const taskMap = new Map<string, GanttTask>();
  const rootTasks: GanttTask[] = [];
  const childrenMap = new Map<string, GanttTask[]>();

  tasks.forEach(task => {
    taskMap.set(task.id, task);
    
    if (task.parentId) {
      const siblings = childrenMap.get(task.parentId) || [];
      siblings.push(task);
      childrenMap.set(task.parentId, siblings);
    } else {
      rootTasks.push(task);
    }
  });

  const renderTask = (task: GanttTask, level: number = 0): React.ReactNode => {
    const children = childrenMap.get(task.id) || [];
    const hasChildren = children.length > 0;
    const isExpanded = expandedTasks.has(task.id);
    const isSelected = selectedTaskId === task.id;

    return (
      <React.Fragment key={task.id}>
        <ListItemButton
          onClick={() => {
            if (hasChildren) {
              onToggleExpand(task.id);
            }
            onTaskClick?.(task);
          }}
          selected={isSelected}
          sx={{
            pl: 2 + level * 2,
            py: 0.5,
            minHeight: 36,
            backgroundColor: isSelected 
              ? alpha(theme.palette.primary.main, 0.08)
              : "transparent",
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
          }}
        >
          {hasChildren && (
            <ListItemIcon sx={{ minWidth: 24 }}>
              {isExpanded ? <ExpandedIcon fontSize="small" /> : <CollapsedIcon fontSize="small" />}
            </ListItemIcon>
          )}
          
          <ListItemText
            primary={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    fontWeight: hasChildren ? 600 : 400,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {task.name}
                </Typography>
                
                {/* Show assignee avatars */}
                {(task.assignees?.length || task.assignee) && (
                  <AvatarGroup 
                    max={3}
                    sx={{
                      '& .MuiAvatar-root': {
                        width: 20,
                        height: 20,
                        fontSize: "0.65rem",
                        backgroundColor: alpha(theme.palette.primary.main, 0.5),
                        border: `1px solid ${theme.palette.background.paper}`,
                      },
                    }}
                  >
                    {task.assignees ? (
                      task.assignees.map((assignee) => (
                        <Avatar key={assignee} title={assignee}>
                          {assignee.charAt(0).toUpperCase()}
                        </Avatar>
                      ))
                    ) : task.assignee ? (
                      <Avatar title={task.assignee}>
                        {task.assignee.charAt(0).toUpperCase()}
                      </Avatar>
                    ) : null}
                  </AvatarGroup>
                )}
                
                {/* Show progress */}
                {task.progress !== undefined && (
                  <Typography variant="caption" color="text.secondary">
                    {task.progress}%
                  </Typography>
                )}
              </Box>
            }
            sx={{ m: 0 }}
          />
        </ListItemButton>
        
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            {children.map(child => renderTask(child, level + 1))}
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box
      sx={{
        width,
        borderRight: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 50,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
          px: 2,
          backgroundColor: theme.palette.grey[50],
        }}
      >
        <Typography variant="subtitle2" fontWeight={600}>
          Tasks
        </Typography>
      </Box>
      
      {/* Task list */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List sx={{ py: 0 }}>
          {rootTasks.map(task => renderTask(task))}
        </List>
      </Box>
    </Box>
  );
};

export default TaskSidebar;