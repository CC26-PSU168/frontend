'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

// Inner component that uses useSearchParams — must be inside <Suspense>
function OAuthCallbackInner() {
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
      setTokens(accessToken, refreshToken);

      fetchProfile()
        .then(() => {
          router.push('/dashboard');
        })
        .catch(() => {
          router.push('/auth/login?error=profile_fetch_failed');
        });
    } else {
      router.push('/auth/login?error=invalid_oauth_response');
    }
  }, [searchParams, router, setTokens, fetchProfile]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-lime mb-4" />
      <p className="text-neutral-400">Menghubungkan akun Google Anda...</p>
    </div>
  );
}

// Page export wraps inner component with Suspense (required by Next.js 14+)
export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-lime mb-4" />
          <p className="text-neutral-400">Memuat...</p>
        </div>
      }
    >
      <OAuthCallbackInner />
    </Suspense>
  );
}
