'use client';

import { useEffect, useRef, useState } from 'react';

export function TechnologySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const processSteps = [
    {
      number: '01',
      title: 'Speech Capture',
      description:
        'High-fidelity audio recording with advanced noise cancellation and real-time processing.',
      delay: 0,
    },
    {
      number: '02',
      title: 'AI Processing',
      description:
        'Whisper AI model transcribes and analyzes pronunciation patterns with millisecond precision.',
      delay: 200,
    },
    {
      number: '03',
      title: 'Phoneme Analysis',
      description:
        'Deep learning algorithms break down speech into individual phonetic components.',
      delay: 400,
    },
    {
      number: '04',
      title: 'Instant Feedback',
      description:
        'Real-time visual and contextual feedback delivered through intelligent recommendations.',
      delay: 600,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-32"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-blue-100/30 to-purple-100/30 blur-3xl"></div>
        <div
          className="absolute -right-32 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-l from-indigo-100/20 to-blue-100/20 blur-3xl"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
          >
            <h2 className="mb-6 text-3xl leading-tight font-bold text-gray-900 sm:text-4xl lg:text-6xl">
              Cutting-Edge
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Technology
              </span>
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 sm:text-xl">
              Our platform leverages the most advanced AI and machine learning
              technologies to deliver unprecedented accuracy in pronunciation
              training.
            </p>
          </div>
        </div>

        {/* Process Flow */}
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div
            className={`mb-12 text-center transition-all delay-300 duration-1000 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
          >
            <h3 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              How It Works
            </h3>
            <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
          </div>

          {/* Desktop Flow */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Animated Connection Line */}
              <div className="absolute top-24 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent">
                <div
                  className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-2000 ease-out ${
                    isVisible ? 'w-full' : 'w-0'
                  }`}
                  style={{ transitionDelay: '800ms' }}
                ></div>
              </div>

              <div className="grid grid-cols-4 gap-8">
                {processSteps.map(step => (
                  <div
                    key={step.number}
                    className={`relative transition-all duration-1000 ease-out ${
                      isVisible
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-12 opacity-0'
                    }`}
                    style={{ transitionDelay: `${step.delay + 400}ms` }}
                  >
                    {/* Floating Card */}
                    <div className="group cursor-pointer">
                      {/* Geometric Shape */}
                      <div className="relative mx-auto mb-6 h-20 w-20">
                        <div className="absolute inset-0 rotate-45 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 transition-transform duration-700 ease-out group-hover:rotate-[225deg]"></div>
                        <div className="absolute inset-2 flex rotate-45 items-center justify-center rounded-xl bg-white transition-transform duration-700 ease-out group-hover:rotate-[225deg]">
                          <span className="-rotate-45 text-lg font-bold text-gray-900 transition-transform duration-700 ease-out group-hover:rotate-[-225deg]">
                            {step.number}
                          </span>
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                        <h4 className="mb-3 text-xl font-bold text-gray-900">
                          {step.title}
                        </h4>
                        <p className="text-sm leading-relaxed text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Flow */}
          <div className="lg:hidden">
            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative transition-all duration-1000 ease-out ${
                    isVisible
                      ? 'translate-x-0 opacity-100'
                      : index % 2 === 0
                        ? '-translate-x-8 opacity-0'
                        : 'translate-x-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${step.delay + 400}ms` }}
                >
                  {/* Connection Line */}
                  {index < processSteps.length - 1 && (
                    <div className="absolute top-20 left-10 h-16 w-0.5 bg-gradient-to-b from-blue-200 to-purple-200">
                      <div
                        className={`w-full bg-gradient-to-b from-blue-500 to-purple-500 transition-all duration-1000 ${
                          isVisible ? 'h-full' : 'h-0'
                        }`}
                        style={{ transitionDelay: `${step.delay + 800}ms` }}
                      ></div>
                    </div>
                  )}

                  <div className="flex items-start space-x-6">
                    {/* Geometric Shape */}
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <div className="absolute inset-0 rotate-45 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600"></div>
                      <div className="absolute inset-2 flex rotate-45 items-center justify-center rounded-xl bg-white">
                        <span className="-rotate-45 text-lg font-bold text-gray-900">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 rounded-xl border border-gray-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                      <h4 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">
                        {step.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className={`mt-16 text-center transition-all delay-1000 duration-1000 sm:mt-20 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        ></div>
      </div>
    </section>
  );
}
