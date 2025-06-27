'use client';

import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle,
  Globe,
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
    'Industry-specific vocabulary training',
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
    <div className="min-h-screen bg-white" ref={sectionRef}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 py-16 sm:py-20 lg:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 -left-32 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-blue-100/30 to-indigo-100/30 blur-3xl"></div>
          <div
            className="absolute -right-32 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-gradient-to-l from-purple-100/20 to-blue-100/20 blur-3xl"
            style={{ animationDelay: '3s' }}
          ></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div
                className={`transition-all duration-1000 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
              >
                <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 backdrop-blur-sm">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    For Career Growth
                  </span>
                </div>

                <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 sm:text-5xl lg:text-6xl">
                  Elevate Your
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Professional Voice
                  </span>
                </h1>

                <p className="mb-8 text-lg leading-relaxed text-gray-600 sm:text-xl">
                  Advance your career with AI-powered pronunciation coaching
                  designed for business professionals. Master executive
                  presence, lead with confidence, and communicate with
                  authority.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <button className="group inline-flex items-center space-x-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <span>Start Professional Training</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  <button className="inline-flex items-center space-x-2 rounded-2xl border-2 border-gray-200 bg-white/80 px-8 py-4 text-lg font-semibold text-gray-700 backdrop-blur-sm transition-all duration-300 hover:border-blue-200 hover:bg-blue-50">
                    <Globe className="h-5 w-5" />
                    <span>Schedule Demo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Professional Mockup */}
            <div className="relative">
              <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
                <div className="mb-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      Professional
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-blue-50 p-4">
                      <div className="text-2xl font-bold text-blue-600">
                        94%
                      </div>
                      <div className="text-sm text-gray-600">Clarity Score</div>
                    </div>
                    <div className="rounded-xl bg-purple-50 p-4">
                      <div className="text-2xl font-bold text-purple-600">
                        A+
                      </div>
                      <div className="text-sm text-gray-600">
                        Executive Rating
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Presentation Skills
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: '92%' }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          92%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Meeting Leadership
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                            style={{ width: '88%' }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          88%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Achievement Badges */}
              <div className="absolute -top-4 -right-4 rotate-12 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 p-3 shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 -rotate-12 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 p-3 shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Features Grid */}
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                Professional Features
              </h3>
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
                    <span className="font-medium text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white">
              <h3 className="mb-4 text-2xl font-bold">Ready to Lead?</h3>
              <p className="mb-6 leading-relaxed text-blue-100">
                Join executive teams who trust our platform to enhance their
                communication effectiveness and drive business results.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-200" />
                  <span className="text-blue-100">Team training available</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-blue-200" />
                  <span className="text-blue-100">Certification programs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-200" />
                  <span className="text-blue-100">
                    ROI tracking & analytics
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
