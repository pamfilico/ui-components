"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Slider,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Markdown from "react-markdown";

interface Resource {
  name: string;
  subtitle?: string;
  price_per_item: number;
  explanation: string;
}

interface Resources {
  [key: string]: Resource;
}

interface Router {
  push: (path: string) => void;
}

interface TranslationFunction {
  (key: string): string;
}

interface GenericPricingSectionProps {
  minPrice: number;
  resources: Resources;
  pricing_explanation: string;
  router?: Router;
  t?: TranslationFunction;
}

const GenericPricingSection: React.FC<GenericPricingSectionProps> = ({
  minPrice,
  resources,
  pricing_explanation,
  router,
  t,
}) => {
  const fallbackTranslations: { [key: string]: string } = {
    "pricing.quick_pricing_compute": "Quick Pricing Compute",
    "pricing.max_monthly_price": "Max Monthly Price",
    "pricing.see_terms": "See Terms",
    "pricing.pricing_explanation": "Quick Explanation",
  };
  const translate = (key: string): string =>
    (t && t(key)) || fallbackTranslations[key] || "Missing Translation";

  const initialQuantities = Object.keys(resources).reduce((acc: { [key: string]: number }, key) => {
    acc[key] = 0;
    return acc;
  }, {});
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(initialQuantities);
  // State to track which resource's explanation dialog is open.
  const [openExplanation, setOpenExplanation] = useState<string | null>(null);
  const [openQuickExplanation, updateOpenQuickExplanation] = useState(false);

  // Update quantity when slider value changes.
  const handleSliderChange = (key: string) => (_event: Event, newValue: number | number[]) => {
    setQuantities({
      ...quantities,
      [key]: typeof newValue === 'number' ? newValue : newValue[0],
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
          {translate("pricing.quick_pricing_compute")}
          {t && router && (
            <Button onClick={() => router.push("/terms")}>
              {translate("pricing.see_terms")}
            </Button>
          )}
        </Typography>

        <Box sx={{ mt: 2 }}>
          {Object.keys(resources).map((key) => (
            <Box key={key} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ flex: '1 1 60%' }}>
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
                <Box sx={{ flex: '0 0 auto', minWidth: '80px', textAlign: 'right' }}>
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
            {translate("pricing.max_monthly_price")}: {totalPrice.toFixed(2)} €
          </Typography>
        </Box>

        {/* Pricing Explanation */}
        <Box
          sx={{
            // mt: 4,
            p: 2,
            // border: "1px solid",
            // borderColor: "divider",
            // borderRadius: 1,
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            {translate("pricing.pricing_explanation")}:
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
      <Dialog open={openExplanation !== null} onClose={handleCloseDialog}>
        <DialogTitle>
          {openExplanation ? resources[openExplanation].name : ""} Explanation
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary">
            {openExplanation ? resources[openExplanation].explanation : ""}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Resource-specific Explanation Dialog */}
      <Dialog
        open={openQuickExplanation}
        onClose={() => updateOpenQuickExplanation(false)}
      >
        {/* <DialogTitle>
          {openExplanation ? resources[openExplanation].name : ""} Explanation
        </DialogTitle> */}
        <DialogContent dividers>
          <Markdown>{pricing_explanation}</Markdown>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => updateOpenQuickExplanation(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export { GenericPricingSection };
export type { GenericPricingSectionProps, Resource, Resources };
