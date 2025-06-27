'use client';

import { Button } from '@/components/ui/button';
import { Transcriber } from '@/lib/types';
import { CheckCircle, Copy, Download, FileText } from 'lucide-react';
import { useState } from 'react';

interface TranscriptionDisplayProps {
  transcriber: Transcriber;
  originalText?: string;
  className?: string;
}

export function TranscriptionDisplay({
  transcriber,
  originalText,
  className = '',
}: TranscriptionDisplayProps) {
  const [copied, setCopied] = useState(false);
  const { output, isProcessing } = transcriber;

  // Copy transcription to clipboard
  const handleCopy = async () => {
    if (output?.text) {
      try {
        await navigator.clipboard.writeText(output.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  // Download transcription as text file
  const handleDownload = () => {
    if (output?.text) {
      const blob = new Blob([output.text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcription-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/20">
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live Transcription
          </h3>
        </div>

        {/* Action Buttons */}
        {output?.text && (
          <div className="flex space-x-2">
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              disabled={copied}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        )}
      </div>

      {/* Transcription Content */}
      <div className="min-h-32 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {isProcessing ? (
          // Processing State
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Transcribing audio...
              </span>
            </div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
                  style={{
                    width: `${Math.random() * 40 + 60}%`,
                    animationDelay: `${i * 200}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : output?.text ? (
          // Transcription Result
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Transcribed Text:
              </h4>
              <p className="leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-white">
                {output.text}
              </p>
            </div>

            {/* Original Text Comparison (if available) */}
            {originalText && (
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <h4 className="mb-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                  Original Text:
                </h4>
                <p className="leading-relaxed whitespace-pre-wrap text-blue-900 dark:text-blue-100">
                  {originalText}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div>
                <span className="font-medium">Words:</span>{' '}
                {
                  output.text.split(/\s+/).filter(word => word.length > 0)
                    .length
                }
              </div>
              <div>
                <span className="font-medium">Characters:</span>{' '}
                {output.text.length}
              </div>
              <div>
                <span className="font-medium">Estimated reading time:</span>{' '}
                {Math.ceil(output.text.split(/\s+/).length / 200)} min
              </div>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center space-y-3 py-8 text-gray-500 dark:text-gray-400">
            <FileText className="h-12 w-12 opacity-50" />
            <div className="text-center">
              <p className="font-medium">No transcription yet</p>
              <p className="text-sm">
                Record or upload audio to start transcription
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      {!output && !isProcessing && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-blue-500" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-200">
                How it works:
              </p>
              <ul className="mt-1 space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Record audio directly or upload an audio file</li>
                <li>• AI will automatically transcribe speech to text</li>
                <li>• Compare with original text for pronunciation practice</li>
                <li>• Copy or download the transcription results</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
