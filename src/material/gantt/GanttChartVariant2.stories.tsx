import type { Meta, StoryObj } from "@storybook/react";
import { GanttChartVariant2 } from "./GanttChartVariant2";
import { useState } from "react";
import { Box, Button, Stack, Paper, Typography } from "@mui/material";
import { addDays, addHours } from "date-fns";

const meta = {
  title: "Material/Gantt/GanttChartVariant2",
  component: GanttChartVariant2,
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
  },
} satisfies Meta<typeof GanttChartVariant2>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = new Date();
const projectTasks = [
  {
    id: "1",
    name: "Requirements Analysis",
    start_datetime: now.toISOString(),
    end_datetime: addDays(now, 3).toISOString(),
    progress: 100,
    assignee: "Alice",
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
    id: "4",
    name: "Frontend Development",
    start_datetime: addDays(now, 6).toISOString(),
    end_datetime: addDays(now, 15).toISOString(),
    progress: 40,
    assignee: "Diana",
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
    assignee: "Eric",
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
    assignee: "DevOps Team",
    color: "#F44336",
    priority: "high" as const,
    description: "Deploy to production",
    dependencies: ["8"],
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

export const InteractiveWithEvents = () => {
  const [tasks, setTasks] = useState<any[]>(projectTasks);
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);

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
      </Stack>
      
      <Box sx={{ flex: 1, display: "flex", gap: 2, minHeight: 0 }}>
        <Box sx={{ flex: 1 }}>
          <GanttChartVariant2
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
            highlightWeekends={true}
            highlightToday={true}
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
    <GanttChartVariant2
      tasks={hourlyTasks}
      height={400}
      viewMode="day"
      showGrid={true}
      showDependencies={true}
      highlightToday={true}
    />
  );
};