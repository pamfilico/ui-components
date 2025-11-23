import type { Meta, StoryObj } from "@storybook/react";
import { GanttChart, type GanttTask, type DateRangeFilter } from "./GanttChart";
import { useState } from "react";
import { Box, Button, Stack, Paper, Typography } from "@mui/material";
import { addDays, addHours, subDays } from "date-fns";

const meta = {
  title: "Material/Gantt/GanttChart",
  component: GanttChart,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    height: {
      control: { type: "number" },
      description: "Height of the Gantt chart",
    },
    viewMode: {
      control: "select",
      options: ["day", "week", "month"],
      description: "Default view mode for the timeline",
    },
    readOnly: {
      control: "boolean",
      description: "Whether the chart is read-only",
    },
    showGrid: {
      control: "boolean",
      description: "Show vertical grid lines",
    },
    showDependencies: {
      control: "boolean",
      description: "Show dependency arrows",
    },
    highlightWeekends: {
      control: "boolean",
      description: "Highlight weekend columns",
    },
    highlightToday: {
      control: "boolean",
      description: "Highlight today's column",
    },
    autoMoveDependencies: {
      control: "boolean",
      description: "Auto-move dependent tasks when parent moves",
    },
    hideCompleted: {
      control: "boolean",
      description: "Hide tasks that are 100% complete",
    },
    priorityFilter: {
      control: "select",
      options: ["all", "high", "medium", "low"],
      description: "Filter tasks by priority level",
    },
  },
} satisfies Meta<typeof GanttChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = new Date();
const projectTasks: GanttTask[] = [
  {
    id: "1",
    name: "Requirements Analysis",
    start_datetime: now.toISOString(),
    end_datetime: addDays(now, 3).toISOString(),
    progress: 100,
    assignees: ["Alice", "Bob"],  // Multiple assignees
    color: "#4CAF50",
    priority: "high" as const,
    description: "Gather and document all project requirements",
    dependencies: [],
  },
  {
    id: "2",
    name: "System Architecture Design",
    start_datetime: addDays(now, 2).toISOString(),
    end_datetime: addDays(now, 6).toISOString(),
    progress: 85,
    assignee: "Bob",
    color: "#2196F3",
    priority: "high" as const,
    description: "Design the overall system architecture",
    dependencies: ["1"],
  },
  {
    id: "3",
    name: "Database Schema Design",
    start_datetime: addDays(now, 4).toISOString(),
    end_datetime: addDays(now, 7).toISOString(),
    progress: 70,
    assignee: "Charlie",
    color: "#FF9800",
    priority: "medium" as const,
    description: "Design database tables and relationships",
    dependencies: ["2"],
  },
  {
    id: "10",
    name: "Documentation Writing",
    start_datetime: addDays(now, 5).toISOString(),
    end_datetime: addDays(now, 12).toISOString(),
    progress: 20,
    assignee: "Isabella",
    color: "#4CAF50",
    priority: "low" as const,
    description: "Write user documentation and API docs",
    dependencies: [],
  },
  {
    id: "4",
    name: "Frontend Development",
    start_datetime: addDays(now, 6).toISOString(),
    end_datetime: addDays(now, 15).toISOString(),
    progress: 40,
    assignees: ["Diana", "Charlie", "Frank"],  // Multiple assignees
    color: "#9C27B0",
    priority: "medium" as const,
    description: "Implement user interface components",
    dependencies: ["2"],
  },
  {
    id: "5",
    name: "Backend API Development",
    start_datetime: addDays(now, 7).toISOString(),
    end_datetime: addDays(now, 16).toISOString(),
    progress: 35,
    assignees: ["Eric", "Alice"],  // Multiple assignees
    color: "#00BCD4",
    priority: "high" as const,
    description: "Develop REST API endpoints",
    dependencies: ["3"],
  },
  {
    id: "6",
    name: "Integration Testing",
    start_datetime: addDays(now, 14).toISOString(),
    end_datetime: addDays(now, 18).toISOString(),
    progress: 10,
    assignee: "Frank",
    color: "#FF5722",
    priority: "medium" as const,
    description: "Test integration between frontend and backend",
    dependencies: ["4", "5"],
  },
  {
    id: "11",
    name: "Code Cleanup",
    start_datetime: addDays(now, 15).toISOString(),
    end_datetime: addDays(now, 17).toISOString(),
    progress: 5,
    assignee: "Jack",
    color: "#9E9E9E",
    priority: "low" as const,
    description: "Refactor and clean up technical debt",
    dependencies: [],
  },
  {
    id: "7",
    name: "User Acceptance Testing",
    start_datetime: addDays(now, 17).toISOString(),
    end_datetime: addDays(now, 20).toISOString(),
    progress: 0,
    assignee: "Grace",
    color: "#795548",
    priority: "high" as const,
    description: "Conduct UAT with stakeholders",
    dependencies: ["6"],
  },
  {
    id: "8",
    name: "Deployment Preparation",
    start_datetime: addDays(now, 19).toISOString(),
    end_datetime: addDays(now, 21).toISOString(),
    progress: 0,
    assignee: "Henry",
    color: "#607D8B",
    priority: "high" as const,
    description: "Prepare production environment",
    dependencies: ["7"],
  },
  {
    id: "9",
    name: "Production Release",
    start_datetime: addDays(now, 21).toISOString(),
    end_datetime: addDays(now, 22).toISOString(),
    progress: 0,
    assignees: ["Henry", "DevOps Team", "Alice", "Bob"],  // Multiple assignees
    color: "#F44336",
    priority: "high" as const,
    description: "Deploy to production",
    dependencies: ["8"],
  },
  {
    id: "12",
    name: "Performance Monitoring Setup",
    start_datetime: addDays(now, 22).toISOString(),
    end_datetime: addDays(now, 24).toISOString(),
    progress: 0,
    assignee: "Kate",
    color: "#8BC34A",
    priority: "low" as const,
    description: "Set up monitoring and analytics tools",
    dependencies: ["9"],
  },
];

