import { useState, useEffect } from 'react';
import { useChatContext } from '../components/ChatContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useChat() {
  const { agent } = useChatContext();
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent,
          message: content,
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.response 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return { messages, sendMessage };
}
