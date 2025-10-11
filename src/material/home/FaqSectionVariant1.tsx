"use client";
import React, { useState } from "react";
import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { scrollToSection } from "../../utils/scroll";

export interface FaqItem {
  id?: string;
  title: string;
  description: string;
  demo_section_id?: string | null;
  [key: string]: any;
}

export interface FaqSectionVariant1Props {
  title?: string;
  items: FaqItem[];
  section_id?: string;
  demoButtonText?: string;
  path?: string;
  is_section?: boolean;
}

/**
 * FaqSectionVariant1 - Displays an accordion-style FAQ section
 * Full-screen section with title and expandable FAQ items
 */
export const FaqSectionVariant1: React.FC<FaqSectionVariant1Props> = ({
  title = "Frequently Asked Questions",
  items,
  section_id = "faq_section",
  demoButtonText = "See Demo",
  path,
  is_section,
}) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: { xs: 4, md: 8 },
      }}
      id={section_id}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Column - Title */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h2"
              sx={{
                color: "white",
                fontWeight: 700,
                mb: { xs: 4, md: 0 },
              }}
            >
              {title}
            </Typography>
          </Grid>

          {/* Right Column - FAQs */}
          <Grid size={{ xs: 12, md: 6 }}>
            {items.map((faq, index) => (
              <Accordion
                key={faq.id || index}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                sx={{ mb: 2 }}
              >
                <AccordionSummary
                  expandIcon={<AddIcon sx={{ color: "#000000" }} />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                  sx={{ backgroundColor: "#FFFFFF" }}
                >
                  <Typography
                    sx={{ color: "#000000", fontWeight: "bold" }}
                    align="left"
                  >
                    {faq.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: "#FFFFFF" }}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                  >
                    <Typography style={{ color: "#000000" }} align="left">
                      {faq.description}
                    </Typography>
                    {faq.demo_section_id && (
                      <Box display="flex" flexDirection="row" alignItems="flex-start">
                        <Button
                          variant="contained"
                          sx={{ color: "#000000", mt: 2, mr: 2 }}
                          onClick={() => scrollToSection(faq.demo_section_id!)}
                        >
                          {demoButtonText}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
