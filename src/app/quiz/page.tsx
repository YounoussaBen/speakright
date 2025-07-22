'use client';

// Speech Recognition type definitions
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionResult {
  [key: number]: SpeechRecognitionAlternative;
  readonly length: number;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultList {
  [key: number]: SpeechRecognitionResult;
  readonly length: number;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  }

  interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    start(): void;
    stop(): void;
  }
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import {
  PronunciationAttempt,
  PronunciationFeedback,
  QuizEngine,
  QuizItem,
  QuizSession,
} from '@/lib/quiz-engine';
import { quizStore, type UserQuizStats } from '@/lib/quiz-store';
import {
  Award,
  Brain,
  CheckCircle,
  Mic,
  MicOff,
  Play,
  RefreshCw,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Volume2,
  XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

const quizEngine = new QuizEngine();

export default function QuizPage() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(
    null
  );
  const [currentItem, setCurrentItem] = useState<QuizItem | null>(null);
  const [currentAttempt, setCurrentAttempt] =
    useState<PronunciationAttempt | null>(null);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<
    'start' | 'playing' | 'feedback' | 'completed'
  >('start');
  const [userStats, setUserStats] = useState<UserQuizStats | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const loadUserStats = useCallback(async () => {
    if (!user) return;

    try {
      const stats = await quizStore.getUserStats(user.uid);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  }, [user]);

  // Initialize speech recognition and load user stats
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
    }

    // Load user stats
    if (user) {
      loadUserStats();
    }
  }, [user, loadUserStats]);

  const startNewSession = () => {
    if (!user) return;

    // Use user's current level from stats, or default to beginner
    const initialLevel = userStats?.currentLevel || 'beginner';

    const newSession: QuizSession = {
      id: `session_${Date.now()}`,
      userId: user.uid,
      startedAt: new Date(),
      currentLevel: initialLevel,
      score: 0,
      streak: 0,
      correctAnswers: 0,
      totalAttempts: 0,
      items: [],
    };

    setCurrentSession(newSession);
    setGameState('playing');
    generateNextItem(newSession);
  };

  const generateNextItem = (session: QuizSession) => {
    const newItem = quizEngine.createQuizItem(session.currentLevel);
    setCurrentItem(newItem);
    setFeedback(null);
    setCurrentAttempt(null);
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Recording is not supported in your browser');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start media recorder for audio blob
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        stream.getTracks().forEach(track => track.stop());

        // Create attempt with audio blob
        if (currentAttempt) {
          setCurrentAttempt({
            ...currentAttempt,
            audioBlob,
          });
        }
      };

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.onresult = event => {
          const transcript = event.results[0]?.[0]?.transcript || '';

          const attempt: PronunciationAttempt = {
            id: `attempt_${Date.now()}`,
            transcription: transcript,
            pronunciationScore: 0,
            feedback: {
              overall: 'poor',
              accuracy: 0,
              fluency: 0,
              pronunciation: 0,
              suggestions: [],
              mistakesDetected: [],
            },
            timestamp: new Date(),
          };

          setCurrentAttempt(attempt);
          setIsRecording(false);

          // Process the pronunciation
          processPronunciation(transcript);
        };

        recognitionRef.current.onerror = event => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognitionRef.current.start();
      }

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const processPronunciation = async (transcription: string) => {
    if (!currentItem || !currentSession) return;

    setIsLoading(true);

    // Get expected text based on item type
    const expectedText =
      currentItem.type === 'word'
        ? (currentItem.content as { word: string }).word
        : (currentItem.content as { text: string }).text;

    // Score the pronunciation
    const pronunciationFeedback = quizEngine.scorePronunciation(
      transcription,
      expectedText
    );

    // Create final attempt
    const finalAttempt: PronunciationAttempt = {
      id: `attempt_${Date.now()}`,
      transcription,
      pronunciationScore: pronunciationFeedback.accuracy,
      feedback: pronunciationFeedback,
      timestamp: new Date(),
      audioBlob: currentAttempt?.audioBlob || new Blob(),
    };

    setCurrentAttempt(finalAttempt);
    setFeedback(pronunciationFeedback);

    // Update session
    const isCorrect = pronunciationFeedback.accuracy >= currentItem.targetScore;
    const updatedSession: QuizSession = {
      ...currentSession,
      score:
        currentSession.score + (isCorrect ? pronunciationFeedback.accuracy : 0),
      streak: isCorrect ? currentSession.streak + 1 : 0,
      correctAnswers: currentSession.correctAnswers + (isCorrect ? 1 : 0),
      totalAttempts: currentSession.totalAttempts + 1,
    };

    // Check for level progression
    updatedSession.currentLevel = quizEngine.calculateNextLevel(
      updatedSession.currentLevel,
      updatedSession.correctAnswers,
      updatedSession.totalAttempts
    );

    setCurrentSession(updatedSession);
    setGameState('feedback');
    setIsLoading(false);
  };

  const continueQuiz = async () => {
    if (!currentSession) return;

    // Save progress after each item
    try {
      await quizStore.saveQuizSession({
        ...currentSession,
        completedAt: new Date(),
      });

      // Refresh user stats
      await loadUserStats();
    } catch (error) {
      console.error('Error saving session progress:', error);
    }

    generateNextItem(currentSession);
    setGameState('playing');
  };

  const speakWord = () => {
    if (!currentItem) return;

    const text =
      currentItem.type === 'word'
        ? (currentItem.content as { word: string }).word
        : (currentItem.content as { text: string }).text;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Brain className="mx-auto mb-4 h-12 w-12 text-blue-500" />
            <h2 className="mb-2 text-xl font-semibold">Login Required</h2>
            <p className="text-gray-600">
              Please log in to access the pronunciation quiz.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStartScreen = () => (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold">Pronunciation Quiz</h1>
        <p className="text-gray-600">
          Test and improve your pronunciation with AI-powered feedback
        </p>
      </div>

      {/* User Stats */}
      {userStats && (
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {userStats.averageScore.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {userStats.totalSessions}
              </div>
              <div className="text-sm text-gray-600">Sessions Played</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {userStats.longestStreak}
              </div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 capitalize">
                {userStats.currentLevel}
              </div>
              <div className="text-sm text-gray-600">Current Level</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="mx-auto mb-3 h-8 w-8 text-blue-500" />
            <h3 className="mb-2 font-semibold">Progressive Difficulty</h3>
            <p className="text-sm text-gray-600">
              Start with simple words and advance to complex sentences
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Brain className="mx-auto mb-3 h-8 w-8 text-green-500" />
            <h3 className="mb-2 font-semibold">AI Feedback</h3>
            <p className="text-sm text-gray-600">
              Get instant feedback and tips to improve your pronunciation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="mx-auto mb-3 h-8 w-8 text-purple-500" />
            <h3 className="mb-2 font-semibold">Track Progress</h3>
            <p className="text-sm text-gray-600">
              Monitor your improvement with detailed scoring
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button
          onClick={startNewSession}
          className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-lg"
        >
          <Play className="mr-2 h-5 w-5" />
          {userStats?.totalSessions === 0
            ? 'Start First Quiz'
            : 'Continue Learning'}
        </Button>
      </div>
    </div>
  );

  const renderQuizItem = () => {
    if (!currentItem) return null;

    const isWord = currentItem.type === 'word';
    const content = currentItem.content as {
      word?: string;
      text?: string;
      phonetic?: string;
      tips?: string[];
    };

    return (
      <div className="mx-auto max-w-2xl p-6">
        {/* Session Info */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">
                {currentSession?.score.toFixed(0) || 0}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-blue-500" />
              <span>{currentSession?.streak || 0}</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Level:{' '}
            <span className="font-semibold capitalize">
              {currentSession?.currentLevel}
            </span>
          </div>
        </div>

        {/* Quiz Item */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              {isWord ? 'Pronounce this word' : 'Pronounce this sentence'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  {isWord ? content.word : content.text}
                </h2>
                {isWord && content.phonetic && (
                  <p className="mt-2 text-lg text-gray-600">
                    {content.phonetic}
                  </p>
                )}
              </div>

              <div className="flex justify-center space-x-3">
                <Button
                  onClick={speakWord}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>Listen</span>
                </Button>

                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                  className={`flex items-center space-x-2 ${
                    isRecording
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                  <span>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </span>
                </Button>
              </div>

              {isRecording && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center space-x-2 text-red-600">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-red-600"></div>
                    <span className="text-sm font-medium">Recording...</span>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center space-x-2 text-blue-600">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">Processing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            {content.tips && content.tips.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="mb-2 font-semibold text-gray-700">Tips:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {content.tips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFeedback = () => {
    if (!feedback || !currentAttempt || !currentItem) return null;

    const isCorrect = feedback.accuracy >= currentItem.targetScore;

    return (
      <div className="mx-auto max-w-2xl p-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            {/* Result */}
            <div className="text-center">
              <div className="mb-4">
                {isCorrect ? (
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="mx-auto h-16 w-16 text-red-500" />
                )}
              </div>
              <h2 className="mb-2 text-2xl font-bold">
                {isCorrect ? 'Great job!' : 'Keep practicing!'}
              </h2>
              <p className="text-gray-600">
                You said: &ldquo;{currentAttempt.transcription}&rdquo;
              </p>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {feedback.accuracy.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {feedback.fluency.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Fluency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {feedback.pronunciation.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Pronunciation</div>
              </div>
            </div>

            {/* Feedback */}
            {feedback.suggestions.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="mb-2 font-semibold text-gray-700">
                  Suggestions:
                </h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  {feedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <Button
                onClick={continueQuiz}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20">
      {gameState === 'start' && renderStartScreen()}
      {gameState === 'playing' && renderQuizItem()}
      {gameState === 'feedback' && renderFeedback()}
    </div>
  );
}