export const Default: Story = {
  args: {
    tasks: projectTasks,
    height: 600,
    viewMode: "week",
    showGrid: true,
    showDependencies: true,
    highlightWeekends: true,
    highlightToday: true,
    readOnly: false,
    hideCompleted: false,
  },
};

export const DayView: Story = {
  args: {
    tasks: projectTasks.slice(0, 5),
    height: 400,
    viewMode: "day",
    showGrid: true,
    showDependencies: true,
    highlightWeekends: true,
    highlightToday: true,
  },
};

export const MonthView: Story = {
  args: {
    tasks: projectTasks,
    height: 600,
    viewMode: "month",
    showGrid: true,
    showDependencies: true,
    highlightToday: true,
  },
};

export const ReadOnlyChart: Story = {
  args: {
    tasks: projectTasks,
    height: 500,
    viewMode: "week",
    readOnly: true,
    showGrid: true,
    showDependencies: true,
  },
};

export const NoGridNoDependencies: Story = {
  args: {
    tasks: projectTasks,
    height: 500,
    viewMode: "week",
    showGrid: false,
    showDependencies: false,
  },
};

export const DateRangeFilterStory = () => {
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter | null>(null);
  
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Gantt Chart with Date Range Filter</Typography>
        <Typography variant="body2" color="text.secondary">
          Click "Date Range" button to filter tasks by date. Use quick presets or select custom dates.
        </Typography>
      </Paper>
      <Box sx={{ flex: 1 }}>
        <GanttChart
          tasks={projectTasks}
          dateRangeFilter={dateRangeFilter}
          onDateRangeFilterChange={setDateRangeFilter}
          height="100%"
          viewMode="week"
          showGrid={true}
          showDependencies={true}
          highlightWeekends={true}
          highlightToday={true}
        />
      </Box>
    </Box>
  );
};

