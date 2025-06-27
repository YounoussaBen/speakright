'use client';

import { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  mimeType: string;
  className?: string;
}

export function AudioPlayer({
  audioUrl,
  mimeType,
  className = '',
}: AudioPlayerProps) {
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const audioSourceRef = useRef<HTMLSourceElement>(null);

  useEffect(() => {
    if (audioPlayerRef.current && audioSourceRef.current) {
      audioSourceRef.current.src = audioUrl;
      audioPlayerRef.current.load();
    }
  }, [audioUrl]);

  return (
    <div className={`w-full ${className}`}>
      <audio
        ref={audioPlayerRef}
        controls
        className="h-12 w-full rounded-lg bg-gray-100 dark:bg-gray-800"
        preload="metadata"
      >
        <source ref={audioSourceRef} type={mimeType} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
