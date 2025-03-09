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
    }
  };

  return (
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
