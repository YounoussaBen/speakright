'use client';

import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ForProfessionalsPage() {
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

  const professionalFeatures = [
    'Advanced analytics & reporting',
    'Custom branding options',
    'API integration access',
    'Priority customer support',
    'Bulk user management',
    'Custom pronunciation libraries',
    'Dedicated account manager',
    'Training & onboarding',
    'SLA guarantee',
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      ref={sectionRef}
    >
      {/* Blend with navbar */}
      <div className="pointer-events-none absolute top-0 left-0 h-32 w-full bg-gradient-to-b from-blue-50/30 via-transparent to-transparent dark:from-blue-950/20"></div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 -left-32 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-blue-100/30 to-indigo-100/30 blur-3xl"></div>
        <div
          className="absolute -right-32 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-gradient-to-l from-purple-100/20 to-blue-100/20 blur-3xl"
          style={{ animationDelay: '3s' }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-32">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex justify-center">
            {/* Centered Content */}
            <div className="w-full max-w-xl">
              <div
                className={`transition-all duration-1000 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
              >
                <div className="mb-6 flex flex-col items-center justify-center">
                  <div className="inline-flex items-center space-x-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 backdrop-blur-sm dark:border-blue-800 dark:bg-gray-800/80">
                    <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      For Career Growth
                    </span>
                  </div>
                </div>

                <h1 className="mb-6 text-center text-4xl leading-tight font-bold text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
                  Elevate Your
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Professional Voice
                  </span>
                </h1>

                <p className="mb-8 text-center text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-gray-300">
                  Advance your career with AI-powered pronunciation coaching
                  designed for business professionals. Master executive
                  presence, lead with confidence, and communicate with
                  authority.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <button className="group inline-flex items-center space-x-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl">
                    <span>Start Professional Training</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Enterprise CTA Section */}
      <section className="relative py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* Left Column - Features */}
            <div className="space-y-8">
              <div
                className={`transition-all duration-1000 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                  Professional Features
                </h2>
              </div>

              <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-green-50/50 to-blue-50/50 p-8 backdrop-blur-sm dark:border-gray-700/30 dark:from-green-950/10 dark:to-blue-950/10">
                <div className="space-y-4">
                  {professionalFeatures.map((feature, index) => (
                    <div
                      key={feature}
                      className={`flex items-center space-x-3 transition-all duration-700 ${
                        isVisible
                          ? 'translate-x-0 opacity-100'
                          : '-translate-x-8 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 100 + 500}ms` }}
                    >
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Enterprise CTA */}
            <div className="space-y-8">
              <div
                className={`transition-all duration-1000 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-blue-600/80 to-purple-600/80 p-8 text-white backdrop-blur-sm">
                  <h3 className="mb-4 text-2xl font-bold">Ready to Lead?</h3>
                  <p className="mb-6 leading-relaxed text-blue-100">
                    Join executive teams who trust our platform to enhance their
                    communication effectiveness and drive business results.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-200" />
                      <span className="text-blue-100">
                        Team training available
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-blue-200" />
                      <span className="text-blue-100">
                        Certification programs
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-blue-200" />
                      <span className="text-blue-100">
                        ROI tracking & analytics
                      </span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button className="group flex w-full items-center justify-center space-x-2 rounded-xl bg-white/20 px-6 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-lg">
                      <span>Contact Sales</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div
                className={`transition-all duration-1000 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '800ms' }}
              ></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
