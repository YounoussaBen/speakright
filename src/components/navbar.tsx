// src/components/navbar.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import {
  BarChart3,
  Building,
  ChevronDown,
  History,
  LogOut,
  Menu,
  Mic,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdowns, setMobileDropdowns] = useState<{
    features: boolean;
    solutions: boolean;
  }>({
    features: false,
    solutions: false,
  });

  const { user, userProfile, loading, logout } = useAuth();
  const router = useRouter();

  const featuresRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close dropdowns and mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Close desktop dropdowns
      if (
        openDropdown === 'features' &&
        featuresRef.current &&
        !featuresRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
      if (
        openDropdown === 'solutions' &&
        solutionsRef.current &&
        !solutionsRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
      if (
        openDropdown === 'profile' &&
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }

      // Close mobile menu when clicking outside
      if (isMobileMenuOpen && !target.closest('[data-mobile-menu]')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown, isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Reset mobile dropdowns when mobile menu closes
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setMobileDropdowns({ features: false, solutions: false });
    }
  }, [isMobileMenuOpen]);

  const featuresItems = [
    { icon: Mic, label: 'Speech Analysis', href: '#speech-analysis' },
    { icon: BarChart3, label: 'Real-time Feedback', href: '#feedback' },
    { icon: TrendingUp, label: 'Progress Tracking', href: '#progress' },
  ];

  const solutionsItems = [
    { icon: User, label: 'For Individuals', href: '#individuals' },
    { icon: Users, label: 'For Teams', href: '#teams' },
    { icon: Building, label: 'For Enterprise', href: '#enterprise' },
  ];

  const profileItems = [
    { icon: User, label: 'Account Info', href: '/profile' },
    { icon: History, label: 'Session History', href: '/history' },
  ];

  const toggleDropdown = (dropdown: string) => {
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    // Toggle the dropdown
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const toggleMobileDropdown = (dropdown: 'features' | 'solutions') => {
    setMobileDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const handleMobileMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Close any open dropdowns
    if (openDropdown) {
      setOpenDropdown(null);
    }
    // Toggle mobile menu
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setOpenDropdown(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAuthNavigation = (path: string) => {
    router.push(path);
  };

  // Don't render anything while loading auth state
  if (loading) {
    return (
      <nav className="fixed top-0 right-0 left-0 z-50 bg-white/90 backdrop-blur-2xl dark:bg-gray-900/90">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex animate-pulse">
              <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="ml-3 h-5 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="flex space-x-3">
              <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-700 ${
          isScrolled
            ? 'border-b border-white/20 bg-white/90 shadow-2xl shadow-blue-500/5 backdrop-blur-2xl dark:border-gray-700/30 dark:bg-gray-900/90'
            : 'bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm dark:from-gray-900/10'
        }`}
      >
        {/* Animated background wave when not scrolled */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-purple-50/10 to-blue-50/20 dark:from-blue-950/10 dark:via-purple-950/5 dark:to-blue-950/10"></div>
          <svg
            className="absolute bottom-0 left-0 h-1 w-full opacity-30"
            viewBox="0 0 1200 4"
          >
            <path
              d="M0,2 Q300,0 600,2 T1200,2"
              stroke="url(#navGradient)"
              strokeWidth="2"
              fill="none"
            />
            <defs>
              <linearGradient
                id="navGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="group flex items-center space-x-3">
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
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden items-center space-x-1 lg:flex">
                {/* Record Button */}
                <Link
                  href="/record"
                  onClick={() => setActiveLink('record')}
                  className="group relative px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Record
                  <div
                    className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                      activeLink === 'record'
                        ? 'w-full opacity-100'
                        : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}
                  ></div>
                  <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:from-blue-950/20 dark:to-purple-950/20"></div>
                </Link>

                {/* Features Dropdown */}
                <div className="relative" ref={featuresRef}>
                  <button
                    onClick={() => toggleDropdown('features')}
                    className="group flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <span>Features</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${openDropdown === 'features' ? 'rotate-180' : ''}`}
                    />
                    <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:from-blue-950/20 dark:to-purple-950/20"></div>
                  </button>

                  {/* Features Dropdown Content */}
                  {openDropdown === 'features' && (
                    <div className="absolute top-full left-0 z-[100] mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                      {featuresItems.map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <item.icon className="mr-3 h-4 w-4 text-blue-500" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Solutions Dropdown */}
                <div className="relative" ref={solutionsRef}>
                  <button
                    onClick={() => toggleDropdown('solutions')}
                    className="group flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <span>Solutions</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${openDropdown === 'solutions' ? 'rotate-180' : ''}`}
                    />
                    <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:from-blue-950/20 dark:to-purple-950/20"></div>
                  </button>

                  {/* Solutions Dropdown Content */}
                  {openDropdown === 'solutions' && (
                    <div className="absolute top-full left-0 z-[100] mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                      {solutionsItems.map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <item.icon className="mr-3 h-4 w-4 text-blue-500" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pricing Button */}
                <Link
                  href="/pricing"
                  onClick={() => setActiveLink('pricing')}
                  className="group relative px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Pricing
                  <div
                    className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
                      activeLink === 'pricing'
                        ? 'w-full opacity-100'
                        : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                    }`}
                  ></div>
                  <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:from-blue-950/20 dark:to-purple-950/20"></div>
                </Link>
              </div>
            </div>

            {/* Right Side - Auth & Profile */}
            <div className="flex items-center space-x-4">
              {!user ? (
                // Auth Buttons
                <div className="hidden items-center space-x-3 sm:flex">
                  <Button
                    onClick={() => handleAuthNavigation('/auth')}
                    variant="ghost"
                    className="relative z-10 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => handleAuthNavigation('/auth')}
                    className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                  >
                    Get Started
                  </Button>
                </div>
              ) : (
                // User Profile Dropdown
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => toggleDropdown('profile')}
                    className="group flex items-center space-x-2 rounded-full p-1 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-transparent transition-all duration-200 group-hover:ring-blue-400">
                      <AvatarImage
                        src={userProfile?.photoURL}
                        alt={userProfile?.displayName}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-sm text-white">
                        {userProfile?.displayName?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left sm:block">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {userProfile?.displayName || user?.email || 'User'}
                      </div>
                    </div>
                  </button>

                  {/* Profile Dropdown Content */}
                  {openDropdown === 'profile' && (
                    <div className="absolute top-full right-0 z-[100] mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                      <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {userProfile?.displayName || 'User'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </div>
                      </div>
                      {profileItems.map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <item.icon className="mr-3 h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                      <div className="mt-1 border-t border-gray-200 pt-1 dark:border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={handleMobileMenuToggle}
                data-mobile-menu
                className="p-2 text-gray-600 transition-colors duration-200 hover:text-gray-900 lg:hidden dark:text-gray-300 dark:hover:text-white"
              >
                <div className="relative h-6 w-6">
                  <Menu
                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}
                  />
                  <X
                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-[90] bg-black/50 transition-opacity duration-300 lg:hidden"
            style={{ top: '64px' }}
            data-mobile-menu
          >
            {/* Mobile Menu Content */}
            <div
              className="translate-y-0 border-t border-gray-200 bg-white transition-transform duration-300 dark:border-gray-700 dark:bg-gray-900"
              data-mobile-menu
            >
              <div className="space-y-4 px-6 py-6" data-mobile-menu>
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {/* Record */}
                  <Link
                    href="/record"
                    onClick={() => {
                      setActiveLink('record');
                      setIsMobileMenuOpen(false);
                    }}
                    className="group flex w-full items-center rounded-lg p-3 text-left text-gray-900 transition-all duration-200 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                  >
                    <span className="text-lg font-medium">Record</span>
                  </Link>

                  {/* Features Dropdown */}
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleMobileDropdown('features')}
                      className="group flex w-full items-center justify-between rounded-lg p-3 text-left text-gray-900 transition-all duration-200 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                      data-mobile-menu
                    >
                      <span className="text-lg font-medium">Features</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          mobileDropdowns.features ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Features Items */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        mobileDropdowns.features
                          ? 'max-h-96 opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="space-y-1 pl-4">
                        {featuresItems.map((item, index) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="group flex w-full items-center rounded-lg p-3 text-left text-gray-700 transition-all duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <item.icon className="mr-3 h-5 w-5 text-blue-500" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Solutions Dropdown */}
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleMobileDropdown('solutions')}
                      className="group flex w-full items-center justify-between rounded-lg p-3 text-left text-gray-900 transition-all duration-200 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                      data-mobile-menu
                    >
                      <span className="text-lg font-medium">Solutions</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          mobileDropdowns.solutions ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Solutions Items */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        mobileDropdowns.solutions
                          ? 'max-h-96 opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="space-y-1 pl-4">
                        {solutionsItems.map((item, index) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="group flex w-full items-center rounded-lg p-3 text-left text-gray-700 transition-all duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <item.icon className="mr-3 h-5 w-5 text-blue-500" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <Link
                    href="/pricing"
                    onClick={() => {
                      setActiveLink('pricing');
                      setIsMobileMenuOpen(false);
                    }}
                    className="group flex w-full items-center rounded-lg p-3 text-left text-gray-900 transition-all duration-200 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                  >
                    <span className="text-lg font-medium">Pricing</span>
                  </Link>
                </div>

                {/* Mobile Auth Actions */}
                {!user && (
                  <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                    <Button
                      onClick={() => {
                        handleAuthNavigation('/auth');
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        handleAuthNavigation('/auth');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
