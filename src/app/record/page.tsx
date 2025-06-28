// src/app/record/page.tsx
'use client';

import { useTranscriber } from '@/hooks/useTranscriber';
import { PronunciationAssessmentEngine } from '@/lib/assessment-engine';
import { useAuth } from '@/lib/auth-context';
import { PDFReportGenerator } from '@/lib/pdf-report-generator';
import { SessionData, useSessionStore } from '@/stores/session-store';
import {
  ArrowLeft,
  Award,
  Download,
  FileText,
  Mic,
  Play,
  RotateCcw,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function RecordPage() {
  const [selectedText, setSelectedText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isUploadedFile, setIsUploadedFile] = useState(false);
  const [recordingState, setRecordingState] = useState<
    'idle' | 'recording' | 'processing' | 'completed' | 'assessed'
  >('idle');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState('');
  interface Assessment {
    overallScore: number;
    accuracyScore: number;
    fluencyScore: number;
    suggestions: string[];
    // Add other fields as needed based on PronunciationAssessmentEngine.assessPronunciation output
  }

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentSession, setCurrentSession] = useState<SessionData | null>(
    null
  );

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTime = useRef<number>(0);

  const { user } = useAuth();
  const { createSession } = useSessionStore();
  const transcriber = useTranscriber();
  const router = useRouter();

  // Load text from sessionStorage on component mount
  useEffect(() => {
    const storedText = sessionStorage.getItem('selectedText');
    const storedFileName = sessionStorage.getItem('uploadedFileName');

    if (storedText) {
      setSelectedText(storedText);
    }

    if (storedFileName) {
      setUploadedFileName(storedFileName);
      setIsUploadedFile(true);
      setSelectedText(
        `This is the extracted content from ${storedFileName}. In a real implementation, this would be the actual text content extracted from the PDF or DOCX file using PDF.js or Mammoth.js. The content would be much longer and contain the actual text that the user wants to practice reading aloud for pronunciation improvement.`
      );
    } else {
      setIsUploadedFile(false);
    }

    if (!storedText && !storedFileName) {
      router.push('/');
    }
  }, [router]);

  const words = selectedText.split(' ').filter(word => word.trim());

  // Enhanced audio level monitoring
  const monitorAudioLevel = useCallback(() => {
    if (analyserRef.current) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += (dataArray[i] || 0) * (dataArray[i] || 0);
      }
      const rms = Math.sqrt(sum / bufferLength);
      const normalizedLevel = Math.min(rms / 128, 1);
      setAudioLevel(normalizedLevel);

      if (recordingState === 'recording') {
        animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
      }
    }
  }, [recordingState]);

  // Recording timer
  useEffect(() => {
    if (recordingState === 'recording') {
      recordingStartTime.current = Date.now();
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recordingState === 'idle') {
        setRecordingTime(0);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recordingState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle recording click
  const handleRecordClick = async () => {
    if (recordingState === 'idle') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        streamRef.current = stream;

        const audioContext = new AudioContext({ sampleRate: 16000 });
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.3;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const audioChunks: Blob[] = [];
        mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          await processAudioForTranscription(audioBlob);
        };

        mediaRecorder.start(100);
        setRecordingState('recording');
        setRecordingTime(0);
        transcriber.onInputChange();

        monitorAudioLevel();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else if (recordingState === 'recording') {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setRecordingState('processing');
      setAudioLevel(0);
    }
  };

  // Process audio for transcription
  const processAudioForTranscription = async (audioBlob: Blob) => {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      await transcriber.start(audioBuffer);
    } catch (error) {
      console.error('Error processing audio:', error);
      setRecordingState('idle');
    }
  };

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('audio/')) return;

    setRecordingState('processing');
    transcriber.onInputChange();

    const audioUrl = URL.createObjectURL(file);
    setUploadedAudioUrl(audioUrl);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      await transcriber.start(audioBuffer);
    } catch (error) {
      console.error('Error processing uploaded file:', error);
      setRecordingState('idle');
    }

    event.target.value = '';
  };

  // Listen to transcriber state changes and perform assessment
  useEffect(() => {
    if (transcriber.output?.text && recordingState === 'processing') {
      setFinalTranscript(transcriber.output.text);
      setRecordingState('completed');

      // Perform pronunciation assessment
      const actualDuration = recordingTime || 0;
      const pronunciationAssessment =
        PronunciationAssessmentEngine.assessPronunciation(
          selectedText,
          transcriber.output.text,
          actualDuration
        );

      setAssessment(pronunciationAssessment);

      // Create session data
      const sessionData: Omit<SessionData, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user?.uid,
        originalText: selectedText,
        transcribedText: transcriber.output.text,
        audioUrl: uploadedAudioUrl,
        assessment: pronunciationAssessment,
        metadata: {
          duration: actualDuration,
          wordCount: words.length,
          sourceType: isUploadedFile ? 'file' : 'sample',
          ...(uploadedFileName ? { sourceFileName: uploadedFileName } : {}),
        },
      };

      // Save session
      createSession(sessionData)
        .then(session => {
          setCurrentSession(session);
          setRecordingState('assessed');
        })
        .catch(error => {
          console.error('Error saving session:', error);
          setRecordingState('assessed'); // Continue anyway
        });
    }
  }, [
    transcriber.output,
    recordingState,
    selectedText,
    recordingTime,
    user,
    words.length,
    isUploadedFile,
    uploadedFileName,
    uploadedAudioUrl,
    createSession,
  ]);

  const handleRestart = () => {
    setRecordingState('idle');
    setFinalTranscript('');
    setAssessment(null);
    setCurrentSession(null);
    setAudioLevel(0);
    setRecordingTime(0);
    if (uploadedAudioUrl) {
      URL.revokeObjectURL(uploadedAudioUrl);
      setUploadedAudioUrl('');
    }
    transcriber.onInputChange();
  };

  const handleNewText = () => {
    sessionStorage.removeItem('selectedText');
    sessionStorage.removeItem('uploadedFileName');
    router.push('/');
  };

  const handleDownloadReport = async () => {
    if (currentSession) {
      try {
        await PDFReportGenerator.downloadReport(currentSession);
      } catch (error) {
        console.error('Error downloading report:', error);
        alert('Failed to generate report. Please try again.');
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!selectedText) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 dark:from-gray-900 dark:to-gray-800">
      <div className="pointer-events-none absolute top-0 left-0 h-32 w-full bg-gradient-to-b from-blue-50/30 via-transparent to-transparent dark:from-blue-950/20"></div>

      <div className="container mx-auto max-w-7xl px-6 py-8">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={handleNewText}
            className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>New Text</span>
          </button>

          <div className="flex items-center space-x-3">
            {recordingState === 'assessed' && currentSession && (
              <button
                onClick={handleDownloadReport}
                className="flex items-center space-x-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
              >
                <Download className="h-4 w-4" />
                <span>Download Report</span>
              </button>
            )}
            <button
              onClick={handleRestart}
              className="flex items-center space-x-2 rounded-xl bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-700 hover:shadow-md"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Restart</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Text Display & Results */}
          <div className="space-y-6 lg:col-span-2">
            {/* Text Preview */}
            <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-6 backdrop-blur-sm dark:border-gray-700/30 dark:from-blue-950/10 dark:to-purple-950/10">
              <div className="mb-4 border-b border-gray-100/50 pb-4 dark:border-gray-700/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-blue-100/80 p-2 dark:bg-blue-900/30">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {isUploadedFile ? uploadedFileName : 'Selected Text'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {words.length} words • ~{Math.ceil(words.length / 180)}{' '}
                        min read
                      </p>
                    </div>
                  </div>
                  {isUploadedFile && (
                    <div className="rounded-full bg-green-100/80 px-3 py-1 dark:bg-green-900/30">
                      <span className="text-xs font-medium text-green-700 dark:text-green-300">
                        Extracted Content
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                <div className="space-y-1 text-lg leading-relaxed">
                  {words.map((word, index) => (
                    <span
                      key={index}
                      className="mr-2 inline-block text-gray-700 dark:text-gray-300"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Audio Visualization */}
            {recordingState === 'recording' && (
              <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-red-50/50 to-orange-50/50 p-6 backdrop-blur-sm dark:border-gray-700/30 dark:from-red-950/10 dark:to-orange-950/10">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
                    <h3 className="font-semibold text-red-800 dark:text-red-200">
                      Recording Audio
                    </h3>
                  </div>
                  <div className="font-mono text-sm font-bold text-red-700 dark:text-red-300">
                    {formatTime(recordingTime)}
                  </div>
                </div>

                <div className="flex h-16 items-center justify-center space-x-1">
                  {[...Array(50)].map((_, i) => {
                    const basePattern = [
                      12, 16, 24, 20, 32, 18, 36, 28, 40, 22, 44, 26, 38, 30,
                      42, 34, 28, 24, 20, 16,
                    ];
                    const cycleIndex = i % basePattern.length;
                    const baseHeight = basePattern[cycleIndex] ?? 16;
                    const audioMultiplier = 1 + audioLevel * 2;
                    const randomVariation =
                      (Math.random() - 0.5) * audioLevel * 20;
                    const finalHeight =
                      baseHeight * audioMultiplier + randomVariation;

                    return (
                      <div
                        key={i}
                        className="rounded-full bg-gradient-to-t from-red-500 to-orange-400 transition-all duration-75"
                        style={{
                          width: '2px',
                          height: `${Math.max(8, Math.min(56, finalHeight))}px`,
                          opacity: 0.6 + audioLevel * 0.4,
                          transform: `scaleY(${0.7 + audioLevel * 0.8})`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Assessment Results */}
            {recordingState === 'assessed' && assessment && (
              <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-green-50/50 to-blue-50/50 p-6 backdrop-blur-sm dark:border-gray-700/30 dark:from-green-950/10 dark:to-blue-950/10">
                <div className="mb-6 border-b border-gray-100/50 pb-4 dark:border-gray-700/30">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-green-100/80 p-2 dark:bg-green-900/30">
                      <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Assessment Results
                    </h3>
                  </div>
                </div>

                {/* Score Overview */}
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${getScoreColor(assessment.overallScore)}`}
                    >
                      {assessment.overallScore}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Overall
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${getScoreColor(assessment.accuracyScore)}`}
                    >
                      {assessment.accuracyScore}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Accuracy
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${getScoreColor(assessment.fluencyScore)}`}
                    >
                      {assessment.fluencyScore}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Fluency
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Improvement Suggestions:
                  </h4>
                  <ul className="space-y-2">
                    {assessment.suggestions
                      .slice(0, 3)
                      .map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {suggestion}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Transcription Results */}
            {(recordingState === 'processing' ||
              recordingState === 'completed' ||
              recordingState === 'assessed') && (
              <div className="flex min-h-[400px] flex-col rounded-3xl border border-white/20 bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-6 backdrop-blur-sm dark:border-gray-700/30 dark:from-purple-950/10 dark:to-pink-950/10">
                <div className="mb-4 border-b border-gray-100/50 pb-4 dark:border-gray-700/30">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        recordingState === 'processing'
                          ? 'animate-pulse bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                    ></div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {recordingState === 'processing'
                        ? 'Processing Speech'
                        : 'Transcription Result'}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col">
                  {recordingState === 'processing' ? (
                    <div className="flex min-h-[300px] flex-1 items-center justify-center rounded-xl bg-white/60 p-6 dark:bg-gray-800/60">
                      <div className="text-center">
                        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        <p className="text-gray-400 italic">
                          {transcriber.isModelLoading
                            ? `Loading AI model... ${Math.round(transcriber.modelLoadingProgress)}%`
                            : 'Analyzing your speech...'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-[300px] flex-1 rounded-xl bg-white/60 p-6 dark:bg-gray-800/60">
                      <p className="leading-relaxed text-gray-800 dark:text-gray-200">
                        {finalTranscript}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Model Loading Progress */}
            {transcriber.isModelLoading && (
              <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-4 backdrop-blur-sm dark:border-gray-700/30 dark:from-blue-950/10 dark:to-purple-950/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    Loading AI Model...
                  </span>
                  <span className="text-blue-600 dark:text-blue-300">
                    {Math.round(transcriber.modelLoadingProgress)}%
                  </span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-blue-200/50 dark:bg-blue-800/30">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${transcriber.modelLoadingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Recording Controls */}
          <div className="space-y-6">
            {/* Recording Button */}
            <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-8 text-center backdrop-blur-sm dark:border-gray-700/30 dark:from-blue-950/10 dark:to-purple-950/10">
              <button
                onClick={handleRecordClick}
                disabled={
                  recordingState === 'processing' ||
                  recordingState === 'assessed' ||
                  transcriber.isModelLoading
                }
                className={`group relative transform rounded-full p-8 transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${
                  recordingState === 'recording'
                    ? 'bg-red-500 shadow-lg shadow-red-500/25 hover:bg-red-600'
                    : recordingState === 'processing'
                      ? 'bg-yellow-500 shadow-lg shadow-yellow-500/25'
                      : recordingState === 'completed' ||
                          recordingState === 'assessed'
                        ? 'bg-green-500 shadow-lg shadow-green-500/25 hover:bg-green-600'
                        : 'bg-blue-500 shadow-lg shadow-blue-500/25 hover:bg-blue-600'
                }`}
              >
                {recordingState === 'recording' && (
                  <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-20"></div>
                )}

                <div className="relative">
                  {recordingState === 'processing' ||
                  transcriber.isModelLoading ? (
                    <div className="animate-spin">
                      <Zap className="h-12 w-12 text-white" />
                    </div>
                  ) : recordingState === 'assessed' ? (
                    <TrendingUp className="h-12 w-12 text-white" />
                  ) : (
                    <Mic className="h-12 w-12 text-white" />
                  )}
                </div>
              </button>

              <div className="mt-6">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {recordingState === 'idle' && 'Click to start recording'}
                  {recordingState === 'recording' &&
                    'Recording... Click to stop'}
                  {recordingState === 'processing' &&
                    (transcriber.isModelLoading
                      ? 'Loading AI model...'
                      : 'Processing your speech...')}
                  {recordingState === 'completed' && 'Recording completed!'}
                  {recordingState === 'assessed' && 'Assessment complete!'}
                </p>
              </div>
            </div>

            {/* Upload Interface */}
            <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-green-50/50 to-blue-50/50 p-8 text-center backdrop-blur-sm dark:border-gray-700/30 dark:from-green-950/10 dark:to-blue-950/10">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={
                  recordingState === 'recording' ||
                  recordingState === 'processing'
                }
                className="group w-full transform rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4 text-white transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-lg font-medium">Upload Audio</span>
                </div>
              </button>

              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                or drop file here
              </p>

              {uploadedAudioUrl &&
                (recordingState === 'completed' ||
                  recordingState === 'assessed') && (
                  <div className="mt-4 rounded-xl bg-white/60 p-4 dark:bg-gray-800/60">
                    <div className="mb-2 flex items-center space-x-2">
                      <Play className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Uploaded Audio
                      </span>
                    </div>
                    <audio controls className="w-full" src={uploadedAudioUrl}>
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
            </div>

            {/* Pro Tips */}
            <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 p-6 backdrop-blur-sm dark:border-gray-700/30 dark:from-yellow-950/10 dark:to-orange-950/10">
              <h3 className="mb-3 text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                💡 Pro Tips
              </h3>
              <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                <li>• Speak clearly and at a moderate pace</li>
                <li>• Ensure you&apos;re in a quiet environment</li>
                <li>• Hold your device 6-8 inches from your mouth</li>
                <li>• Practice difficult words multiple times</li>
              </ul>
            </div>

            {/* Session Summary */}
            {recordingState === 'assessed' && assessment && (
              <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-green-50/50 to-blue-50/50 p-6 backdrop-blur-sm dark:border-gray-700/30 dark:from-green-950/10 dark:to-blue-950/10">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="rounded-lg bg-green-100/80 p-2 dark:bg-green-900/30">
                    <div className="h-5 w-5 rounded-full bg-green-500"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Session Complete!
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Overall Score:
                    </span>
                    <span
                      className={`font-semibold ${getScoreColor(assessment.overallScore)}`}
                    >
                      {assessment.overallScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Words Transcribed:
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {finalTranscript.split(' ').filter(w => w.trim()).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Original Words:
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {words.length}
                    </span>
                  </div>
                  {recordingTime > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Duration:
                      </span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {formatTime(recordingTime)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
