import type { Meta, StoryObj } from "@storybook/react";
import { GanttChart, type GanttTask } from "./GanttChart";
import { Box, Typography } from "@mui/material";
import { useState } from "react";

const meta = {
  title: "Material/Gantt/GanttChart/Hierarchy",
  component: GanttChart,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GanttChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = new Date();
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Hierarchical project tasks
const hierarchicalTasks: GanttTask[] = [
  // Main project
  {
    id: "project",
    name: "▼ Website Redesign Project",
    start_datetime: now.toISOString(),
    end_datetime: addDays(now, 60).toISOString(),
    progress: 35,
    assignees: ["Project Manager"],
    priority: "high",
    children: ["phase1", "phase2", "phase3"],
    level: 0,
    isExpanded: true,
  },
  
  // Phase 1
  {
    id: "phase1", 
    name: "  ▼ Phase 1: Research & Planning",
    parentId: "project",
    start_datetime: now.toISOString(),
    end_datetime: addDays(now, 14).toISOString(),
    progress: 80,
    assignees: ["Alice", "Bob"],
    priority: "high",
    children: ["task1", "task2", "task3"],
    level: 1,
    isExpanded: true,
  },
  {
    id: "task1",
    name: "    • User Research",
    parentId: "phase1",
    start_datetime: now.toISOString(),
    end_datetime: addDays(now, 5).toISOString(),
    progress: 100,
    assignees: ["Alice"],
    priority: "medium",
    level: 2,
  },
  {
    id: "task2",
    name: "    • Competitive Analysis",
    parentId: "phase1",
    start_datetime: addDays(now, 3).toISOString(),
    end_datetime: addDays(now, 8).toISOString(),
    progress: 75,
    assignees: ["Bob"],
    priority: "medium",
    level: 2,
  },
  {
    id: "task3",
    name: "    • Requirements Documentation",
    parentId: "phase1",
    start_datetime: addDays(now, 6).toISOString(),
    end_datetime: addDays(now, 14).toISOString(),
    progress: 60,
    assignees: ["Alice", "Bob"],
    priority: "high",
    level: 2,
  },
  
  // Phase 2
  {
    id: "phase2",
    name: "  ▶ Phase 2: Design & Development",
    parentId: "project",
    start_datetime: addDays(now, 10).toISOString(),
    end_datetime: addDays(now, 40).toISOString(),
    progress: 25,
    assignees: ["Charlie", "Diana", "Eric"],
    priority: "high",
    children: ["task4", "task5", "task6"],
    level: 1,
    isExpanded: false,
  },
  
  // Phase 3
  {
    id: "phase3",
    name: "  ▶ Phase 3: Testing & Launch",
    parentId: "project",
    start_datetime: addDays(now, 35).toISOString(),
    end_datetime: addDays(now, 60).toISOString(),
    progress: 0,
    assignees: ["Frank", "Grace"],
    priority: "medium",
    children: ["task7", "task8", "task9"],
    level: 1,
    isExpanded: false,
  },
];

export const HierarchicalTasks: Story = {
  args: {
    tasks: hierarchicalTasks,
    height: 500,
    viewMode: "week",
  },
  render: (args) => {
    const [tasks, setTasks] = useState(hierarchicalTasks);

    const handleTaskUpdate = (taskId: string, updates: Partial<GanttTask>) => {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));
    };

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Hierarchical Task Structure
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Tasks are organized in a parent-child hierarchy. Click the arrows to expand/collapse task groups.
        </Typography>
        <GanttChart
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          height={500}
          viewMode="week"
        />
      </Box>
    );
  },
};

export const CollapsedHierarchy: Story = {
  args: {
    tasks: hierarchicalTasks,
    height: 400,
    viewMode: "month",
  },
  render: (args) => {
    const collapsedTasks = hierarchicalTasks.map(task => ({
      ...task,
      name: task.level === 0 ? "▶ Website Redesign Project" :
            task.level === 1 && task.id === "phase1" ? "  ▶ Phase 1: Research & Planning" :
            task.name.replace("▼", "▶"),
      isExpanded: false,
    }));

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Collapsed Hierarchy View
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          All task groups are collapsed, showing only the high-level structure.
        </Typography>
        <GanttChart
          tasks={collapsedTasks}
          height={400}
          viewMode="month"
        />
      </Box>
    );
  },
};