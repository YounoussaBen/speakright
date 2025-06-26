import { Button } from '@/components/ui/button';
import { AudioWaveform, Mic, Upload, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-16 pt-20 dark:from-gray-900 dark:to-gray-800">
      {/* Blend with navbar - flowing background */}
      <div className="pointer-events-none absolute top-0 left-0 h-32 w-full bg-gradient-to-b from-blue-50/30 via-transparent to-transparent dark:from-blue-950/20"></div>

      <div className="relative mx-auto w-full max-w-7xl">
        {/* Two-column grid */}
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Panel - Audio Input Flow */}
          <div className="relative space-y-8">
            {/* Hero Text with Wave Integration */}
            <div className="relative space-y-6">
              {/* Subtle background wave */}
              <div className="pointer-events-none absolute -top-4 -left-4 h-full w-full opacity-5">
                <svg className="h-full w-full" viewBox="0 0 300 200">
                  <path
                    d="M0,150 Q75,100 150,140 T300,120"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>

              <h1 className="relative z-10 text-4xl leading-tight font-bold text-gray-900 lg:text-6xl dark:text-white">
                Perfect Your{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Pronunciation
                </span>{' '}
                with AI
              </h1>

              <p className="relative z-10 text-lg leading-relaxed text-gray-600 lg:text-xl dark:text-gray-300">
                Get instant, personalized feedback on your pronunciation using
                advanced AI technology. Improve your speaking skills with
                real-time analysis.
              </p>
            </div>

            {/* Flowing Audio Input Module */}
            <div className="relative">
              <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-6 backdrop-blur-sm dark:border-gray-700/30 dark:from-blue-950/10 dark:to-purple-950/10">
                {/* Input header with mini wave */}
                <div className="mb-6 flex items-center space-x-3">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse rounded-full bg-blue-400 dark:bg-blue-500"
                        style={{
                          width: '3px',
                          height: `${8 + i * 2}px`,
                          animationDelay: `${i * 200}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <h3 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-lg font-semibold text-transparent dark:from-white dark:to-gray-300">
                    Start Your Audio Journey
                  </h3>
                </div>

                {/* Flowing Audio Input Options */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Record Button - Wave Style */}
                  <div className="group relative overflow-hidden">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative cursor-pointer rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-100/50 to-blue-50 p-6 transition-all duration-300 hover:border-blue-400/50 dark:border-blue-700/30 dark:from-blue-900/20 dark:to-blue-800/10">
                      {/* Record Icon with pulse effect */}
                      <div className="mb-4 flex justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20"></div>
                          <div className="relative rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-3">
                            <Mic className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <span className="mb-1 block font-semibold text-gray-900 dark:text-white">
                          Record Audio
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Tap to capture your voice
                        </span>
                      </div>

                      {/* Mini waveform preview */}
                      <div className="mt-3 flex justify-center space-x-1 opacity-60">
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className="rounded-full bg-blue-400 dark:bg-blue-500"
                            style={{
                              width: '2px',
                              height: `${6 + Math.random() * 8}px`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Upload Area - Wave Style */}
                  <div className="group relative overflow-hidden">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative cursor-pointer rounded-2xl border border-purple-200/50 bg-gradient-to-br from-purple-100/50 to-purple-50 p-6 transition-all duration-300 hover:border-purple-400/50 dark:border-purple-700/30 dark:from-purple-900/20 dark:to-purple-800/10">
                      {/* Upload Icon with floating effect */}
                      <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 p-3 transition-transform duration-200 group-hover:scale-105">
                          <Upload className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      <div className="text-center">
                        <span className="mb-1 block font-semibold text-gray-900 dark:text-white">
                          Upload File
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Drag & drop audio here
                        </span>
                      </div>

                      {/* Upload flow indicator */}
                      <div className="mt-3 flex justify-center">
                        <div className="flex space-x-1 opacity-60">
                          <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                          <div className="h-0.5 w-4 self-center rounded-full bg-purple-300"></div>
                          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting flow elements */}
              <div className="absolute top-1/2 -right-4 h-0.5 w-8 rounded-full bg-gradient-to-r from-blue-300 to-transparent opacity-40"></div>
            </div>

            {/* CTA Buttons with Wave Integration */}
            <div className="relative">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 text-base shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                >
                  <span className="flex items-center space-x-2">
                    <span>Try It Now</span>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-1 w-1 animate-pulse rounded-full bg-white"
                          style={{ animationDelay: `${i * 300}ms` }}
                        />
                      ))}
                    </div>
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-300 px-8 text-base transition-all duration-300 hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-500"
                >
                  View Examples
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Audio Wave Visualization */}
          <div className="relative">
            {/* Central Audio Wave Flow */}
            <div className="relative">
              {/* Main Waveform Display */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50 to-purple-50 p-8 dark:from-blue-950/20 dark:to-purple-950/20">
                {/* Large Central Waveform */}
                <div className="mb-6 flex h-32 items-end justify-center space-x-1">
                  {[...Array(24)].map((_, i) => {
                    const heights = [
                      20, 35, 45, 60, 80, 65, 90, 75, 85, 70, 95, 85, 75, 80,
                      65, 70, 55, 45, 60, 40, 35, 25, 30, 20,
                    ];
                    return (
                      <div
                        key={i}
                        className="rounded-full bg-gradient-to-t from-blue-500 to-purple-500 transition-all duration-1000"
                        style={{
                          width: '6px',
                          height: `${heights[i]}px`,
                          opacity: 0.6 + (i % 3) * 0.2,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Flowing Phoneme Analysis */}
                <div className="relative">
                  {/* Background wave flow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-blue-100/30 to-transparent dark:via-blue-800/20"></div>

                  <div className="relative z-10 flex items-center justify-between py-4">
                    {[
                      { phoneme: 'θɪŋk', accuracy: 95, color: 'green' },
                      { phoneme: 'prɪti', accuracy: 87, color: 'blue' },
                      { phoneme: 'wɜːrd', accuracy: 92, color: 'purple' },
                    ].map((item, i) => (
                      <div key={i} className="text-center">
                        <div
                          className={`inline-block rounded-full px-3 py-1 font-mono text-xs bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-800 dark:text-${item.color}-300 mb-2`}
                        >
                          {item.phoneme}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.accuracy}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini waveforms flowing through */}
                <div className="mt-6 flex justify-between">
                  {[...Array(3)].map((_, groupIndex) => (
                    <div key={groupIndex} className="flex space-x-1">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="rounded-full bg-blue-300 dark:bg-blue-600"
                          style={{
                            width: '2px',
                            height: `${Math.random() * 20 + 8}px`,
                            opacity: 0.4 + Math.random() * 0.4,
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Subtle background pattern */}
                <div className="absolute top-0 left-0 h-full w-full opacity-5">
                  <svg className="h-full w-full" viewBox="0 0 400 200">
                    <path
                      d="M0,100 Q100,50 200,100 T400,100"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,120 Q100,80 200,120 T400,120"
                      stroke="currentColor"
                      strokeWidth="1"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>

              {/* Feature indicators flowing around the wave */}
              <div className="absolute top-8 -right-4 flex items-center space-x-2 rounded-full bg-white px-3 py-2 shadow-lg dark:bg-gray-800">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-xs font-medium">3s</span>
              </div>

              <div className="absolute bottom-8 -left-4 flex items-center space-x-2 rounded-full bg-white px-3 py-2 shadow-lg dark:bg-gray-800">
                <AudioWaveform className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-medium">AI</span>
              </div>

              {/* Subtle floating audio elements */}
              <div className="absolute top-4 right-16 h-2 w-2 animate-pulse rounded-full bg-blue-400 opacity-60"></div>
              <div
                className="absolute bottom-16 left-8 h-3 w-3 animate-pulse rounded-full bg-purple-400 opacity-40"
                style={{ animationDelay: '1s' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
