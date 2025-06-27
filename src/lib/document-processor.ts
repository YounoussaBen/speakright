// src/lib/document-processor.ts
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`;
}

// Configuration constants
export const DOCUMENT_LIMITS = {
  MAX_CHARACTERS: 10000, // Maximum characters allowed
  MAX_WORDS: 2000, // Maximum words allowed
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  PREVIEW_CHARACTERS: 500, // Characters shown in preview
} as const;

export interface ProcessedDocument {
  text: string;
  originalLength: number;
  wordCount: number;
  isTruncated: boolean;
  processingTime: number;
  fileSize: number;
  fileName: string;
}

export interface DocumentError {
  code:
    | 'FILE_TOO_LARGE'
    | 'TEXT_TOO_LONG'
    | 'UNSUPPORTED_FORMAT'
    | 'PROCESSING_ERROR';
  message: string;
}

/**
 * Clean and normalize extracted text
 */
export function cleanText(text: string): string {
  return (
    text
      // Remove multiple consecutive whitespace characters
      .replace(/\s+/g, ' ')
      // Remove leading and trailing whitespace
      .trim()
      // Remove special characters that might interfere with speech processing
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Zero-width characters
      // Normalize quotes
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      // Remove excessive punctuation
      .replace(/\.{3,}/g, '...')
      .replace(/!{2,}/g, '!')
      .replace(/\?{2,}/g, '?')
      // Fix spacing around punctuation
      .replace(/\s+([,.!?;:])/g, '$1')
      .replace(/([,.!?;:])\s*/g, '$1 ')
      // Remove or replace problematic characters
      .replace(/[^\w\s\-.,!?;:()'"/\n]/g, ' ')
      // Final cleanup
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Validate document before processing
 */
export function validateDocument(file: File): DocumentError | null {
  // Check file size
  if (file.size > DOCUMENT_LIMITS.MAX_FILE_SIZE) {
    return {
      code: 'FILE_TOO_LARGE',
      message: `File size exceeds ${DOCUMENT_LIMITS.MAX_FILE_SIZE / 1024 / 1024}MB limit`,
    };
  }

  // Check file type
  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
  ];

  if (!supportedTypes.includes(file.type)) {
    return {
      code: 'UNSUPPORTED_FORMAT',
      message:
        'Unsupported file format. Please upload PDF, DOCX, or TXT files.',
    };
  }

  return null;
}

/**
 * Validate extracted text length
 */
export function validateTextLength(text: string): DocumentError | null {
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

  if (text.length > DOCUMENT_LIMITS.MAX_CHARACTERS) {
    return {
      code: 'TEXT_TOO_LONG',
      message: `Text exceeds ${DOCUMENT_LIMITS.MAX_CHARACTERS} character limit. Current: ${text.length} characters.`,
    };
  }

  if (wordCount > DOCUMENT_LIMITS.MAX_WORDS) {
    return {
      code: 'TEXT_TOO_LONG',
      message: `Text exceeds ${DOCUMENT_LIMITS.MAX_WORDS} word limit. Current: ${wordCount} words.`,
    };
  }

  return null;
}

/**
 * Truncate text to fit within limits while preserving sentence boundaries
 */
export function truncateText(text: string): {
  text: string;
  isTruncated: boolean;
} {
  if (text.length <= DOCUMENT_LIMITS.MAX_CHARACTERS) {
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount <= DOCUMENT_LIMITS.MAX_WORDS) {
      return { text, isTruncated: false };
    }
  }

  // Try to truncate at sentence boundaries first
  const sentences = text.split(/[.!?]+/);
  let truncatedText = '';
  let isTruncated = false;

  for (const sentence of sentences) {
    const potentialText = truncatedText + sentence + '.';
    const potentialWordCount = potentialText
      .split(/\s+/)
      .filter(word => word.length > 0).length;

    if (
      potentialText.length > DOCUMENT_LIMITS.MAX_CHARACTERS ||
      potentialWordCount > DOCUMENT_LIMITS.MAX_WORDS
    ) {
      isTruncated = true;
      break;
    }

    truncatedText = potentialText;
  }

  // If no complete sentences fit, truncate at word boundaries
  if (truncatedText.length === 0) {
    const words = text.split(/\s+/);
    const maxWords = Math.min(words.length, DOCUMENT_LIMITS.MAX_WORDS);

    for (let i = 0; i < maxWords; i++) {
      const potentialText = words.slice(0, i + 1).join(' ');
      if (potentialText.length > DOCUMENT_LIMITS.MAX_CHARACTERS) {
        break;
      }
      truncatedText = potentialText;
    }
    isTruncated = true;
  }

  return {
    text: truncatedText || text.substring(0, DOCUMENT_LIMITS.MAX_CHARACTERS),
    isTruncated,
  };
}

/**
 * Extract text from PDF file
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    const numPages = Math.min(pdf.numPages, 50); // Limit to first 50 pages to prevent abuse

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map(item => {
          if ('str' in item && typeof item.str === 'string') {
            return item.str;
          }
          return '';
        })
        .join(' ');

      fullText += pageText + '\n';

      // Early termination if we're getting too much text
      if (fullText.length > DOCUMENT_LIMITS.MAX_CHARACTERS * 2) {
        break;
      }
    }

    return fullText;
  } catch (error) {
    throw new Error(
      `Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Extract text from DOCX file
 */
export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (result.messages && result.messages.length > 0) {
      console.warn('DOCX extraction warnings:', result.messages);
    }

    return result.value || '';
  } catch (error) {
    throw new Error(
      `Failed to extract text from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Extract text from plain text file
 */
export async function extractTextFromTXT(file: File): Promise<string> {
  try {
    return await file.text();
  } catch (error) {
    throw new Error(
      `Failed to read text file: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Main document processing function
 */
export async function processDocument(
  file: File
): Promise<ProcessedDocument | DocumentError> {
  const startTime = performance.now();

  // Validate file first
  const validationError = validateDocument(file);
  if (validationError) {
    return validationError;
  }

  try {
    let extractedText = '';

    // Extract text based on file type
    switch (file.type) {
      case 'application/pdf':
        extractedText = await extractTextFromPDF(file);
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        extractedText = await extractTextFromDOCX(file);
        break;
      case 'text/plain':
        extractedText = await extractTextFromTXT(file);
        break;
      default:
        return {
          code: 'UNSUPPORTED_FORMAT',
          message: 'Unsupported file format',
        };
    }

    // Clean the extracted text
    const cleanedText = cleanText(extractedText);

    // Check if text is too long and truncate if necessary
    const { text: finalText, isTruncated } = truncateText(cleanedText);

    const processingTime = performance.now() - startTime;
    const wordCount = finalText
      .split(/\s+/)
      .filter(word => word.length > 0).length;

    return {
      text: finalText,
      originalLength: cleanedText.length,
      wordCount,
      isTruncated,
      processingTime: Math.round(processingTime),
      fileSize: file.size,
      fileName: file.name,
    };
  } catch (error) {
    return {
      code: 'PROCESSING_ERROR',
      message:
        error instanceof Error ? error.message : 'Failed to process document',
    };
  }
}

/**
 * Get text preview for display
 */
export function getTextPreview(
  text: string,
  maxLength: number = DOCUMENT_LIMITS.PREVIEW_CHARACTERS
): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Try to cut at sentence boundary
  const truncated = text.substring(0, maxLength);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );

  if (lastSentenceEnd > maxLength * 0.7) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }

  // Cut at word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
