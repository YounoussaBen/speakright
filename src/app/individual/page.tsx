'use client';

import { ArrowRight, CheckCircle, Star } from 'lucide-react';
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
  ];

  return (
    <div className="min-h-screen bg-white" ref={sectionRef}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-16 sm:py-20 lg:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-blue-200/40 to-purple-200/40 blur-3xl"></div>
          <div
            className="absolute -right-32 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-l from-indigo-200/30 to-blue-200/30 blur-3xl"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 backdrop-blur-sm">
                <div className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  For Personal Learning
                </span>
              </div>

              <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 sm:text-5xl lg:text-7xl">
                Master Your
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Pronunciation
                </span>
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl">
                Transform your speaking confidence with AI-powered pronunciation
                training. Get personalized feedback, track your progress, and
                speak with clarity in any language.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button className="group inline-flex items-center space-x-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <span>Start Learning Free</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button className="inline-flex items-center space-x-2 rounded-2xl border-2 border-gray-200 bg-white/80 px-8 py-4 text-lg font-semibold text-gray-700 backdrop-blur-sm transition-all duration-300 hover:border-blue-200 hover:bg-blue-50">
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Checklist */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                Everything You Need to
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Succeed
                </span>
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                Get access to all features designed to accelerate your
                pronunciation learning journey.
              </p>

              <div className="space-y-4">
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
                    <span className="font-medium text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Mock Interface */}
              <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Your Progress</h3>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-current text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Pronunciation Accuracy
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        94%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: '94%' }}
                      ></div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Words Practiced
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        1,247
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: '78%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
