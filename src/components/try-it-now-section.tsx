'use client';

import { ArrowRight, AudioWaveform, Mic, Target, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TryItNowSection() {
  const router = useRouter();

  const handleStartRecording = () => {
    router.push('/record');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-24 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 lg:text-5xl dark:text-white">
            Ready to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Perfect Your Voice?
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Experience the power of AI pronunciation training instantly - no
            sign-up required
          </p>
        </div>

        {/* Main CTA Content */}
        <div className="mx-auto max-w-4xl">
          {/* Central CTA Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 p-8 shadow-lg backdrop-blur-sm lg:p-12 dark:border-gray-700/30 dark:bg-gray-800/70">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 h-full w-full opacity-5">
              <svg className="h-full w-full" viewBox="0 0 400 300">
                <path
                  d="M0,150 Q100,100 200,150 T400,150"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M0,180 Q100,130 200,180 T400,180"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </div>

            <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="mb-6 flex justify-center space-x-2 lg:justify-start">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-full bg-gradient-to-t from-blue-400 to-purple-400"
                      style={{
                        width: '4px',
                        height: `${15 + (i % 4) * 8}px`,
                        animationDelay: `${i * 150}ms`,
                      }}
                    />
                  ))}
                </div>

                <h3 className="mb-4 text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
                  Start Recording Now
                </h3>
                <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                  Choose your text, hit record, and get instant AI-powered
                  pronunciation feedback. It&apos;s that simple.
                </p>

                {/* CTA Button */}
                <button
                  onClick={handleStartRecording}
                  className="group inline-flex items-center space-x-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                >
                  <div className="rounded-full bg-white/20 p-2">
                    <Mic className="h-6 w-6" />
                  </div>
                  <span>Start Recording</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  No account needed • Works in your browser • Completely free
                </p>
              </div>

              {/* Right Visual */}
              <div className="relative">
                {/* Mock Interface Preview */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  {/* Mock Text Display */}
                  <div className="mb-4 flex items-center space-x-3">
                    <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                      <AudioWaveform className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-20 rounded bg-gray-200 dark:bg-gray-600"></div>
                      <div className="mt-1 h-1.5 w-16 rounded bg-gray-100 dark:bg-gray-700"></div>
                    </div>
                  </div>

                  {/* Mock Text Lines */}
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <div className="h-2 w-16 rounded bg-green-200 dark:bg-green-800"></div>
                      <div className="h-2 w-12 rounded bg-green-200 dark:bg-green-800"></div>
                      <div className="h-2 w-20 rounded bg-blue-200 dark:bg-blue-800"></div>
                      <div className="h-2 w-14 rounded bg-gray-200 dark:bg-gray-600"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-2 w-18 rounded bg-green-200 dark:bg-green-800"></div>
                      <div className="h-2 w-10 rounded bg-yellow-200 dark:bg-yellow-800"></div>
                      <div className="h-2 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
                    </div>
                  </div>

                  {/* Mock Recording Button */}
                  <div className="mt-6 text-center">
                    <div className="inline-flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-red-500">
                      <div className="h-4 w-4 rounded-full bg-white"></div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-3 -right-3 rounded-full bg-green-100 p-2 shadow-lg dark:bg-green-900/30">
                  <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="absolute -bottom-3 -left-3 rounded-full bg-blue-100 p-2 shadow-lg dark:bg-blue-900/30">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
