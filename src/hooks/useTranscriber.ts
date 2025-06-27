import { useWorker } from '@/hooks/useWorker';
import { Transcriber, TranscriberData } from '@/lib/types';
import { useCallback, useMemo, useState } from 'react';

export function useTranscriber(): Transcriber {
  const [output, setOutput] = useState<TranscriberData | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0);

  const webWorker = useWorker(event => {
    const message = event.data;

    switch (message.status) {
      case 'progress':
        setModelLoadingProgress(message.progress);
        break;
      case 'update':
        // Handle real-time updates if needed
        break;
      case 'complete':
        setOutput(message.data);
        setIsProcessing(false);
        break;
      case 'initiate':
        setIsModelLoading(true);
        break;
      case 'ready':
        setIsModelLoading(false);
        break;
      case 'error':
        setIsProcessing(false);
        console.error('Transcription error:', message.data);
        break;
      case 'done':
        break;
      default:
        break;
    }
  });

  const onInputChange = useCallback(() => {
    setOutput(undefined);
  }, []);

  const start = useCallback(
    async (audioData: AudioBuffer | undefined) => {
      if (audioData) {
        setOutput(undefined);
        setIsProcessing(true);

        let audio;
        if (audioData.numberOfChannels === 2) {
          // Convert stereo to mono
          const SCALING_FACTOR = Math.sqrt(2);
          const left = audioData.getChannelData(0);
          const right = audioData.getChannelData(1);

          audio = new Float32Array(left.length);
          for (let i = 0; i < audioData.length; ++i) {
            audio[i] =
              (SCALING_FACTOR * ((left[i] || 0) + (right[i] || 0))) / 2;
          }
        } else {
          // If the audio is not stereo, we can just use the first channel
          audio = audioData.getChannelData(0);
        }

        webWorker?.postMessage({ audio });
      }
    },
    [webWorker]
  );

  const transcriber = useMemo(() => {
    return {
      onInputChange,
      isProcessing,
      isModelLoading,
      modelLoadingProgress,
      start,
      output,
    };
  }, [
    onInputChange,
    isProcessing,
    isModelLoading,
    modelLoadingProgress,
    start,
    output,
  ]);

  return transcriber;
}
