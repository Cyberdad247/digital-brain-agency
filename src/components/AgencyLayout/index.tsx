'use client';

import * as React from 'react';
import { ThemeProvider } from '../ThemeProvider';
import { AgentProvider } from '../AgentContext';
import { CommandMenu } from '../CommandMenu';
import { useHotkeys } from 'react-hotkeys-hook';
import { AgencyLayoutProps } from './types';
import styles from './index.module.css';

export function AgencyLayout({ children, className, variant = 'default' }: AgencyLayoutProps) {
  useHotkeys('ctrl+k, cmd+k', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      metaKey: true,
    });
    document.dispatchEvent(event);
  });

  const layoutClassName = React.useMemo(() => {
    const classes = [styles.agencyLayout];
    if (className) classes.push(className);
    if (variant === 'dashboard') classes.push(styles.dashboardLayout);
    return classes.join(' ');
  }, [className, variant]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AgentProvider>
        <div className={layoutClassName}>
          <main className={styles.agencyContent}>{children}</main>
          <CommandMenu />
        </div>
      </AgentProvider>
    </ThemeProvider>
  );
}
