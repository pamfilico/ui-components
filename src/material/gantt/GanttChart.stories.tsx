import type { Meta, StoryObj } from "@storybook/react";
import { GanttChart } from "./GanttChart";
import { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import { addDays } from "date-fns";

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
    readOnly: {
      control: "boolean",
      description: "Whether the chart is read-only",
    },
  },
} satisfies Meta<typeof GanttChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = new Date();
const sampleTasks = [
  {
    id: "1",
    name: "Project Planning",
    start_datetime: now.toISOString(),
    end_datetime: addDays(now, 5).toISOString(),
    progress: 100,
    assignee: "John Doe",
    color: "#4CAF50",
    dependencies: [],
  },
  {
    id: "2",
    name: "Design Phase",
    start_datetime: addDays(now, 3).toISOString(),
    end_datetime: addDays(now, 10).toISOString(),
    progress: 75,
    assignee: "Jane Smith",
    color: "#2196F3",
    dependencies: ["1"],
  },
  {
    id: "3",
    name: "Development Sprint 1",
    start_datetime: addDays(now, 7).toISOString(),
    end_datetime: addDays(now, 14).toISOString(),
    progress: 50,
    assignee: "Dev Team",
    color: "#FF9800",
    dependencies: ["2"],
  },
  {
    id: "4",
    name: "Development Sprint 2",
    start_datetime: addDays(now, 14).toISOString(),
    end_datetime: addDays(now, 21).toISOString(),
    progress: 25,
    assignee: "Dev Team",
    color: "#FF9800",
    dependencies: ["3"],
  },
  {
    id: "5",
    name: "Testing & QA",
    start_datetime: addDays(now, 18).toISOString(),
    end_datetime: addDays(now, 25).toISOString(),
    progress: 0,
    assignee: "QA Team",
    color: "#9C27B0",
    dependencies: ["3", "4"],
  },
  {
    id: "6",
    name: "Deployment",
    start_datetime: addDays(now, 25).toISOString(),
    end_datetime: addDays(now, 27).toISOString(),
    progress: 0,
    assignee: "DevOps",
    color: "#F44336",
    dependencies: ["5"],
  },
];

export const Default: Story = {
  args: {
    tasks: sampleTasks,
    height: 600,
    readOnly: false,
  },
};

export const ReadOnly: Story = {
  args: {
    tasks: sampleTasks,
    height: 600,
    readOnly: true,
  },
};

export const Interactive = () => {
  const [tasks, setTasks] = useState(sampleTasks);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleTaskUpdate = (taskId: string, updates: any) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
    addLog(`Task ${taskId} updated: ${JSON.stringify(updates)}`);
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    addLog(`Task ${taskId} deleted`);
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
    addLog(`Dependency added: ${sourceId} → ${targetId}`);
  };

  const handleDependencyRemove = (edgeId: string) => {
    const [sourceId, targetId] = edgeId.split('-');
    setTasks(prev => prev.map(task => {
      if (task.id === targetId) {
        return {
          ...task,
          dependencies: task.dependencies?.filter(dep => dep !== sourceId) || [],
        };
      }
      return task;
    }));
    addLog(`Dependency removed: ${edgeId}`);
  };

  const addNewTask = () => {
    const newId = String(tasks.length + 1);
    const lastTask = tasks[tasks.length - 1];
    const startDate = lastTask 
      ? addDays(new Date(lastTask.start_datetime), 2)
      : addDays(now, 30);
    
    setTasks(prev => [...prev, {
      id: newId,
      name: `New Task ${newId}`,
      start_datetime: startDate.toISOString(),
      end_datetime: addDays(startDate, 5).toISOString(),
      progress: 0,
      assignee: "Unassigned",
      color: "#607D8B",
      dependencies: [],
    }]);
    addLog(`New task ${newId} added`);
  };

  return (
    <Box sx={{ p: 2, height: "100vh", display: "flex", flexDirection: "column" }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={addNewTask}>
          Add New Task
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => {
            setTasks(sampleTasks);
            addLog("Tasks reset to default");
          }}
        >
          Reset Tasks
        </Button>
      </Stack>
      
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <GanttChart
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onDependencyAdd={handleDependencyAdd}
          onDependencyRemove={handleDependencyRemove}
          height="100%"
        />
      </Box>
      
      <Box sx={{ mt: 2, p: 1, bgcolor: "grey.100", borderRadius: 1, maxHeight: 120, overflow: "auto" }}>
        <Box component="pre" sx={{ m: 0, fontSize: "0.85rem", fontFamily: "monospace" }}>
          {logs.length > 0 ? logs.join('\n') : "Activity log will appear here..."}
        </Box>
      </Box>
    </Box>
  );
};

export const MinimalTasks: Story = {
  args: {
    tasks: [
      {
        id: "1",
        name: "Single Task",
        start_datetime: now.toISOString(),
        end_datetime: addDays(now, 7).toISOString(),
        dependencies: [],
      },
      {
        id: "2",
        name: "Dependent Task",
        start_datetime: addDays(now, 5).toISOString(),
        end_datetime: addDays(now, 12).toISOString(),
        dependencies: ["1"],
      },
    ],
    height: 400,
  },
};

export const ComplexDependencies: Story = {
  args: {
    tasks: [
      {
        id: "1",
        name: "Foundation",
        start_datetime: now.toISOString(),
        end_datetime: addDays(now, 3).toISOString(),
        color: "#4CAF50",
        dependencies: [],
      },
      {
        id: "2a",
        name: "Module A",
        start_datetime: addDays(now, 3).toISOString(),
        end_datetime: addDays(now, 7).toISOString(),
        color: "#2196F3",
        dependencies: ["1"],
      },
      {
        id: "2b",
        name: "Module B",
        start_datetime: addDays(now, 3).toISOString(),
        end_datetime: addDays(now, 8).toISOString(),
        color: "#00BCD4",
        dependencies: ["1"],
      },
      {
        id: "2c",
        name: "Module C",
        start_datetime: addDays(now, 3).toISOString(),
        end_datetime: addDays(now, 6).toISOString(),
        color: "#009688",
        dependencies: ["1"],
      },
      {
        id: "3",
        name: "Integration",
        start_datetime: addDays(now, 8).toISOString(),
        end_datetime: addDays(now, 12).toISOString(),
        color: "#FF9800",
        dependencies: ["2a", "2b", "2c"],
      },
      {
        id: "4",
        name: "Final Review",
        start_datetime: addDays(now, 12).toISOString(),
        end_datetime: addDays(now, 14).toISOString(),
        color: "#F44336",
        dependencies: ["3"],
      },
    ],
    height: 500,
  },
};