export const AssigneeFilter = () => {
  const [assigneeFilter, setAssigneeFilter] = useState<string[]>([]);
  
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Gantt Chart with Assignee Filter</Typography>
        <Typography variant="body2" color="text.secondary">
          Click "Assignees" button to filter tasks by team members. Select multiple people to see their tasks.
        </Typography>
      </Paper>
      <Box sx={{ flex: 1 }}>
        <GanttChart
          tasks={projectTasks}
          assigneeFilter={assigneeFilter}
          onAssigneeFilterChange={setAssigneeFilter}
          height="100%"
          viewMode="week"
          showGrid={true}
          showDependencies={true}
          highlightWeekends={true}
          highlightToday={true}
        />
      </Box>
    </Box>
  );
};

export const InteractiveWithMilestones = () => {
  const [tasks, setTasks] = useState<GanttTask[]>(projectTasks);
  const [milestones, setMilestones] = useState([
    { id: "m1", name: "Phase 1 Complete", date: addDays(now, 10).toISOString(), type: "review" as const },
    { id: "m2", name: "Beta Release", date: addDays(now, 20).toISOString(), type: "delivery" as const },
    { id: "m3", name: "Final Approval", date: addDays(now, 30).toISOString(), type: "approval" as const },
  ]);

  const handleMilestoneUpdate = (id: string, updates: Partial<GanttTask>) => {
    setMilestones(prev => 
      prev.map(m => m.id === id ? { ...m, ...updates } : m)
    );
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Interactive Gantt Chart with Draggable Milestones</Typography>
        <Typography variant="body2" color="text.secondary">
          Drag milestones left/right to change their dates. Drag tasks to move them.
        </Typography>
      </Paper>
      <Box sx={{ flex: 1 }}>
        <GanttChart
          tasks={tasks}
          milestones={milestones}
          onTaskUpdate={(id, updates) => {
            setTasks(prev => 
              prev.map(t => t.id === id ? { ...t, ...updates } : t)
            );
          }}
          onMilestoneUpdate={handleMilestoneUpdate}
          onMilestoneClick={(milestone) => {
            alert(`Clicked milestone: ${milestone.name} on ${milestone.date}`);
          }}
          height="100%"
          showGrid={true}
          showDependencies={true}
          highlightWeekends={true}
          highlightToday={true}
        />
      </Box>
    </Box>
  );
};

