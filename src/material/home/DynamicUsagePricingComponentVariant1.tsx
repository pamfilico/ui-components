"use client";
import React, { useState } from "react";
import { Box, Typography, Slider, Paper, IconButton } from "@mui/material";
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

interface DynamicUsagePricingComponentVariant1Props {
  config: PricingConfig;
  locale: "en" | "el";
}

const DynamicUsagePricingComponentVariant1: React.FC<
  DynamicUsagePricingComponentVariant1Props
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
  // State to track which resource's explanation dialog is open.
  const [openExplanation, setOpenExplanation] = useState<string | null>(null);
  const [openQuickExplanation, updateOpenQuickExplanation] = useState(false);

  // Update quantity when slider value changes.
  const handleSliderChange =
    (key: string) => (_event: Event, newValue: number | number[]) => {
      setQuantities({
        ...quantities,
        [key]: typeof newValue === "number" ? newValue : newValue[0],
      });
    };

  // Calculate the cost for the resources used.
  const resourceCost = Object.keys(quantities).reduce((total, key) => {
    return total + quantities[key] * resources[key].price_per_item;
  }, 0);
  // Use the minimum price if resourceCost is less than minPrice.
  const totalPrice = resourceCost < minPrice ? minPrice : resourceCost;

  // Handlers for opening/closing the explanation dialog.
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
        minHeight: "100vh",
        padding: { xs: 2, md: 4 },
      }}
      id="pricing_section"
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 3 },
          width: { xs: "100%", sm: 500 },
          margin: "auto",
        }}
      >
        <Typography variant="h5" gutterBottom textAlign="center">
          {translate("quick_pricing_compute")}
        </Typography>

        <Box sx={{ mt: 2 }}>
          {Object.keys(resources).map((key) => (
            <Box key={key} sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Box sx={{ flex: "1 1 60%" }}>
                  <Typography id={`${key}-slider`} gutterBottom>
                    {resources[key].name} ({quantities[key]})
                  </Typography>
                  {resources[key]?.subtitle && (
                    <Typography
                      id={`${key}-slider`}
                      gutterBottom
                      variant="body2"
                    >
                      {resources[key].subtitle}
                    </Typography>
                  )}
                </Box>
                <Box>
                  <IconButton
                    onClick={() => handleOpenDialog(key)}
                    aria-label={`help ${key}`}
                    size="small"
                  >
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    flex: "0 0 auto",
                    minWidth: "80px",
                    textAlign: "right",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {resources[key].price_per_item} €/unit
                  </Typography>
                </Box>
              </Box>
              <Slider
                value={quantities[key]}
                onChange={handleSliderChange(key)}
                aria-labelledby={`${key}-slider`}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={100} // For example: up to 100 units.
              />
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="h6">
            {translate("max_monthly_price")}: {totalPrice.toFixed(2)} €
          </Typography>
        </Box>

        {/* Pricing Explanation */}
        <Box
          sx={{
            p: 2,
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            {translate("pricing_explanation")}:
          </Typography>
          <IconButton
            onClick={() => updateOpenQuickExplanation(true)}
            size="small"
          >
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>

      {/* Resource-specific Explanation Dialog */}
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

      {/* Pricing Explanation Dialog */}
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

export { DynamicUsagePricingComponentVariant1 };
export type { DynamicUsagePricingComponentVariant1Props, PricingConfig, Resource, Resources };
