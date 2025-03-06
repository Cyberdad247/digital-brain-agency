import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, StopCircle, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  content: string;
  sender: 'user' | 'bot';
  type: 'text' | 'voice';
  audio_data?: string;
}

interface FloatingAvatarProps {
  isRecording: boolean;
  onVoiceToggle: () => void;
}

export const FloatingAvatar: React.FC<FloatingAvatarProps> = ({ isRecording, onVoiceToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isServerConnected, setIsServerConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    checkServerConnection();
    const intervalId = setInterval(checkServerConnection, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const checkServerConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });
      setIsServerConnected(response.ok);
    } catch (error) {
      console.error('Server connection check failed:', error);
      setIsServerConnected(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!isServerConnected) {
      toast({
        title: "Server Unavailable",
        description: "Cannot connect to the AI server. Please try again later.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      content: input,
      sender: 'user',
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, type: 'text' }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage: Message = {
        content: data.response,
        sender: 'bot',
        type: data.type,
        audio_data: data.audio_data
      };

      setMessages(prev => [...prev, botMessage]);

      if (data.type === 'voice' && data.audio_data) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio_data}`);
        await audio.play().catch(err => {
          console.error('Error playing audio:', err);
          toast({
            title: "Audio Playback Error",
            description: "Could not play the audio response.",
            variant: "destructive"
          });
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        content: error instanceof DOMException && error.name === 'AbortError'
          ? 'Request timed out. The server took too long to respond.'
          : 'Sorry, there was an error processing your request.',
        sender: 'bot',
        type: 'text'
      };

      setMessages(prev => [...prev, errorMessage]);
      toast({
        title: "Communication Error",
        description: error instanceof DOMException && error.name === 'AbortError'
          ? "The request timed out. Please try again."
          : "Failed to communicate with the AI server.",
        variant: "destructive"
      });

      checkServerConnection();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-4 z-50">
      {isChatOpen && (
        <div className="w-96 h-[500px] bg-background border rounded-lg shadow-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/ai-avatar.svg" alt="AI Assistant" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Digital Brain Assistant</h3>
                <p className="text-xs text-muted-foreground">Ask me anything</p>
              </div>
            </div>
            {!isServerConnected ? (
              <WifiOff className="h-4 w-4 text-destructive" />
            ) : (
              <Wifi className="h-4 w-4 text-green-500" />
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className={`${message.sender === 'user' ? 'ml-2' : 'mr-2'} h-6 w-6`}>
                    {message.sender === 'bot' ? (
                      <AvatarImage src="/ai-avatar.svg" alt="AI" />
                    ) : null}
                    <AvatarFallback>{message.sender === 'user' ? 'U' : 'AI'}</AvatarFallback>
                  </Avatar>
                  <div className={`rounded-lg px-3 py-2 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {message.type === 'voice' && <span className="text-xs block mb-1">🎤 Voice Message</span>}
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-background flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={onVoiceToggle}
              disabled={isLoading}
            >
              {isRecording ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div 
        className="flex items-center gap-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && !isChatOpen && (
          <Button
            variant="outline"
            size="icon"
            onClick={onVoiceToggle}
            className="animate-in fade-in slide-in-from-right-5 duration-200"
          >
            {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        )}
        <div 
          className={`transform transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <Avatar className={`h-12 w-12 ring-2 ${isRecording ? 'ring-destructive animate-pulse' : 'ring-primary'} ring-offset-2 ring-offset-background cursor-pointer`}>
            <AvatarImage src="/ai-avatar.svg" alt="AI Assistant" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default FloatingAvatar;