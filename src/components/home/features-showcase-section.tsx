import { BarChart3, Mic, TrendingUp } from 'lucide-react';

export function FeaturesShowcaseSection() {
  const features = [
    {
      icon: Mic,
      title: 'Speech Analysis',
      description: 'Breaks down your pronunciation at the sound level.',
      color: 'blue',
      stats: 'Accuracy',
      demo: (
        <div className="flex space-x-1">
          {['θɪŋk', 'prɪti', 'wɜːrd'].map((phoneme, i) => (
            <div
              key={i}
              className="rounded-full bg-blue-100/80 px-2 py-1 font-mono text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {phoneme}
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: BarChart3,
      title: 'Real-time Feedback',
      description:
        'Get instant visual feedback as you speak with automatic transcription.',
      color: 'purple',
      stats: '<100ms Latency',
      demo: (
        <div className="space-y-2">
          <div className="flex space-x-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-full bg-purple-400"
                style={{
                  width: '3px',
                  height: `${8 + i * 2}px`,
                  animationDelay: `${i * 150}ms`,
                }}
              />
            ))}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400">
            Live transcription...
          </div>
        </div>
      ),
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description:
        'Monitor your improvement over time with detailed  analytics.',
      color: 'green',
      stats: 'Tracking',
      demo: (
        <div className="space-y-1">
          <div className="flex space-x-1">
            {[60, 75, 80, 85, 90, 95].map((score, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-green-400"
                style={{ height: `${score / 5}px` }}
              />
            ))}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            Accuracy improving
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="relative bg-white py-24 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 lg:text-5xl dark:text-white">
            Speak Clearly{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learn Confidently
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Advanced AI technology meets intuitive design to help you speak with
            confidence
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-${feature.color}-50/50 to-white/50 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 dark:border-gray-700/30 dark:from-${feature.color}-950/10 dark:to-gray-800/50`}
            >
              {/* Feature Icon */}
              <div
                className={`mb-6 inline-flex rounded-xl p-3 bg-${feature.color}-100/80 dark:bg-${feature.color}-900/30`}
              >
                <feature.icon
                  className={`h-8 w-8 text-${feature.color}-600 dark:text-${feature.color}-400`}
                />
              </div>

              {/* Feature Content */}
              <div className="mb-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>

              {/* Stats */}
              <div className="mb-6">
                <div
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium bg-${feature.color}-100/80 text-${feature.color}-700 dark:bg-${feature.color}-900/30 dark:text-${feature.color}-300`}
                >
                  {feature.stats}
                </div>
              </div>

              {/* Interactive Demo */}
              <div className="rounded-xl bg-white/60 p-4 dark:bg-gray-800/60">
                {feature.demo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
