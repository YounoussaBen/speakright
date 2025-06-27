'use client';

import { ArrowRight, RefreshCw, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function HeroSection() {
  const [selectedText, setSelectedText] = useState('');
  const [, setUploadedFile] = useState<File | null>(null);
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Much longer, varied sample texts for reading practice
  const sampleTexts = [
    "The art of conversation is a delicate dance between speaking and listening, where each participant must balance their desire to express their thoughts with the equally important need to understand others. In our modern world, where digital communication often replaces face-to-face interaction, the nuances of verbal communication become even more precious. The tone of voice, the subtle inflections, and the careful choice of words all contribute to meaningful dialogue. When we practice pronunciation, we're not just learning to articulate sounds correctly; we're preparing ourselves to engage more confidently in the rich tapestry of human communication that connects us all.",

    'Scientific research has consistently demonstrated that learning a new language or improving pronunciation skills creates new neural pathways in the brain, enhancing cognitive flexibility and problem-solving abilities. The process of mastering pronunciation involves not only the physical coordination of speech organs but also the development of acute listening skills and phonetic awareness. Each sound we practice strengthens our ability to distinguish between similar phonemes, improving our overall communication effectiveness. This neuroplasticity extends beyond language learning, contributing to better memory retention, increased focus, and enhanced creative thinking capabilities throughout our lives.',

    "The history of human communication spans thousands of years, from the earliest cave paintings to today's sophisticated digital technologies. Despite these technological advances, the fundamental human need for clear, articulate speech remains unchanged. Pronunciation serves as the bridge between our thoughts and the understanding of others, making it one of the most essential skills we can develop. Whether we're presenting ideas in a professional setting, sharing stories with friends, or teaching children, our ability to speak clearly and confidently directly impacts our effectiveness and the depth of our connections with others.",

    "In the realm of public speaking, pronunciation plays a crucial role in establishing credibility and maintaining audience engagement. Professional speakers understand that even the most compelling content can lose its impact if delivered with unclear articulation or inconsistent pronunciation patterns. The mastery of proper pronunciation involves understanding rhythm, stress patterns, and intonation, which together create the melody of speech that captures and holds listeners' attention. This skill becomes particularly important in our globalized world, where clear communication across different accents and dialects is essential for successful collaboration and understanding.",

    'The journey of language learning is filled with both challenges and rewards, requiring patience, practice, and persistence. Each step forward in pronunciation improvement represents not just a technical achievement but a personal victory over self-doubt and communication barriers. The process teaches us valuable lessons about resilience, attention to detail, and the importance of consistent effort in achieving long-term goals. As we work to perfect our pronunciation, we develop greater sensitivity to the subtle variations in human speech and a deeper appreciation for the complexity and beauty of language itself.',

    'Technology has revolutionized the way we approach pronunciation training, offering innovative tools and methods that make learning more accessible and effective than ever before. Modern pronunciation assessment systems can analyze speech patterns with remarkable precision, providing detailed feedback on specific areas for improvement. These technological advances democratize language learning, making high-quality pronunciation training available to learners regardless of their geographical location or economic circumstances. The integration of artificial intelligence in language learning represents a significant step forward in personalized education and skill development.',

    'Cultural diversity in language expression adds richness and complexity to global communication, highlighting the importance of clear pronunciation in cross-cultural interactions. Different languages emphasize various aspects of pronunciation, from tonal variations to consonant clusters, each presenting unique challenges and learning opportunities. Understanding these differences helps us become more effective communicators and more empathetic listeners. As we improve our own pronunciation skills, we develop greater respect for the linguistic journeys of others and the effort required to master clear communication in any language.',

    'The psychological aspects of pronunciation confidence cannot be underestimated in their impact on overall communication effectiveness. When we feel secure in our ability to pronounce words correctly, we speak with greater authority and conviction, which in turn influences how others perceive and respond to our message. This confidence extends beyond mere technical accuracy to encompass the emotional and social dimensions of communication. Building pronunciation skills is therefore not just about perfecting sounds but about developing the self-assurance necessary for meaningful personal and professional interactions.',
  ];

  // Rotate through different sample texts every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSampleIndex(prev => (prev + 1) % sampleTexts.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [sampleTexts.length]);

  const handleTextSelection = async (text: string) => {
    setSelectedText(text);
    setIsLoading(true);

    // Simulate brief loading then redirect
    setTimeout(() => {
      // Store selected text in sessionStorage for the record page
      sessionStorage.setItem('selectedText', text);
      router.push('/record');
    }, 1000);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsLoading(true);

      // TODO: Process file content and extract text
      setTimeout(() => {
        // Store file info for the record page
        sessionStorage.setItem('uploadedFileName', file.name);
        sessionStorage.setItem(
          'selectedText',
          `Content from ${file.name} will be processed...`
        );
        router.push('/record');
      }, 1500);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleManualTextSubmit = () => {
    if (selectedText.trim()) {
      handleTextSelection(selectedText);
    }
  };

  const handleRefreshSamples = () => {
    setCurrentSampleIndex(prev => (prev + 1) % sampleTexts.length);
  };

  if (isLoading) {
    return (
      <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-16 pt-20 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="mb-6 flex justify-center space-x-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-full bg-gradient-to-t from-blue-400 to-purple-400"
                style={{
                  width: '4px',
                  height: `${20 + (i % 4) * 10}px`,
                  animationDelay: `${i * 150}ms`,
                }}
              />
            ))}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Preparing Your Session
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Taking you to the recording studio...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-16 pt-20 dark:from-gray-900 dark:to-gray-800">
      {/* Blend with navbar */}
      <div className="pointer-events-none absolute top-0 left-0 h-32 w-full bg-gradient-to-b from-blue-50/30 via-transparent to-transparent dark:from-blue-950/20"></div>

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Hero Text */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl leading-tight font-bold text-gray-900 lg:text-6xl dark:text-white">
            Perfect Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pronunciation
            </span>{' '}
            with AI
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600 lg:text-xl dark:text-gray-300">
            Improve your speaking skills with personalized feedback
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Panel - Text Input */}
          <div className="space-y-6">
            {/* Manual Text Input */}
            <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-6 backdrop-blur-sm dark:border-gray-700/30 dark:from-blue-950/10 dark:to-purple-950/10">
              <textarea
                value={selectedText}
                onChange={e => setSelectedText(e.target.value)}
                placeholder="Paste or type any text you'd like to practice reading aloud..."
                className="mb-4 h-32 w-full resize-none rounded-xl border border-gray-200 bg-white/70 p-4 backdrop-blur-sm transition-all focus:border-transparent focus:ring-2 focus:ring-blue-400 focus:outline-none dark:border-gray-600 dark:bg-gray-800/70 dark:text-white"
              />

              <button
                onClick={handleManualTextSubmit}
                disabled={!selectedText.trim()}
                className="group flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>Start Recording</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* File Upload */}
            <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-6 backdrop-blur-sm dark:border-gray-700/30 dark:from-purple-950/10 dark:to-pink-950/10">
              <div className="mb-4 flex items-center space-x-3">
                <Upload className="h-5 w-5 text-purple-500" />
                <h3 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-lg font-semibold text-transparent dark:from-white dark:to-gray-300">
                  Upload Document
                </h3>
              </div>

              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Upload a PDF or DOCX file for pronunciation practice
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={handleUploadClick}
                className="group flex w-full items-center justify-center space-x-2 rounded-xl border-2 border-dashed border-purple-300 bg-white/50 px-6 py-8 transition-all duration-300 hover:border-purple-400 hover:bg-purple-50 dark:border-purple-600 dark:bg-gray-800/50 dark:hover:border-purple-500 dark:hover:bg-purple-900/20"
              >
                <Upload className="h-8 w-8 text-purple-500 transition-transform group-hover:scale-110" />
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Click to upload file
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    PDF, DOCX up to 10MB
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Panel - Sample Texts */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-green-50/50 to-blue-50/50 p-6 backdrop-blur-sm dark:border-gray-700/30 dark:from-green-950/10 dark:to-blue-950/10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse rounded-full bg-green-400 dark:bg-green-500"
                        style={{
                          width: '3px',
                          height: `${8 + i * 2}px`,
                          animationDelay: `${i * 200}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <h3 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-lg font-semibold text-transparent dark:from-white dark:to-gray-300">
                    Practice Samples
                  </h3>
                </div>
                <button
                  onClick={handleRefreshSamples}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/50 hover:text-gray-600 dark:hover:bg-gray-800/50 dark:hover:text-gray-300"
                  title="Load different samples"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              {/* Current Sample Text Preview */}
              <div className="mb-4 rounded-xl border border-gray-200 bg-white/60 p-4 dark:border-gray-600 dark:bg-gray-800/60">
                <div className="max-h-64 overflow-y-auto">
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {sampleTexts[currentSampleIndex]}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  handleTextSelection(sampleTexts[currentSampleIndex] || '')
                }
                className="group flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 text-white transition-all duration-300 hover:from-green-700 hover:to-blue-700 hover:shadow-lg"
              >
                <span>Practice This Text</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Sample Text Indicators */}
              <div className="mt-4 flex justify-center space-x-2">
                {sampleTexts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSampleIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index === currentSampleIndex
                        ? 'w-6 bg-green-500'
                        : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
