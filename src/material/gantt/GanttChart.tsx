"use client";

import React, { useCallback, useMemo, useState, useRef, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  EdgeChange,
  NodeChange,
  Handle,
  Position,
  NodeProps,
  EdgeProps,
  getBezierPath,
} from "reactflow";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from "@mui/icons-material";
import {
  format,
  differenceInDays,
  addDays,
  startOfDay,
  endOfDay,
  parseISO,
  isValid,
} from "date-fns";
import "reactflow/dist/style.css";

export interface GanttTask {
  id: string;
  name: string;
  start_datetime: string;
  end_datetime: string;
  progress?: number;
  assignee?: string;
  color?: string;
  dependencies?: string[];
}

export interface GanttChartProps {
  tasks: GanttTask[];
  onTaskUpdate?: (taskId: string, updates: Partial<GanttTask>) => void;
  onTaskDelete?: (taskId: string) => void;
  onDependencyAdd?: (sourceId: string, targetId: string) => void;
  onDependencyRemove?: (edgeId: string) => void;
  height?: number | string;
  readOnly?: boolean;
}

const TASK_HEIGHT = 60;
const TASK_WIDTH = 200;
const DAY_WIDTH = 30;
const HEADER_HEIGHT = 40;

interface TaskNodeData extends GanttTask {
  onUpdate?: (updates: Partial<GanttTask>) => void;
  onDelete?: () => void;
  readOnly?: boolean;
}

const TaskNode: React.FC<NodeProps<TaskNodeData>> = ({ data, id, selected }) => {
  const theme = useTheme();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDraggingTime, setIsDraggingTime] = useState<"start" | "end" | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [originalDate, setOriginalDate] = useState("");

  const [{ isDragging }, drag, preview] = useDrag({
    type: "task",
    item: { id, data },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !data.readOnly,
  });

  const [, drop] = useDrop({
    accept: "task",
    hover: (item: { id: string; data: TaskNodeData }) => {
      if (item.id !== id && !data.readOnly) {
        // Swap positions logic would go here
      }
    },
  });

  // Combine drag and drop refs
  useEffect(() => {
    if (nodeRef.current && !data.readOnly) {
      drag(drop(nodeRef.current));
    }
  }, [drag, drop, data.readOnly]);

  const handleTimeResize = useCallback(
    (e: React.MouseEvent, type: "start" | "end") => {
      if (data.readOnly) return;
      e.stopPropagation();
      setIsDraggingTime(type);
      setDragStartX(e.clientX);
      setOriginalDate(type === "start" ? data.start_datetime : data.end_datetime);
    },
    [data]
  );

  useEffect(() => {
    if (!isDraggingTime) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX;
      const daysDelta = Math.round(deltaX / DAY_WIDTH);
      
      const originalDateParsed = parseISO(originalDate);
      if (!isValid(originalDateParsed)) return;
      
      const newDate = addDays(originalDateParsed, daysDelta);
      
      if (isDraggingTime === "start") {
        const endDate = parseISO(data.end_datetime);
        if (isValid(endDate) && newDate < endDate) {
          data.onUpdate?.({ start_datetime: newDate.toISOString() });
        }
      } else {
        const startDate = parseISO(data.start_datetime);
        if (isValid(startDate) && newDate > startDate) {
          data.onUpdate?.({ end_datetime: newDate.toISOString() });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingTime(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingTime, dragStartX, originalDate, data]);

  const startDate = parseISO(data.start_datetime);
  const endDate = parseISO(data.end_datetime);
  const duration = isValid(startDate) && isValid(endDate) 
    ? differenceInDays(endDate, startDate) + 1 
    : 1;
  const taskWidth = Math.max(duration * DAY_WIDTH, TASK_WIDTH);

  return (
    <Paper
      ref={nodeRef}
      elevation={selected ? 8 : 2}
      sx={{
        position: "relative",
        width: taskWidth,
        height: TASK_HEIGHT,
        backgroundColor: data.color || theme.palette.primary.main,
        color: theme.palette.getContrastText(data.color || theme.palette.primary.main),
        borderRadius: 1,
        opacity: isDragging ? 0.5 : 1,
        cursor: data.readOnly ? "default" : "move",
        transition: "all 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: theme.palette.secondary.main,
          width: 10,
          height: 10,
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: theme.palette.secondary.main,
          width: 10,
          height: 10,
        }}
      />

      <Box sx={{ p: 1, height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {!data.readOnly && (
            <DragIcon fontSize="small" sx={{ opacity: 0.6, cursor: "grab" }} />
          )}
          <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
            {data.name}
          </Typography>
          {!data.readOnly && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                data.onDelete?.();
              }}
              sx={{ color: "inherit", p: 0 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 0.5, mt: "auto" }}>
          <Chip
            label={format(startDate, "MMM d")}
            size="small"
            variant="outlined"
            sx={{ 
              borderColor: "currentColor",
              color: "inherit",
              height: 20,
              fontSize: "0.7rem",
            }}
          />
          <Chip
            label={format(endDate, "MMM d")}
            size="small"
            variant="outlined"
            sx={{ 
              borderColor: "currentColor",
              color: "inherit",
              height: 20,
              fontSize: "0.7rem",
            }}
          />
          {data.assignee && (
            <Chip
              label={data.assignee}
              size="small"
              sx={{ 
                backgroundColor: alpha(theme.palette.background.paper, 0.2),
                color: "inherit",
                height: 20,
                fontSize: "0.7rem",
                ml: "auto",
              }}
            />
          )}
        </Box>

        {data.progress !== undefined && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: alpha(theme.palette.common.black, 0.2),
            }}
          >
            <Box
              sx={{
                width: `${data.progress}%`,
                height: "100%",
                backgroundColor: theme.palette.success.main,
              }}
            />
          </Box>
        )}
      </Box>

      {!data.readOnly && (
        <>
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 8,
              cursor: "ew-resize",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
              },
            }}
            onMouseDown={(e) => handleTimeResize(e, "start")}
          />
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 8,
              cursor: "ew-resize",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.2),
              },
            }}
            onMouseDown={(e) => handleTimeResize(e, "end")}
          />
        </>
      )}
    </Paper>
  );
};

const DependencyEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const theme = useTheme();
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          stroke: theme.palette.grey[500],
          strokeWidth: 2,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {!data?.readOnly && (
        <path
          d={edgePath}
          style={{
            strokeWidth: 20,
            stroke: "transparent",
            cursor: "pointer",
          }}
          onClick={() => data?.onRemove?.(id)}
        />
      )}
    </>
  );
};

const nodeTypes = {
  task: TaskNode,
};

const edgeTypes = {
  dependency: DependencyEdge,
};

export function GanttChart({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onDependencyAdd,
  onDependencyRemove,
  height = 600,
  readOnly = false,
}: GanttChartProps) {
  const theme = useTheme();

  const initialNodes: Node<TaskNodeData>[] = useMemo(() => {
    return tasks.map((task, index) => ({
      id: task.id,
      type: "task",
      position: {
        x: 100,
        y: HEADER_HEIGHT + index * (TASK_HEIGHT + 20),
      },
      data: {
        ...task,
        onUpdate: (updates: Partial<GanttTask>) => onTaskUpdate?.(task.id, updates),
        onDelete: () => onTaskDelete?.(task.id),
        readOnly,
      },
    }));
  }, [tasks, onTaskUpdate, onTaskDelete, readOnly]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    tasks.forEach((task) => {
      task.dependencies?.forEach((depId) => {
        edges.push({
          id: `${depId}-${task.id}`,
          source: depId,
          target: task.id,
          type: "dependency",
          data: {
            onRemove: onDependencyRemove,
            readOnly,
          },
        });
      });
    });
    return edges;
  }, [tasks, onDependencyRemove, readOnly]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!readOnly && params.source && params.target) {
        setEdges((eds) => addEdge({ ...params, type: "dependency" }, eds));
        onDependencyAdd?.(params.source, params.target);
      }
    },
    [setEdges, onDependencyAdd, readOnly]
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach((change) => {
        if (change.type === "position" && change.dragging === false && change.position) {
          const node = nodes.find((n) => n.id === change.id);
          if (node) {
            const daysMoved = Math.round((change.position.x - node.position.x) / DAY_WIDTH);
            if (daysMoved !== 0) {
              const startDate = parseISO(node.data.start_datetime);
              const endDate = parseISO(node.data.end_datetime);
              if (isValid(startDate) && isValid(endDate)) {
                const newStartDate = addDays(startDate, daysMoved);
                const newEndDate = addDays(endDate, daysMoved);
                onTaskUpdate?.(node.id, {
                  start_datetime: newStartDate.toISOString(),
                  end_datetime: newEndDate.toISOString(),
                });
              }
            }
          }
        }
      });
      onNodesChange(changes);
    },
    [nodes, onNodesChange, onTaskUpdate]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          height,
          width: "100%",
          backgroundColor: theme.palette.background.default,
          borderRadius: 1,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background gap={20} size={1} />
          <Controls />
        </ReactFlow>
      </Box>
    </DndProvider>
  );
}

export default GanttChart;