// src/lib/assessment-engine.ts
import { PronunciationAssessment } from '@/stores/session-store';

// Simplified phoneme mapping for common English words
const PHONEME_MAP: Record<string, string> = {
  // Common vowels
  a: 'æ',
  e: 'ɛ',
  i: 'ɪ',
  o: 'ɔ',
  u: 'ʌ',
  ee: 'i',
  oo: 'u',
  ou: 'aʊ',
  ow: 'aʊ',
  ay: 'eɪ',
  ai: 'eɪ',
  ey: 'eɪ',
  igh: 'aɪ',
  ie: 'aɪ',
  y: 'aɪ',

  // Common consonants
  th: 'θ',
  sh: 'ʃ',
  ch: 'tʃ',
  ng: 'ŋ',
  ph: 'f',
  gh: 'f',
  ck: 'k',

  // Silent letters patterns
  kn: 'n',
  wr: 'r',
  mb: 'm',
};

// Common mispronunciation patterns
const COMMON_MISTAKES: Record<string, string[]> = {
  th: ['f', 'd', 't', 's'],
  v: ['w', 'b'],
  w: ['v'],
  r: ['l'],
  l: ['r'],
  p: ['b'],
  b: ['p'],
  t: ['d'],
  d: ['t'],
  k: ['g'],
  g: ['k'],
};

// Word difficulty levels - using cSpell ignore for phoneme patterns
const DIFFICULTY_PATTERNS = {
  easy: /^[a-z]{1,4}$/i,
  medium: /^[a-z]{5,7}$/i,
  hard: /^[a-z]{8,}$/i,
  // cspell:disable-next-line
  complex: /(th|sh|ch|ng|ough|augh|eigh)/i,
};

interface WordAnalysis {
  word: string;
  originalWord: string;
  matched: boolean;
  similarity: number;
  phonemeErrors: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'complex';
}

export class PronunciationAssessmentEngine {
  /**
   * Main assessment function
   */
  static assessPronunciation(
    originalText: string,
    transcribedText: string,
    duration: number = 0
  ): PronunciationAssessment {
    const originalWords = this.normalizeText(originalText);
    const transcribedWords = this.normalizeText(transcribedText);

    // Align words using simple matching
    const alignment = this.alignWords(originalWords, transcribedWords);

    // Analyze each word
    const wordAnalyses = alignment.map(({ original, transcribed }) =>
      this.analyzeWord(original, transcribed)
    );

    // Calculate scores
    const scores = this.calculateScores(
      wordAnalyses,
      duration,
      originalWords.length
    );

    // Generate word-level details
    const wordLevelScores = wordAnalyses.map(analysis => ({
      word: analysis.word,
      originalWord: analysis.originalWord,
      score: Math.round(analysis.similarity * 100),
      phonemes: this.getPhonemeAnalysis(analysis),
      feedback: this.generateWordFeedback(analysis),
    }));

    // Generate overall suggestions
    const suggestions = this.generateSuggestions(wordAnalyses, scores);

    return {
      overallScore: scores.overall,
      accuracyScore: scores.accuracy,
      fluencyScore: scores.fluency,
      wordLevelScores,
      suggestions,
    };
  }

  /**
   * Normalize text for comparison
   */
  private static normalizeText(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .split(' ')
      .filter(word => word.length > 0);
  }

  /**
   * Simple word alignment algorithm
   */
  private static alignWords(
    original: string[],
    transcribed: string[]
  ): Array<{ original: string; transcribed: string }> {
    const alignment: Array<{ original: string; transcribed: string }> = [];

    let i = 0;
    let j = 0;

    while (i < original.length && j < transcribed.length) {
      const originalWord = original[i];
      const transcribedWord = transcribed[j];

      // Safety check for undefined values
      if (!originalWord || !transcribedWord) {
        if (!originalWord && originalWord !== '') {
          i++;
          continue;
        }
        if (!transcribedWord && transcribedWord !== '') {
          j++;
          continue;
        }
      }

      // Direct match
      if (originalWord === transcribedWord) {
        alignment.push({
          original: originalWord,
          transcribed: transcribedWord,
        });
        i++;
        j++;
      }
      // Similar words (edit distance)
      else if (this.calculateSimilarity(originalWord, transcribedWord) > 0.5) {
        alignment.push({
          original: originalWord,
          transcribed: transcribedWord,
        });
        i++;
        j++;
      }
      // Skip transcribed word (insertion)
      else if (
        j < transcribed.length - 1 &&
        transcribed[j + 1] !== undefined &&
        this.calculateSimilarity(originalWord, transcribed[j + 1] ?? '') > 0.5
      ) {
        j++;
      }
      // Skip original word (deletion)
      else if (
        i < original.length - 1 &&
        original[i + 1] !== undefined &&
        this.calculateSimilarity(original[i + 1] ?? '', transcribedWord) > 0.5
      ) {
        alignment.push({ original: originalWord, transcribed: '' });
        i++;
      }
      // Substitution
      else {
        alignment.push({
          original: originalWord,
          transcribed: transcribedWord,
        });
        i++;
        j++;
      }
    }

    // Handle remaining words
    while (i < original.length) {
      const remainingWord = original[i];
      if (remainingWord !== undefined) {
        alignment.push({ original: remainingWord, transcribed: '' });
      }
      i++;
    }

    return alignment;
  }

