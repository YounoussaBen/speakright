'use client';

import { Check, Mail, Star, Users, Zap } from 'lucide-react';
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
    'Progress tracking dashboard',
    'Multiple language support',
    'Mobile & desktop access',
    'Community support',
    'Basic analytics',
    'Standard pronunciation library',
  ];

  const enterpriseFeatures = [
    'Everything in Individual',
    'Team management dashboard',
    'Advanced analytics & reporting',
    'Custom branding options',
    'API integration access',
    'Priority customer support',
    'Bulk user management',
    'Custom pronunciation libraries',
    'SSO integration',
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
    <div className="min-h-screen bg-white" ref={sectionRef}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 py-16 sm:py-20 lg:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl"></div>
          <div
            className="absolute -right-32 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-l from-indigo-200/20 to-blue-200/20 blur-3xl"
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
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  Simple, Transparent Pricing
                </span>
              </div>

              <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 sm:text-5xl lg:text-6xl">
                Choose Your
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Perfect Plan
                </span>
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl">
                Start free as an individual or scale with enterprise features.
                No hidden fees, no complicated tiers - just powerful AI
                pronunciation training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Individual Plan */}
            <div
              className={`relative transition-all duration-1000 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="h-full rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl lg:p-10">
                <div className="mb-8 text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    Individual
                  </h3>
                  <p className="mb-4 text-gray-600">
                    Perfect for personal learning
                  </p>
                  <div className="mb-2 text-5xl font-bold text-gray-900">
                    Free
                  </div>
                  <p className="text-gray-500">Forever</p>
                </div>

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
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg">
                  Get Started Free
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
                <div className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white shadow-lg">
                  Most Popular
                </div>
              </div>

              <div className="hover:shadow-3xl h-full rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 lg:p-10">
                <div className="mb-8 text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    Enterprise
                  </h3>
                  <p className="mb-4 text-gray-600">
                    For teams and organizations
                  </p>
                  <div className="mb-2 text-5xl font-bold text-gray-900">
                    Custom
                  </div>
                  <p className="text-gray-500">Contact for pricing</p>
                </div>

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
                      <span className="font-medium text-gray-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button className="w-full rounded-2xl bg-gradient-to-r from-gray-900 to-blue-900 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-gray-800 hover:to-blue-800 hover:shadow-lg">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                Ready to Get
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Started?
                </span>
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                Have questions about enterprise features or need a custom
                solution? Our team is here to help you find the perfect fit for
                your organization.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email Us</div>
                    <div className="text-gray-600">sales@speakright.com</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-purple-50 p-8">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                Get Enterprise Quote
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Team Size
                  </label>
                  <select className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                    <option>1-10 employees</option>
                    <option>11-50 employees</option>
                    <option>51-200 employees</option>
                    <option>200+ employees</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                >
                  Get Quote
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-1000 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h3 className="mb-3 text-lg font-bold text-gray-900">
                  {faq.question}
                </h3>
                <p className="leading-relaxed text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
