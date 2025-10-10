import type { Preview } from '@storybook/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';

// Initialize MSW with correct service worker path
// Detect if running on GitHub Pages by checking the pathname
const isGitHubPages = typeof window !== 'undefined' && window.location.pathname.startsWith('/ui-components');
initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: isGitHubPages ? '/ui-components/mockServiceWorker.js' : '/mockServiceWorker.js',
  },
});

// Color palette extracted from hero section gradients
const brandColors = {
  indigo: "#6366f1", // Primary brand color
  purple: "#a855f7", // Secondary gradient color
  violet: "#8b5cf6", // Mid gradient color
  pink: "#ec4899", // Accent pink
  amber: "#f59e0b", // Accent amber
};

// Create Material-UI theme with brand colors
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: brandColors.indigo,
      light: "#818cf8",
      dark: "#4338ca",
    },
    secondary: {
      main: brandColors.purple,
      light: "#c084fc",
      dark: "#7c3aed",
    },
    error: {
      main: "#ff6b6b",
    },
    success: {
      main: "#4caf50",
    },
    info: {
      main: brandColors.violet,
    },
    warning: {
      main: brandColors.amber,
    },
    background: {
      default: "#000000",
      paper: "#0a0a0a",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          background: `linear-gradient(135deg, ${brandColors.indigo} 0%, ${brandColors.violet} 50%, ${brandColors.purple} 100%)`,
          boxShadow: `0 8px 32px rgba(99, 102, 241, 0.3)`,
          "&:hover": {
            background: `linear-gradient(135deg, ${brandColors.indigo} 0%, ${brandColors.violet} 50%, ${brandColors.purple} 100%)`,
            boxShadow: `0 12px 40px rgba(99, 102, 241, 0.4)`,
            transform: "translateY(-2px)",
          },
        },
        outlined: {
          borderColor: `rgba(99, 102, 241, 0.5)`,
          color: brandColors.indigo,
          "&:hover": {
            borderColor: brandColors.indigo,
            backgroundColor: `rgba(99, 102, 241, 0.1)`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-outlined": {
            borderColor: `rgba(99, 102, 241, 0.3)`,
            "&:hover": {
              backgroundColor: `rgba(99, 102, 241, 0.1)`,
              borderColor: `rgba(99, 102, 241, 0.5)`,
            },
          },
        },
      },
    },
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster position="top-center" />
        <Story />
      </ThemeProvider>
    ),
  ],
  loaders: [mswLoader],
};

export default preview;
