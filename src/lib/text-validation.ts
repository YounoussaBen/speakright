// src/lib/text-validation.ts

/**
 * Text validation and processing utilities for pronunciation practice
 */

export const TEXT_LIMITS = {
  // Maximum characters for different contexts
  MAX_CHARACTERS_PRACTICE: 10000,
  MAX_CHARACTERS_SAMPLE: 5000,
  MAX_CHARACTERS_MANUAL: 15000,

  // Maximum words for different contexts
  MAX_WORDS_PRACTICE: 2000,
  MAX_WORDS_SAMPLE: 1000,
  MAX_WORDS_MANUAL: 3000,

  // Minimum requirements
  MIN_CHARACTERS: 50,
  MIN_WORDS: 10,

  // Preview and display limits
  PREVIEW_CHARACTERS: 500,
  SNIPPET_CHARACTERS: 150,
} as const;

export interface TextValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    characters: number;
    words: number;
    sentences: number;
    estimatedReadingTime: number; // in minutes
  };
}

export interface TextProcessingOptions {
  maxCharacters?: number;
  maxWords?: number;
  minCharacters?: number;
  minWords?: number;
  allowEmptyLines?: boolean;
  preserveFormatting?: boolean;
}

/**
 * Count words in text (more accurate than simple split)
 */
export function countWords(text: string): number {
  if (!text || typeof text !== 'string') return 0;

  // Remove extra whitespace and split by word boundaries
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0 && /\w/.test(word)).length;
}

/**
 * Count sentences in text
 */
export function countSentences(text: string): number {
  if (!text || typeof text !== 'string') return 0;

  // Split by sentence-ending punctuation, filter out empty results
  return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0)
    .length;
}

/**
 * Estimate reading time in minutes (average 180 words per minute)
 */
export function estimateReadingTime(text: string): number {
  const wordCount = countWords(text);
  return Math.ceil(wordCount / 180);
}

/**
 * Clean text for pronunciation practice
 */
export function cleanTextForPractice(
  text: string,
  options: TextProcessingOptions = {}
): string {
  if (!text || typeof text !== 'string') return '';

  const { allowEmptyLines = false, preserveFormatting = false } = options;

  let cleaned = text;

  if (!preserveFormatting) {
    // Remove excessive whitespace
    cleaned = cleaned.replace(/[ \t]+/g, ' ');

    // Handle line breaks
    if (allowEmptyLines) {
      cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive line breaks
    } else {
      cleaned = cleaned.replace(/\n+/g, ' '); // Replace all line breaks with spaces
    }
  }

  // Remove or normalize problematic characters
  cleaned = cleaned
    // Remove zero-width characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Normalize quotes
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    // Remove excessive punctuation
    .replace(/\.{4,}/g, '...')
    .replace(/!{2,}/g, '!')
    .replace(/\?{2,}/g, '?')
    // Fix spacing around punctuation
    .replace(/\s+([,.!?;:])/g, '$1')
    .replace(/([,.!?;:])\s*/g, '$1 ')
    // Final cleanup
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}

/**
 * Validate text for pronunciation practice
 */
