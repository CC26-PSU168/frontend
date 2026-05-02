'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/validators/authSchema';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', data);
      const { user, accessToken, refreshToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);

      router.push('/dashboard');
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message || 'Login gagal');
      } else {
        setError('Login gagal');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#0A0A0A] relative items-center justify-center overflow-hidden">
        {/* Diagonal Clip */}
        <div className="absolute inset-0 bg-[#BCFF4F]/5 clip-diagonal" />

        {/* Decorative gears */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="material-symbols-outlined animate-gear absolute top-20 left-[15%] text-[100px] text-white opacity-[0.06]">
            settings
          </span>
          <span className="material-symbols-outlined animate-gear-reverse absolute bottom-32 right-[10%] text-[160px] text-white opacity-[0.04]">
            settings
          </span>
        </div>

        <div className="relative z-10 text-center px-16">
          <h1 className="text-6xl font-[900] tracking-[-0.04em] text-[#BCFF4F] mb-4">
            KAMPUSCUAN
          </h1>
          <p className="text-[#888888] text-lg font-medium">
            Kelola keuanganmu dengan cerdas.<br />
            AI-powered insights untuk mahasiswa Indonesia.
          </p>
          <div className="mt-12 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-[900] text-white">10K+</p>
              <p className="text-[#888888] text-xs uppercase tracking-widest">Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-[900] text-[#BCFF4F]">AI</p>
              <p className="text-[#888888] text-xs uppercase tracking-widest">Powered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-[900] text-white">100%</p>
              <p className="text-[#888888] text-xs uppercase tracking-widest">Free</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 bg-[#0A0A0A] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-12 text-center">
            <h1 className="text-3xl font-[900] tracking-[-0.04em] text-[#BCFF4F]">KAMPUSCUAN</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-[900] tracking-[-0.04em] text-white">Masuk.</h2>
            <p className="text-[#888888] mt-2 font-medium">Selamat datang kembali, Sobat Cuan!</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-[10px] font-[900] text-[#888888] uppercase tracking-widest mb-2 block">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="nama@universitas.ac.id"
                className="w-full bg-[#141414] border border-white/5 rounded-xl px-6 py-4 text-[#F4F4F0] font-bold text-sm focus:ring-2 focus:ring-[#BCFF4F]/50 focus:border-transparent transition-all placeholder:text-[#333]"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-2 font-bold">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-[900] text-[#888888] uppercase tracking-widest mb-2 block">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#141414] border border-white/5 rounded-xl px-6 py-4 text-[#F4F4F0] font-bold text-sm focus:ring-2 focus:ring-[#BCFF4F]/50 focus:border-transparent transition-all placeholder:text-[#333]"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-2 font-bold">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-[#BCFF4F] text-xs font-bold hover:underline"
              >
                Lupa Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#BCFF4F] text-[#0A0A0A] font-[900] py-4 rounded-full text-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memproses...' : 'MASUK'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-[#888888] text-xs font-bold uppercase">atau</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          {/* Google OAuth */}
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            className="w-full bg-[#141414] border border-white/10 text-[#F4F4F0] font-bold py-4 rounded-full flex items-center justify-center gap-3 hover:bg-[#1C1B1B] transition-all active:scale-95 cursor-pointer block text-center"
          >
            <svg className="w-5 h-5 inline-block" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Masuk dengan Google
          </a>

          {/* Register link */}
          <p className="text-center text-[#888888] text-sm mt-8">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-[#BCFF4F] font-bold hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
