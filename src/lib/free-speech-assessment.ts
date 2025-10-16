import nlp from 'compromise';
import type {
  FreeSpeechAssessment,
  FreeSpeechMetrics,
  TranscriptionChunk,
  AudioFeatures,
} from './types';
import { AudioFeaturesAnalyzer } from './audio-features';

/**
 * Free Speech Assessment Engine
 * Evaluates pronunciation, fluency, clarity, and grammar without reference text
 */
export class FreeSpeechAssessmentEngine {
  private static readonly FILLER_WORDS = [
    'um',
    'uh',
    'uhm',
    'hmm',
    'err',
    'ah',
    'like',
    'you know',
    'sort of',
    'kind of',
    'basically',
    'actually',
    'literally',
    'i mean',
  ];

  private static readonly OPTIMAL_WPM = 140; // Optimal words per minute
  private static readonly MIN_WPM = 100;
  private static readonly MAX_WPM = 180;

  /**
   * Perform comprehensive free speech assessment
   */
  static async assess(
    transcribedText: string,
    chunks: TranscriptionChunk[] | undefined,
    audioBuffer: AudioBuffer,
    duration: number
  ): Promise<FreeSpeechAssessment> {
    // Analyze audio features
    const audioFeatures = AudioFeaturesAnalyzer.analyzeAudio(audioBuffer);

    // Calculate metrics
    const metrics = this.calculateMetrics(
      transcribedText,
      chunks,
      audioFeatures,
      duration
    );

    // Calculate individual scores
    const fluencyScore = this.calculateFluencyScore(metrics, audioFeatures);
    const clarityScore = this.calculateClarityScore(metrics, audioFeatures);
    const grammarScore = this.calculateGrammarScore(transcribedText);
    const pronunciationScore = this.calculatePronunciationScore(metrics);

    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      fluencyScore * 0.3 +
        clarityScore * 0.25 +
        grammarScore * 0.2 +
        pronunciationScore * 0.25
    );

    // Generate feedback
    const feedback = this.generateFeedback(
      metrics,
      audioFeatures,
      fluencyScore,
      clarityScore,
      grammarScore,
      pronunciationScore
    );

    // Generate suggestions
    const suggestions = this.generateSuggestions(
      metrics,
      audioFeatures,
      fluencyScore,
      clarityScore,
      grammarScore
    );

    // Identify strengths
    const strengths = this.identifyStrengths(
      fluencyScore,
      clarityScore,
      grammarScore,
      pronunciationScore,
      metrics
    );

    // Identify areas to improve
    const areasToImprove = this.identifyAreasToImprove(
      fluencyScore,
      clarityScore,
      grammarScore,
      pronunciationScore,
      metrics
    );

