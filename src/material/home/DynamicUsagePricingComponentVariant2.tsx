"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Slider,
  Card,
  CardContent,
  IconButton,
  Chip,
  Fade,
  Stack,
  Divider,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { MessageDialogComponentVariant1 } from "../dialogs/MessageDialogComponentVariant1";
import { createTranslator } from "../../utils/translations";

// Import translation files
import enMessages from "../../../public/messages/en.json";
import elMessages from "../../../public/messages/el.json";

const translations = {
  en: enMessages,
  el: elMessages,
};

interface Resource {
  name: string;
  subtitle?: string;
  price_per_item: number;
  explanation: string;
}

interface Resources {
  [key: string]: Resource;
}

interface PricingConfig {
  minPrice: number;
  resources: Resources;
  pricing_explanation: string;
}

interface DynamicUsagePricingComponentVariant2Props {
  config: PricingConfig;
  locale: "en" | "el";
}

const DynamicUsagePricingComponentVariant2: React.FC<
  DynamicUsagePricingComponentVariant2Props
> = ({ config, locale }) => {
  const { minPrice, resources, pricing_explanation } = config;
  const translator = createTranslator(
    "DynamicUsagePricingComponentVariant1",
    locale,
    translations
  );
  const translate = (key: string) => translator.t(key);

  const initialQuantities = Object.keys(resources).reduce(
    (acc: { [key: string]: number }, key) => {
      acc[key] = 0;
      return acc;
    },
    {}
  );
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    initialQuantities
  );
  const [openExplanation, setOpenExplanation] = useState<string | null>(null);
  const [openQuickExplanation, updateOpenQuickExplanation] = useState(false);

  const handleSliderChange =
    (key: string) => (_event: Event, newValue: number | number[]) => {
      setQuantities({
        ...quantities,
        [key]: typeof newValue === "number" ? newValue : newValue[0],
      });
    };

  const resourceCost = Object.keys(quantities).reduce((total, key) => {
    return total + quantities[key] * resources[key].price_per_item;
  }, 0);
  const totalPrice = resourceCost < minPrice ? minPrice : resourceCost;

  const handleOpenDialog = (key: string) => {
    setOpenExplanation(key);
  };
  const handleCloseDialog = () => {
    setOpenExplanation(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: { xs: 2, md: 3 },
        background: (theme) =>
          theme.palette.mode === "dark"
            ? `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.primary.dark} 100%)`
            : `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
      }}
      id="pricing_section"
    >
      <Box
        sx={{
          width: { xs: "100%", md: "700px" },
          maxWidth: "100%",
        }}
      >
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography
              variant="h4"
              sx={{
                color: "common.white",
                fontWeight: 800,
                mb: 0.5,
                textShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              {translate("quick_pricing_compute")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "common.white",
                opacity: 0.95,
                mb: 1,
                fontWeight: 500,
              }}
            >
              Drag the sliders to calculate your monthly cost
            </Typography>
          </Box>
        </Fade>

        {/* Total Price Card - Placed at Top */}
        <Fade in timeout={1000}>
          <Card
            sx={{
              background: "common.white",
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
              mb: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            <CardContent sx={{ p: 4, position: "relative" }}>
              <Stack spacing={2}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: "text.secondary",
                      letterSpacing: 3,
                      fontWeight: 700,
                    }}
                  >
                    {translate("max_monthly_price")}
                  </Typography>
                  <Typography
                    variant="h1"
                    sx={{
                      color: "secondary.main",
                      fontWeight: 900,
                      fontSize: { xs: "3rem", md: "4rem" },
                      textShadow: (theme) =>
                        `0 4px 24px ${theme.palette.secondary.main}40`,
                    }}
                  >
                    €{totalPrice.toFixed(2)}
                  </Typography>
                  {resourceCost < minPrice && (
                    <Chip
                      label="Minimum charge applied"
                      size="small"
                      sx={{
                        mt: 1.5,
                        backgroundColor: "warning.light",
                        color: "warning.contrastText",
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                    }}
                  >
                    {translate("pricing_explanation")}
                  </Typography>
                  <IconButton
                    onClick={() => updateOpenQuickExplanation(true)}
                    size="small"
                    sx={{
                      color: "secondary.main",
                      "&:hover": {
                        backgroundColor: "secondary.light",
                      },
                    }}
                  >
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Fade>

        {/* Resource Cards */}
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          {Object.keys(resources).map((key, index) => (
            <Fade in timeout={1000 + index * 100} key={key}>
              <Card
                sx={{
                  background: "common.white",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: "secondary.main" }}
                        >
                          {resources[key].name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(key)}
                          sx={{
                            color: "secondary.main",
                            "&:hover": { backgroundColor: "secondary.light" },
                          }}
                        >
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      {resources[key]?.subtitle && (
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", mt: 0.5 }}
                        >
                          {resources[key].subtitle}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 800,
                          color: "primary.main",
                          display: "flex",
                          alignItems: "baseline",
                          gap: 0.5,
                        }}
                      >
                        {quantities[key]}
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          units
                        </Typography>
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                      >
                        {resources[key].price_per_item}€ per unit
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ px: 1 }}>
                    <Slider
                      value={quantities[key]}
                      onChange={handleSliderChange(key)}
                      aria-labelledby={`${key}-slider`}
                      valueLabelDisplay="auto"
                      step={1}
                      marks={[
                        { value: 0, label: "0" },
                        { value: 50, label: "50" },
                        { value: 100, label: "100" },
                      ]}
                      min={0}
                      max={100}
                      sx={{
                        color: "secondary.main",
                        height: 8,
                        "& .MuiSlider-thumb": {
                          width: 24,
                          height: 24,
                          backgroundColor: "common.white",
                          border: "4px solid currentColor",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          "&:hover, &.Mui-focusVisible": {
                            boxShadow: (theme) =>
                              `0 0 0 10px ${theme.palette.secondary.main}33, 0 2px 8px rgba(0,0,0,0.2)`,
                          },
                        },
                        "& .MuiSlider-track": {
                          height: 8,
                          borderRadius: 4,
                        },
                        "& .MuiSlider-rail": {
                          height: 8,
                          borderRadius: 4,
                          opacity: 0.2,
                        },
                        "& .MuiSlider-mark": {
                          display: "none",
                        },
                        "& .MuiSlider-valueLabel": {
                          backgroundColor: "secondary.main",
                          fontWeight: 700,
                        },
                      }}
                    />
                  </Box>

                  {quantities[key] > 0 && (
                    <Fade in>
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          background: (theme) =>
                            `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                          borderRadius: 2,
                          boxShadow: (theme) =>
                            `0 2px 12px ${theme.palette.secondary.main}40`,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ color: "common.white", fontWeight: 700 }}
                        >
                          Subtotal: €
                          {(
                            quantities[key] * resources[key].price_per_item
                          ).toFixed(2)}
                        </Typography>
                      </Box>
                    </Fade>
                  )}
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Stack>
      </Box>

      {/* Dialogs */}
      <MessageDialogComponentVariant1
        open={openExplanation !== null}
        onClose={handleCloseDialog}
        title={
          openExplanation
            ? `${resources[openExplanation].name} Explanation`
            : ""
        }
        message={openExplanation ? resources[openExplanation].explanation : ""}
        useMarkdown={false}
        locale={locale}
      />

      <MessageDialogComponentVariant1
        open={openQuickExplanation}
        onClose={() => updateOpenQuickExplanation(false)}
        message={pricing_explanation}
        useMarkdown={true}
        locale={locale}
      />
    </Box>
  );
};

export { DynamicUsagePricingComponentVariant2 };
export type { DynamicUsagePricingComponentVariant2Props, PricingConfig, Resource, Resources };
