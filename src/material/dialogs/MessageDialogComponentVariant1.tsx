"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import Markdown from "react-markdown";
import { createTranslator } from "../../utils/translations";

// Import translation files
import enMessages from "../../../public/messages/en.json";
import elMessages from "../../../public/messages/el.json";

const translations = {
  en: enMessages,
  el: elMessages,
};

interface MessageDialogComponentVariant1Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  useMarkdown?: boolean;
  closeButtonText?: string;
  locale?: "en" | "el";
}

const MessageDialogComponentVariant1: React.FC<MessageDialogComponentVariant1Props> = ({
  open,
  onClose,
  title,
  message,
  useMarkdown = false,
  closeButtonText,
  locale = "en",
}) => {
  const translator = createTranslator(
    "MessageDialogComponentVariant1",
    locale,
    translations
  );
  const defaultCloseText = translator.t("close");
  const finalCloseText = closeButtonText || defaultCloseText;
  return (
    <Dialog open={open} onClose={onClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent dividers>
        {useMarkdown ? (
          <Markdown>{message}</Markdown>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{finalCloseText}</Button>
      </DialogActions>
    </Dialog>
  );
};

export { MessageDialogComponentVariant1 };
export type { MessageDialogComponentVariant1Props };
