export interface QuizWord {
  id: string;
  word: string;
  phonetic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'common' | 'business' | 'academic' | 'technical';
  audioUrl?: string;
  tips?: string[];
}

export interface QuizSentence {
  id: string;
  text: string;
  difficulty: 'intermediate' | 'advanced';
  category: 'common' | 'business' | 'academic' | 'technical';
  audioUrl?: string;
  focusWords: string[];
  tips?: string[];
}

export interface QuizItem {
  id: string;
  type: 'word' | 'sentence';
  content: QuizWord | QuizSentence;
  targetScore: number;
}

export interface QuizSession {
  id: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  score: number;
  streak: number;
  correctAnswers: number;
  totalAttempts: number;
  items: QuizSessionItem[];
}

export interface QuizSessionItem {
  id: string;
  quizItem: QuizItem;
  attempts: PronunciationAttempt[];
  completed: boolean;
  bestScore: number;
}

export interface PronunciationAttempt {
  id: string;
  audioBlob?: Blob;
  transcription: string;
  pronunciationScore: number;
  feedback: PronunciationFeedback;
  timestamp: Date;
}

export interface PronunciationFeedback {
  overall: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  accuracy: number;
  fluency: number;
  pronunciation: number;
  suggestions: string[];
  mistakesDetected: string[];
}

export class QuizEngine {
  private wordBank: QuizWord[] = [
    // Beginner words
    {
      id: 'w1',
      word: 'hello',
      phonetic: '/həˈloʊ/',
      difficulty: 'beginner',
      category: 'common',
      tips: ['Stress on the second syllable', 'The "o" sound is long'],
    },
    {
      id: 'w2',
      word: 'water',
      phonetic: '/ˈwɔːtər/',
      difficulty: 'beginner',
      category: 'common',
      tips: ['Stress on the first syllable', 'The "a" sounds like "aw"'],
    },
    {
      id: 'w3',
      word: 'computer',
      phonetic: '/kəmˈpjuːtər/',
      difficulty: 'beginner',
      category: 'technical',
      tips: [
        'Stress on the second syllable',
        'The first syllable is unstressed',
      ],
    },
    {
      id: 'w4',
      word: 'beautiful',
      phonetic: '/ˈbjuːtɪfəl/',
      difficulty: 'beginner',
      category: 'common',
      tips: ['Stress on the first syllable', 'Three syllables: beau-ti-ful'],
    },
    {
      id: 'w5',
      word: 'important',
      phonetic: '/ɪmˈpɔːrtənt/',
      difficulty: 'beginner',
      category: 'common',
      tips: ['Stress on the second syllable', 'The "or" sounds like "oar"'],
    },

    // Intermediate words
    {
      id: 'w6',
      word: 'pronunciation',
      phonetic: '/prəˌnʌnsiˈeɪʃən/',
      difficulty: 'intermediate',
      category: 'academic',
      tips: [
        'Stress on the fourth syllable',
        'Six syllables total',
        'The "ci" sounds like "see"',
      ],
    },
    {
      id: 'w7',
      word: 'entrepreneur',
      phonetic: '/ˌɑːntrəprəˈnɜːr/',
      difficulty: 'intermediate',
      category: 'business',
      tips: [
        'French origin word',
        'Stress on the last syllable',
        'Silent "t" at the end',
      ],
    },
    {
      id: 'w8',
      word: 'algorithm',
      phonetic: '/ˈælɡərɪðəm/',
      difficulty: 'intermediate',
      category: 'technical',
      tips: [
        'Stress on the first syllable',
        'The "th" is soft',
        'Al-go-ri-thm',
      ],
    },
    {
      id: 'w9',
      word: 'development',
      phonetic: '/dɪˈveləpmənt/',
      difficulty: 'intermediate',
      category: 'business',
      tips: ['Stress on the second syllable', 'Four syllables total'],
    },
    {
      id: 'w10',
      word: 'responsibility',
      phonetic: '/rɪˌspɑːnsəˈbɪləti/',
      difficulty: 'intermediate',
      category: 'business',
      tips: [
        'Stress on the fourth syllable',
        'Six syllables total',
        'Silent "b" in the middle',
      ],
    },

    // Advanced words
    {
      id: 'w11',
      word: 'phenomenon',
      phonetic: '/fəˈnɑːmɪnən/',
      difficulty: 'advanced',
      category: 'academic',
      tips: [
        'Stress on the second syllable',
        'Greek origin',
        'The "ph" sounds like "f"',
      ],
    },
    {
      id: 'w12',
      word: 'architecture',
      phonetic: '/ˈɑːrkɪˌtektʃər/',
      difficulty: 'advanced',
      category: 'academic',
      tips: ['Stress on the first syllable', 'The "ch" sounds like "k"'],
    },
    {
      id: 'w13',
      word: 'pharmaceutical',
      phonetic: '/ˌfɑːrməˈsuːtɪkəl/',
      difficulty: 'advanced',
      category: 'technical',
      tips: [
        'Stress on the third syllable',
        'The "ph" sounds like "f"',
        'Five syllables',
      ],
    },
    {
      id: 'w14',
      word: 'unconscious',
      phonetic: '/ʌnˈkɑːnʃəs/',
      difficulty: 'advanced',
      category: 'academic',
      tips: ['Stress on the second syllable', 'The "sc" sounds like "sh"'],
    },
    {
      id: 'w15',
      word: 'bureaucracy',
      phonetic: '/bjʊˈrɑːkrəsi/',
      difficulty: 'advanced',
      category: 'business',
      tips: [
        'Stress on the second syllable',
        'Four syllables',
        'French origin',
      ],
    },
  ];

