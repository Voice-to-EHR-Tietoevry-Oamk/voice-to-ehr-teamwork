'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { text } from 'stream/consumers';

interface VoiceRecorderProps {
  patientId: string;
  onTranscriptionComplete?: (text: string) => void;
}

export default function VoiceRecorder({ patientId, onTranscriptionComplete }: VoiceRecorderProps) {
  const { doctor } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [error, setError] = useState<string>('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Load saved transcription on component mount only if authenticated
  useEffect(() => {
    if (doctor) {
      const savedTranscription = localStorage.getItem(`transcription_${patientId}`);
      if (savedTranscription) {
        setTranscribedText(savedTranscription);
        onTranscriptionComplete?.(savedTranscription);
      }
    } else {
      // Clear transcription if not authenticated
      setTranscribedText('');
      onTranscriptionComplete?.('');
    }
  }, [patientId, onTranscriptionComplete, doctor]);

  const startRecording = async () => {    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.start(1000);
      setIsRecording(true);
      setIsPaused(false);
      setError('');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Error accessing microphone. Please make sure you have granted microphone permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder.current?.state === 'paused') {
      mediaRecorder.current.resume();
      setIsPaused(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64String = reader.result as string;
          // Remove the data URL prefix
          const base64Data = base64String.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      const response = await fetch('/api/voice-to-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audio: base64Audio })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to transcribe audio');
      }

      const data = await response.json();
      if (!data.text || data.text.trim() === '') {
        throw new Error('No speech detected in audio');
      }

      return data.text;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setIsTranscribing(true);
      setError('');

      try {
        await new Promise(resolve => {
          if (mediaRecorder.current) {
            mediaRecorder.current.addEventListener('stop', resolve, { once: true });
          }
        });

        // Create a WAV blob with the correct format
        const audioBlob = new Blob(audioChunks.current, { 
          type: 'audio/wav;codecs=1' // PCM format
        });
        
        console.log("Audio blob type:", audioBlob.type);
        console.log("Audio blob size:", audioBlob.size);
        
        const transcript = await transcribeAudio(audioBlob);
        
        // Only save transcription if authenticated
        if (doctor) {
          localStorage.setItem(`transcription_${patientId}`, transcript);
        }
        setTranscribedText(transcript);
        onTranscriptionComplete?.(transcript);
      } catch (error) {
        console.error('Error during transcription:', error);
        setError('Error during transcription. Please try again.');
      } finally {
        setIsTranscribing(false);
        mediaRecorder.current?.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
/*
  const handleStartEHR = () => {
    if (!transcribedText) return;
    // Here we will send just the raw text to the backend
    console.log('Sending raw text to backend:', transcribedText);
    onTranscriptionComplete?.(transcribedText);
  };
  */

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <button
            onClick={isRecording ? (isPaused ? resumeRecording : pauseRecording) : startRecording}
            className={`w-full p-4 rounded ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {isRecording ? (isPaused ? 'Resume Recording' : 'Pause Recording') : 'Record'}
          </button>
          <p className="text-sm text-gray-500 text-center mt-2">This will record your voice</p>
        </div>

        <div>
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className={`w-full p-4 rounded ${
              isTranscribing
                ? 'bg-blue-500 animate-pulse'
                : 'bg-gray-200 hover:bg-gray-300'
            } disabled:opacity-50`}
          >
            {isTranscribing ? 'Transcribing...' : 'Stop'}
          </button>
          <p className="text-sm text-gray-500 text-center mt-2">This will transcript your voice</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
 {/**Cancel the Start EHR btn and move to Page.tsx */}
 {/*
      <div className="w-full">
        <button
          //onClick={handleStartEHR}
          onClick={onStartEHR}
          disabled={!transcribedText}
          className="w-full p-4 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start EHR
        </button>
        <p className="text-sm text-gray-500 text-center mt-2">This will turn your transcripted voice into an EHR</p>
      </div>
      */}
    </div>
  );
} 