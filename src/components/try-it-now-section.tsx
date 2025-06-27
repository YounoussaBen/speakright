'use client';

import { ArrowRight, AudioWaveform, Mic, Target, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TryItNowSection() {
  const router = useRouter();

  const handleStartRecording = () => {
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
            Experience the power of AI pronunciation training instantly - no
            sign-up required
          </p>
        </div>

        {/* Main CTA Content */}
        <div className="mx-auto max-w-4xl">
          {/* Central CTA Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-4 shadow-lg backdrop-blur-sm sm:rounded-3xl sm:p-6 lg:p-8 xl:p-12 dark:border-gray-700/30 dark:bg-gray-800/70">
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

            <div className="relative grid gap-6 sm:gap-8 lg:grid-cols-2 lg:items-center">
              {/* Left Content */}
              <div className="order-2 text-center lg:order-1 lg:text-left">
                <div className="mb-4 flex justify-center space-x-1 sm:mb-6 sm:space-x-2 lg:justify-start">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-full bg-gradient-to-t from-blue-400 to-purple-400"
                      style={{
                        width: '3px',
                        height: `${12 + (i % 4) * 6}px`,
                        animationDelay: `${i * 150}ms`,
                      }}
                    />
                  ))}
                </div>

                <h3 className="mb-3 text-xl font-bold text-gray-900 sm:mb-4 sm:text-2xl lg:text-3xl dark:text-white">
                  Start Recording Now
                </h3>
                <p className="mb-6 text-sm text-gray-600 sm:mb-8 sm:text-base lg:text-lg dark:text-gray-300">
                  Choose your text, hit record, and get instant AI-powered
                  pronunciation feedback. It&apos;s that simple.
                </p>

                {/* CTA Button */}
                <button
                  onClick={handleStartRecording}
                  className="group inline-flex w-full items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl sm:w-auto sm:space-x-3 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-lg"
                >
                  <div className="rounded-full bg-white/20 p-1.5 sm:p-2">
                    <Mic className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                  <span>Start Recording</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </button>

                <p className="mt-3 text-xs text-gray-500 sm:mt-4 sm:text-sm dark:text-gray-400">
                  No account needed • Works in your browser • Completely free
                </p>
              </div>

              {/* Right Visual */}
              <div className="relative order-1 lg:order-2">
                {/* Mock Interface Preview */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6 dark:border-gray-700 dark:bg-gray-800">
                  {/* Mock Text Display */}
                  <div className="mb-3 flex items-center space-x-2 sm:mb-4 sm:space-x-3">
                    <div className="rounded-md bg-blue-50 p-1.5 sm:rounded-lg sm:p-2 dark:bg-blue-900/20">
                      <AudioWaveform className="h-3 w-3 text-blue-600 sm:h-4 sm:w-4 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-1.5 w-16 rounded bg-gray-200 sm:h-2 sm:w-20 dark:bg-gray-600"></div>
                      <div className="mt-1 h-1 w-12 rounded bg-gray-100 sm:h-1.5 sm:w-16 dark:bg-gray-700"></div>
                    </div>
                  </div>

                  {/* Mock Text Lines */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex space-x-1.5 sm:space-x-2">
                      <div className="h-1.5 w-12 rounded bg-green-200 sm:h-2 sm:w-16 dark:bg-green-800"></div>
                      <div className="h-1.5 w-8 rounded bg-green-200 sm:h-2 sm:w-12 dark:bg-green-800"></div>
                      <div className="h-1.5 w-16 rounded bg-blue-200 sm:h-2 sm:w-20 dark:bg-blue-800"></div>
                      <div className="h-1.5 w-10 rounded bg-gray-200 sm:h-2 sm:w-14 dark:bg-gray-600"></div>
                    </div>
                    <div className="flex space-x-1.5 sm:space-x-2">
                      <div className="h-1.5 w-14 rounded bg-green-200 sm:h-2 sm:w-18 dark:bg-green-800"></div>
                      <div className="h-1.5 w-8 rounded bg-yellow-200 sm:h-2 sm:w-10 dark:bg-yellow-800"></div>
                      <div className="h-1.5 w-12 rounded bg-gray-200 sm:h-2 sm:w-16 dark:bg-gray-600"></div>
                    </div>
                  </div>

                  {/* Mock Recording Button */}
                  <div className="mt-4 text-center sm:mt-6">
                    <div className="inline-flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-red-500 sm:h-12 sm:w-12">
                      <div className="h-3 w-3 rounded-full bg-white sm:h-4 sm:w-4"></div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements - Hidden on very small screens */}
                <div className="absolute -top-2 -right-2 hidden rounded-full bg-green-100 p-1.5 shadow-lg sm:-top-3 sm:-right-3 sm:block sm:p-2 dark:bg-green-900/30">
                  <Zap className="h-3 w-3 text-green-600 sm:h-4 sm:w-4 dark:text-green-400" />
                </div>
                <div className="absolute -bottom-2 -left-2 hidden rounded-full bg-blue-100 p-1.5 shadow-lg sm:-bottom-3 sm:-left-3 sm:block sm:p-2 dark:bg-blue-900/30">
                  <Target className="h-3 w-3 text-blue-600 sm:h-4 sm:w-4 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
