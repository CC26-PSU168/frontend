'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/validators/authSchema';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = useWatch({
    control,
    name: 'password',
    defaultValue: '',
  });

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;

    if (!pwd) return strength;

  if (pwd.length > 0) strength++;
  if (pwd.length >= 8) strength++;
  if (/[A-Z]/.test(pwd)) strength++;
  if (/[0-9]/.test(pwd)) strength++;
  if (/[^A-Za-z0-9]/.test(pwd)) strength++;

  return Math.min(strength, 5);
  };

  const strengthLevel = getPasswordStrength(password);

  const strengthColors = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#a3e635',
    '#C8FF5A',
  ];

  const strengthLabels = [
    'Sangat Lemah',
    'Lemah',
    'Cukup',
    'Kuat',
    'Sangat Kuat',
  ];

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', data);

      const { user, accessToken, refreshToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setUser(user);

      router.push('/dashboard');
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const err = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        setError(
          err.response?.data?.message ||
            'Registrasi gagal. Silakan coba lagi.'
        );
      } else {
        setError('Registrasi gagal. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (name: string) =>
    `w-full
    h-[58px]
    bg-[#131313]
    border
    rounded-[18px]
    px-5
    text-[#F5F5F5]
    text-sm
    font-semibold
    transition-all
    duration-300
    placeholder:text-[#5F5F5F]
    outline-none
    ${
      focusedField === name
        ? 'border-[#C8FF5A] bg-[#171717] shadow-[0_0_0_4px_rgba(200,255,90,0.08)]'
        : errors[name as keyof typeof errors]
        ? 'border-red-500/40'
        : 'border-white/[0.05] hover:border-white/[0.10]'
    }`;

  const labelClass =
    'text-[10px] font-black uppercase tracking-[0.28em] text-[#6E6E6E] mb-3 block';

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px);
          }

          100% {
            transform: translateY(0px);
          }
        }

        .anim-1 {
          animation: slideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        .anim-2 {
          animation: slideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.08s both;
        }

        .anim-3 {
          animation: slideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.16s both;
        }

        .anim-4 {
          animation: slideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.24s both;
        }

        .anim-5 {
          animation: slideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.32s both;
        }

        .anim-6 {
          animation: slideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.40s both;
        }

        .floating {
          animation: float 6s ease-in-out infinite;
        }

        .feature-card {
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateX(6px);
          border-color: rgba(200,255,90,0.10);
          background: rgba(255,255,255,0.025);;
        }
      `}</style>

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#C8FF5A]/[0.08] blur-[180px] rounded-full" />

        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#C8FF5A]/[0.04] blur-[200px] rounded-full" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent_35%)]" />
      </div>

      <div className="relative z-10 min-h-screen grid lg:grid-cols-[58%_42%]">
        {/* LEFT */}
        <div className="hidden lg:flex flex-col justify-center gap-20 p-12 xl:p-16 border-r border-white/[0.04] bg-[#070707]">
          {/* TOP */}
          <div>
            {/* LOGO */}
            <div className="flex items-center gap-4 mb-20 anim-1">
              <div className="floating w-14 h-14 rounded-2xl bg-[#C8FF5A] flex items-center justify-center shadow-[0_0_40px_rgba(200,255,90,0.20)]">
                <span className="material-symbols-outlined text-black text-[28px]">
                  account_balance_wallet
                </span>
              </div>

              <span className="text-[2rem] font-black tracking-[-0.06em] text-white">
                Budgetly
              </span>
            </div>

            {/* HERO */}
            <div className="max-w-[540px]">
              <h1 className="text-[4.2rem] leading-[0.88] tracking-[-0.09em] max-h-[900px] font-black text-white anim-2">
                Mulai
                <br />
                perjalanan
                <br />

                <span className="text-[#C8FF5A] drop-shadow-[0_0_30px_rgba(200,255,90,0.25)]">
                  finansialmu.
                </span>
              </h1>

              <p className="mt-8 text-[#858585] text-[1.05rem] leading-[1.9] max-w-[620px] font-medium anim-3">
                Gratis selamanya untuk mahasiswa Indonesia.
                Kelola keuangan modern tanpa ribet dengan
                pengalaman yang cepat, elegan, dan powerful.
              </p>
            </div>

            {/* FEATURES */}
            <div className="mt-16 max-w-[450px] anim-4">
              <p className="text-[10px] uppercase tracking-[0.32em] font-black text-[#C8FF5A]/80 mb-6">
                Yang kamu dapat
              </p>

              <div className="space-y-3">
                {[
                  {
                    icon: 'receipt_long',
                    text: 'Catat transaksi unlimited',
                  },
                  {
                    icon: 'savings',
                    text: 'Budget & target tabungan',
                  },
                  {
                    icon: 'group',
                    text: 'Split bill dengan teman',
                  },
                  {
                    icon: 'psychology',
                    text: 'AI insight keuanganmu',
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="feature-card flex items-center gap-4 bg-[#0F0F0F] border border-white/[0.04] rounded-[18px] p-4"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-black border border-white/[0.05] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#C8FF5A] text-[18px]">
                        {f.icon}
                      </span>
                    </div>

                    <span className="text-white text-[15px] font-bold">
                      {f.text}
                    </span>

                    <span className="material-symbols-outlined text-[#5A5A5A] ml-auto">
                      arrow_forward
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="anim-5">
            <div className="inline-flex items-center gap-4 px-5 py-4 rounded-[22px] border border-white/[0.05] bg-[#101010]">
              <div className="flex -space-x-2">
                {['#232323', '#3A3A3A', '#C8FF5A'].map((c, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-black"
                    style={{ background: c }}
                  />
                ))}
              </div>

              <p className="text-[#A0A0A0] text-sm font-medium">
                Bergabung bersama{' '}
                <span className="text-[#C8FF5A] font-black">
                  10,000+
                </span>{' '}
                mahasiswa
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center px-6 py-10 lg:px-10 relative">
          <div className="w-full max-w-[470px] relative">
            {/* FORM CARD */}
            <div className="relative overflow-hidden rounded-[38px] border border-white/[0.06] bg-[#0C0C0C]/90 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.65)] p-8 sm:p-10 lg:p-11">
              {/* TOP GLOW */}
              <div className="absolute top-0 left-0 w-full h-[180px] bg-gradient-to-b from-[#C8FF5A]/[0.05] to-transparent pointer-events-none" />

              {/* MOBILE LOGO */}
              <div className="lg:hidden flex items-center gap-3 mb-12 anim-1">
                <div className="w-12 h-12 rounded-2xl bg-[#C8FF5A] flex items-center justify-center">
                  <span className="material-symbols-outlined text-black">
                    account_balance_wallet
                  </span>
                </div>

                <span className="text-2xl font-black tracking-[-0.06em] text-white">
                  Budgetly
                </span>
              </div>

              {/* HEADER */}
              <div className="mb-10 anim-1">
                <div className="inline-block bg-[#C8FF5A] px-3 py-1">
                  <h2 className="text-black text-[3rem] sm:text-[4rem] leading-[0.9] font-black tracking-[-0.10em]">
                    Daftar.
                  </h2>
                </div>

                <p className="mt-4 text-[#7A7A7A] text-sm leading-relaxed font-medium">
                  Buat akun baru & mulai kelola keuanganmu sekarang.
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-[20px] mb-6 text-sm font-bold flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm">
                    error
                  </span>

                  {error}
                </div>
              )}

              {/* FORM */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* NAME */}
                <div className="anim-2">
                  <label className={labelClass}>
                    Nama Lengkap
                  </label>

                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Adrian Wijaya"
                    className={inputClass('name')}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                  />

                  {errors.name && (
                    <p className="text-red-400 text-xs mt-2 font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs">
                        error
                      </span>

                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div className="anim-3">
                  <label className={labelClass}>Email</label>

                  <input
                    {...register('email')}
                    type="email"
                    placeholder="nama@universitas.ac.id"
                    className={inputClass('email')}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />

                  {errors.email && (
                    <p className="text-red-400 text-xs mt-2 font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs">
                        error
                      </span>

                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* UNIVERSITY */}
                <div className="anim-3">
                  <label className={labelClass}>
                    Universitas

                    <span className="ml-1 text-[#5A5A5A] normal-case tracking-normal">
                      (opsional)
                    </span>
                  </label>

                  <input
                    {...register('university')}
                    type="text"
                    placeholder="Universitas Indonesia"
                    className={inputClass('university')}
                    onFocus={() => setFocusedField('university')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>

                {/* PASSWORD */}
                <div className="anim-4">
                  <label className={labelClass}>Password</label>

                  <input
                    {...register('password')}
                    type="password"
                    placeholder="Min. 8 karakter"
                    className={inputClass('password')}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />

                  {password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-2">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-[5px] flex-1 rounded-full transition-all duration-500"
                            style={{
                              background:
                                i < strengthLevel
                                  ? strengthColors[
                                      strengthLevel - 1
                                    ]
                                  : '#1F1F1F',
                            }}
                          />
                        ))}
                      </div>

                      <p
                        className="text-[10px] font-black uppercase tracking-[0.24em]"
                        style={{
                          color:
                            strengthLevel > 0
                              ? strengthColors[
                                  strengthLevel - 1
                                ]
                              : '#5A5A5A',
                        }}
                      >
                        {strengthLabels[strengthLevel - 1] ||
                          'Sangat Lemah'}
                      </p>
                    </div>
                  )}

                  {errors.password && (
                    <p className="text-red-400 text-xs mt-2 font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs">
                        error
                      </span>

                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="anim-5">
                  <label className={labelClass}>
                    Konfirmasi Password
                  </label>

                  <input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="Ulangi password"
                    className={inputClass('confirmPassword')}
                    onFocus={() =>
                      setFocusedField('confirmPassword')
                    }
                    onBlur={() => setFocusedField(null)}
                  />

                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-2 font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs">
                        error
                      </span>

                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* SUBMIT */}
                <div className="pt-4 anim-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="
                      group
                      relative
                      overflow-hidden
                      w-full
                      h-[60px]
                      rounded-[18px]
                      bg-[#C8FF5A]
                      text-black
                      font-black
                      uppercase
                      tracking-[0.18em]
                      text-sm
                      transition-all
                      duration-300
                      hover:scale-[1.01]
                      hover:shadow-[0_0_40px_rgba(200,255,90,0.16)]
                      active:scale-[0.98]
                      disabled:opacity-50
                    "
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    {isLoading ? (
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />

                        Memproses...
                      </span>
                    ) : (
                      <span className="relative z-10">
                        Daftar Sekarang
                      </span>
                    )}
                  </button>
                </div>
              </form>

              {/* DIVIDER */}
              <div className="flex items-center gap-4 my-8 anim-6">
                <div className="flex-1 h-px bg-white/[0.05]" />

                <span className="text-[10px] uppercase tracking-[0.24em] font-black text-[#5A5A5A]">
                  atau
                </span>

                <div className="flex-1 h-px bg-white/[0.05]" />
              </div>

              {/* GOOGLE */}
              <div className="anim-6">
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                  className="
                    w-full
                    h-[58px]
                    rounded-[18px]
                    bg-[#131313]
                    border
                    border-white/[0.05]
                    flex
                    items-center
                    justify-center
                    gap-3
                    text-white
                    font-bold
                    text-sm
                    transition-all
                    duration-300
                    hover:bg-[#171717]
                    hover:border-white/[0.10]
                  "
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
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

                  Daftar dengan Google
                </a>
              </div>

              {/* FOOTER */}
              <p className="text-center text-[#6A6A6A] text-sm mt-8 font-medium anim-6">
                Sudah punya akun?{' '}

                <Link
                  href="/auth/login"
                  className="text-[#C8FF5A] font-black hover:underline underline-offset-4"
                >
                  Masuk
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}