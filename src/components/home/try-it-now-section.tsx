'use client';

import {
  ArrowRight,
  FileText,
  Mic,
  MessageSquare,
  Target,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TryItNowSection() {
  const router = useRouter();

  const handleFreeSpeech = () => {
    sessionStorage.setItem('practiceMode', 'free-speech');
    router.push('/record?mode=free-speech');
  };

  const handleStartRecording = () => {
    sessionStorage.setItem('practiceMode', 'text-based');
    router.push('/record');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-12 sm:py-16 lg:py-24 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-8 text-center sm:mb-12 lg:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-5xl dark:text-white">
            Ready to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Perfect Your Voice?
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:mt-4 sm:text-lg dark:text-gray-300">
            Choose your practice mode - Free speech or text-based training
          </p>
        </div>

        {/* Practice Mode Cards */}
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Free Speech Practice Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-green-50/50 to-blue-50/50 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl sm:p-8 dark:border-gray-700/30 dark:from-green-950/10 dark:to-blue-950/10">
              {/* Background Elements */}
              <div className="absolute top-0 left-0 h-full w-full opacity-5">
                <svg className="h-full w-full" viewBox="0 0 400 300">
                  <path
                    d="M0,150 Q100,100 200,150 T400,150"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>

              <div className="relative">
                {/* Icon & Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-green-100/80 p-3 dark:bg-green-900/30">
                    <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="rounded-full bg-green-100/80 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    NEW
                  </span>
                </div>

                {/* Content */}
                <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                  Free Speech Practice
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  Speak naturally about any topic. Our AI analyzes your fluency,
                  clarity, grammar, and pronunciation in real-time.
                </p>

                {/* Features */}
                <ul className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <span>Natural conversation practice</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <span>AI-powered fluency analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <span>Grammar & clarity feedback</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <button
                  onClick={handleFreeSpeech}
                  className="group/btn inline-flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-blue-700 hover:shadow-xl"
                >
                  <div className="rounded-full bg-white/20 p-1.5">
                    <Mic className="h-5 w-5" />
                  </div>
                  <span>Start Free Speech</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>

                <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                  No preparation needed • Just start talking
                </p>
              </div>
            </div>

            {/* Text-Based Practice Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl sm:p-8 dark:border-gray-700/30 dark:from-blue-950/10 dark:to-purple-950/10">
              {/* Background Elements */}
              <div className="absolute top-0 left-0 h-full w-full opacity-5">
                <svg className="h-full w-full" viewBox="0 0 400 300">
                  <path
                    d="M0,180 Q100,130 200,180 T400,180"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>

              <div className="relative">
                {/* Icon */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-blue-100/80 p-3 dark:bg-blue-900/30">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    POPULAR
                  </span>
                </div>

                {/* Content */}
                <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                  Text-Based Practice
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  Choose your text, record yourself reading, and get detailed
                  word-by-word pronunciation feedback.
                </p>

                {/* Features */}
                <ul className="mb-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    <span>Word-level accuracy scoring</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    <span>Upload your own text or PDFs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                    <span>Detailed pronunciation reports</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <button
                  onClick={handleStartRecording}
                  className="group/btn inline-flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                >
                  <div className="rounded-full bg-white/20 p-1.5">
                    <Mic className="h-5 w-5" />
                  </div>
                  <span>Start Text Practice</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>

                <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                  Perfect for structured learning
                </p>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 rounded-full bg-purple-100/80 p-2 shadow-lg dark:bg-purple-900/30">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="absolute -bottom-2 -left-2 rounded-full bg-blue-100/80 p-2 shadow-lg dark:bg-blue-900/30">
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Bottom Notice */}
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            No account needed • Works in your browser • Completely free
          </p>
        </div>
      </div>
    </section>
  );
}
