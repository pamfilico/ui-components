"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import {
  QrCode as QrCodeIcon,
  ContentCopy as CopyIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import QRCode from "qrcode";

export interface QRCodeShareProps {
  /**
   * The URL to generate QR code for
   */
  url: string;
  /**
   * Optional title for the QR code section
   */
  title?: string;
  /**
   * Size of the QR code (default: 200)
   */
  size?: number;
  /**
   * Locale for translations (default: "en")
   */
  locale?: string;
  /**
   * Callback when URL is copied successfully
   */
  onCopySuccess?: (message: string) => void;
  /**
   * Callback when an error occurs
   */
  onError?: (message: string) => void;
}

// Translation loader
const loadTranslations = async (locale: string) => {
  try {
    const response = await fetch(`/messages/${locale}.json`);
    if (!response.ok) {
      // Fallback to English
      const fallback = await fetch('/messages/en.json');
      return await fallback.json();
    }
    return await response.json();
  } catch (err) {
    console.error("Error loading translations:", err);
    return {};
  }
};

const QRCodeShare: React.FC<QRCodeShareProps> = ({
  url,
  title,
  size = 200,
  locale = "en",
  onCopySuccess,
  onError,
}) => {
  const [translations, setTranslations] = useState<any>({});
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load translations
  useEffect(() => {
    loadTranslations(locale).then(setTranslations);
  }, [locale]);

  const t = (key: string, fallback: string = key) => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
      if (!value) return fallback;
    }
    return value || fallback;
  };

  // Generate QR code
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true);
        setError(null);

        const dataUrl = await QRCode.toDataURL(url, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        setQrCodeDataUrl(dataUrl);
      } catch (err) {
        console.error("Error generating QR code:", err);
        const errorMsg = t("QRCode.failedToGenerate", "Failed to generate QR code");
        setError(errorMsg);
        onError?.(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      generateQRCode();
    }
  }, [url, size]);

  // Copy URL to clipboard
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      const successMsg = t("QRCode.urlCopied", "URL copied to clipboard");
      onCopySuccess?.(successMsg);
    } catch (err) {
      console.error("Error copying to clipboard:", err);
      const errorMsg = t("QRCode.failedToCopy", "Failed to copy URL");
      onError?.(errorMsg);
    }
  };

  // Native share (if supported)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("QRCode.shareTitle", "Share Profile"),
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
        // Fallback to copy
        handleCopyUrl();
      }
    } else {
      // Fallback to copy
      handleCopyUrl();
    }
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Card elevation={2}>
      <CardContent sx={{ p: 4 }}>
        {title && (
          <Typography
            variant="h6"
            gutterBottom
            sx={{ mb: 3, fontWeight: 500, display: "flex", alignItems: "center", gap: 1 }}
          >
            <QrCodeIcon color="primary" />
            {title}
          </Typography>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <Typography color="text.secondary">
              {t("QRCode.generating", "Generating QR code...")}
            </Typography>
          </Box>
        ) : qrCodeDataUrl ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* QR Code Container */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 3,
                  border: 1,
                  borderColor: "divider",
                  display: "inline-block",
                }}
              >
                <Box
                  component="img"
                  src={qrCodeDataUrl}
                  alt={t("QRCode.qrCodeAlt", "QR Code")}
                  sx={{
                    width: size,
                    height: size,
                    display: "block",
                    borderRadius: 1,
                  }}
                />
              </Box>
            </Box>

            {/* Description */}
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {t("QRCode.scanToVisit", "Scan to visit profile")}
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="outlined"
                startIcon={<CopyIcon />}
                onClick={handleCopyUrl}
                sx={{ minWidth: 120 }}
              >
                {t("QRCode.copyUrl", "Copy URL")}
              </Button>

              <Button
                variant="contained"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                sx={{ minWidth: 120 }}
              >
                {t("QRCode.share", "Share")}
              </Button>
            </Box>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default QRCodeShare;
