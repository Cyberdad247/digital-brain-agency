import React, { createContext, useContext, ReactNode } from 'react';

type ChatContextType = {
  messages: string[];
  addMessage: (message: string) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = React.useState<string[]>([]);

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
