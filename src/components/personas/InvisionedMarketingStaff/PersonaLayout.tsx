import { ReactNode } from 'react';
import CRMBeacon from './CRMBeacon';
import { AgentContext } from '../AgentContext';

interface PersonaLayoutProps {
  children: ReactNode;
}

export default function PersonaLayout({ children }: PersonaLayoutProps) {
  return (
    <AgentContext.Provider value="invisioned-marketing">
      <div className="grid grid-cols-[300px_1fr] h-screen">
        <aside className="border-r p-4">
          <CRMBeacon />
        </aside>
        <main className="p-4">
          {children}
        </main>
      </div>
    </AgentContext.Provider>
  );
}
