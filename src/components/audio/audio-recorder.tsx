'use client';

import { Button } from '@/components/ui/button';
import { Mic, Pause, Play, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
}

export function AudioRecorder({
  onRecordingComplete,
  onRecordingStart,
  onRecordingStop,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check microphone permission on mount
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      // Stop the stream immediately as we're just checking permission
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setHasPermission(false);
    }
  };

  // Start recording function
  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000, // Whisper prefers 16kHz
          channelCount: 1, // Mono audio
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      setHasPermission(true);

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus', // Good compression and quality
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm;codecs=opus',
        });
        onRecordingComplete(audioBlob);
        onRecordingStop?.();
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms for real-time processing
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      onRecordingStart?.();

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setHasPermission(false);
    }
  };

  // Pause/Resume recording function
  const togglePauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        // Resume recording
        mediaRecorderRef.current.resume();
        setIsPaused(false);

        // Restart timer
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        // Pause recording
        mediaRecorderRef.current.pause();
        setIsPaused(true);

        // Stop timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Stop all tracks on the stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  // Format time function
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Show permission request if needed
  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center space-y-4 rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
        <Mic className="h-8 w-8 text-red-500" />
        <div>
          <h3 className="font-semibold text-red-800 dark:text-red-200">
            Microphone Access Required
          </h3>
          <p className="mt-1 text-sm text-red-600 dark:text-red-300">
            Please allow microphone access to record audio
          </p>
        </div>
        <Button onClick={checkMicrophonePermission} size="sm">
          Grant Permission
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Timer Display */}
      <div className="flex items-center space-x-3">
        <div className="font-mono text-2xl font-bold text-gray-900 dark:text-white">
          {formatTime(recordingTime)}
        </div>
        {isRecording && !isPaused && (
          <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
        )}
      </div>

      {/* Recording Controls */}
      <div className="flex space-x-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            size="lg"
            className="h-16 w-16 rounded-full bg-red-500 p-0 hover:bg-red-600"
            disabled={hasPermission !== true}
          >
            <Mic className="h-8 w-8 text-white" />
          </Button>
        ) : (
          <>
            <Button
              onClick={togglePauseRecording}
              size="lg"
              variant="outline"
              className="h-12 w-12 rounded-full p-0"
            >
              {isPaused ? (
                <Play className="h-6 w-6" />
              ) : (
                <Pause className="h-6 w-6" />
              )}
            </Button>

            <Button
              onClick={stopRecording}
              size="lg"
              variant="destructive"
              className="h-12 w-12 rounded-full p-0"
            >
              <Square className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {/* Status Display */}
      <div className="text-center">
        {isRecording && (
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {isPaused ? 'Recording paused' : 'Recording...'}
          </div>
        )}
        {!isRecording && recordingTime > 0 && (
          <div className="text-sm font-medium text-green-600 dark:text-green-400">
            Recording completed
          </div>
        )}
      </div>
    </div>
  );
}
