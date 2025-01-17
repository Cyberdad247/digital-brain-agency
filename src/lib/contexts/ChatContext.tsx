import { createContext, useContext, useState } from 'react';

interface ChatContextType {
  agent: string;
  setAgent: (agent: string) => void;
}

const ChatContext = createContext<ChatContextType>({
  agent: '',
  setAgent: () => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [agent, setAgent] = useState('');

  return (
    <ChatContext.Provider value={{ agent, setAgent }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
