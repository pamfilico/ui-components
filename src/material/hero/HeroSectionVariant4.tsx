"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Chip,
  Stack,
  Rating,
  Avatar,
  AvatarGroup,
  useTheme,
  useMediaQuery,
  keyframes,
  Fade,
  Grow,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import GroupsIcon from "@mui/icons-material/Groups";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export interface WhyChooseFeature {
  title: string;
  description: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  valueProposition: string;
  primaryCTA: string;
  secondaryCTA: string;
  features: string[];
  trustBadges: string[];
  whyChooseTitle: string;
  whyChooseFeatures: WhyChooseFeature[];
}

export interface HeroSectionVariant4Props {
  content: HeroContent;
  onPrimaryCTAClick?: () => void;
  onSecondaryCTAClick?: () => void;
  showPrimaryBtn?: boolean;
  showSecondaryBtn?: boolean;
}

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const slideInLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const HeroSectionVariant4: React.FC<HeroSectionVariant4Props> = ({
  content,
  onPrimaryCTAClick = () => {},
  onSecondaryCTAClick = () => {},
  showPrimaryBtn = true,
  showSecondaryBtn = true,
}) => {
  const {
    headline,
    subheadline,
    valueProposition,
    primaryCTA,
    secondaryCTA,
    features,
    trustBadges,
    whyChooseTitle,
    whyChooseFeatures,
  } = content;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [timeLeft, setTimeLeft] = useState({
    hours: 48,
    minutes: 0,
    seconds: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          return { hours: 48, minutes: 0, seconds: 0 };
        }

        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }

        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const avatarUrls = [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=2",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=4",
    "https://i.pravatar.cc/150?img=5",
  ];

  return (
    <Box
      id="hero_section"
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        // Add padding-top to push content below fixed header
        pt: { xs: "calc(64px + 2rem)", sm: "calc(64px + 3rem)", md: "calc(64px + 4rem)" },
        pb: { xs: 4, sm: 6, md: 8 },
      }}
    >
      {/* Animated geometric shapes background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            width: "200%",
            height: "200%",
            top: "-50%",
            left: "-50%",
            background: `radial-gradient(circle at 20% 80%, ${alpha("#f093fb", 0.15)} 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, ${alpha("#f5576c", 0.15)} 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, ${alpha("#4facfe", 0.1)} 0%, transparent 50%)`,
            animation: "float 20s ease-in-out infinite",
          },
          "@keyframes float": {
            "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
            "33%": { transform: "translate(30px, -30px) rotate(120deg)" },
            "66%": { transform: "translate(-20px, 20px) rotate(240deg)" },
          },
        }}
      />

      {/* Mesh gradient overlay for depth */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(180deg, transparent 0%, ${alpha("#000", 0.2)} 100%)`,
          zIndex: 1,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, sm: 3, md: 4 },
            alignItems: "center",
          }}
        >
          <Box sx={{ flex: { md: 7 }, width: "100%" }}>
            {false && (
              <Fade in={isVisible} timeout={500}>
                <Box
                  sx={{
                    display: "inline-block",
                    mb: 3,
                    animation: `${pulse} 2s infinite`,
                  }}
                >
                  <Chip
                    icon={<LocalOfferIcon />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          Limited Time Offer
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            bgcolor: alpha(theme.palette.common.white, 0.2),
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 16 }} />
                          <Typography variant="caption" fontWeight="bold">
                            {String(timeLeft.hours).padStart(2, "0")}:
                            {String(timeLeft.minutes).padStart(2, "0")}:
                            {String(timeLeft.seconds).padStart(2, "0")}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    color="error"
                    sx={{
                      height: "auto",
                      py: 0.5,
                      "& .MuiChip-label": { px: 1 },
                    }}
                  />
                </Box>
              </Fade>
            )}

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3.5rem" },
                fontWeight: 800,
                color: theme.palette.common.white,
                mb: { xs: 1.5, md: 2 },
                animation: isVisible ? `${fadeInUp} 0.8s ease-out` : "none",
                lineHeight: { xs: 1.1, md: 1.2 },
                // Better text readability on mobile
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {headline}
            </Typography>

            <Typography
              variant={isMobile ? "body1" : "h5"}
              sx={{
                color: alpha(theme.palette.common.white, 0.9),
                mb: { xs: 2, md: 3 },
                animation: isVisible
                  ? `${fadeInUp} 0.8s ease-out 0.2s both`
                  : "none",
                fontWeight: 400,
                lineHeight: 1.5,
                fontSize: { xs: "0.95rem", sm: "1.125rem", md: "1.5rem" },
                // Better text readability on mobile
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              {subheadline}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 2 },
                mb: { xs: 2, md: 3 },
                animation: isVisible
                  ? `${slideInLeft} 0.8s ease-out 0.4s both`
                  : "none",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                // Better spacing on mobile
                px: { xs: 0.5, md: 0 },
              }}
            >
              <TrendingUpIcon
                sx={{
                  color: theme.palette.success.light,
                  fontSize: { xs: 24, sm: 32 },
                }}
              />
              <Typography
                variant={isMobile ? "body1" : "h6"}
                sx={{
                  color: theme.palette.success.light,
                  fontWeight: 600,
                  fontSize: { xs: "0.95rem", sm: "1.125rem", md: "1.25rem" },
                }}
              >
                {valueProposition}
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2 }}
              sx={{ mb: 4 }}
              flexWrap="wrap"
            >
              {(isMobile ? features.slice(0, 2) : features).map(
                (feature, index) => (
                  <Grow
                    key={index}
                    in={isVisible}
                    timeout={800}
                    style={{
                      transformOrigin: "left center",
                      transitionDelay: `${600 + index * 100}ms`,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CheckCircleIcon
                        sx={{
                          color: theme.palette.success.light,
                          fontSize: 20,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: alpha(theme.palette.common.white, 0.9),
                          whiteSpace: "nowrap",
                        }}
                      >
                        {feature}
                      </Typography>
                    </Box>
                  </Grow>
                )
              )}
            </Stack>

            {(showPrimaryBtn || showSecondaryBtn) && (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1.5, sm: 2 }}
                sx={{ mb: { xs: 3, md: 4 } }}
              >
                {showPrimaryBtn && (
                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    onClick={onPrimaryCTAClick}
                    endIcon={!isMobile && <ArrowForwardIcon />}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      color: theme.palette.common.white,
                      px: { xs: 2.5, sm: 4 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: "0.9rem", sm: "1.1rem" },
                      fontWeight: 700,
                      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      animation: isVisible ? `${pulse} 2s infinite` : "none",
                      // Full width on mobile for easier tapping
                      width: { xs: "100%", sm: "auto" },
                      minHeight: { xs: "48px", sm: "auto" }, // Minimum touch target size
                      "&:hover": {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        transform: "translateY(-2px)",
                        boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                      },
                      transition: "all 0.3s ease",
                      boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  >
                    {primaryCTA}
                  </Button>
                )}
                {showSecondaryBtn && (
                  <Button
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    onClick={onSecondaryCTAClick}
                    sx={{
                      borderColor: theme.palette.common.white,
                      color: theme.palette.common.white,
                      borderWidth: 2,
                      px: { xs: 2.5, sm: 4 },
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: "0.9rem", sm: "1.1rem" },
                      fontWeight: 600,
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                      // Full width on mobile for easier tapping
                      width: { xs: "100%", sm: "auto" },
                      minHeight: { xs: "48px", sm: "auto" }, // Minimum touch target size
                      "&:hover": {
                        bgcolor: alpha(theme.palette.common.white, 0.15),
                        borderColor: theme.palette.common.white,
                        borderWidth: 2,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {secondaryCTA}
                  </Button>
                )}
              </Stack>
            )}

            <Box
              sx={{
                display: "flex",
                gap: { xs: 2, sm: 3 },
                flexWrap: "wrap",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
              }}
            >
              {false && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AvatarGroup max={4}>
                    {avatarUrls.map((url, index) => (
                      <Avatar
                        key={index}
                        src={url}
                        sx={{
                          width: 32,
                          height: 32,
                          border: `2px solid ${theme.palette.common.white}`,
                        }}
                      />
                    ))}
                  </AvatarGroup>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: alpha(theme.palette.common.white, 0.7) }}
                    >
                      Join us today
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ color: theme.palette.common.white }}
                    >
                      Get started free
                    </Typography>
                  </Box>
                </Box>
              )}

              {false && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Rating
                    value={5}
                    readOnly
                    precision={0.1}
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: theme.palette.warning.light,
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.common.white }}
                  >
                    Premium Features
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ flex: { md: 5 }, width: "100%", mt: { xs: 3, md: 0 } }}>
            <Box
              sx={{
                position: "relative",
                animation: isVisible
                  ? `${fadeInUp} 1s ease-out 0.6s both`
                  : "none",
              }}
            >
              <Box
                sx={{
                  bgcolor: alpha(theme.palette.common.white, 0.1),
                  backdropFilter: "blur(10px)",
                  borderRadius: { xs: 2, md: 3 },
                  p: { xs: 2, sm: 3, md: 4 },
                  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                  // Better mobile styling
                  mx: { xs: 1, sm: 0 }, // Small margin on mobile
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.common.white,
                    mb: 3,
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  {whyChooseTitle}
                </Typography>

                <Stack spacing={3}>
                  {whyChooseFeatures.map((item, index) => {
                    const iconMap = [
                      <SpeedIcon key="speed" />,
                      <SecurityIcon key="security" />,
                      <GroupsIcon key="groups" />,
                      <TrendingUpIcon key="trending" />,
                    ];
                    return (
                      <Grow
                        key={index}
                        in={isVisible}
                        timeout={1000}
                        style={{
                          transformOrigin: "left center",
                          transitionDelay: `${800 + index * 150}ms`,
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Box
                            sx={{
                              color: theme.palette.success.light,
                              minWidth: 40,
                              height: 40,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: alpha(theme.palette.success.light, 0.1),
                              borderRadius: 2,
                            }}
                          >
                            {iconMap[index % iconMap.length]}
                          </Box>
                          <Box>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              sx={{ color: theme.palette.common.white, mb: 0.5 }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: alpha(theme.palette.common.white, 0.7),
                              }}
                            >
                              {item.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Grow>
                    );
                  })}
                </Stack>

                <Box
                  sx={{
                    mt: 4,
                    pt: 3,
                    borderTop: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    flexWrap="wrap"
                  >
                    {trustBadges.map((badge, index) => (
                      <Chip
                        key={index}
                        label={badge}
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.common.white, 0.1),
                          color: theme.palette.common.white,
                          border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSectionVariant4;
