'use client';

import {
  ArrowLeft,
  AudioWaveform,
  Download,
  FileText,
  Mic,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RecordPage() {
  const [selectedText, setSelectedText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isUploadedFile, setIsUploadedFile] = useState(false);
  const [recordingState, setRecordingState] = useState<
    'idle' | 'recording' | 'processing' | 'completed'
  >('idle');
  const [realTimeTranscript, setRealTimeTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [accuracyScore, setAccuracyScore] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
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
      // For uploaded files, we would extract content here
      // For now, using placeholder content
      setSelectedText(
        `This is the extracted content from ${storedFileName}. In a real implementation, this would be the actual text content extracted from the PDF or DOCX file using PDF.js or Mammoth.js. The content would be much longer and contain the actual text that the user wants to practice reading aloud for pronunciation improvement.`
      );
    } else {
      setIsUploadedFile(false);
    }

    // If no text is available, redirect back to home
    if (!storedText && !storedFileName) {
      router.push('/');
    }
  }, [router]);

  const words = selectedText.split(' ').filter(word => word.trim());

  const handleRecordClick = () => {
    if (recordingState === 'idle') {
      setRecordingState('recording');
      setRealTimeTranscript('');
      setCurrentWordIndex(0);
      console.log('Starting recording...');

      // Simulate real-time transcription
      simulateTranscription();
    } else if (recordingState === 'recording') {
      setRecordingState('processing');
      console.log('Stopping recording...');

      // Simulate processing and analysis
      setTimeout(() => {
        setFinalTranscript(realTimeTranscript);
        setAccuracyScore(Math.floor(Math.random() * 15) + 85); // Random score 85-100
        setRecordingState('completed');
      }, 3000);
    }
  };

  const simulateTranscription = () => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < words.length && recordingState === 'recording') {
        setRealTimeTranscript(
          prev => prev + (prev ? ' ' : '') + words[currentIndex]
        );
        setCurrentWordIndex(currentIndex);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 600);
  };

  const handleRestart = () => {
    setRecordingState('idle');
    setRealTimeTranscript('');
    setFinalTranscript('');
    setCurrentWordIndex(0);
    setAccuracyScore(0);
  };

  const handleNewText = () => {
    // Clear all session storage
    sessionStorage.removeItem('selectedText');
    sessionStorage.removeItem('uploadedFileName');
    router.push('/');
  };

  const handleDownloadReport = () => {
    // TODO: Generate and download PDF report
    console.log('Downloading report...');
  };

  if (!selectedText) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={handleNewText}
            className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Choose Different Text</span>
          </button>

          <div className="flex items-center space-x-3">
            {recordingState === 'completed' && (
              <>
                <button
                  onClick={handleDownloadReport}
                  className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </>
            )}
            <button
              onClick={handleRestart}
              className="flex items-center space-x-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-700 hover:shadow-md"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Restart</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Text Display */}
          <div className="space-y-6 lg:col-span-2">
            {/* Text Preview */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
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
                    <div className="rounded-full bg-green-50 px-3 py-1 dark:bg-green-900/20">
                      <span className="text-xs font-medium text-green-700 dark:text-green-300">
                        Extracted Content
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto p-6">
                <div className="space-y-1 text-lg leading-relaxed">
                  {words.map((word, index) => (
                    <span
                      key={index}
                      className={`mr-2 inline-block transition-all duration-300 ${
                        recordingState === 'recording' &&
                        index === currentWordIndex
                          ? 'rounded-md bg-blue-100 px-1 py-0.5 text-blue-900 dark:bg-blue-800/30 dark:text-blue-100'
                          : recordingState === 'recording' &&
                              index < currentWordIndex
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Real-time Transcription */}
            {(recordingState === 'recording' ||
              recordingState === 'processing' ||
              recordingState === 'completed') && (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        recordingState === 'recording'
                          ? 'animate-pulse bg-red-500'
                          : recordingState === 'processing'
                            ? 'animate-pulse bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                    ></div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {recordingState === 'recording'
                        ? 'Live Transcription'
                        : recordingState === 'processing'
                          ? 'Processing Speech'
                          : 'Final Transcription'}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="min-h-[100px] rounded-xl bg-gray-50 p-4 dark:bg-gray-900/50">
                    <p className="text-gray-800 dark:text-gray-200">
                      {recordingState === 'completed'
                        ? finalTranscript
                        : realTimeTranscript || (
                            <span className="text-gray-400 italic">
                              {recordingState === 'processing'
                                ? 'Processing your speech...'
                                : 'Your speech will appear here...'}
                            </span>
                          )}
                      {recordingState === 'recording' && (
                        <span className="ml-1 animate-pulse text-blue-500">
                          |
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Recording Controls & Visualization */}
          <div className="space-y-6">
            {/* Recording Button */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={handleRecordClick}
                disabled={recordingState === 'processing'}
                className={`group relative transform rounded-full p-8 transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${
                  recordingState === 'recording'
                    ? 'bg-red-500 shadow-lg shadow-red-500/25 hover:bg-red-600'
                    : recordingState === 'processing'
                      ? 'bg-yellow-500 shadow-lg shadow-yellow-500/25'
                      : recordingState === 'completed'
                        ? 'bg-green-500 shadow-lg shadow-green-500/25 hover:bg-green-600'
                        : 'bg-blue-500 shadow-lg shadow-blue-500/25 hover:bg-blue-600'
                }`}
              >
                {/* Pulsing ring for recording state */}
                {recordingState === 'recording' && (
                  <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-20"></div>
                )}

                <div className="relative">
                  {recordingState === 'processing' ? (
                    <div className="animate-spin">
                      <Zap className="h-12 w-12 text-white" />
                    </div>
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
                    'Processing your speech...'}
                  {recordingState === 'completed' && 'Recording completed!'}
                </p>
                {recordingState === 'recording' && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Word {currentWordIndex + 1} of {words.length}
                  </p>
                )}
              </div>
            </div>

            {/* Waveform Visualization */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 flex items-center space-x-3">
                <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/20">
                  <AudioWaveform className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Audio Visualization
                </h3>
              </div>

              {/* Waveform Display */}
              <div className="mb-6 flex h-24 items-end justify-center space-x-1">
                {[...Array(20)].map((_, i) => {
                  const heights = [
                    15, 25, 35, 45, 55, 45, 65, 55, 60, 50, 70, 60, 55, 58, 48,
                    52, 40, 32, 45, 30,
                  ];
                  return (
                    <div
                      key={i}
                      className={`rounded-full transition-all duration-1000 ${
                        recordingState === 'recording'
                          ? 'animate-pulse bg-red-500'
                          : recordingState === 'processing'
                            ? 'animate-pulse bg-yellow-500'
                            : recordingState === 'completed'
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                      }`}
                      style={{
                        width: '4px',
                        height: `${heights[i]}px`,
                        opacity:
                          recordingState === 'recording'
                            ? 0.6 + (i % 3) * 0.2
                            : 0.4 + (i % 2) * 0.2,
                        animationDelay:
                          recordingState === 'recording'
                            ? `${i * 50}ms`
                            : '0ms',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Session Summary */}
            {recordingState === 'completed' && (
              <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-blue-50 p-6 shadow-sm dark:border-green-700/30 dark:from-green-900/10 dark:to-blue-900/10">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                    <div className="h-5 w-5 rounded-full bg-green-500"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Session Complete!
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Accuracy Score:
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {accuracyScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Words Read:
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {words.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Duration:
                    </span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      ~{Math.ceil(words.length / 180)} min
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
