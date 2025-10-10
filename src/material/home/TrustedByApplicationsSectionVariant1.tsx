"use client";
import React, { useEffect, useState } from "react";
import { Typography, Box, Container, Card, CardContent, Link, CircularProgress } from "@mui/material";
import { Language as LanguageIcon } from "@mui/icons-material";

interface FetchedMetadata {
  title: string;
  description?: string;
  image?: string;
  favicon: string;
}

interface AppWithMetadata {
  url: string;
  metadata: FetchedMetadata;
}

interface CachedMetadata {
  data: FetchedMetadata;
  timestamp: number;
}

export interface TrustedByApplicationsSectionVariant1Props {
  urls: string[];
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  section_id?: string;
}

function getDomainFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

const CACHE_DURATION = 1209600000; // 2 weeks in milliseconds
const CACHE_KEY_PREFIX = 'trustedby_metadata_';

function getCachedMetadata(url: string): FetchedMetadata | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY_PREFIX + url);
    if (!cached) return null;

    const parsed: CachedMetadata = JSON.parse(cached);
    const now = Date.now();

    if (now - parsed.timestamp < CACHE_DURATION) {
      return parsed.data;
    }

    localStorage.removeItem(CACHE_KEY_PREFIX + url);
    return null;
  } catch {
    return null;
  }
}

function setCachedMetadata(url: string, metadata: FetchedMetadata): void {
  if (typeof window === 'undefined') return;

  try {
    const cached: CachedMetadata = {
      data: metadata,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY_PREFIX + url, JSON.stringify(cached));
  } catch {
    // Ignore localStorage errors
  }
}

async function fetchMetadata(url: string): Promise<FetchedMetadata> {
  const cached = getCachedMetadata(url);
  if (cached) return cached;

  try {
    const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }

    const json = await response.json();
    const data = json.data || {};

    const metadata: FetchedMetadata = {
      title: data.title || new URL(url).hostname,
      description: data.description || `Visit ${new URL(url).hostname}`,
      image: data.image?.url,
      favicon: data.logo?.url || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`,
    };

    setCachedMetadata(url, metadata);
    return metadata;
  } catch (error) {
    const domain = new URL(url).hostname;
    const fallbackMetadata: FetchedMetadata = {
      title: domain,
      description: `Visit ${domain}`,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    };

    setCachedMetadata(url, fallbackMetadata);
    return fallbackMetadata;
  }
}

/**
 * TrustedByApplicationsSectionVariant1 - Displays a grid of applications with metadata
 * Shows application cards with images, titles, descriptions, and favicons
 * Fetches metadata for each URL using microlink.io API
 */
export const TrustedByApplicationsSectionVariant1: React.FC<TrustedByApplicationsSectionVariant1Props> = ({
  urls,
  title = "Trusted By Applications",
  subtitle = "These applications use our platform to manage their content across multiple languages",
  backgroundColor = "#0f0f23",
  section_id = "trusted-by",
}) => {
  const [apps, setApps] = useState<AppWithMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetadata() {
      setLoading(true);
      const appsWithMetadata = await Promise.all(
        urls.map(async (url) => ({
          url,
          metadata: await fetchMetadata(url),
        }))
      );
      setApps(appsWithMetadata);
      setLoading(false);
    }

    if (urls.length > 0) {
      loadMetadata();
    } else {
      setLoading(false);
    }
  }, [urls]);

  if (urls.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <Box
        sx={{
          py: 8,
          backgroundColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
      id={section_id}
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
                  {app.metadata.image ? (
                    <Box
                      component="img"
                      src={app.metadata.image}
                      alt={app.metadata.title}
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
                      {app.metadata.favicon && (
                        <Box
                          component="img"
                          src={app.metadata.favicon}
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
                      {app.metadata.title}
                    </Typography>

                    {/* Description */}
                    {app.metadata.description && (
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
                        {app.metadata.description}
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