export function validateText(
  text: string,
  options: TextProcessingOptions = {}
): TextValidationResult {
  const {
    maxCharacters = TEXT_LIMITS.MAX_CHARACTERS_PRACTICE,
    maxWords = TEXT_LIMITS.MAX_WORDS_PRACTICE,
    minCharacters = TEXT_LIMITS.MIN_CHARACTERS,
    minWords = TEXT_LIMITS.MIN_WORDS,
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  if (!text || typeof text !== 'string') {
    errors.push('Text is required');
    return {
      isValid: false,
      errors,
      warnings,
      stats: {
        characters: 0,
        words: 0,
        sentences: 0,
        estimatedReadingTime: 0,
      },
    };
  }

  const cleanedText = cleanTextForPractice(text);
  const characters = cleanedText.length;
  const words = countWords(cleanedText);
  const sentences = countSentences(cleanedText);
  const estimatedReadingTime = estimateReadingTime(cleanedText);

  // Length validation
  if (characters < minCharacters) {
    errors.push(
      `Text is too short. Minimum ${minCharacters} characters required.`
    );
  }

  if (characters > maxCharacters) {
    errors.push(
      `Text is too long. Maximum ${maxCharacters} characters allowed.`
    );
  }

  if (words < minWords) {
    errors.push(`Text is too short. Minimum ${minWords} words required.`);
  }

  if (words > maxWords) {
    errors.push(`Text is too long. Maximum ${maxWords} words allowed.`);
  }

  // Content validation
  if (sentences === 0) {
    warnings.push('Text appears to have no complete sentences.');
  }

  if (words > 0 && characters / words > 15) {
    warnings.push(
      'Text may contain very long words that could be difficult to pronounce.'
    );
  }

  if (estimatedReadingTime > 15) {
    warnings.push(
      'Text is quite long and may take over 15 minutes to read aloud.'
    );
  }

  // Check for non-standard characters that might be hard to pronounce
  const nonStandardChars = cleanedText.match(/[^\w\s\-.,!?;:()'"/\n]/g);
  if (nonStandardChars && nonStandardChars.length > 10) {
    warnings.push(
      'Text contains many special characters that may affect pronunciation.'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: {
      characters,
      words,
      sentences,
      estimatedReadingTime,
    },
  };
}

/**
 * Truncate text while preserving sentence boundaries
 */
export function truncateTextAtSentence(
  text: string,
  maxLength: number
): { text: string; isTruncated: boolean } {
  if (!text || text.length <= maxLength) {
    return { text, isTruncated: false };
  }

  // Try to find a good sentence boundary to cut at
  const sentences = text.split(/([.!?]+)/);
  let truncated = '';
  let isTruncated = false;

  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i] || '';
    const punctuation = sentences[i + 1] || '';
    const potential = truncated + sentence + punctuation;

    if (potential.length > maxLength) {
      isTruncated = true;
      break;
    }

    truncated = potential;
  }

  // If no complete sentences fit, truncate at word boundary
  if (truncated.length === 0) {
    const words = text.split(/\s+/);
    for (const word of words) {
      const potential = truncated + (truncated ? ' ' : '') + word;
      if (potential.length > maxLength) {
        break;
      }
      truncated = potential;
    }
    isTruncated = true;
  }

  return {
    text: truncated || text.substring(0, maxLength),
    isTruncated: isTruncated || truncated.length < text.length,
  };
}

/**
 * Get a preview snippet of text
 */
export function getTextSnippet(
  text: string,
  maxLength: number = TEXT_LIMITS.SNIPPET_CHARACTERS
): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Format text statistics for display
 */
export function formatTextStats(stats: TextValidationResult['stats']): string {
  const { characters, words, sentences, estimatedReadingTime } = stats;

  const parts = [
    `${words.toLocaleString()} words`,
    `${characters.toLocaleString()} characters`,
  ];

  if (sentences > 0) {
    parts.push(`${sentences} sentences`);
  }

  if (estimatedReadingTime > 0) {
    parts.push(`~${estimatedReadingTime} min read`);
  }

  return parts.join(' • ');
}

/**
 * Check if text is suitable for pronunciation practice
 */
export function isTextSuitableForPractice(text: string): {
  suitable: boolean;
  reasons: string[];
  suggestions: string[];
} {
  const validation = validateText(text);
  const reasons: string[] = [];
  const suggestions: string[] = [];

  if (!validation.isValid) {
    reasons.push(...validation.errors);
  }

  // Additional suitability checks
  const { words, characters, sentences } = validation.stats;

  if (words < 50) {
    reasons.push('Text is quite short for meaningful practice');
    suggestions.push(
      'Consider adding more content or combining with other texts'
    );
  }

  if (sentences < 3) {
    reasons.push('Text has very few complete sentences');
    suggestions.push('Add more complete sentences for better practice flow');
  }

  if (characters / words > 12) {
    reasons.push('Text contains many long or complex words');
    suggestions.push(
      'Consider simplifying vocabulary for clearer pronunciation practice'
    );
  }

  // Check for too many numbers or special formatting
  const numberMatches = text.match(/\d+/g);
  if (numberMatches && numberMatches.length > words * 0.1) {
    reasons.push(
      'Text contains many numbers which may be hard to pronounce naturally'
    );
    suggestions.push('Consider replacing numbers with written-out versions');
  }

  return {
    suitable: reasons.length === 0,
    reasons,
    suggestions,
  };
}
