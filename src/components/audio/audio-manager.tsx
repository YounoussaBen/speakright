'use client';

import { Button } from '@/components/ui/button';
import { Transcriber } from '@/lib/types';
import { FileAudio, Loader2, Mic, RotateCcw, Upload, Zap } from 'lucide-react';
import { useCallback, useState } from 'react';
import { AudioPlayer } from './audio-player';
import { AudioRecorder } from './audio-recorder';

export enum AudioSource {
  RECORDING = 'RECORDING',
  FILE = 'FILE',
}

interface AudioData {
  buffer: AudioBuffer;
  url: string;
  source: AudioSource;
  mimeType: string;
  duration: number;
}

interface AudioManagerProps {
  transcriber: Transcriber;
  onAudioReady?: (audioData: AudioData) => void;
  onTranscriptionStart?: () => void;
  onTranscriptionComplete?: () => void;
}

export function AudioManager({
  transcriber,
  onAudioReady,
  onTranscriptionStart,
  onTranscriptionComplete,
}: AudioManagerProps) {
  const [audioData, setAudioData] = useState<AudioData | undefined>(undefined);
  const [recordingMode, setRecordingMode] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);

  // Handle recording completion
  const handleRecordingComplete = useCallback(
    async (blob: Blob) => {
      setIsProcessingAudio(true);
      transcriber.onInputChange();

      try {
        const blobUrl = URL.createObjectURL(blob);
        const fileReader = new FileReader();

        fileReader.onloadend = async () => {
          try {
            const audioCTX = new AudioContext({ sampleRate: 16000 });
            const arrayBuffer = fileReader.result as ArrayBuffer;
            const decoded = await audioCTX.decodeAudioData(arrayBuffer);

            const newAudioData: AudioData = {
              buffer: decoded,
              url: blobUrl,
              source: AudioSource.RECORDING,
              mimeType: blob.type,
              duration: decoded.duration,
            };

            setAudioData(newAudioData);
            onAudioReady?.(newAudioData);
            setRecordingMode(false);
          } catch (error) {
            console.error('Error processing audio:', error);
          } finally {
            setIsProcessingAudio(false);
          }
        };

        fileReader.readAsArrayBuffer(blob);
      } catch (error) {
        console.error('Error handling recording:', error);
        setIsProcessingAudio(false);
      }
    },
    [transcriber, onAudioReady]
  );

  // Handle file upload
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('audio/')) {
        alert('Please select an audio file');
        return;
      }

      setIsProcessingAudio(true);
      transcriber.onInputChange();

      try {
        const blobUrl = URL.createObjectURL(file);
        const fileReader = new FileReader();

        fileReader.onloadend = async () => {
          try {
            const audioCTX = new AudioContext({ sampleRate: 16000 });
            const arrayBuffer = fileReader.result as ArrayBuffer;
            const decoded = await audioCTX.decodeAudioData(arrayBuffer);

            const newAudioData: AudioData = {
              buffer: decoded,
              url: blobUrl,
              source: AudioSource.FILE,
              mimeType: file.type,
              duration: decoded.duration,
            };

            setAudioData(newAudioData);
            onAudioReady?.(newAudioData);
          } catch (error) {
            console.error('Error processing uploaded file:', error);
            alert(
              'Error processing audio file. Please try a different format.'
            );
          } finally {
            setIsProcessingAudio(false);
          }
        };

        fileReader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('Error uploading file:', error);
        setIsProcessingAudio(false);
      }

      // Clear the input
      event.target.value = '';
    },
    [transcriber, onAudioReady]
  );

  // Start transcription
  const handleTranscribe = useCallback(async () => {
    if (!audioData) return;

    if (onTranscriptionStart) {
      onTranscriptionStart();
    }
    try {
      await transcriber.start(audioData.buffer);
      if (onTranscriptionComplete) {
        onTranscriptionComplete();
      }
    } catch (error) {
      console.error('Transcription error:', error);
    }
  }, [audioData, transcriber, onTranscriptionStart, onTranscriptionComplete]);

  // Reset all audio data
  const handleReset = useCallback(() => {
    transcriber.onInputChange();
    if (audioData?.url) {
      URL.revokeObjectURL(audioData.url);
    }
    setAudioData(undefined);
    setRecordingMode(false);
  }, [transcriber, audioData]);

  // Format duration for display
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Audio Input
        </h3>
        {audioData && (
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {/* Audio Input Options */}
      {!audioData && !recordingMode && !isProcessingAudio && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Record Audio Button */}
          <Button
            onClick={() => setRecordingMode(true)}
            variant="outline"
            className="h-24 flex-col space-y-2"
          >
            <Mic className="h-8 w-8 text-blue-500" />
            <span className="font-medium">Record Audio</span>
          </Button>

          {/* Upload File Button */}
          <div className="relative">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <Button
              variant="outline"
              className="h-24 w-full flex-col space-y-2"
            >
              <Upload className="h-8 w-8 text-green-500" />
              <span className="font-medium">Upload File</span>
            </Button>
          </div>
        </div>
      )}

      {/* Recording Interface */}
      {recordingMode && !audioData && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            onRecordingStart={() => console.log('Recording started')}
            onRecordingStop={() => console.log('Recording stopped')}
          />

          <div className="mt-4 text-center">
            <Button
              onClick={() => setRecordingMode(false)}
              variant="ghost"
              size="sm"
            >
              Cancel Recording
            </Button>
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessingAudio && (
        <div className="flex flex-col items-center space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Processing audio...
          </p>
        </div>
      )}

      {/* Audio Ready State */}
      {audioData && !isProcessingAudio && (
        <div className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
          {/* Audio Info */}
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <FileAudio className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                {audioData.source === AudioSource.RECORDING
                  ? 'Recorded Audio'
                  : 'Uploaded Audio'}
              </p>
              <p className="text-sm text-green-600 dark:text-green-300">
                Duration: {formatDuration(audioData.duration)}
              </p>
            </div>
          </div>

          {/* Audio Player */}
          <AudioPlayer audioUrl={audioData.url} mimeType={audioData.mimeType} />

          {/* Transcribe Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleTranscribe}
              disabled={transcriber.isModelLoading || transcriber.isProcessing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {transcriber.isModelLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Model...
                </>
              ) : transcriber.isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transcribing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Start Transcription
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Model Loading Progress */}
      {transcriber.isModelLoading && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-blue-800 dark:text-blue-200">
              Loading AI Model...
            </span>
            <span className="text-blue-600 dark:text-blue-300">
              {Math.round(transcriber.modelLoadingProgress)}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-blue-200 dark:bg-blue-800">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${transcriber.modelLoadingProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
