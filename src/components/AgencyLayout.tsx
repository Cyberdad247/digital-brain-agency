import * as React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { AgentProvider } from './AgentContext';
import { CommandMenu } from './CommandMenu';
import { useHotkeys } from 'react-hotkeys-hook';

interface AgencyLayoutProps {
  children: React.ReactNode;
}

export function AgencyLayout({ children }: AgencyLayoutProps) {
  // Add keyboard shortcut for command menu
  useHotkeys('ctrl+k, cmd+k', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      metaKey: true,
    });
    document.dispatchEvent(event);
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AgentProvider>
        <div className="agency-layout">
          <main className="agency-content">
            {children}
          </main>
          <CommandMenu />
        </div>
      </AgentProvider>
    </ThemeProvider>
  );
}
