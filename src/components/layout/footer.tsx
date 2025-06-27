import { AudioWaveform, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'API', href: '#api' },
    ],
    company: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
      { label: 'Contact', href: '#contact' },
    ],
    support: [
      { label: 'Help Center', href: '#help' },
      { label: 'Documentation', href: '#docs' },
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="relative border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
      {/* Flowing wave at top */}

      <div className="relative pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
            {/* Brand Section */}
            <div className="space-y-6 lg:col-span-2">
              {/* Logo & Brand */}
              {/* Logo & Brand */}
              <div className="group flex cursor-pointer items-center space-x-3">
                {/* Logo with amazing hover effects */}
                <div className="relative">
                  <div className="relative overflow-hidden rounded-xl">
                    <Image
                      src="/logo.png"
                      alt="SpeakRight Logo"
                      width={64}
                      height={64}
                      className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                    />
                  </div>
                </div>

                {/* Brand Name with Wave */}
                <div className="relative">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-xl font-bold text-transparent transition-all duration-300 group-hover:from-blue-600 group-hover:to-purple-600 dark:from-white dark:to-gray-300">
                    SpeakRight
                  </span>
                  {/* Flowing underline wave */}
                  <div className="absolute -bottom-1 left-0 h-0.5 w-full scale-x-0 transform rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"></div>
                  {/* Extra sparkle */}
                  <div className="absolute -top-1 -right-1 h-2 w-2 animate-ping rounded-full bg-blue-400 opacity-0 transition-all delay-200 duration-700 group-hover:opacity-60"></div>
                </div>
              </div>

              {/* Description */}
              <p className="max-w-md leading-relaxed text-gray-600 dark:text-gray-400">
                Perfect your pronunciation with AI-powered feedback. Real-time
                analysis, personalized learning, and instant results to help you
                speak with confidence.
              </p>

              {/* Wave visualization */}
              <div className="flex items-center space-x-2 py-2">
                <AudioWaveform className="h-5 w-5 text-blue-500" />
                <div className="flex space-x-1">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-full bg-gradient-to-t from-blue-400 to-purple-400"
                      style={{
                        width: '2px',
                        height: `${8 + (i % 3) * 4}px`,
                        animationDelay: `${i * 150}ms`,
                        opacity: 0.6,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="rounded-lg bg-gray-100 p-2 text-gray-400 transition-all duration-300 hover:scale-110 hover:bg-blue-50 hover:text-blue-500 dark:bg-gray-800 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Product
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="group flex items-center text-gray-600 transition-colors duration-200 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <span>{link.label}</span>
                      <div className="ml-1 h-0.5 w-0 rounded-full bg-blue-400 transition-all duration-200 group-hover:w-2"></div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="group flex items-center text-gray-600 transition-colors duration-200 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <span>{link.label}</span>
                      <div className="ml-1 h-0.5 w-0 rounded-full bg-blue-400 transition-all duration-200 group-hover:w-2"></div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="group flex items-center text-gray-600 transition-colors duration-200 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <span>{link.label}</span>
                      <div className="ml-1 h-0.5 w-0 rounded-full bg-blue-400 transition-all duration-200 group-hover:w-2"></div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              {/* Copyright */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {currentYear} SpeakRight. All rights reserved.
              </p>

              {/* Mini wave animation */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Powered by AI</span>
                <div className="flex space-x-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1 w-1 animate-bounce rounded-full bg-blue-400"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
