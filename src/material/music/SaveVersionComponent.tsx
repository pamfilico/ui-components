"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  KeyboardArrowUp as TransposeUpIcon,
  KeyboardArrowDown as TransposeDownIcon,
} from "@mui/icons-material";
import ReadOnlyBlockNoteViewer from "./ReadOnlyBlockNoteViewer";
import {
  transposeChordSymbol,
  parseChordSymbol,
  SHARP_NOTES,
} from "./utils";

// Calculate semitone difference between two keys
const calculateSemitoneSteps = (fromKey: string, toKey: string): number => {
  if (!fromKey || !toKey || fromKey === toKey) return 0;

  // Simple key mapping to semitones (C = 0)
  const keyToSemitone = (key: string): number => {
    // Handle common key formats: C, Cm, C#, C#m, Db, Dbm, etc.
    const root = key.replace(/m$/, ""); // Remove minor suffix

    const noteMap: { [key: string]: number } = {
      C: 0,
      "C#": 1,
      Db: 1,
      D: 2,
      "D#": 3,
      Eb: 3,
      E: 4,
      F: 5,
      "F#": 6,
      Gb: 6,
      G: 7,
      "G#": 8,
      Ab: 8,
      A: 9,
      "A#": 10,
      Bb: 10,
      B: 11,
    };

    return noteMap[root] ?? 0;
  };

  const fromSemitone = keyToSemitone(fromKey);
  const toSemitone = keyToSemitone(toKey);

  let steps = toSemitone - fromSemitone;
  if (steps < 0) steps += 12; // Handle wraparound
  if (steps > 6) steps -= 12; // Prefer smaller intervals

  console.log(`Transposing from ${fromKey} to ${toKey}: ${steps} semitones`);
  return steps;
};

// Transpose all chord symbols in BlockNote content
const transposeBlockNoteContent = (content: any[], steps: number): any[] => {
  if (!content) {
    console.log("No content provided");
    return [];
  }

  if (steps === 0) {
    console.log("No transposition needed, steps:", steps);
    // Return a deep copy even when no transposition is needed
    return JSON.parse(JSON.stringify(content));
  }

  console.log("Transposing content by", steps, "semitones");
  console.log("Original content structure:", JSON.stringify(content, null, 2));

  // Create a deep copy first to avoid mutations
  const contentCopy = JSON.parse(JSON.stringify(content));

  const transposed = contentCopy.map((block: any, blockIndex: number) => {
    console.log(`Processing block ${blockIndex}:`, block);

    if (!block.content) {
      console.log(`Block ${blockIndex} has no content`);
      return block;
    }

    const newContent = block.content.map((item: any, itemIndex: number) => {
      console.log(`  Processing item ${itemIndex}:`, item);

      if (item && typeof item === "object" && item.type === "chord") {
        const symbol = item.props?.symbol || "";
        console.log(`  Found chord symbol: "${symbol}"`);

        try {
          console.log(
            `  Attempting to transpose "${symbol}" by ${steps} steps`
          );
          console.log(
            `  transposeChordSymbol function:`,
            typeof transposeChordSymbol
          );

          const newSymbol = transposeChordSymbol(symbol, steps, true);
          console.log(`  Transposed: ${symbol} -> ${newSymbol}`);

          if (newSymbol === symbol) {
            console.warn(
              `  WARNING: No change in transposition for "${symbol}"`
            );
          }

          return {
            ...item,
            props: { ...item.props, symbol: newSymbol },
          };
        } catch (error) {
          console.error(`Error transposing chord "${symbol}":`, error);
          return item; // Return original if transposition fails
        }
      }

      return item;
    });

    return { ...block, content: newContent };
  });

  console.log("Final transposed content:", JSON.stringify(transposed, null, 2));
  return transposed;
};

export interface SaveVersionComponentProps {
  songId: string;
  originalContent: any[];
  originalKey: string;
  onSave?: (versionData: any) => void;
  showControls?: boolean;
  className?: string;
  /**
   * Custom key select component to render
   * Receives props: valueKeyId, onChange, label
   */
  keySelectComponent?: React.ReactElement;
  /**
   * Translation function for actions (save, cancel, etc)
   */
  tActions?: (key: string) => string;
  /**
   * Translation function for labels (key, etc)
   */
  tLabels?: (key: string) => string;
  /**
   * Translation function for messages
   */
  tMessages?: (key: string) => string;
}

