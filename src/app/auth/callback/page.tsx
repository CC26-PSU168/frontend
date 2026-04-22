'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setTokens = useAuthStore((state) => state.setTokens);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      router.push(`/auth/login?error=${error}`);
      return;
    }

    if (accessToken && refreshToken) {
      // Setup session properly
      setTokens(accessToken, refreshToken);
      
      // Attempt to load profile, then redirect to dashboard
      fetchProfile()
        .then(() => {
          router.push('/dashboard');
        })
        .catch(() => {
          // If profile fetch fails, user might need to retry login
          router.push('/auth/login?error=profile_fetch_failed');
        });
    } else {
      router.push('/auth/login?error=invalid_oauth_response');
    }
  }, [searchParams, router, setTokens, fetchProfile]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-lime mb-4"></div>
      <p className="text-neutral-400">Menghubungkan akun Google Anda...</p>
    </div>
  );
}
