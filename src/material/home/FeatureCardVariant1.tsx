"use client";
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export interface Feature {
  id: string;
  title: string;
  description: string;
  [key: string]: any;
}

export interface FeatureCardVariant1Props {
  feature: Feature;
}

/**
 * FeatureCardVariant1 - Displays a single feature card with title and description
 * Features hover animation with transform and box-shadow effects
 */
export const FeatureCardVariant1: React.FC<FeatureCardVariant1Props> = ({ feature }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          {feature.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {feature.description}
        </Typography>
      </CardContent>
    </Card>
  );
};
