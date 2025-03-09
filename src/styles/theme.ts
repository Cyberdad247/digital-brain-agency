export const theme = {
  colors: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    background: '#F5F8FA',
    text: '#333333',
  },
  fonts: {
    body: 'Arial, sans-serif',
    heading: 'Helvetica, sans-serif',
  },
  sizes: {
    maxWidth: '1200px',
  },
};

export const cssVariables = {
  '--background': theme.colors.background,
  '--text': theme.colors.text,
  '--primary': theme.colors.primary,
  '--font-body': theme.fonts.body,
  '--font-heading': theme.fonts.heading,
  '--max-width': theme.sizes.maxWidth,
};
