'use client';

import { ArrowRight, Check, Crown, Mail, Star, Users, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function PricingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
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

  const individualFeatures = [
    'Unlimited practice sessions',
    'Real-time AI feedback',
    'Mobile & desktop access',
    'Standard pronunciation library',
    'Basic progress tracking',
    'Community support',
  ];

  const enterpriseFeatures = [
    'Everything in Individual',
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

  const faqs = [
    {
      question: 'Is the individual plan really free?',
      answer:
        'Yes, completely free. No credit card required, no hidden fees. Get full access to our AI-powered pronunciation training.',
    },
    {
      question: "What's included in enterprise pricing?",
      answer:
        'Enterprise pricing includes team management, advanced analytics, custom branding, API access, and dedicated support. Contact us for custom pricing based on your team size.',
    },
    {
      question: 'Can I upgrade from individual to enterprise?',
      answer:
        "Absolutely! Contact our sales team and we'll help you seamlessly transition your account to enterprise features.",
    },
    {
      question: 'Do you offer training and onboarding?',
      answer:
        'Yes, enterprise customers receive comprehensive training and onboarding to ensure successful adoption across your organization.',
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      ref={sectionRef}
    >
      {/* Navbar Blending */}
      <div className="pointer-events-none absolute top-0 left-0 h-32 w-full bg-gradient-to-b from-blue-50/30 via-transparent to-transparent dark:from-blue-950/20"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl"></div>
        <div
          className="absolute -right-32 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-l from-indigo-200/20 to-blue-200/20 blur-3xl"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-white/20 bg-white/80 px-4 py-2 backdrop-blur-sm dark:border-gray-700/30 dark:bg-gray-800/80">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Simple, Transparent Pricing
                </span>
              </div>

              <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
                Choose Your
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Perfect Plan
                </span>
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-gray-300">
                Start free as an individual or scale with enterprise features.
                No hidden fees, no complicated tiers - just powerful AI
                pronunciation training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative pb-16 sm:pb-20 lg:pb-24">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Individual Plan */}
            <div
              className={`relative transition-all duration-1000 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="group h-full rounded-3xl border border-white/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl lg:p-10 dark:border-gray-700/30 dark:from-blue-950/10 dark:to-purple-950/10">
                {/* Plan Header */}
                <div className="mb-8 text-center">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100/80 to-purple-100/80 dark:from-blue-900/30 dark:to-purple-900/30">
                    <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                    Individual
                  </h3>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
                    Perfect for personal learning
                  </p>
                  <div className="mb-2 text-5xl font-bold text-gray-900 dark:text-white">
                    Free
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">Forever</p>
                </div>

                {/* Features List */}
                <div className="mb-8 space-y-4">
                  {individualFeatures.map((feature, index) => (
                    <div
                      key={feature}
                      className={`flex items-start space-x-3 transition-all duration-700 ${
                        isVisible
                          ? 'translate-x-0 opacity-100'
                          : '-translate-x-4 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 50 + 200}ms` }}
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="group w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <span>Get Started Free</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div
              className={`relative transition-all duration-1000 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 transform">
                <div className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white shadow-lg">
                  <Crown className="h-4 w-4" />
                  <span>Most Popular</span>
                </div>
              </div>

              <div className="group hover:shadow-3xl h-full rounded-3xl border-2 border-blue-200/50 bg-gradient-to-br from-blue-50/60 to-purple-50/60 p-8 shadow-2xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 lg:p-10 dark:border-blue-700/30 dark:from-blue-950/20 dark:to-purple-950/20">
                {/* Plan Header */}
                <div className="mb-8 text-center">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100/80 to-purple-100/80 dark:from-blue-900/30 dark:to-purple-900/30">
                    <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                    Enterprise
                  </h3>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
                    For teams and organizations
                  </p>
                  <div className="mb-2 text-5xl font-bold text-gray-900 dark:text-white">
                    Custom
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Contact for pricing
                  </p>
                </div>

                {/* Features List */}
                <div className="mb-8 space-y-4">
                  {enterpriseFeatures.map((feature, index) => (
                    <div
                      key={feature}
                      className={`flex items-start space-x-3 transition-all duration-700 ${
                        isVisible
                          ? 'translate-x-0 opacity-100'
                          : '-translate-x-4 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 50 + 400}ms` }}
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="group w-full rounded-2xl bg-gradient-to-r from-gray-900 to-blue-900 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-gray-800 hover:to-blue-800 hover:shadow-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <span>Contact Sales</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative pb-16 sm:pb-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Content */}
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-8 opacity-0'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                Ready to Get
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Started?
                </span>
              </h2>
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                Have questions about enterprise features or need a custom
                solution? Our team is here to help you find the perfect fit for
                your organization.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/30 dark:to-purple-900/30">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Email Us
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      sales@speakright.com
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4"></div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-8 opacity-0'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-8 backdrop-blur-sm dark:border-gray-700/30 dark:from-blue-950/10 dark:to-purple-950/10">
                <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                  Get A Quote
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200/50 bg-white/60 px-4 py-3 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600/50 dark:bg-gray-800/60 dark:text-white dark:focus:ring-blue-800"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-gray-200/50 bg-white/60 px-4 py-3 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600/50 dark:bg-gray-800/60 dark:text-white dark:focus:ring-blue-800"
                      placeholder="your@email.com"
                    />
                  </div>
                  <button
                    type="submit"
                    className="group w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Get Quote</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative pb-16 sm:pb-20">
        <div className="container mx-auto max-w-4xl px-6">
          <div
            className={`mb-12 text-center transition-all duration-1000 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '1000ms' }}
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className={`rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-sm transition-all duration-1000 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700/30 dark:bg-gray-800/60 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100 + 1200}ms` }}
              >
                <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
