export interface TranscriberData {
  text: string;
  chunks?: TranscriptionChunk[];
}

export interface TranscriptionChunk {
  text: string;
  timestamp: [number, number];
  confidence?: number;
}

export interface Transcriber {
  onInputChange: () => void;
  isProcessing: boolean;
  isModelLoading: boolean;
  modelLoadingProgress: number;
  start: (audioData: AudioBuffer | undefined) => Promise<void>;
  output: TranscriberData | undefined;
}

// Free Speech Assessment Types
export interface FreeSpeechMetrics {
  speechRate: number; // words per minute
  pauseCount: number;
  pauseDuration: number; // total seconds in pauses
  fillerWordCount: number;
  fillerWords: string[];
  averageConfidence: number;
  vocabularyRichness: number; // unique words / total words
  totalWords: number;
  uniqueWords: number;
  averageWordLength: number;
  volumeConsistency: number; // 0-1
}

export interface FreeSpeechAssessment {
  fluencyScore: number; // 0-100
  clarityScore: number; // 0-100
  grammarScore: number; // 0-100
  pronunciationScore: number; // 0-100
  overallScore: number; // 0-100
  metrics: FreeSpeechMetrics;
  feedback: string[];
  suggestions: string[];
  strengths: string[];
  areasToImprove: string[];
}

export interface AudioFeatures {
  pauses: Array<{ start: number; end: number; duration: number }>;
  averageVolume: number;
  volumeVariance: number;
  speechDuration: number; // total duration minus pauses
  silenceDuration: number;
}
