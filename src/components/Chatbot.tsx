import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import MessageParser from './ChatbotMessageParser';
import ActionProvider, { ChatState } from './ChatbotActionProvider';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatState>({ messages: [] });
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage = {
        id: Math.random().toString(),
        type: 'user',
        message: inputValue
      };
      
      setMessages(prev => ({
        messages: [...prev.messages, userMessage]
      }));
      
      setInputValue('');
      
      // Simulate bot response
      setTimeout(() => {
        const botMessage = {
          id: Math.random().toString(),
          type: 'bot',
          message: 'Thank you for your message! Our team will get back to you shortly.'
        };
        setMessages(prev => ({
          messages: [...prev.messages, botMessage]
        }));
      }, 1000);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      {isOpen ? (
        <div className="w-96 h-[600px] bg-background rounded-lg shadow-lg border border-gray-700 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold">Customer Support</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto" ref={containerRef}>
            <div className="space-y-4">
              {messages.messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.type === 'bot' 
                      ? 'bg-gray-100 text-gray-900 mr-auto' 
                      : 'bg-blue-500 text-white ml-auto'
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                type="button"
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleSendMessage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal">
                  <path d="m3 3 3 9-3 9 19-9Z"/>
                  <path d="M6 12h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
          </svg>
        </Button>
      )}
    </div>
  );
};
