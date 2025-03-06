import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, Send, StopCircle, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { FloatingAvatar } from "./FloatingAvatar";
import { useToast } from "@/hooks/use-toast";

interface Message {
  content: string;
  sender: 'user' | 'bot';
  type: 'text' | 'voice';
  audio_data?: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerConnected, setIsServerConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check server connection on component mount
  useEffect(() => {
    checkServerConnection();
    const intervalId = setInterval(checkServerConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const checkServerConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // Timeout after 5 seconds
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
    
    // Add user message to chat
    const userMessage: Message = {
      content: input,
      sender: 'user',
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Send message to backend API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
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
      
      // Add bot response to chat
      const botMessage: Message = {
        content: data.response,
        sender: 'bot',
        type: data.type,
        audio_data: data.audio_data
      };
      
      setMessages(prev => [...prev, botMessage]);

      // If the response includes audio data, play it
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
      // Add error message
      const errorMessage: Message = {
        content: error instanceof DOMException && error.name === 'AbortError' 
          ? 'Request timed out. The server took too long to respond.'
          : 'Sorry, there was an error processing your request.',
        sender: 'bot',
        type: 'text'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Show toast notification
      toast({
        title: "Communication Error",
        description: error instanceof DOMException && error.name === 'AbortError'
          ? "The request timed out. Please try again."
          : "Failed to communicate with the AI server.",
        variant: "destructive"
      });
      
      // Check server connection after error
      checkServerConnection();
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    return new Promise<void>((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();

        reader.onload = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          // Add user voice message
          const userVoiceMessage: Message = {
            content: '🎤 Voice message sent',
            sender: 'user',
            type: 'voice'
          };
          
          setMessages(prev => [...prev, userVoiceMessage]);
          setIsLoading(true);

          try {
            const response = await fetch('http://localhost:8000/chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: '',
                type: 'voice',
                audio_data: base64Audio
              }),
            });

            const data = await response.json();

            const botMessage: Message = {
              content: data.response,
              sender: 'bot',
              type: data.type,
              audio_data: data.audio_data
            };

            setMessages(prev => [...prev, botMessage]);

            // If the response includes audio data, play it
            if (data.type === 'voice' && data.audio_data) {
              const audio = new Audio(`data:audio/wav;base64,${data.audio_data}`);
              await audio.play();
            }
          } catch (error) {
            console.error('Error processing voice message:', error);
            const errorMessage: Message = {
              content: 'Sorry, there was an error processing your voice message.',
              sender: 'bot',
              type: 'text'
            };
            setMessages(prev => [...prev, errorMessage]);
          } finally {
            setIsLoading(false);
          }
          resolve();
        };

        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    });
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <>
      <div className="flex flex-col h-[600px] w-full max-w-md mx-auto border rounded-lg overflow-hidden bg-background">
      <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Digital Brain Assistant</h2>
          <p className="text-sm text-muted-foreground">Ask me anything about digital marketing</p>
        </div>
        {!isServerConnected && (
          <div className="flex items-center text-destructive">
            <WifiOff className="h-4 w-4 mr-1" />
            <span className="text-xs">Offline</span>
          </div>
        )}
        {isServerConnected && (
          <div className="flex items-center text-green-500">
            <Wifi className="h-4 w-4 mr-1" />
            <span className="text-xs">Connected</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className={`${message.sender === 'user' ? 'ml-2' : 'mr-2'} h-8 w-8`}>
                  {message.sender === 'bot' ? (
                    <AvatarImage src="/ai-avatar.svg" alt="AI" />
                  ) : null}
                  <AvatarFallback>{message.sender === 'user' ? 'U' : 'AI'}</AvatarFallback>
                </Avatar>
                <div 
                  className={`rounded-lg px-3 py-2 ${message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'}`}
                >
                  {message.type === 'voice' && <span className="text-xs block mb-1">🎤 Voice Message</span>}
                  <p>{message.content}</p>
                  {message.type === 'voice' && message.audio_data && (
                    <button
                      onClick={() => {
                        const audio = new Audio(`data:audio/wav;base64,${message.audio_data}`);
                        audio.play();
                      }}
                      className="text-xs underline mt-1"
                    >
                      Play Audio
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-3 py-2 flex items-center space-x-2">
              <div className="flex space-x-1">
<div className="w-2 h-2 rounded-full bg-current animate-bounce delay-0" />
                <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-150" />
                <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-300" />
              </div>
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-background">
        <div className="flex space-x-2">
          <Button 
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={handleVoiceInput}
            className="flex-shrink-0"
          >
            {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isRecording}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
      <FloatingAvatar
        isRecording={isRecording}
        onVoiceToggle={handleVoiceInput}
      />
    </>
  );
};

export default ChatInterface;