const SaveVersionComponent: React.FC<SaveVersionComponentProps> = ({
  songId,
  originalContent,
  originalKey,
  onSave,
  showControls = true,
  className,
  keySelectComponent,
  tActions = (key) => key,
  tLabels = (key) => key,
  tMessages = (key) => key,
}) => {

  // State
  const [targetKeyId, setTargetKeyId] = useState<string | null>(null);
  const [targetKeyName, setTargetKeyName] = useState<string>(
    originalKey || "C"
  );
  const [semitoneOffset, setSemitoneOffset] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Calculate transposed content - only use semitone offset (arrow buttons)
  const transposedContent = useMemo(() => {
    console.log("=== TRANSPOSITION DEBUG ===");
    console.log("Original content:", originalContent);
    console.log("Original key:", originalKey);
    console.log("Target key (from selector):", targetKeyName);
    console.log("Semitone offset (from arrows):", semitoneOffset);

    // Only use semitone offset from arrow buttons
    const totalSteps = semitoneOffset;

    console.log("Total steps:", totalSteps);

    if (totalSteps === 0) {
      console.log("No transposition needed, returning original content");
      return originalContent;
    }

    const transposed = transposeBlockNoteContent(originalContent, totalSteps);
    console.log("Final transposed content:", transposed);
    console.log("=== END TRANSPOSITION DEBUG ===");

    return transposed;
  }, [originalContent, originalKey, targetKeyName, semitoneOffset]);

  // Initialize state
  useEffect(() => {
    setTargetKeyName(originalKey || "C");
    setTargetKeyId(null);
    setSemitoneOffset(0);

    // Test transposition function
    console.log("=== TESTING TRANSPOSITION FUNCTION ===");
    console.log("transposeChordSymbol type:", typeof transposeChordSymbol);

    try {
      const testResult = transposeChordSymbol("C", 2, true);
      console.log("Test transposition C + 2 semitones =", testResult);

      const testResult2 = transposeChordSymbol("Am", 5, true);
      console.log("Test transposition Am + 5 semitones =", testResult2);
    } catch (error) {
      console.error("Error testing transposition:", error);
    }
    console.log("=== END TESTING ===");
  }, [originalKey]);

  // Handle key selection
  const handleKeyChange = useCallback(
    (keyId: string | null, keyName?: string) => {
      setTargetKeyId(keyId);
      if (keyName) {
        setTargetKeyName(keyName);
      }
    },
    []
  );

  // Handle transpose buttons
  const handleTranspose = useCallback((steps: number) => {
    setSemitoneOffset((prev) => {
      const newOffset = prev + steps;
      // Keep offset within reasonable range
      return Math.max(-12, Math.min(12, newOffset));
    });
  }, []);

  // Open save dialog
  const handleOpenSaveDialog = () => {
    if (!transposedContent) {
      console.error("No content to save");
      return;
    }
    setShowSaveDialog(true);
  };

  // Handle save confirmation
  const handleConfirmSave = async () => {
    if (!targetKeyId) {
      console.error("Please select a key");
      return;
    }

    setSaving(true);
    try {
      // The target key is what the user selected in the dialog
      // The transposed content is based on semitone offset from arrow buttons
      const versionData = {
        blocknote_raw: JSON.stringify(transposedContent),
        key_id: targetKeyId,
        key_name: targetKeyName,
        semitone_offset: semitoneOffset,
      };

      setShowSaveDialog(false);
      await onSave?.(versionData);
    } catch (error: any) {
      console.error("Error saving version:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className={className}>
      {showControls && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Transpose from {originalKey || "C"} to:
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            gap={2}
            flexWrap="wrap"
            mb={2}
          >
            {/* Semitone controls */}
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="caption">Transpose:</Typography>
              <IconButton
                size="small"
                onClick={() => handleTranspose(-1)}
                title="Transpose down a semitone"
              >
                <TransposeDownIcon />
              </IconButton>
              <Typography
                variant="body2"
                sx={{ minWidth: 40, textAlign: "center" }}
              >
                {semitoneOffset > 0 ? `+${semitoneOffset}` : semitoneOffset}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleTranspose(1)}
                title="Transpose up a semitone"
              >
                <TransposeUpIcon />
              </IconButton>
            </Box>

            {/* Save button */}
            <Button
              onClick={handleOpenSaveDialog}
              variant="contained"
              disabled={saving}
              sx={{ ml: "auto" }}
            >
              {tActions("save")}
            </Button>
          </Box>
        </Box>
      )}

      {/* Chord Editor Preview */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Preview (read-only):
        </Typography>
        <Box
          sx={{
            height: 400,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            overflow: "auto",
          }}
        >
          <ReadOnlyBlockNoteViewer
            key={`${semitoneOffset}-${targetKeyName}-${JSON.stringify(transposedContent).substring(0, 100)}`}
            content={transposedContent}
            isDarkMode={false}
          />
        </Box>
      </Box>

      {/* Save Confirmation Dialog */}
      <Dialog
        open={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Save Version</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Original Key:</strong> {originalKey || "C"}
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ mb: 3 }}>
              <strong>Transpose Steps:</strong>{" "}
              {semitoneOffset > 0 ? `+${semitoneOffset}` : semitoneOffset}{" "}
              semitones
            </Typography>

            <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
              <strong>Select New Key:</strong>
            </Typography>
            {keySelectComponent
              ? React.cloneElement(keySelectComponent, {
                  valueKeyId: targetKeyId,
                  onChange: handleKeyChange,
                  label: tLabels("key"),
                } as any)
              : null}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            disabled={saving || !targetKeyId}
            startIcon={saving ? <CircularProgress size={16} /> : null}
          >
            {saving ? "Saving..." : tActions("save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SaveVersionComponent;