export const InteractiveWithEvents = () => {
  const [tasks, setTasks] = useState<any[]>(projectTasks);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all");

  const addLog = (message: string) => {
    setEventLog(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleTaskUpdate = (taskId: string, updates: any) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
    addLog(`Task "${tasks.find(t => t.id === taskId)?.name}" updated`);
  };

  const handleTaskDelete = (taskId: string) => {
    const taskName = tasks.find(t => t.id === taskId)?.name;
    setTasks(prev => prev.filter(task => task.id !== taskId));
    addLog(`Task "${taskName}" deleted`);
  };

  const handleDependencyAdd = (sourceId: string, targetId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === targetId) {
        const deps = task.dependencies || [];
        if (!deps.includes(sourceId)) {
          return { ...task, dependencies: [...deps, sourceId] };
        }
      }
      return task;
    }));
    const sourceName = tasks.find(t => t.id === sourceId)?.name;
    const targetName = tasks.find(t => t.id === targetId)?.name;
    addLog(`Dependency added: "${sourceName}" → "${targetName}"`);
  };

  const handleDependencyRemove = (sourceId: string, targetId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === targetId) {
        return {
          ...task,
          dependencies: task.dependencies?.filter((dep: string) => dep !== sourceId) || [],
        };
      }
      return task;
    }));
    const sourceName = tasks.find(t => t.id === sourceId)?.name;
    const targetName = tasks.find(t => t.id === targetId)?.name;
    addLog(`Dependency removed: "${sourceName}" → "${targetName}"`);
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    addLog(`Task "${task.name}" selected`);
  };

  const addNewTask = () => {
    const newId = String(tasks.length + 1);
    const lastTask = tasks[tasks.length - 1];
    const startDate = lastTask 
      ? addDays(new Date(lastTask.start_datetime), 1)
      : addDays(now, 25);
    
    const newTask = {
      id: newId,
      name: `New Task ${newId}`,
      start_datetime: startDate.toISOString(),
      end_datetime: addDays(startDate, 3).toISOString(),
      progress: 0,
      assignee: "Unassigned",
      color: "#9E9E9E",
      priority: "low" as const,
      description: "New task description",
      dependencies: [],
    };
    
    setTasks(prev => [...prev, newTask]);
    addLog(`New task "${newTask.name}" added`);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", p: 2 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={addNewTask}>
          Add Task
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => {
            setTasks(projectTasks);
            addLog("Tasks reset to default");
          }}
        >
          Reset
        </Button>
        <Button
          variant={hideCompleted ? "contained" : "outlined"}
          onClick={() => {
            setHideCompleted(!hideCompleted);
            addLog(hideCompleted ? "Showing all tasks" : "Hiding completed tasks");
          }}
        >
          {hideCompleted ? "Show All" : "Hide Completed"}
        </Button>
      </Stack>
      
      <Box sx={{ flex: 1, display: "flex", gap: 2, minHeight: 0 }}>
        <Box sx={{ flex: 1 }}>
          <GanttChart
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onDependencyAdd={handleDependencyAdd}
            onDependencyRemove={handleDependencyRemove}
            onTaskClick={handleTaskClick}
            height="100%"
            viewMode="week"
            showGrid={true}
            showDependencies={true}
            autoMoveDependencies={true}
            highlightWeekends={true}
            highlightToday={true}
            hideCompleted={hideCompleted}
            onHideCompletedChange={setHideCompleted}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={(value) => {
              setPriorityFilter(value);
              addLog(`Priority filter changed to: ${value}`);
            }}
          />
        </Box>
        
        <Paper sx={{ width: 300, p: 2, overflow: "auto" }}>
          {selectedTask && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Selected Task
              </Typography>
              <Typography variant="body2">
                <strong>Name:</strong> {selectedTask.name}
              </Typography>
              <Typography variant="body2">
                <strong>Assignee:</strong> {selectedTask.assignee}
              </Typography>
              <Typography variant="body2">
                <strong>Progress:</strong> {selectedTask.progress}%
              </Typography>
              <Typography variant="body2">
                <strong>Priority:</strong> {selectedTask.priority}
              </Typography>
              <Typography variant="body2">
                <strong>Description:</strong> {selectedTask.description}
              </Typography>
            </Box>
          )}
          
          <Typography variant="h6" gutterBottom>
            Event Log
          </Typography>
          <Box 
            sx={{ 
              bgcolor: "grey.100", 
              p: 1, 
              borderRadius: 1,
              fontSize: "0.75rem",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
            }}
          >
            {eventLog.length > 0 ? eventLog.join('\n') : "No events yet..."}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export const WithCompletedTasks: Story = {
  args: {
    tasks: projectTasks.map(task => ({
      ...task,
      // Mark first 3 tasks as completed for demo
      progress: ['1', '2', '3'].includes(task.id) ? 100 : task.progress
    })),
    height: 600,
    viewMode: "week",
    showGrid: true,
    showDependencies: true,
    highlightWeekends: true,
    highlightToday: true,
    hideCompleted: false,
  },
};

export const PriorityIndicators: Story = {
  args: {
    tasks: projectTasks.map(task => ({
      ...task,
      // Remove colors to showcase priority-based styling
      color: undefined,
      // Ensure all tasks have clear priority levels
      priority: task.priority || (
        ['1', '2', '5', '7', '8', '9'].includes(task.id) ? ('high' as const) :
        ['3', '4', '6'].includes(task.id) ? ('medium' as const) : 
        ('low' as const)
      ),
    })),
    height: 600,
    viewMode: "week",
    showGrid: true,
    showDependencies: true,
    highlightWeekends: true,
    highlightToday: true,
  },
};