  private sentenceBank: QuizSentence[] = [
    // Intermediate sentences
    {
      id: 's1',
      text: 'The weather is beautiful today.',
      difficulty: 'intermediate',
      category: 'common',
      focusWords: ['weather', 'beautiful', 'today'],
      tips: ['Focus on clear consonants', 'Link words smoothly'],
    },
    {
      id: 's2',
      text: 'I need to schedule a meeting for tomorrow.',
      difficulty: 'intermediate',
      category: 'business',
      focusWords: ['schedule', 'meeting', 'tomorrow'],
      tips: ['Clear "sch" in schedule', 'Stress on important words'],
    },
    {
      id: 's3',
      text: 'The computer algorithm processes data efficiently.',
      difficulty: 'intermediate',
      category: 'technical',
      focusWords: ['computer', 'algorithm', 'processes', 'efficiently'],
      tips: ['Technical terms need clear pronunciation', 'Maintain rhythm'],
    },
    {
      id: 's4',
      text: 'Education is important for personal development.',
      difficulty: 'intermediate',
      category: 'academic',
      focusWords: ['education', 'important', 'development'],
      tips: ['Stress key syllables', 'Clear vowel sounds'],
    },

    // Advanced sentences
    {
      id: 's5',
      text: 'The pharmaceutical company announced breakthrough research results.',
      difficulty: 'advanced',
      category: 'technical',
      focusWords: ['pharmaceutical', 'announced', 'breakthrough', 'research'],
      tips: ['Complex vocabulary requires precision', 'Maintain natural flow'],
    },
    {
      id: 's6',
      text: 'The architecture of the building demonstrates extraordinary craftsmanship.',
      difficulty: 'advanced',
      category: 'academic',
      focusWords: [
        'architecture',
        'demonstrates',
        'extraordinary',
        'craftsmanship',
      ],
      tips: ['Long sentences need breath control', 'Emphasize key concepts'],
    },
    {
      id: 's7',
      text: 'Unconscious bias affects decision-making in organizations.',
      difficulty: 'advanced',
      category: 'business',
      focusWords: [
        'unconscious',
        'affects',
        'decision-making',
        'organizations',
      ],
      tips: ['Professional vocabulary', 'Clear articulation needed'],
    },
    {
      id: 's8',
      text: 'The phenomenon requires comprehensive analysis and documentation.',
      difficulty: 'advanced',
      category: 'academic',
      focusWords: ['phenomenon', 'comprehensive', 'analysis', 'documentation'],
      tips: ['Academic language precision', 'Maintain formal tone'],
    },
  ];

  getRandomWord(
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): QuizWord {
    const availableWords = this.wordBank.filter(
      word => word.difficulty === difficulty
    );
    return availableWords[Math.floor(Math.random() * availableWords.length)]!;
  }

