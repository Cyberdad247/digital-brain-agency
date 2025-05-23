import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VoiceChatBot } from './VoiceChatBot';
import { NoCodeIDE } from './NoCodeIDE';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from '../hooks/use-toast';

interface VoiceCommand {
  command: string;
  action: string;
  params?: Record<string, any>;
}

export const EnhancedVoiceChatBot: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isListening, setIsListening] = useState(false);
  const [recognizedCommand, setRecognizedCommand] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  
  // Define voice commands for IDE control
  const ideCommands: VoiceCommand[] = [
    { command: 'add button', action: 'addComponent', params: { type: 'button' } },
    { command: 'add input field', action: 'addComponent', params: { type: 'input' } },
    { command: 'add text box', action: 'addComponent', params: { type: 'text' } },
    { command: 'add image', action: 'addComponent', params: { type: 'image' } },
    { command: 'add container', action: 'addComponent', params: { type: 'container' } },
    { command: 'delete selected', action: 'deleteComponent' },
    { command: 'switch to design', action: 'switchTab', params: { tab: 'design' } },
    { command: 'switch to voice commands', action: 'switchTab', params: { tab: 'voice' } },
    { command: 'switch to deployment', action: 'switchTab', params: { tab: 'deploy' } },
    { command: 'deploy application', action: 'deployProject' },
    { command: 'switch to chat', action: 'switchTab', params: { tab: 'chat' } },
    { command: 'switch to ide', action: 'switchTab', params: { tab: 'ide' } }
  ];
  
  // Initialize speech recognition
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
      processVoiceCommand(transcript);
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
  
  // Process voice command
  const processVoiceCommand = (transcript: string) => {
    setRecognizedCommand(transcript);
    
    // Check if the command matches any IDE commands
    const matchedCommand = ideCommands.find(cmd => 
      transcript.toLowerCase().includes(cmd.command.toLowerCase())
    );
    
    if (matchedCommand) {
      // Handle IDE commands
      switch (matchedCommand.action) {
        case 'switchTab':
          if (matchedCommand.params?.tab) {
            setActiveTab(matchedCommand.params.tab);
            toast({
              title: 'Tab Switched',
              description: `Switched to ${matchedCommand.params.tab} tab`,
              variant: 'default'
            });
          }
          break;
          
        default:
          // For other commands, we'll pass them to the NoCodeIDE component
          // This would require adding a ref or callback to the NoCodeIDE component
          toast({
            title: 'Command Recognized',
            description: `"${matchedCommand.command}" - ${matchedCommand.action}`,
            variant: 'default'
          });
          break;
      }
    } else {
      // If not an IDE command, it's a regular chat message
      // We'll let the VoiceChatBot handle it
      if (activeTab !== 'chat') {
        setActiveTab('chat');
      }
    }
    
    // Clear the recognized command after 3 seconds
    setTimeout(() => {
      setRecognizedCommand(null);
    }, 3000);
  };
  
  // Start listening for voice commands
  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };