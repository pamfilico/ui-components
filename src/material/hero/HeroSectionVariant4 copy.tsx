import React from "react";
import { Box, Button, Container, Stack, Typography, Chip } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

export interface HeroContent {
  headline: string;
  subheadline: string;
  valueProposition: string;
  primaryCTA: string;
  secondaryCTA: string;
  features: string[];
  trustBadges: string[];
}

export interface HeroSectionVariant4Props {
  content: HeroContent;
  onPrimaryCTAClick?: () => void;
  onSecondaryCTAClick?: () => void;
}

const HeroSectionVariant4: React.FC<HeroSectionVariant4Props> = ({
  content,
  onPrimaryCTAClick,
  onSecondaryCTAClick,
}) => {
  return (
    <Box
      id="hero_section"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
          animation: "pulse 15s ease-in-out infinite",
        },
        "@keyframes pulse": {
          "0%, 100%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.5,
          },
        },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          spacing={4}
          alignItems="center"
          textAlign="center"
          sx={{
            position: "relative",
            zIndex: 1,
            py: { xs: 8, md: 12 },
          }}
        >
          {/* Headline */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              fontWeight: 800,
              color: "common.white",
              textShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            {content.headline}
          </Typography>

          {/* Subheadline */}
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
              color: "rgba(255, 255, 255, 0.95)",
              maxWidth: "700px",
              lineHeight: 1.6,
            }}
          >
            {content.subheadline}
          </Typography>

          {/* Value Proposition */}
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              color: "rgba(255, 255, 255, 0.85)",
              maxWidth: "600px",
            }}
          >
            {content.valueProposition}
          </Typography>

          {/* CTA Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={onPrimaryCTAClick}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                bgcolor: "common.white",
                color: "primary.main",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  bgcolor: "grey.100",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {content.primaryCTA}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={onSecondaryCTAClick}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderColor: "common.white",
                color: "common.white",
                "&:hover": {
                  borderColor: "common.white",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {content.secondaryCTA}
            </Button>
          </Stack>

          {/* Features */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 3 }}
            flexWrap="wrap"
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            {content.features.map((feature, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  color: "common.white",
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: "1.2rem" }} />
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.95rem", fontWeight: 500 }}
                >
                  {feature}
                </Typography>
              </Stack>
            ))}
          </Stack>

          {/* Trust Badges */}
          <Stack
            direction="row"
            spacing={1.5}
            flexWrap="wrap"
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            {content.trustBadges.map((badge, index) => (
              <Chip
                key={index}
                icon={<VerifiedUserIcon />}
                label={badge}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "common.white",
                  backdropFilter: "blur(10px)",
                  fontWeight: 500,
                  "& .MuiChip-icon": {
                    color: "common.white",
                  },
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSectionVariant4;