  /**
   * Calculate word similarity using Levenshtein distance
   */
  private static calculateSimilarity(word1: string, word2: string): number {
    if (!word1 || !word2) return 0;
    if (word1 === word2) return 1;

    const matrix = Array(word2.length + 1)
      .fill(null)
      .map(() => Array(word1.length + 1).fill(null));

    for (let i = 0; i <= word1.length; i++) matrix[0]![i] = i;
    for (let j = 0; j <= word2.length; j++) matrix[j]![0] = j;

    for (let j = 1; j <= word2.length; j++) {
      for (let i = 1; i <= word1.length; i++) {
        const substitutionCost = word1[i - 1] === word2[j - 1] ? 0 : 1;
        const currentRow = matrix[j];
        const prevRow = matrix[j - 1];
        const currentCell = currentRow?.[i - 1];
        const aboveCell = prevRow?.[i];
        const diagCell = prevRow?.[i - 1];

        if (
          currentRow &&
          typeof currentCell === 'number' &&
          typeof aboveCell === 'number' &&
          typeof diagCell === 'number'
        ) {
          currentRow[i] = Math.min(
            currentCell + 1, // insertion
            aboveCell + 1, // deletion
            diagCell + substitutionCost // substitution
          );
        }
      }
    }

    const maxLength = Math.max(word1.length, word2.length);
    const finalDistance = matrix[word2.length]?.[word1.length];
    return typeof finalDistance === 'number'
      ? (maxLength - finalDistance) / maxLength
      : 0;
  }

  /**
   * Analyze individual word
   */
  private static analyzeWord(
    originalWord: string,
    transcribedWord: string
  ): WordAnalysis {
    const similarity = this.calculateSimilarity(originalWord, transcribedWord);
    const matched = similarity > 0.8;

    // Determine difficulty
    let difficulty: 'easy' | 'medium' | 'hard' | 'complex' = 'medium';
    if (DIFFICULTY_PATTERNS.complex.test(originalWord)) difficulty = 'complex';
    else if (DIFFICULTY_PATTERNS.hard.test(originalWord)) difficulty = 'hard';
    else if (DIFFICULTY_PATTERNS.easy.test(originalWord)) difficulty = 'easy';

    // Find phoneme errors
    const phonemeErrors = this.findPhonemeErrors(originalWord, transcribedWord);

    return {
      word: transcribedWord,
      originalWord,
      matched,
      similarity,
      phonemeErrors,
      difficulty,
    };
  }

  /**
   * Find potential phoneme errors
   */
  private static findPhonemeErrors(
    original: string,
    transcribed: string
  ): string[] {
    const errors: string[] = [];

    // Check for common mistake patterns
    for (const [correct, mistakes] of Object.entries(COMMON_MISTAKES)) {
      if (original.includes(correct)) {
        for (const mistake of mistakes) {
          if (transcribed.includes(mistake) && !transcribed.includes(correct)) {
            errors.push(`${mistake} instead of ${correct}`);
          }
        }
      }
    }

    // Check for missing sounds
    const originalSounds = this.extractSounds(original);
    const transcribedSounds = this.extractSounds(transcribed);

    originalSounds.forEach(sound => {
      if (sound && !transcribedSounds.includes(sound)) {
        errors.push(`missing ${sound}`);
      }
    });

    return errors;
  }

  /**
   * Extract sounds from word (simplified)
   */
  private static extractSounds(word: string): string[] {
    const sounds: string[] = [];
    let i = 0;

    while (i < word.length) {
      // Check for digraphs first
      const twoChar = word.substring(i, i + 2);
      if (PHONEME_MAP[twoChar]) {
        sounds.push(PHONEME_MAP[twoChar]);
        i += 2;
      } else {
        const oneChar = word[i];
        if (oneChar) {
          sounds.push(PHONEME_MAP[oneChar] || oneChar);
        }
        i++;
      }
    }

    return sounds.filter(sound => sound.length > 0);
  }

