import React, { useState, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";

interface VoiceBubbleProps {
  onVoiceInput?: (text: string) => void;
}

export const VoiceBubble: React.FC<VoiceBubbleProps> = ({ onVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        // Here we would typically send the audio to a speech-to-text service
        // For now, we'll just log it
        console.log('Audio recording completed', audioBlob);
        setAudioChunks([]);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsListening(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      // Here we would implement the error handling and fallback UI
    }
  }, [audioChunks]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsListening(false);
    }
  }, [mediaRecorder]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 flex items-center gap-2 transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <Button
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          onClick={handleVoiceToggle}
          className="animate-in fade-in slide-in-from-right-5 duration-200"
        >
          {isListening ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
      )}
      <div 
        className={`transform transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
      >
        <Avatar 
          className={`h-12 w-12 ring-2 ${isListening ? 'ring-destructive animate-pulse' : 'ring-primary'} ring-offset-2 ring-offset-background cursor-pointer`}
        >
          <AvatarImage src="/ai-avatar.svg" alt="AI Assistant" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default VoiceBubble;