<<<<<<< HEAD
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSupabase } from '../../backend/api/supabaseClient';
import { useChat } from '../hooks/useChat';

interface VoiceChatBotProps {
  onboardingComplete?: () => void;
}

export const VoiceChatBot = ({ onboardingComplete }: VoiceChatBotProps) => {
  const { session } = useSupabase();
  const { messages, sendMessage } = useChat();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Convert audio to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        // Send to backend for speech-to-text processing
        const response = await fetch('/api/voice/recognize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audio: base64Audio }),
        });

        const data = await response.json();
        if (data.success) {
          setTranscript(data.data.transcription);
          await sendMessage(data.data.transcription);
        }
      };
    } catch (error) {
      console.error('Error processing audio:', error);
=======
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '../hooks/use-toast';
import { geminiService, GeminiState } from '../lib/ai';
import { v4 as uuidv4 } from 'uuid';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'bot';
  timestamp: Date;
  imageUrl?: string; // Add support for image URLs
}

// Type definitions for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export const VoiceChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationState, setConversationState] = useState<GeminiState>(geminiService.getState());
  const [isConnected, setIsConnected] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const webSocketRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const reconnectAttempts = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Define handleReconnection before it's used in connectWebSocket
  const handleReconnection = useCallback(() => {
    if (reconnectAttempts.current < 3) {
      const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
      setTimeout(() => {
        reconnectAttempts.current += 1;
        connectWebSocket();
      }, delay);
    } else {
      toast({
        title: 'Connection Lost',
        description: 'Unable to reconnect to chat service',
        variant: 'destructive'
      });
    }
  }, [toast]);

  // WebSocket management
  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://localhost:8000/chat');
    
    ws.onopen = () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
    };

    ws.onmessage = async (event) => {
      try {
        const response = JSON.parse(event.data);
        if (!response.message) {
          throw new Error('Invalid message format');
        }
        
        // Process the server response directly
        setIsProcessing(false);
        addMessage('bot', response.message);
        speakResponse(response.message);
      } catch (error) {
        console.error('Message handling error:', error);
        toast({
          title: 'Processing Error',
          description: 'Failed to handle server response',
          variant: 'destructive'
        });
      } finally {
        setIsProcessing(false);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      handleReconnection();
    };

    ws.onclose = () => {
      setIsConnected(false);
      handleReconnection();
    };

    webSocketRef.current = ws;
  }, [handleReconnection, toast]);

  // Speech Recognition
  const initSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: 'Not Supported',
        description: 'Speech recognition is not supported in this browser',
        variant: 'destructive'
      });
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      handleUserMessage(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [toast]);

  // Message handling
  const addMessage = (type: 'user' | 'bot', text: string, imageUrl?: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      text,
      type,
      timestamp: new Date(),
      imageUrl
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // File handling
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload an image file',
        variant: 'destructive'
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target?.result as string;
      setUploadedImage(base64Image);
      toast({
        title: 'Image Uploaded',
        description: 'Image ready to send with your next message',
        variant: 'default'
      });
    };
    reader.readAsDataURL(file);
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUserMessage = (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    addMessage('user', text, uploadedImage || undefined);
    
    // Clear uploaded image after sending
    if (uploadedImage) {
      clearUploadedImage();
    }
    
    // Send to WebSocket if connected
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        text,
        image: uploadedImage,
        state: conversationState
      };
      webSocketRef.current.send(JSON.stringify(message));
    } else {
      // Fallback to direct API call if WebSocket is not connected
      geminiService.handleMessage(text, uploadedImage)
        .then(response => {
          setConversationState(response.state);
          addMessage('bot', response.text);
          speakResponse(response.text);
        })
        .catch(error => {
          console.error('API error:', error);
          toast({
            title: 'Processing Error',
            description: 'Failed to process your message',
            variant: 'destructive'
          });
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const text = input.value.trim();
    
    if (text) {
      handleUserMessage(text);
      input.value = '';
    }
  };

  // Speech synthesis
  const speakResponse = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }
    
    // Cancel any ongoing speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Get available voices and set a female voice if available
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('female') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Google US English Female')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
    
    speechSynthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (!('speechSynthesis' in window)) {
      return;
    }
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize WebSocket and speech recognition
  useEffect(() => {
    connectWebSocket();
    initSpeechRecognition();
    
    // Clean up on unmount
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, [connectWebSocket, initSpeechRecognition]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
>>>>>>> main
    }
  };

  return (
<<<<<<< HEAD
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-4 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${message.role === 'user' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? 'destructive' : 'default'}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        {transcript && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Transcript: {transcript}</p>
        )}
      </div>
    </div>
  );
};
=======
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Avatar 
          className="h-16 w-16 cursor-pointer hover:scale-110 transition-transform duration-200 shadow-lg"
          onClick={toggleChat}
        >
          <img src="/tasha-avatar.png" alt="AI Assistant" className="w-full h-full object-cover" />
        </Avatar>
      </div>
      
      {isChatOpen && (
        <div className="fixed bottom-24 right-4 z-50 flex flex-col h-[600px] w-[350px] bg-gray-50 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 bg-blue-800">
                <img src="/tasha-avatar.png" alt="Tasha" className="h-full w-full object-cover" />
              </Avatar>
              <div>
                <h3 className="font-medium">Voice Assistant</h3>
                <div className="text-xs flex items-center">
                  {isConnected ? (
                    <Badge variant="outline" className="bg-green-500 text-white border-0 text-xs">
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-500 text-white border-0 text-xs">
                      Disconnected
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {isSpeaking && (
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="h-8 px-2"
                  onClick={stopSpeaking}
                >
                  <span className="mr-1">🔇</span> Stop
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-white"
                onClick={() => setIsChatOpen(false)}
              >
                ✕
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
            {messages.length === 0 ? (
              <div className="text-5xl mb-2">👋
              <p>Hi! I'm your AI assistant. How can I help you today?</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className={`p-3 ${message.type === 'user' ? 'bg-blue-50' : 'bg-white'}`}>
                  <div className="flex items-start space-x-2">
                    <Avatar className={`h-8 w-8 ${message.type === 'user' ? 'bg-blue-600' : 'bg-blue-800'}`}>
                      {message.type === 'user' ? (
                        <span className="text-white text-sm">You</span>
                      ) : (
                        <img src="/tasha-avatar.png" alt="AI" className="h-full w-full object-cover" />
                      )}
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {message.type === 'user' ? 'You' : 'AI Assistant'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{message.text}</p>
                      {message.imageUrl && (
                        <img src={message.imageUrl} alt="Uploaded content" className="mt-2 max-w-[200px] rounded" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
          </div>

          {/* Input area */}
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
                aria-label="Upload image"
              />
              <div className="flex-1 flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0"
                  aria-label="Attach file"
                >
                  📎
                </Button>
                <input
                  type="text"
                  name="message"
                  placeholder="Type a message..."
                  className="flex-1 min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                  aria-label="Message input"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={isListening ? 'destructive' : 'outline'}
                  size="icon"
                  onClick={startListening}
                  disabled={isProcessing}
                  className="shrink-0"
                >
                  🎤
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={isProcessing}
                  className="shrink-0"
                >
                  Send
                </Button>
              </div>
            </form>
            {uploadedImage && (
              <div className="mt-2 flex items-center space-x-2">
                <img src={uploadedImage} alt="Upload preview" className="h-10 w-10 object-cover rounded" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearUploadedImage}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
>>>>>>> main
