# GanttChart Component - Feature Documentation

## Overview

The GanttChart is a comprehensive, interactive timeline-based project management component built with React, TypeScript, and Material-UI. It provides a visual representation of tasks, their durations, dependencies, and progress over time.

## Core Features

### 1. Task Visualization
- **Timeline-based display**: Tasks are displayed as horizontal bars on a timeline grid
- **Duration representation**: Task bars span from start to end date/time
- **Progress indicator**: Visual progress bar within each task showing completion percentage (0-100%)
- **Task metadata display**: Shows task name, assignee (as avatar chip), and visual indicators
- **Priority coloring**: Tasks can have custom colors or priority-based coloring (low/medium/high)
- **Responsive positioning**: Automatic calculation of task positions based on dates and view mode

### 2. Task Management

#### Interactive Editing (when not in read-only mode)
- **Drag to move**: Click and drag entire task bars to change start/end dates while maintaining duration
- **Resize handles**: Drag left or right edges to adjust start or end dates independently
- **Real-time updates**: Visual feedback during dragging with immediate position updates
- **Constraint handling**: Prevents invalid date ranges and maintains minimum task width

#### Task Operations
- **Click handling**: Click tasks to select them and trigger custom onClick handlers
- **Delete capability**: Remove tasks through UI or programmatically
- **Update mechanism**: Modify any task property through the onTaskUpdate callback
- **Batch operations**: Support for updating multiple tasks in sequence

### 3. Dependency Management

#### Visual Dependencies
- **Arrow connections**: SVG paths with arrowheads connecting dependent tasks
- **Smart routing**: Arrows connect from parent task end to child task start
- **Interactive creation**: "Add Dependency" mode for creating new dependencies by clicking tasks
- **Dependency removal**: Click on arrows to remove dependencies (when not read-only)

#### Auto-Move Dependencies (New Feature)
- **Cascading updates**: When enabled, moving a parent task automatically shifts all dependent tasks
- **Maintains relationships**: Preserves time gaps between connected tasks
- **Multi-level support**: Handles chains of dependencies (A→B→C→D)
- **Smart calculation**: Different behavior for drag (whole task) vs resize (end date only)
- **Optional feature**: Controlled by `autoMoveDependencies` prop

### 4. View Modes and Timeline

#### Three View Modes
1. **Day View**
   - Hourly precision for task positioning
   - Shows individual days with day name and date
   - Best for short-term, detailed planning
   - Column width: 80px per day

2. **Week View** 
   - Daily precision with weekly columns
   - Shows week start dates
   - Balanced view for most projects
   - Column width: 120px per week

3. **Month View**
   - Daily precision with monthly columns
   - Shows month names and years
   - Best for long-term project overview
   - Column width: 160px per month

#### Timeline Features
- **Dynamic date range**: Automatically calculates min/max dates from tasks with buffer
- **Infinite scrolling**: Horizontal scroll through timeline
- **Column headers**: Context-appropriate date labels based on view mode
- **Grid lines**: Optional vertical grid lines for visual alignment

### 5. Visual Enhancements

#### Highlighting Options
- **Weekend highlighting**: Different background color for Saturday/Sunday columns
- **Today indicator**: Highlighted column for current date
- **Task selection**: Visual feedback for selected tasks
- **Hover effects**: Interactive hover states on tasks and UI elements

#### Visual Indicators
- **Progress bars**: LinearProgress component showing task completion
- **Priority chips**: Color-coded priority indicators (low=green, medium=orange, high=red)
- **Assignee avatars**: Chip components showing task assignees
- **Drag indicators**: Visual cues during drag operations

### 6. Navigation and Controls

#### UI Controls
- **View mode toggle**: ButtonGroup for switching between day/week/month views
- **Scroll to today**: Button to quickly navigate to current date
- **Dependency mode toggle**: Enable/disable dependency creation mode
- **Zoom controls**: Adjust timeline scale (through view modes)

#### Scrolling
- **Horizontal scroll**: Navigate through timeline
- **Programmatic scroll**: ScrollIntoView for today's date
- **Smooth scrolling**: Animated scroll transitions

### 7. Data Structure

#### GanttTask Interface
```typescript
interface GanttTask {
  id: string;                    // Unique identifier
  name: string;                   // Task display name
  start_datetime: string;         // ISO 8601 date string
  end_datetime: string;           // ISO 8601 date string
  progress?: number;              // 0-100 completion percentage
  assignee?: string;              // Person responsible
  color?: string;                 // Custom color override
  dependencies?: string[];       // Array of parent task IDs
  description?: string;           // Additional details
  priority?: "low" | "medium" | "high";  // Task priority
}
```