export const Milestones: Story = {
  args: {
    tasks: [
      // Phase 1 Tasks
      {
        id: "1",
        name: "Requirements Gathering",
        start_datetime: now.toISOString(),
        end_datetime: addDays(now, 5).toISOString(),
        progress: 100,
        assignee: "Alice",
        priority: "high" as const,
      },
      {
        id: "2",
        name: "System Design",
        start_datetime: addDays(now, 6).toISOString(),
        end_datetime: addDays(now, 12).toISOString(),
        progress: 75,
        assignee: "Bob",
        priority: "high" as const,
        dependencies: ["1"],
      },
      // Phase 2 Tasks
      {
        id: "3",
        name: "Frontend Development",
        start_datetime: addDays(now, 13).toISOString(),
        end_datetime: addDays(now, 25).toISOString(),
        progress: 40,
        assignee: "Charlie",
        priority: "medium" as const,
        dependencies: ["2"],
      },
      {
        id: "4",
        name: "Backend Development",
        start_datetime: addDays(now, 13).toISOString(),
        end_datetime: addDays(now, 28).toISOString(),
        progress: 30,
        assignee: "Diana",
        priority: "medium" as const,
        dependencies: ["2"],
      },
      {
        id: "5",
        name: "Integration Testing",
        start_datetime: addDays(now, 26).toISOString(),
        end_datetime: addDays(now, 30).toISOString(),
        progress: 0,
        assignee: "Eric",
        priority: "high" as const,
        dependencies: ["3", "4"],
      },
      // Phase 3 Tasks
      {
        id: "6",
        name: "User Acceptance Testing",
        start_datetime: addDays(now, 32).toISOString(),
        end_datetime: addDays(now, 38).toISOString(),
        progress: 0,
        assignee: "Frank",
        priority: "high" as const,
      },
      {
        id: "7",
        name: "Bug Fixes",
        start_datetime: addDays(now, 35).toISOString(),
        end_datetime: addDays(now, 40).toISOString(),
        progress: 0,
        assignee: "Grace",
        priority: "medium" as const,
        dependencies: ["6"],
      },
      {
        id: "8",
        name: "Production Deployment",
        start_datetime: addDays(now, 42).toISOString(),
        end_datetime: addDays(now, 43).toISOString(),
        progress: 0,
        assignee: "DevOps",
        priority: "high" as const,
        dependencies: ["7"],
      },
    ],
    milestones: [
      {
        id: "m1",
        name: "Requirements Review",
        date: addDays(now, 5).toISOString(),
        type: "review" as const,
      },
      {
        id: "m2",
        name: "Design Approval",
        date: addDays(now, 12).toISOString(),
        type: "approval" as const,
      },
      {
        id: "m3",
        name: "Beta Release",
        date: addDays(now, 31).toISOString(),
        type: "delivery" as const,
      },
      {
        id: "m4",
        name: "Final Review",
        date: addDays(now, 41).toISOString(),
        type: "review" as const,
      },
      {
        id: "m5",
        name: "Product Launch",
        date: addDays(now, 44).toISOString(),
        type: "delivery" as const,
        description: "Official product launch to customers",
      },
    ],
    height: 600,
    viewMode: "week",
    showGrid: true,
    showDependencies: true,
    highlightWeekends: true,
    highlightToday: true,
  },
};

