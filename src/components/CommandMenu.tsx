'use client';

import * as React from 'react';
import { useAgent } from '@/components/AgentContext';
import { useTheme } from 'next-themes';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

type Agent = {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  department: string;
};

export function CommandMenu() {
  const { state } = useAgent();
  const { setTheme } = useTheme();
  const router = useRouter();

  return (
    <CommandDialog>
      <CommandInput placeholder="Search commands..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Agents">
          {state.agents?.map((agent: Agent) => (
            <CommandItem
              key={agent.id}
              value={agent.name}
              onSelect={() => {
                router.push(`/agents/${agent.id}`, { scroll: false });
              }}
            >
              <div className="flex items-center justify-between w-full">
                <span>{agent.name}</span>
                <span className="text-sm text-gray-500">{agent.department}</span>
              </div>
            </CommandItem>
          )) || null}
        </CommandGroup>

        <CommandGroup heading="Navigation">
          <CommandItem
            value="dashboard"
            onSelect={() => {
              router.push('/dashboard', { scroll: false });
            }}
          >
            Dashboard
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