  /**
   * Calculate comprehensive scores
   */
  private static calculateScores(
    analyses: WordAnalysis[],
    duration: number,
    originalWordCount: number
  ) {
    // Accuracy score (word-level)
    const totalSimilarity = analyses.reduce(
      (sum, analysis) => sum + analysis.similarity,
      0
    );
    const accuracy =
      analyses.length > 0
        ? Math.round((totalSimilarity / analyses.length) * 100)
        : 0;

    // Fluency score (based on speed and hesitation)
    const wordsPerMinute =
      duration > 0 ? (originalWordCount / duration) * 60 : 180;
    const expectedWPM = 180; // Average reading speed
    const speedScore = Math.min(100, (wordsPerMinute / expectedWPM) * 100);

    // Penalty for missing words
    const completionRate =
      analyses.length > 0
        ? analyses.filter(a => a.word).length / analyses.length
        : 0;
    const fluency = Math.round(speedScore * completionRate);

    // Overall score (weighted average)
    const overall = Math.round(accuracy * 0.7 + fluency * 0.3);

    return {
      accuracy: Math.max(0, Math.min(100, accuracy)),
      fluency: Math.max(0, Math.min(100, fluency)),
      overall: Math.max(0, Math.min(100, overall)),
    };
  }

  /**
   * Get phoneme-level analysis for display
   */
  private static getPhonemeAnalysis(analysis: WordAnalysis) {
    const originalPhonemes = this.extractSounds(analysis.originalWord);
    const transcribedPhonemes = this.extractSounds(analysis.word);

    const maxLength = Math.max(
      originalPhonemes.length,
      transcribedPhonemes.length
    );
    const phonemeScores = [];

    for (let i = 0; i < maxLength; i++) {
      const expected = originalPhonemes[i] || '';
      const actual = transcribedPhonemes[i] || '';
      const score = expected === actual ? 100 : 0;

      phonemeScores.push({
        expected,
        actual,
        score,
      });
    }

    return phonemeScores;
  }

  /**
   * Generate word-specific feedback
   */
  private static generateWordFeedback(analysis: WordAnalysis): string[] {
    const feedback: string[] = [];

    if (!analysis.matched) {
      if (analysis.word === '') {
        feedback.push('Word was not recognized - try speaking more clearly');
      } else if (analysis.similarity < 0.3) {
        feedback.push(
          `Pronunciation differs significantly from "${analysis.originalWord}"`
        );
      } else {
        feedback.push(
          `Close pronunciation - review the "${analysis.originalWord}" sound`
        );
      }
    }

    // Add difficulty-specific feedback
    switch (analysis.difficulty) {
      case 'complex':
        feedback.push('This is a challenging word - practice slowly first');
        break;
      case 'hard':
        feedback.push('Focus on each syllable clearly');
        break;
    }

    // Add phoneme-specific feedback
    analysis.phonemeErrors.forEach(error => {
      feedback.push(`Check ${error} sound`);
    });

    return feedback;
  }

  /**
   * Generate overall improvement suggestions
   */
  private static generateSuggestions(
    analyses: WordAnalysis[],
    scores: { accuracy: number; fluency: number; overall: number }
  ): string[] {
    const suggestions: string[] = [];

    // Accuracy-based suggestions
    if (scores.accuracy < 70) {
      suggestions.push(
        'Focus on articulation - speak each word clearly and slowly'
      );
      suggestions.push(
        'Practice difficult words separately before reading full text'
      );
    } else if (scores.accuracy < 85) {
      suggestions.push(
        'Good pronunciation! Focus on the challenging words highlighted above'
      );
    }

    // Fluency-based suggestions
    if (scores.fluency < 60) {
      suggestions.push('Take your time - focus on clarity over speed');
      suggestions.push(
        'Practice reading the text silently first to familiarize yourself'
      );
    } else if (scores.fluency < 80) {
      suggestions.push(
        'Good pace! Try to maintain consistent rhythm throughout'
      );
    }

    // Common error patterns
    const commonErrors = analyses.flatMap(a => a.phonemeErrors);
    const errorCounts = commonErrors.reduce(
      (acc, error) => {
        if (error) {
          // Add safety check
          acc[error] = (acc[error] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    Object.entries(errorCounts)
      .filter(([, count]) => count > 1)
      .forEach(([error]) => {
        suggestions.push(`Focus on ${error} - this appeared multiple times`);
      });

    // Difficulty-based suggestions
    const hardWords = analyses.filter(
      a => a.difficulty === 'complex' && !a.matched
    );
    if (hardWords.length > 0) {
      suggestions.push(
        'Practice complex words with online pronunciation guides'
      );
    }

    // Positive reinforcement
    if (scores.overall >= 85) {
      suggestions.push(
        'Excellent pronunciation! Keep practicing to maintain this level'
      );
    } else if (scores.overall >= 70) {
      suggestions.push(
        'Good job! A few more practice sessions will significantly improve your score'
      );
    }

    return suggestions.slice(0, 5); // Limit to 5 most relevant suggestions
  }
}
