"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Chip,
  Typography,
} from "@mui/material";

export interface ChordSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onChordSelect: (chord: string) => void;
}

const ChordSelectionDialog: React.FC<ChordSelectionDialogProps> = ({
  open,
  onClose,
  onChordSelect
}) => {
  // Common chord progressions and chords organized by category
  const chordCategories = useMemo(() => ({
    "Major Chords": ["C", "D", "E", "F", "G", "A", "B", "C#", "D#", "F#", "G#", "A#"],
    "Minor Chords": ["Cm", "Dm", "Em", "Fm", "Gm", "Am", "Bm", "C#m", "D#m", "F#m", "G#m", "A#m"],
    "7th Chords": ["C7", "D7", "E7", "F7", "G7", "A7", "B7", "Cmaj7", "Dmaj7", "Emaj7", "Fmaj7", "Gmaj7", "Amaj7", "Bmaj7"],
    "Common Progressions": ["Am7", "Dm7", "Em7", "Fm7", "Gm7", "Cm7", "F/C", "G/B", "Am/C", "D/F#"],
    "Extended Chords": ["Cadd9", "Dsus4", "Esus2", "Fadd9", "Gsus4", "Asus2", "C6", "D9", "E11", "F13"],
  }), []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Select a Chord</DialogTitle>
      <DialogContent>
        {Object.entries(chordCategories).map(([category, chords]) => (
          <Box key={category} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              {category}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {chords.map((chord) => (
                <Chip
                  key={chord}
                  label={chord}
                  onClick={() => onChordSelect(chord)}
                  clickable
                  variant="outlined"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default ChordSelectionDialog;