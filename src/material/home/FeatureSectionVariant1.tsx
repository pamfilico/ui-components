"use client";
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { FeatureCardVariant1, Feature } from "./FeatureCardVariant1";

export interface FeatureSectionVariant1Props {
  title?: string;
  features: Feature[];
  section_id?: string;
}

/**
 * FeatureSectionVariant1 - Displays a grid of feature cards
 * Full-screen section with centered content and responsive grid layout
 */
export const FeatureSectionVariant1: React.FC<FeatureSectionVariant1Props> = ({
  title = "Features",
  features,
  section_id = "features",
}) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 4 },
      }}
      id={section_id}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 600, mb: { xs: 2, md: 4 } }}
      >
        {title}
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.id || index}>
            <FeatureCardVariant1 feature={feature} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
