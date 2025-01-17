import * as React from 'react';
import { Command } from 'cmdk';
import { useAgent } from './AgentContext';
import { useTheme } from 'next-themes';
import { Search } from 'lucide-react';

export function CommandMenu() {
  const { state } = useAgent();
  const { setTheme } = useTheme();

  return (
    <Command.Dialog
      label="Command Menu"
      shouldFilter={false}
      className="command-menu"
    >
      <Command.Input
        placeholder="Search commands..."
        className="command-input"
      />
      <Command.List className="command-list">
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Agents">
          {state.agents.map(agent => (
            <Command.Item
              key={agent.id}
              value={agent.name}
              onSelect={() => {
                // Handle agent selection
              }}
            >
              <div className="agent-item">
                <span>{agent.name}</span>
                <span className="department">{agent.department}</span>
              </div>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Navigation">
          <Command.Item
            value="dashboard"
            onSelect={() => {
              // Navigate to dashboard
            }}
          >
            <Search className="icon" />
            <span>Dashboard</span>
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Theme">
          <Command.Item
            value="light"
            onSelect={() => setTheme('light')}
          >
            Light Mode
          </Command.Item>
          <Command.Item
            value="dark"
            onSelect={() => setTheme('dark')}
          >
            Dark Mode
          </Command.Item>
          <Command.Item
            value="system"
            onSelect={() => setTheme('system')}
          >
            System Theme
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