export const StatusIndicators: Story = {
  args: {
    tasks: [
      // Completed task (100% progress)
      {
        id: "1",
        name: "Completed Task - Requirements Done",
        start_datetime: subDays(now, 5).toISOString(),
        end_datetime: subDays(now, 2).toISOString(),
        progress: 100,
        assignee: "Alice",
        priority: "high" as const,
        description: "This task is complete",
      },
      // Overdue task (past end date, not complete)
      {
        id: "2",
        name: "Overdue Task - Backend API",
        start_datetime: subDays(now, 8).toISOString(),
        end_datetime: subDays(now, 1).toISOString(),
        progress: 65,
        assignee: "Bob",
        priority: "high" as const,
        description: "This task is overdue",
      },
      // In progress task (current date between start and end)
      {
        id: "3",
        name: "In Progress - Frontend Dev",
        start_datetime: subDays(now, 2).toISOString(),
        end_datetime: addDays(now, 3).toISOString(),
        progress: 45,
        assignee: "Charlie",
        priority: "medium" as const,
        description: "This task is in progress",
      },
      // Not started task (future start date)
      {
        id: "4",
        name: "Not Started - Testing Phase",
        start_datetime: addDays(now, 5).toISOString(),
        end_datetime: addDays(now, 10).toISOString(),
        progress: 0,
        assignee: "Diana",
        priority: "medium" as const,
        description: "This task hasn't started yet",
      },
      // Another overdue task
      {
        id: "5",
        name: "Overdue - Documentation",
        start_datetime: subDays(now, 6).toISOString(),
        end_datetime: subDays(now, 3).toISOString(),
        progress: 30,
        assignee: "Eric",
        priority: "low" as const,
        description: "Documentation is overdue",
      },
      // Another in progress
      {
        id: "6",
        name: "In Progress - Code Review",
        start_datetime: subDays(now, 1).toISOString(),
        end_datetime: addDays(now, 2).toISOString(),
        progress: 75,
        assignee: "Frank",
        priority: "high" as const,
        description: "Code review in progress",
      },
      // Future task
      {
        id: "7",
        name: "Not Started - Deployment",
        start_datetime: addDays(now, 8).toISOString(),
        end_datetime: addDays(now, 9).toISOString(),
        progress: 0,
        assignee: "DevOps",
        priority: "high" as const,
        description: "Future deployment",
      },
      // Another completed
      {
        id: "8",
        name: "Completed - Initial Setup",
        start_datetime: subDays(now, 10).toISOString(),
        end_datetime: subDays(now, 7).toISOString(),
        progress: 100,
        assignee: "Grace",
        priority: "low" as const,
        description: "Setup complete",
      },
    ],
    height: 500,
    viewMode: "week",
    showGrid: true,
    showDependencies: false,
    highlightWeekends: true,
    highlightToday: true,
    statusFilter: "all",
  },
};

export const HourlySchedule = () => {
  const todayStart = new Date();
  todayStart.setHours(9, 0, 0, 0);
  
  const hourlyTasks = [
    {
      id: "1",
      name: "Morning Standup",
      start_datetime: todayStart.toISOString(),
      end_datetime: addHours(todayStart, 0.5).toISOString(),
      assignee: "Team",
      color: "#4CAF50",
      progress: 100,
      dependencies: [],
    },
    {
      id: "2",
      name: "Code Review",
      start_datetime: addHours(todayStart, 0.5).toISOString(),
      end_datetime: addHours(todayStart, 2).toISOString(),
      assignee: "Alice",
      color: "#2196F3",
      progress: 75,
      dependencies: ["1"],
    },
    {
      id: "3",
      name: "Feature Development",
      start_datetime: addHours(todayStart, 2).toISOString(),
      end_datetime: addHours(todayStart, 5).toISOString(),
      assignee: "Bob",
      color: "#FF9800",
      progress: 50,
      dependencies: ["2"],
    },
    {
      id: "4",
      name: "Lunch Break",
      start_datetime: addHours(todayStart, 3).toISOString(),
      end_datetime: addHours(todayStart, 4).toISOString(),
      assignee: "Everyone",
      color: "#9E9E9E",
      progress: 0,
      dependencies: [],
    },
    {
      id: "5",
      name: "Testing Session",
      start_datetime: addHours(todayStart, 5).toISOString(),
      end_datetime: addHours(todayStart, 7).toISOString(),
      assignee: "Charlie",
      color: "#9C27B0",
      progress: 25,
      dependencies: ["3"],
    },
    {
      id: "6",
      name: "Documentation",
      start_datetime: addHours(todayStart, 7).toISOString(),
      end_datetime: addHours(todayStart, 8).toISOString(),
      assignee: "Diana",
      color: "#00BCD4",
      progress: 0,
      dependencies: ["5"],
    },
  ];
  
  return (
    <GanttChart
      tasks={hourlyTasks}
      height={400}
      viewMode="day"
      showGrid={true}
      showDependencies={true}
      highlightToday={true}
    />
  );
};