  getRandomSentence(difficulty: 'intermediate' | 'advanced'): QuizSentence {
    const availableSentences = this.sentenceBank.filter(
      sentence => sentence.difficulty === difficulty
    );
    return availableSentences[
      Math.floor(Math.random() * availableSentences.length)
    ]!;
  }

  createQuizItem(
    level: 'beginner' | 'intermediate' | 'advanced',
    type?: 'word' | 'sentence'
  ): QuizItem {
    let content: QuizWord | QuizSentence;
    let itemType: 'word' | 'sentence';

    if (level === 'beginner') {
      itemType = 'word';
      content = this.getRandomWord('beginner');
    } else if (type === 'word' || (type === undefined && Math.random() < 0.7)) {
      itemType = 'word';
      content = this.getRandomWord(level);
    } else {
      itemType = 'sentence';
      content = this.getRandomSentence(level);
    }

    return {
      id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: itemType,
      content,
      targetScore: this.getTargetScore(level, itemType),
    };
  }

  private getTargetScore(
    level: 'beginner' | 'intermediate' | 'advanced',
    type: 'word' | 'sentence'
  ): number {
    const baseScores = {
      beginner: { word: 70, sentence: 75 },
      intermediate: { word: 75, sentence: 80 },
      advanced: { word: 80, sentence: 85 },
    };

    return baseScores[level][type];
  }

  calculateNextLevel(
    currentLevel: 'beginner' | 'intermediate' | 'advanced',
    correctAnswers: number,
    totalAttempts: number
  ): 'beginner' | 'intermediate' | 'advanced' {
    const accuracy = totalAttempts > 0 ? correctAnswers / totalAttempts : 0;

    if (currentLevel === 'beginner' && accuracy >= 0.8 && correctAnswers >= 5) {
      return 'intermediate';
    } else if (
      currentLevel === 'intermediate' &&
      accuracy >= 0.85 &&
      correctAnswers >= 10
    ) {
      return 'advanced';
    }

    return currentLevel;
  }

  scorePronunciation(
    transcription: string,
    expected: string
  ): PronunciationFeedback {
    // Simplified scoring logic - in reality, you'd use more sophisticated phonetic analysis
    const normalizeText = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .trim();
    const transcribedText = normalizeText(transcription);
    const expectedText = normalizeText(expected);

    // Calculate basic similarity
    const similarity = this.calculateSimilarity(transcribedText, expectedText);
    const accuracy = Math.max(0, Math.min(100, similarity * 100));

    // Determine overall rating
    let overall: PronunciationFeedback['overall'];
    if (accuracy >= 90) overall = 'excellent';
    else if (accuracy >= 75) overall = 'good';
    else if (accuracy >= 60) overall = 'needs_improvement';
    else overall = 'poor';

    // Generate feedback
    const suggestions: string[] = [];
    const mistakes: string[] = [];

    if (accuracy < 90) {
      suggestions.push('Practice speaking more slowly and clearly');
      if (accuracy < 75) {
        suggestions.push('Focus on pronouncing each syllable distinctly');
      }
      if (accuracy < 60) {
        suggestions.push(
          'Try listening to the word/sentence multiple times before speaking'
        );
        mistakes.push('Significant pronunciation differences detected');
      }
    }

    return {
      overall,
      accuracy,
      fluency: Math.max(60, accuracy - 5), // Simplified fluency score
      pronunciation: accuracy,
      suggestions,
      mistakesDetected: mistakes,
    };
  }

  private calculateSimilarity(text1: string, text2: string): number {
    // Simple Levenshtein distance-based similarity
    const matrix: number[][] = [];
    const len1 = text1.length;
    const len2 = text2.length;

    if (len1 === 0) return len2 === 0 ? 1 : 0;
    if (len2 === 0) return 0;

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0]![j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = text1[i - 1] === text2[j - 1] ? 0 : 1;
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j]! + 1, // deletion
          matrix[i]![j - 1]! + 1, // insertion
          matrix[i - 1]![j - 1]! + cost // substitution
        );
      }
    }

    const maxLength = Math.max(len1, len2);
    return (maxLength - matrix[len1]![len2]!) / maxLength;
  }
}

export const quizEngine = new QuizEngine();
