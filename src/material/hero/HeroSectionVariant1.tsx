"use client";
import React from "react";
import { Typography, Box, Container, Grid, Card, CardContent, Chip, alpha } from "@mui/material";

export interface HeroSectionTranslations {
  platformLabel: string;
  mainHeading: string;
  mainHeadingHighlight: string;
  subHeading: string;
}

export interface FeatureTranslations {
  title: string;
  description: string;
  stats: string;
}

export interface HighlightTranslations {
  label: string;
  value: string;
}

export interface Feature {
  icon: React.ReactNode;
  translations: Record<string, FeatureTranslations>;
  color: string;
}

export interface Highlight {
  icon: React.ReactNode;
  translations: Record<string, HighlightTranslations>;
}

export interface HeroSectionVariant1Props {
  translations: Record<string, HeroSectionTranslations>;
  features: Feature[];
  highlights: Highlight[];
  locale: string;
  sectionId?: string;
  background?: string;
}

export const HeroSectionVariant1: React.FC<HeroSectionVariant1Props> = ({
  translations,
  features,
  highlights,
  locale,
  sectionId = "herosection",
  background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
}) => {
  const t = translations[locale] || translations["en"] || Object.values(translations)[0];

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: { xs: 2, md: 4 },
        background,
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
      id={sectionId}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", mb: 6, mt: { xs: 4, md: 8 } }}>
          <Chip
            label={t.platformLabel}
            sx={{
              mb: 3,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.875rem",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          />
          <Typography
            variant="h1"
            gutterBottom
            sx={{
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontWeight: 800,
              color: "white",
              mb: 2,
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              lineHeight: 1.2,
            }}
          >
            {t.mainHeading}
            <br />
            <Box
              component="span"
              sx={{
                background: "linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t.mainHeadingHighlight}
            </Box>
          </Typography>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontSize: { xs: "1.25rem", md: "1.5rem" },
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.9)",
              mb: 4,
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            {t.subHeading}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              flexWrap: "wrap",
              mb: 6,
            }}
          >
            {highlights.map((highlight, index) => {
              const highlightT = highlight.translations[locale] || highlight.translations["en"] || Object.values(highlight.translations)[0];
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Box sx={{ color: "white" }}>{highlight.icon}</Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255, 255, 255, 0.8)", display: "block", lineHeight: 1 }}
                    >
                      {highlightT.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                      {highlightT.value}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => {
            const featureT = feature.translations[locale] || feature.translations["en"] || Object.values(feature.translations)[0];
            return (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-12px) scale(1.02)",
                      boxShadow: `0 20px 60px ${alpha(feature.color, 0.4)}`,
                      "& .feature-icon": {
                        transform: "scale(1.1) rotate(5deg)",
                      },
                      "&::before": {
                        opacity: 1,
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: `linear-gradient(90deg, ${feature.color}, ${alpha(
                        feature.color,
                        0.5
                      )})`,
                      opacity: 0.7,
                      transition: "opacity 0.3s ease",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      p: 4,
                    }}
                  >
                    <Box
                      className="feature-icon"
                      sx={{
                        width: 80,
                        height: 80,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${alpha(
                          feature.color,
                          0.2
                        )}, ${alpha(feature.color, 0.05)})`,
                        color: feature.color,
                        mb: 2,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Chip
                      label={featureT.stats}
                      size="small"
                      sx={{
                        mb: 2,
                        backgroundColor: alpha(feature.color, 0.1),
                        color: feature.color,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        border: `1px solid ${alpha(feature.color, 0.3)}`,
                      }}
                    />
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 700, mb: 1.5, fontSize: "1.25rem" }}
                    >
                      {featureT.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7, fontSize: "0.95rem" }}
                    >
                      {featureT.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};