### 8. Component Props

#### Required Props
- `tasks: GanttTask[]` - Array of task objects to display

#### Optional Props
- `height?: number | string` - Chart height (default: 600)
- `readOnly?: boolean` - Disable all editing features
- `viewMode?: "day" | "week" | "month"` - Initial view mode
- `showGrid?: boolean` - Show vertical grid lines
- `showDependencies?: boolean` - Display dependency arrows
- `highlightWeekends?: boolean` - Highlight weekend columns
- `highlightToday?: boolean` - Highlight today's column
- `autoMoveDependencies?: boolean` - Auto-shift dependent tasks

#### Event Handlers
- `onTaskUpdate?: (taskId: string, updates: Partial<GanttTask>) => void`
- `onTaskDelete?: (taskId: string) => void`
- `onDependencyAdd?: (sourceId: string, targetId: string) => void`
- `onDependencyRemove?: (sourceId: string, targetId: string) => void`
- `onTaskClick?: (task: GanttTask) => void`

### 9. Technical Implementation

#### Technologies Used
- **React 18+**: Hooks-based functional components
- **TypeScript**: Full type safety and IntelliSense support
- **Material-UI v5**: Comprehensive UI component library
- **date-fns**: Modern date manipulation and formatting
- **SVG**: For dependency arrows and custom graphics

#### Performance Optimizations
- **useMemo**: Memoized calculations for positions and date ranges
- **useCallback**: Optimized event handlers to prevent re-renders
- **Efficient updates**: Only re-calculate affected tasks on changes
- **Virtual rendering**: (Potential future enhancement)

#### Responsive Design
- **Flexible height**: Supports fixed pixel or percentage heights
- **Scrollable container**: Handles any number of tasks
- **Adaptive column widths**: Based on view mode
- **Mobile considerations**: Touch-friendly hit targets

### 10. Styling and Theming

#### Material-UI Integration
- **Theme-aware**: Uses MUI theme colors and spacing
- **Dark mode support**: Adapts to theme mode
- **Custom styling**: sx prop support for customization
- **Component composition**: Built with MUI components

#### Visual Hierarchy
- **Z-index management**: Proper layering of grid, tasks, and dependencies
- **Consistent spacing**: 20px gap between task rows
- **Header height**: 60px for controls, 50px for timeline headers
- **Task height**: 36px standard height for all tasks

### 11. Use Cases

#### Project Management
- Software development sprints
- Construction project timelines
- Marketing campaign planning
- Event coordination

#### Resource Planning
- Team member allocation
- Equipment scheduling
- Facility booking systems
- Production planning

#### Features for Different User Roles
- **Viewers**: Read-only mode with full visualization
- **Planners**: Drag-and-drop rescheduling
- **Managers**: Dependency tracking and cascade updates
- **Analysts**: Progress tracking and timeline overview

### 12. Comparison Advantages

#### Unique Features
1. **Auto-move dependencies**: Intelligent cascade updates not found in many libraries
2. **Integrated Material-UI**: Seamless integration with MUI design system
3. **Flexible data model**: Simple yet extensible task structure
4. **Real-time interactivity**: Smooth drag/resize without lag
5. **Multiple view modes**: Easy switching between detail levels

#### Developer Experience
- **TypeScript-first**: Full type safety and autocompletion
- **Well-documented props**: Clear API with sensible defaults
- **Event-driven architecture**: Easy integration with state management
- **Modular design**: Clean separation of concerns
- **Storybook integration**: Interactive documentation and testing

### 13. Limitations and Future Enhancements

#### Current Limitations
- No resource/swimlane view
- No critical path calculation
- No task grouping/milestones
- No export functionality (PDF, image)
- No undo/redo system
- No recurring tasks
- No time tracking integration

#### Potential Enhancements
- Virtualization for large datasets
- Zoom controls beyond view modes
- Custom task renderers
- Gantt-to-calendar sync
- Collaborative editing
- Mobile touch gestures
- Keyboard navigation
- Accessibility improvements (ARIA)

## Summary

The GanttChart component provides a robust, interactive solution for timeline-based project visualization and management. Its key strengths include:

- **Modern React architecture** with hooks and TypeScript
- **Rich interactivity** with drag-and-drop and resize capabilities
- **Smart dependency handling** with auto-move functionality
- **Flexible visualization** with multiple view modes
- **Clean Material-UI integration** for consistent design
- **Extensible data model** supporting custom fields
- **Production-ready** with proper error handling and edge cases

This component is ideal for applications requiring intuitive project timeline management with real-time updates and dependency tracking.