    return {
      fluencyScore,
      clarityScore,
      grammarScore,
      pronunciationScore,
      overallScore,
      metrics,
      feedback,
      suggestions,
      strengths,
      areasToImprove,
    };
  }

  /**
   * Calculate all metrics from transcription and audio
   */
  private static calculateMetrics(
    text: string,
    chunks: TranscriptionChunk[] | undefined,
    audioFeatures: AudioFeatures,
    duration: number
  ): FreeSpeechMetrics {
    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 0);
    const totalWords = words.length;
    const uniqueWords = new Set(words).size;

    // Calculate speech rate (words per minute)
    const speechRate = (totalWords / duration) * 60;

    // Detect filler words
    const fillerWords: string[] = [];
    let fillerWordCount = 0;

    for (const fillerWord of this.FILLER_WORDS) {
      const regex = new RegExp(`\\b${fillerWord}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        fillerWordCount += matches.length;
        fillerWords.push(...matches.map(m => m.toLowerCase()));
      }
    }

    // Calculate average confidence from chunks
    let averageConfidence = 0.85; // Default if not available
    if (chunks && chunks.length > 0) {
      const confidenceValues = chunks
        .map(chunk => chunk.confidence)
        .filter((c): c is number => c !== undefined);

      if (confidenceValues.length > 0) {
        averageConfidence =
          confidenceValues.reduce((sum, conf) => sum + conf, 0) /
          confidenceValues.length;
      }
    }

    // Calculate vocabulary richness (unique words / total words)
    const vocabularyRichness = totalWords > 0 ? uniqueWords / totalWords : 0;

    // Calculate average word length
    const averageWordLength =
      words.reduce((sum, word) => sum + word.length, 0) / (totalWords || 1);

    // Calculate volume consistency
    const volumeConsistency = AudioFeaturesAnalyzer.calculateVolumeConsistency(
      audioFeatures.volumeVariance
    );

    return {
      speechRate,
      pauseCount: audioFeatures.pauses.length,
      pauseDuration: audioFeatures.silenceDuration,
      fillerWordCount,
      fillerWords,
      averageConfidence,
      vocabularyRichness,
      totalWords,
      uniqueWords,
      averageWordLength,
      volumeConsistency,
    };
  }

  /**
   * Calculate fluency score based on speech rate, pauses, and filler words
   */
  private static calculateFluencyScore(
    metrics: FreeSpeechMetrics,
    audioFeatures: AudioFeatures
  ): number {
    let score = 100;

    // Penalty for speech rate deviation from optimal
    const wpmDeviation = Math.abs(metrics.speechRate - this.OPTIMAL_WPM);
    const wpmPenalty = Math.min(30, (wpmDeviation / this.OPTIMAL_WPM) * 50);
    score -= wpmPenalty;

    // Penalty for too many pauses
    const pauseRate = metrics.pauseCount / (audioFeatures.speechDuration / 60); // pauses per minute
    const pausePenalty = Math.min(20, Math.max(0, (pauseRate - 3) * 5)); // More than 3 pauses/min
    score -= pausePenalty;

    // Penalty for filler words
    const fillerRate = metrics.fillerWordCount / metrics.totalWords;
    const fillerPenalty = Math.min(25, fillerRate * 100);
    score -= fillerPenalty;

    return Math.max(0, Math.round(score));
  }

  /**
   * Calculate clarity score based on confidence and volume consistency
   */
  private static calculateClarityScore(
    metrics: FreeSpeechMetrics,
    _audioFeatures: AudioFeatures
  ): number {
    let score = 100;

    // Confidence score (higher is better)
    const confidenceScore = metrics.averageConfidence * 100;
    score = confidenceScore * 0.7; // 70% weight on confidence

    // Volume consistency (higher is better)
    const volumeScore = metrics.volumeConsistency * 100;
    score += volumeScore * 0.3; // 30% weight on volume consistency

    return Math.max(0, Math.round(score));
  }

  /**
   * Calculate grammar score using NLP analysis
   */
  private static calculateGrammarScore(text: string): number {
    const doc = nlp(text);

    let score = 100;
    const sentences = doc.sentences().out('array');

    if (sentences.length === 0) {
      return 50; // No complete sentences
    }

    // Check for complete sentences
    const incompleteSentences = sentences.filter((s: string) => {
      const sentenceDoc = nlp(s);
      const hasVerb = sentenceDoc.verbs().length > 0;
      const hasNoun = sentenceDoc.nouns().length > 0;
      return !hasVerb || !hasNoun;
    });

    const incompletePenalty =
      (incompleteSentences.length / sentences.length) * 30;
    score -= incompletePenalty;

    // Check for proper capitalization (first word of sentences)
    const properlyCapitalized = sentences.filter((s: string) =>
      /^[A-Z]/.test(s.trim())
    );
    const capitalizationScore =
      (properlyCapitalized.length / sentences.length) * 10;
    score = score * 0.9 + capitalizationScore;

    // Check for basic punctuation
    const withPunctuation = sentences.filter((s: string) =>
      /[.!?]$/.test(s.trim())
    );
    const punctuationScore = (withPunctuation.length / sentences.length) * 10;
    score = score * 0.9 + punctuationScore;

    return Math.max(0, Math.round(score));
  }

  /**
   * Calculate pronunciation score based on confidence and word length
   */
  private static calculatePronunciationScore(
    metrics: FreeSpeechMetrics
  ): number {
    // Use confidence as primary indicator
    let score = metrics.averageConfidence * 100;

    // Bonus for using longer/more complex words
    if (metrics.averageWordLength > 5) {
      score += Math.min(10, (metrics.averageWordLength - 5) * 2);
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  /**
   * Generate detailed feedback
   */
  private static generateFeedback(
    metrics: FreeSpeechMetrics,
    _audioFeatures: AudioFeatures,
    _fluencyScore: number,
    _clarityScore: number,
    _grammarScore: number,
    _pronunciationScore: number
  ): string[] {
    const feedback: string[] = [];

    // Speech rate feedback
    if (metrics.speechRate < this.MIN_WPM) {
      feedback.push(
        `Your speech rate is ${Math.round(metrics.speechRate)} words per minute, which is slower than average. Try to speak a bit faster.`
      );
    } else if (metrics.speechRate > this.MAX_WPM) {
      feedback.push(
        `Your speech rate is ${Math.round(metrics.speechRate)} words per minute, which is quite fast. Try to slow down for better clarity.`
      );
    } else {
      feedback.push(
        `Your speech rate of ${Math.round(metrics.speechRate)} words per minute is natural and easy to follow.`
      );
    }

    // Filler words feedback
    if (metrics.fillerWordCount > 0) {
      const fillerRate = (
        (metrics.fillerWordCount / metrics.totalWords) *
        100
      ).toFixed(1);
      feedback.push(
        `You used ${metrics.fillerWordCount} filler word(s) (${fillerRate}% of speech). Common fillers: ${[...new Set(metrics.fillerWords)].join(', ')}.`
      );
    } else {
      feedback.push('Great job avoiding filler words!');
    }

    // Clarity feedback
    const confidencePercent = (metrics.averageConfidence * 100).toFixed(0);
    if (metrics.averageConfidence >= 0.85) {
      feedback.push(
        `Excellent clarity with ${confidencePercent}% average confidence.`
      );
    } else if (metrics.averageConfidence >= 0.7) {
      feedback.push(
        `Good clarity with ${confidencePercent}% average confidence.`
      );
    } else {
      feedback.push(
        `Clarity could be improved (${confidencePercent}% confidence). Focus on enunciating clearly.`
      );
    }

    // Vocabulary feedback
    if (metrics.vocabularyRichness > 0.7) {
      feedback.push('Excellent vocabulary diversity!');
    } else if (metrics.vocabularyRichness < 0.5) {
      feedback.push(
        'Try to use more varied vocabulary to make your speech more engaging.'
      );
    }

    return feedback;
  }

  /**
   * Generate improvement suggestions
   */
  private static generateSuggestions(
    metrics: FreeSpeechMetrics,
    audioFeatures: AudioFeatures,
    fluencyScore: number,
    clarityScore: number,
    grammarScore: number
  ): string[] {
    const suggestions: string[] = [];

    if (fluencyScore < 75) {
      suggestions.push(
        'Practice speaking at a steady pace without rushing or hesitating too much.'
      );
      if (metrics.fillerWordCount > 3) {
        suggestions.push(
          'When you feel the urge to say "um" or "uh", try pausing silently instead.'
        );
      }
    }

    if (clarityScore < 75) {
      suggestions.push(
        'Focus on pronouncing each word clearly and completely.'
      );
      suggestions.push('Maintain consistent volume throughout your speech.');
    }

    if (grammarScore < 75) {
      suggestions.push(
        'Try to speak in complete sentences with proper structure.'
      );
      suggestions.push('Practice organizing your thoughts before speaking.');
    }

    if (audioFeatures.pauses.length > 10) {
      suggestions.push(
        'Work on reducing unnecessary pauses to maintain better flow.'
      );
    }

    if (metrics.vocabularyRichness < 0.6) {
      suggestions.push(
        'Expand your vocabulary by reading more and learning new words.'
      );
    }

    // General tips
    suggestions.push(
      'Record yourself regularly to track improvement over time.'
    );
    suggestions.push(
      'Listen to native speakers and try to mimic their pace and rhythm.'
    );

    return suggestions;
  }

  /**
   * Identify strengths
   */
  private static identifyStrengths(
    fluencyScore: number,
    clarityScore: number,
    grammarScore: number,
    pronunciationScore: number,
    metrics: FreeSpeechMetrics
  ): string[] {
    const strengths: string[] = [];

    if (fluencyScore >= 80) {
      strengths.push('Strong fluency and natural speech flow');
    }

    if (clarityScore >= 80) {
      strengths.push('Clear and understandable pronunciation');
    }

    if (grammarScore >= 80) {
      strengths.push('Good grammar and sentence structure');
    }

    if (pronunciationScore >= 80) {
      strengths.push('Confident word pronunciation');
    }

    if (metrics.fillerWordCount === 0) {
      strengths.push('No filler words used');
    }

    if (metrics.vocabularyRichness > 0.7) {
      strengths.push('Rich and diverse vocabulary');
    }

    if (
      metrics.speechRate >= this.MIN_WPM &&
      metrics.speechRate <= this.MAX_WPM
    ) {
      strengths.push('Natural speaking pace');
    }

    return strengths;
  }

  /**
   * Identify areas to improve
   */
  private static identifyAreasToImprove(
    fluencyScore: number,
    clarityScore: number,
    grammarScore: number,
    pronunciationScore: number,
    metrics: FreeSpeechMetrics
  ): string[] {
    const areas: string[] = [];

    if (fluencyScore < 70) {
      areas.push('Speech fluency and flow');
    }

    if (clarityScore < 70) {
      areas.push('Pronunciation clarity');
    }

    if (grammarScore < 70) {
      areas.push('Grammar and sentence structure');
    }

    if (pronunciationScore < 70) {
      areas.push('Word pronunciation accuracy');
    }

    if (metrics.fillerWordCount > 5) {
      areas.push('Reducing filler words');
    }

    if (metrics.speechRate < this.MIN_WPM) {
      areas.push('Speaking speed (too slow)');
    } else if (metrics.speechRate > this.MAX_WPM) {
      areas.push('Speaking speed (too fast)');
    }

    if (metrics.vocabularyRichness < 0.5) {
      areas.push('Vocabulary diversity');
    }

    return areas;
  }
}
