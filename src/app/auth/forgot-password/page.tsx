'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/validators/authSchema';

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async () => {
    // TODO: Integrate with backend reset password endpoint
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0A0A0A] relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#BCFF4F]/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 text-center px-16">
          <h1 className="text-6xl font-[900] tracking-[-0.04em] text-[#BCFF4F] mb-4">KAMPUSCUAN</h1>
          <p className="text-[#888888] text-lg font-medium">
            Jangan khawatir.<br />
            Kami bantu reset password kamu.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 bg-[#0A0A0A] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-12 text-center">
            <h1 className="text-3xl font-[900] tracking-[-0.04em] text-[#BCFF4F]">KAMPUSCUAN</h1>
          </div>

          {!isSubmitted ? (
            <>
              <div className="mb-10">
                <h2 className="text-4xl font-[900] tracking-[-0.04em] text-white">Reset Password.</h2>
                <p className="text-[#888888] mt-2 font-medium">
                  Masukkan email yang terdaftar. Kami akan mengirimkan link reset.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  {errors.email && <p className="text-red-400 text-xs mt-2 font-bold">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#BCFF4F] text-[#0A0A0A] font-[900] py-4 rounded-full text-lg active:scale-95 transition-all"
                >
                  KIRIM LINK RESET
                </button>
              </form>

              <p className="text-center text-[#888888] text-sm mt-8">
                <Link href="/auth/login" className="text-[#BCFF4F] font-bold hover:underline">
                  ← Kembali ke Login
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-[#BCFF4F] rounded-full flex items-center justify-center mx-auto mb-8">
                <span className="material-symbols-outlined text-[#0A0A0A] text-4xl">mark_email_read</span>
              </div>
              <h2 className="text-3xl font-[900] text-white mb-4">Email Terkirim!</h2>
              <p className="text-[#888888] font-medium mb-8">
                Cek inbox email kamu untuk link reset password. Link berlaku selama 1 jam.
              </p>
              <Link
                href="/auth/login"
                className="inline-block bg-[#BCFF4F] text-[#0A0A0A] font-[900] px-8 py-4 rounded-full active:scale-95 transition-all"
              >
                KEMBALI KE LOGIN
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
