'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Camera,
  Check,
  Edit3,
  Loader2,
  Mail,
  Save,
  User,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Validation schema for profile updates
const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, userProfile, updateUserProfile, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: userProfile?.displayName || '',
    },
  });

  // Update form when userProfile changes
  useEffect(() => {
    if (userProfile) {
      form.reset({
        displayName: userProfile.displayName,
      });
    }
  }, [userProfile, form]);

  const handleProfileUpdate = async (data: ProfileForm) => {
    if (!userProfile) return;

    setIsUpdating(true);
    setUpdateError('');
    setUpdateSuccess(false);

    try {
      await updateUserProfile({
        displayName: data.displayName,
      });
      setUpdateSuccess(true);
      setIsEditing(false);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : 'Failed to update profile'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 dark:from-gray-900 dark:to-gray-800">
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

      <div className="container mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            Account Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your account information
          </p>
        </div>

        <div className="flex justify-center">
          {/* Profile Information Card */}
          <div className="w-full max-w-2xl space-y-6">
            <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-8 backdrop-blur-sm dark:border-gray-700/30 dark:from-blue-950/10 dark:to-purple-950/10">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Profile Information
                </h2>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>

              {/* Success Message */}
              {updateSuccess && (
                <div className="mb-6 flex items-center space-x-3 rounded-xl border border-green-200 bg-green-50/80 p-4 dark:border-green-800 dark:bg-green-900/20">
                  <Check className="h-5 w-5 text-green-500" />
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Profile updated successfully!
                  </p>
                </div>
              )}

              {/* Error Message */}
              {updateError && (
                <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50/80 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    {updateError}
                  </p>
                  <button
                    onClick={() => setUpdateError('')}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20 ring-4 ring-white/50 dark:ring-gray-700/50">
                      <AvatarImage
                        src={userProfile.photoURL}
                        alt={userProfile.displayName}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-2xl text-white">
                        {userProfile.displayName?.charAt(0) ||
                          user.email?.charAt(0) ||
                          'U'}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute -right-1 -bottom-1 rounded-full bg-blue-500 p-2 text-white shadow-lg transition-all hover:scale-110 hover:bg-blue-600">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {userProfile.displayName || 'Update your name'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                {isEditing ? (
                  <form
                    onSubmit={form.handleSubmit(handleProfileUpdate)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        placeholder="Enter your display name"
                        {...form.register('displayName')}
                        aria-invalid={!!form.formState.errors.displayName}
                      />
                      {form.formState.errors.displayName && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.displayName.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          form.reset();
                          setUpdateError('');
                        }}
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-white/60 p-4 dark:border-gray-600 dark:bg-gray-800/60">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Display Name
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {userProfile.displayName || 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email (Read-only) */}
                <div className="rounded-xl border border-gray-200 bg-white/60 p-4 dark:border-gray-600 dark:bg-gray-800/60">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
