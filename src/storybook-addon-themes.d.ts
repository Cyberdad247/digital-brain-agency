declare module '@storybook/addon-themes' {
  import type { DecoratorFn } from '@storybook/react';
  
  export interface ThemeConfig {
    default: string;
    themes: Record<string, unknown>;
  }

  export const withThemesProvider: (config: ThemeConfig) => DecoratorFn;
}
