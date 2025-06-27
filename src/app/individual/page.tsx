'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ForIndividualsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    'Unlimited practice sessions',
    'Real-time AI feedback',
    'Mobile & desktop access',
    'Standard pronunciation library',
    'Progress tracking',
    'Personalized recommendations',
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      ref={sectionRef}
    >
      {/* Blend with navbar */}
      <div className="pointer-events-none absolute top-0 left-0 h-32 w-full bg-gradient-to-b from-blue-50/30 via-transparent to-transparent dark:from-blue-950/20"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-blue-200/40 to-purple-200/40 blur-3xl"></div>
        <div
          className="absolute -right-32 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-l from-indigo-200/30 to-blue-200/30 blur-3xl"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 backdrop-blur-sm dark:border-blue-800 dark:bg-gray-800/80">
                <div className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  For Personal Learning
                </span>
              </div>

              <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 sm:text-5xl lg:text-7xl dark:text-white">
                Master Your
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Pronunciation
                </span>
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-gray-300">
                Transform your speaking confidence with AI-powered pronunciation
                training. Get personalized feedback, track your progress, and
                speak with clarity.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button className="group inline-flex items-center space-x-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl">
                  <span>Start Learning Free</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative flex items-center justify-center py-16 sm:py-20 lg:py-24">
        <div className="w-full max-w-2xl px-6">
          <div className="space-y-8 text-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                Everything You Need to
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Succeed
                </span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                Get access to all features designed to accelerate your
                pronunciation learning journey.
              </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-green-50/50 to-blue-50/50 p-8 backdrop-blur-sm dark:border-gray-700/30 dark:from-green-950/10 dark:to-blue-950/10">
              <div className="flex flex-col space-y-8 sm:flex-row sm:space-y-0 sm:space-x-8">
                <div className="flex-1">
                  <div className="space-y-6">
                    {features.map((feature, index) => (
                      <div
                        key={feature}
                        className={`flex items-center space-x-3 transition-all duration-700 ${
                          isVisible
                            ? 'translate-x-0 opacity-100'
                            : '-translate-x-8 opacity-0'
                        }`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* You can add content for the right side here if needed */}
              </div>

              <div className="mt-8 flex justify-center">
                <button className="group flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 text-white transition-all duration-300 hover:scale-105 hover:from-green-700 hover:to-blue-700 hover:shadow-lg">
                  <span>Get Started Free</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
