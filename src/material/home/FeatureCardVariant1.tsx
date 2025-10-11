"use client";
import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

export interface Feature {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
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
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ pb: feature.image ? 0 : undefined }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom={!feature.image}
          sx={{ fontWeight: 600 }}
        >
          {feature.title}
        </Typography>
      </CardContent>
      {feature.image && (
        <img
          src={feature.image}
          alt={feature.title}
          style={{
            width: '100%',
            height: feature.imageHeight ? `${feature.imageHeight}px` : 'auto',
            display: 'block'
          }}
        />
      )}
      <CardContent sx={{ pt: feature.image ? 0 : undefined, flexGrow: 1 }}>
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <Typography variant="body2" color="text.secondary" component="div" sx={{ mt: 1 }}>
                {children}
              </Typography>
            ),
          }}
        >
          {feature.description}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
};
