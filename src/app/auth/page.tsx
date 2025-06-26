// src/app/auth/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { AudioWaveform, Eye, EyeOff, Loader2, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Validation schemas
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z
  .object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  // Sign In Form
  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Sign Up Form
  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSignIn = async (data: SignInForm) => {
    setIsLoading(true);
    setAuthError('');
    try {
      await signIn(data.email, data.password);
      router.push('/');
    } catch (error: unknown) {
      setAuthError(
        error instanceof Error ? error.message : 'Failed to sign in'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpForm) => {
    setIsLoading(true);
    setAuthError('');
    try {
      await signUp(data.email, data.password, data.displayName);
      router.push('/');
    } catch (error: unknown) {
      setAuthError(
        error instanceof Error ? error.message : 'Failed to create account'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setAuthError('');
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (error: unknown) {
      setAuthError(
        error instanceof Error ? error.message : 'Failed to sign in with Google'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const switchAuthMode = (newIsSignUp: boolean) => {
    setIsSignUp(newIsSignUp);
    setAuthError('');
    signInForm.reset();
    signUpForm.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated background waves */}
        <svg
          className="absolute top-0 left-0 h-full w-full opacity-10"
          viewBox="0 0 1200 800"
        >
          <path
            d="M0,300 Q300,200 600,300 T1200,250"
            stroke="url(#wave1)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M0,400 Q400,300 800,400 T1200,350"
            stroke="url(#wave2)"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 h-16 w-16 animate-pulse rounded-full bg-blue-200/20 dark:bg-blue-800/20"></div>
        <div
          className="absolute top-40 right-32 h-12 w-12 animate-pulse rounded-full bg-purple-200/20 dark:bg-purple-800/20"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-32 left-40 h-20 w-20 animate-pulse rounded-full bg-indigo-200/20 dark:bg-indigo-800/20"
          style={{ animationDelay: '3s' }}
        ></div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Header with Logo */}
          <div className="mb-8 text-center">
            <Link href="/" className="group inline-flex items-center space-x-3">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="SpeakRight"
                  width={48}
                  height={48}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-400/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-2xl font-bold text-transparent dark:from-white dark:to-gray-300">
                SpeakRight
              </span>
            </Link>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Perfect your pronunciation with AI-powered feedback
            </p>
          </div>

          {/* Auth Card */}
          <Card className="border-white/20 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-gray-700/30 dark:bg-gray-800/70">
            <CardHeader className="space-y-6 text-center">
              {/* Toggle Buttons */}
              <div className="relative mx-auto w-full max-w-sm">
                <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
                  <button
                    onClick={() => switchAuthMode(false)}
                    className={`relative flex-1 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 ${
                      !isSignUp
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    }`}
                  >
                    Sign In
                    {!isSignUp && (
                      <div className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    )}
                  </button>
                  <button
                    onClick={() => switchAuthMode(true)}
                    className={`relative flex-1 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 ${
                      isSignUp
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    }`}
                  >
                    Sign Up
                    {isSignUp && (
                      <div className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    )}
                  </button>
                </div>
              </div>

              {/* Dynamic Title */}
              <div className="space-y-2">
                <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                  <AudioWaveform className="h-6 w-6 text-blue-500" />
                  <span>{isSignUp ? 'Create Account' : 'Welcome Back'}</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isSignUp
                    ? 'Join thousands improving their pronunciation'
                    : 'Continue your pronunciation journey'}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Message */}
              {authError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  {authError}
                </div>
              )}

              {/* Google Sign In */}
              <Button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                variant="outline"
                className="w-full border-gray-300 bg-white py-3 text-base hover:bg-gray-50 hover:shadow-lg dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="font-medium">Continue with Google</span>
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Sign In Form */}
              {!isSignUp && (
                <form
                  onSubmit={signInForm.handleSubmit(handleSignIn)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-9"
                        {...signInForm.register('email')}
                        aria-invalid={!!signInForm.formState.errors.email}
                      />
                    </div>
                    {signInForm.formState.errors.email && (
                      <p className="text-sm text-red-600">
                        {signInForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pr-9"
                        {...signInForm.register('password')}
                        aria-invalid={!!signInForm.formState.errors.password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {signInForm.formState.errors.password && (
                      <p className="text-sm text-red-600">
                        {signInForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Sign In
                  </Button>
                </form>
              )}

              {/* Sign Up Form */}
              {isSignUp && (
                <form
                  onSubmit={signUpForm.handleSubmit(handleSignUp)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name</Label>
                    <Input
                      id="displayName"
                      placeholder="Enter your full name"
                      {...signUpForm.register('displayName')}
                      aria-invalid={!!signUpForm.formState.errors.displayName}
                    />
                    {signUpForm.formState.errors.displayName && (
                      <p className="text-sm text-red-600">
                        {signUpForm.formState.errors.displayName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-9"
                        {...signUpForm.register('email')}
                        aria-invalid={!!signUpForm.formState.errors.email}
                      />
                    </div>
                    {signUpForm.formState.errors.email && (
                      <p className="text-sm text-red-600">
                        {signUpForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        className="pr-9"
                        {...signUpForm.register('password')}
                        aria-invalid={!!signUpForm.formState.errors.password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {signUpForm.formState.errors.password && (
                      <p className="text-sm text-red-600">
                        {signUpForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="pr-9"
                        {...signUpForm.register('confirmPassword')}
                        aria-invalid={
                          !!signUpForm.formState.errors.confirmPassword
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {signUpForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600">
                        {signUpForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Create Account
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="hover:text-blue-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="hover:text-blue-600">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
