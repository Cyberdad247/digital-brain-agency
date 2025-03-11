import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../hooks/use-toast';
import { tashaService } from '../lib/websocket';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

export const VoiceChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationState, setConversationState] = useState(tashaService.getState());
  const [isConnected, setIsConnected] = useState(false);
  const webSocketRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Initialize WebSocket connection
  useEffect(() => {
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;
    const reconnectDelay = 2000;

    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8000/chat');
      webSocketRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts = 0;
      };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      const tashaResponse = tashaService.handleMessage(response.text);
      setConversationState(tashaResponse.state);
      addMessage('bot', tashaResponse.text);
      speakResponse(tashaResponse.text);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      
      if (reconnectAttempts < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts++;
          connectWebSocket();
        }, reconnectDelay);
      } else {
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to chat service after multiple attempts',
          variant: 'destructive'
        });
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      if (reconnectAttempts < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts++;
          connectWebSocket();
        }, reconnectDelay);
      }
    };

    connectWebSocket();

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Speech recognition setup
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const startListening = async () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addMessage('user', transcript);
        sendMessage(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: 'Voice Input Error',
          description: 'Failed to recognize speech',
          variant: 'destructive'
        });
      };

      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error('Speech recognition setup error:', error);
      toast({
        title: 'Voice Input Error',
        description: 'Speech recognition not supported',
        variant: 'destructive'
      });
    }
  };

  // Text-to-speech output
  const speakResponse = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Add message to chat
  const addMessage = (type: 'user' | 'bot', text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date()
    }]);
  };

  // Send message to WebSocket server
  const sendMessage = (text: string) => {
    if (!isConnected) {
      toast({
        title: 'Connection Error',
        description: 'Not connected to chat service. Please try again later.',
        variant: 'destructive'
      });
      return;
    }
    if (webSocketRef.current?.readyState === WebSocket.OPEN) {
      setIsProcessing(true);
      const tashaResponse = tashaService.handleMessage(text);
      setConversationState(tashaResponse.state);
      webSocketRef.current.send(JSON.stringify({ 
        message: text,
        state: tashaResponse.state
      }));
    } else {
      toast({
        title: 'Connection Error',
        description: 'Not connected to chat service',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg p-4">
      <div className="h-96 overflow-y-auto mb-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`mb-2 p-2 rounded ${message.type === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}
          >
            <p>{message.text}</p>
            <small className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={startListening}
          disabled={isListening || isProcessing}
          className={`p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-blue-500'} text-white`}
        >
          {isListening ? 'Listening...' : 'Start Speaking'}
        </button>
        {isProcessing && (
          <span className="text-sm text-gray-500">Processing...</span>
        )}
      </div>
    </div>
  );
};