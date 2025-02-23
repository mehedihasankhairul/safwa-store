// app/dashboard/layout.js
'use client';

import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';
import '../../public/styles/globals.css';

export function createEmotionCache() {
  return createCache({ key: 'css', prepend: true });
}

export default function DashboardLayout({ children }) {
  const [cache] = useState(() => createEmotionCache());

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(' '),
        }}
      />
    );
  });

  return (
    <html lang="en">
      <body>
        <CacheProvider value={cache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="p-6 bg-book-offwhite min-h-screen">{children}</div>
          </ThemeProvider>
        </CacheProvider>
      </body>
    </html>
  );
}

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#800000', // Maroon from your header
    },
    secondary: {
      main: '#D4A017', // Gold from your accents
    },
    background: {
      default: '#F9F6F2', // Off-white from Literary Minimalism
    },
    text: {
      primary: '#333333', // Charcoal for text
    },
  },
  typography: {
    fontFamily: [
      '"Playfair Display"', // For headings
      '"Open Sans"', // For body
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem', // Match Tailwind rounded-lg
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', // Subtle shadow
        },
      },
    },
  },
});