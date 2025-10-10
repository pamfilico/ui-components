"use client";
import React from "react";
import { Typography, Box, Container, Card, CardContent, Link } from "@mui/material";
import { Language as LanguageIcon } from "@mui/icons-material";

export interface AppMetadata {
  name: string;
  url: string;
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
}

export interface TrustedByApplicationsVariant1Props {
  apps: AppMetadata[];
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  sectionId?: string;
}

function getDomainFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

/**
 * TrustedByApplicationsVariant1 - Displays a grid of applications with metadata
 * Shows application cards with images, titles, descriptions, and favicons
 */
export const TrustedByApplicationsVariant1: React.FC<TrustedByApplicationsVariant1Props> = ({
  apps,
  title = "Trusted By Applications",
  subtitle = "These applications use our platform to manage their content across multiple languages",
  backgroundColor = "#0f0f23",
  sectionId = "trusted-by",
}) => {
  if (apps.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        py: 8,
        backgroundColor,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.5), transparent)",
        },
      }}
      id={sectionId}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{ mb: 2, fontWeight: 700, color: "white" }}
        >
          {title}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: "700px", mx: "auto" }}
        >
          {subtitle}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {apps.map((app, index) => {
            const domain = getDomainFromUrl(app.url);

            return (
              <Link
                key={index}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: "none" }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.3)",
                    },
                  }}
                >
                  {/* Open Graph Image */}
                  {app.image ? (
                    <Box
                      component="img"
                      src={app.image}
                      alt={app.title || app.name}
                      sx={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        backgroundColor: "grey.900",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "grey.900",
                      }}
                    >
                      <LanguageIcon
                        sx={{
                          fontSize: 64,
                          color: "primary.main",
                        }}
                      />
                    </Box>
                  )}

                  <CardContent sx={{ p: 3 }}>
                    {/* Favicon and Domain */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                      {app.favicon && (
                        <Box
                          component="img"
                          src={app.favicon}
                          alt=""
                          sx={{
                            width: 20,
                            height: 20,
                            mr: 1,
                            borderRadius: 0.5,
                          }}
                        />
                      )}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {domain}
                      </Typography>
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        fontSize: "1.125rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {app.title || app.name}
                    </Typography>

                    {/* Description */}
                    {app.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.875rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {app.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};
