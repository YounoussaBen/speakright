export function TechnologySection() {
  const processSteps = [
    {
      number: '01',
      title: 'Speech Capture',
      description: 'High-quality audio recording.',
      icon: '🎤',
    },
    {
      number: '02',
      title: 'AI Processing',
      description: 'Whisper AI model transcribes pronunciation in real-time.',
      icon: '🧠',
    },
    {
      number: '03',
      title: 'Phoneme Analysis',
      description: 'Breaking down speech into individual sounds.',
      icon: '🔍',
    },
    {
      number: '04',
      title: 'Instant Feedback',
      description: 'Visual and textual feedback.',
      icon: '⚡',
    },
  ];

  return (
    <section className="relative bg-gray-50 py-24 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 lg:text-5xl dark:text-white">
            Powered by{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cutting-Edge Technology
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Our platform leverages advanced AI and machine learning to provide
            the most accurate and effective pronunciation training available.
          </p>
        </div>

        {/* How It Works Process */}
        <div className="mb-16">
          <h3 className="mb-12 text-center text-2xl font-bold text-gray-900 dark:text-white">
            How It Works
          </h3>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < processSteps.length - 1 && (
                  <div className="absolute top-12 left-full hidden h-0.5 w-full bg-gradient-to-r from-blue-200 to-purple-200 lg:block dark:from-blue-800 dark:to-purple-800">
                    <div className="absolute top-1/2 right-0 h-2 w-2 translate-x-1 -translate-y-1/2 rounded-full bg-purple-400"></div>
                  </div>
                )}

                <div className="text-center">
                  {/* Step Number */}
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                    {step.icon}
                  </div>

                  {/* Step Content */}
                  <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
                    <div className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                      STEP {step.number}
                    </div>
                    <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
