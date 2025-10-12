"use client";

import React, { useMemo, Component, ReactNode } from "react";
import { Box, Typography, Container } from "@mui/material";
import {
  BlockNoteSchema,
  defaultInlineContentSpecs,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { Chord } from "./ChordEditorComponent";

// Error Boundary for BlockNote
class BlockNoteErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('BlockNote Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Unable to display BlockNote content
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Create a schema that includes chord inline content (reuse from ChordEditorComponent)
const useChordSchema = () =>
  useMemo(
    () =>
      BlockNoteSchema.create({
        inlineContentSpecs: {
          ...defaultInlineContentSpecs,
          chord: Chord,
        },
      }),
    []
  );

interface ReadOnlyBlockNoteViewerProps {
  /**
   * BlockNote JSON content to display
   */
  content: any;
  /**
   * Whether to use dark mode styling
   */
  isDarkMode?: boolean;
}

const ReadOnlyBlockNoteViewer: React.FC<ReadOnlyBlockNoteViewerProps> = ({
  content,
  isDarkMode = true,
}) => {
  const schema = useChordSchema();

  // Parse content safely and provide fallback
  const parsedContent = useMemo(() => {
    try {
      // Handle empty or null content
      if (!content || content === '{}' || content === '' || content === 'null') {
        return [
          {
            type: "paragraph",
            content: "No content available"
          }
        ];
      }

      let parsed;

      // Parse string content
      if (typeof content === 'string') {
        parsed = JSON.parse(content);
      } else {
        parsed = content;
      }

      // Handle object with content property (nested structure)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        if (parsed.content && Array.isArray(parsed.content)) {
          parsed = parsed.content;
        } else {
          // Try to convert object to paragraph
          return [
            {
              type: "paragraph",
              content: JSON.stringify(parsed)
            }
          ];
        }
      }

      // Validate that parsed content is an array
      if (!Array.isArray(parsed)) {
        console.warn('BlockNote content is not an array:', parsed);
        return [
          {
            type: "paragraph",
            content: "Invalid content format"
          }
        ];
      }

      // Ensure we have at least one block
      if (parsed.length === 0) {
        return [
          {
            type: "paragraph",
            content: ""
          }
        ];
      }

      // Validate each block has required structure
      const validatedContent = parsed.map((block, index) => {
        if (!block || typeof block !== 'object') {
          return {
            type: "paragraph",
            content: `Invalid block ${index + 1}`
          };
        }

        // Ensure block has type
        if (!block.type) {
          return {
            type: "paragraph",
            content: block.content || `Block ${index + 1}`
          };
        }

        return block;
      });

      return validatedContent;

    } catch (error) {
      console.error('Failed to parse BlockNote content:', error, 'Content:', content);
      return [
        {
          type: "paragraph",
          content: "Error: Invalid BlockNote content"
        }
      ];
    }
  }, [content]);

  // Create editor (hooks must be called unconditionally)
  const editor = useCreateBlockNote({
    schema,
    initialContent: parsedContent,
    editable: false, // Make it read-only
  });

  // Ensure editor is non-editable after creation
  React.useEffect(() => {
    if (editor) {
      editor.isEditable = false;
    }
  }, [editor]);

  return (
    <Box
      sx={{
        height: '100%',
        overflow: 'auto',
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        '& .bn-container': {
          minHeight: '100%',
          backgroundColor: isDarkMode ? '#1a1a1a' : undefined,
        },
        '& .bn-editor': {
          backgroundColor: isDarkMode ? '#1a1a1a' : undefined,
          color: isDarkMode ? '#e0e0e0' : undefined,
        },
        '& .bn-block': {
          color: isDarkMode ? '#e0e0e0' : undefined,
        },
        // Hide all interactive elements for read-only mode
        '& .bn-side-menu': {
          display: 'none',
        },
        '& .bn-formatting-toolbar': {
          display: 'none',
        },
        '& .bn-slash-menu': {
          display: 'none',
        },
        // Make content truly read-only
        '& .bn-editor *': {
          userSelect: 'text !important',
          pointerEvents: 'none !important',
        },
        '& .bn-editor': {
          cursor: 'default !important',
        },
        // Allow text selection but prevent editing
        '& .bn-block': {
          pointerEvents: 'none !important',
        },
      }}
    >
      <Container maxWidth="md" sx={{ width: '100%', p: 0 }}>
        <BlockNoteErrorBoundary>
          <BlockNoteView
            key={`readonly-${JSON.stringify(parsedContent).slice(0, 50)}`} // Force re-render
            editor={editor}
            formattingToolbar={false}  // No toolbar
            sideMenu={false}          // No side menu
            slashMenu={false}         // No slash menu
            editable={false}          // Explicitly set editable prop
          />
        </BlockNoteErrorBoundary>
      </Container>
    </Box>
  );
};

export default ReadOnlyBlockNoteViewer;