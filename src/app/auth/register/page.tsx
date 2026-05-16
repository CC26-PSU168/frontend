'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [mounted, setMounted] = useState(false);

  const leftRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = useWatch({ control, name: 'password', defaultValue: '' });

  const getPasswordStrength = (pwd: string) => {
    let s = 0;
    if (!pwd) return s;
    if (pwd.length > 0) s++;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return Math.min(s, 5);
  };

  const strengthLevel = getPasswordStrength(password);
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
  const strengthLabels = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];

  useEffect(() => {
    // Defer setting mounted to avoid synchronous setState during render/effect
    // which can cause cascading renders. Use rAF to schedule update.
    const id = typeof window !== 'undefined' && 'requestAnimationFrame' in window
      ? window.requestAnimationFrame(() => setMounted(true))
      : // fallback for non-browser env
        setTimeout(() => setMounted(true), 0);

    return () => {
      if (typeof window !== 'undefined' && 'cancelAnimationFrame' in window) {
        window.cancelAnimationFrame(id as number);
      } else {
        clearTimeout(id as number);
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let gsap: typeof import('gsap').gsap;

    const initGSAP = async () => {
      const gsapModule = await import('gsap');
      gsap = gsapModule.gsap;

      // Set initial states
      gsap.set([logoRef.current, badgeRef.current], { opacity: 0, y: -20 });
      gsap.set(headlineRef.current, { opacity: 0, y: 40, skewY: 3 });
      gsap.set(subRef.current, { opacity: 0, y: 20 });
      gsap.set(featuresRef.current?.children ?? [], { opacity: 0, x: -24 });
      gsap.set(socialRef.current, { opacity: 0, y: 16 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(logoRef.current, { opacity: 1, y: 0, duration: 0.6 })
        .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .to(headlineRef.current, { opacity: 1, y: 0, skewY: 0, duration: 0.8 }, '-=0.2')
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
        .to(featuresRef.current?.children ?? [], {
          opacity: 1, x: 0, duration: 0.5, stagger: 0.08,
        }, '-=0.3')
        .to(socialRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');

      // Subtle parallax on mouse move
      const handleMouseMove = (e: MouseEvent) => {
        if (!leftRef.current) return;
        const rect = leftRef.current.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(headlineRef.current, {
          x: cx * 10, y: cy * 8,
          duration: 1.2, ease: 'power2.out',
        });
        gsap.to(badgeRef.current, {
          x: cx * 16, y: cy * 12,
          duration: 1.4, ease: 'power2.out',
        });
      };

      leftRef.current?.addEventListener('mousemove', handleMouseMove);

      return () => {
        leftRef.current?.removeEventListener('mousemove', handleMouseMove);
      };
    };

    initGSAP();
  }, [mounted]);

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
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
      } else {
        setError('Registrasi gagal. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (name: string) =>
    [
      'w-full h-[52px] rounded-2xl px-4 text-[13.5px] font-medium outline-none transition-all duration-200',
      'placeholder:text-[#3a3a3a] text-white border',
      focusedField === name
        ? 'border-[#C8FF5A]/60 bg-[#1C1C1C] shadow-[0_0_0_3px_rgba(200,255,90,0.08)]'
        : errors[name as keyof typeof errors]
        ? 'border-red-500/30 bg-[#1A1515]'
        : 'border-white/[0.07] bg-[#181818] hover:border-white/[0.14] hover:bg-[#1C1C1C]',
    ].join(' ');

  const labelClass = 'block text-[10px] font-bold uppercase tracking-[0.22em] text-[#555] mb-2';

  return (
    <div className="min-h-screen flex overflow-hidden" suppressHydrationWarning>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,900&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        body { font-family: 'DM Sans', sans-serif; }

        @keyframes formIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .fi { animation: formIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .fi-1 { animation-delay: 0.08s; }
        .fi-2 { animation-delay: 0.14s; }
        .fi-3 { animation-delay: 0.20s; }
        .fi-4 { animation-delay: 0.26s; }
        .fi-5 { animation-delay: 0.32s; }
        .fi-6 { animation-delay: 0.38s; }
        .fi-7 { animation-delay: 0.44s; }

        .feat-row {
          position: relative;
          transition: background 0.18s ease, transform 0.18s ease;
          cursor: default;
        }
        .feat-row::before {
          content: '';
          position: absolute;
          left: 0; top: 50%; transform: translateY(-50%);
          width: 2px; height: 0;
          background: #C8FF5A;
          border-radius: 4px;
          transition: height 0.2s ease;
        }
        .feat-row:hover {
          background: rgba(200,255,90,0.06);
          transform: translateX(3px);
        }
        .feat-row:hover::before { height: 60%; }

        .dot-grid {
          background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      {/* ════════ LEFT — Dark Premium with GSAP ════════ */}
      <div
        ref={leftRef}
        className="hidden lg:flex flex-col w-[46%] relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0D0D0D 0%, #111 60%, #141414 100%)' }}
      >
        {/* Dot grid */}
        <div className="dot-grid absolute inset-0 pointer-events-none" />

        {/* Accent blob */}
        <div className="absolute top-[-100px] right-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(200,255,90,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] left-[-40px] w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(200,255,90,0.05) 0%, transparent 70%)' }} />

        {/* Vertical accent line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />

        <div className="relative z-10 flex flex-col h-full px-12 xl:px-14 py-12">

          {/* Logo */}
          <div ref={logoRef} className="flex items-center gap-3 mb-auto">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: '#C8FF5A' }}>
              <span className="material-symbols-outlined text-black text-[18px]">
                account_balance_wallet
              </span>
            </div>
            <span className="text-[1.1rem] font-black tracking-[-0.04em] text-white"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Budgetly
            </span>
          </div>

          {/* Main content */}
          <div className="flex flex-col justify-center flex-1 py-10">
            {/* Badge */}
            <div ref={badgeRef} className="mb-7">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#888]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF5A]" />
                Gratis untuk mahasiswa
              </span>
            </div>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="text-[3rem] xl:text-[3.6rem] font-black leading-[0.88] tracking-[-0.05em] text-white"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Mulai
              <br />
              perjalanan
              <br />
              <span style={{ color: '#C8FF5A' }}>finansialmu.</span>
            </h1>

            <p
              ref={subRef}
              className="mt-6 text-[0.9rem] leading-[1.85] max-w-[320px] font-normal"
              style={{ color: '#555' }}
            >
              Kelola keuangan lebih cerdas — catat, analisis, dan rencanakan masa depan finansialmu.
            </p>

            {/* Features */}
            <div ref={featuresRef} className="mt-10 space-y-0.5">
              {[
                { icon: 'receipt_long', label: 'Catat transaksi unlimited' },
                { icon: 'savings',      label: 'Budget & target tabungan' },
                { icon: 'group',        label: 'Split bill dengan teman' },
                { icon: 'psychology',   label: 'AI insight keuanganmu' },
              ].map((f, i) => (
                <div
                  key={i}
                  className="feat-row flex items-center gap-3.5 px-4 py-3.5 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(200,255,90,0.08)', border: '1px solid rgba(200,255,90,0.1)' }}>
                    <span className="material-symbols-outlined text-[#C8FF5A] text-[15px]">
                      {f.icon}
                    </span>
                  </div>
                  <span className="text-[13.5px] font-semibold" style={{ color: '#aaa' }}>{f.label}</span>
                  <span className="material-symbols-outlined ml-auto text-[14px]" style={{ color: '#333' }}>
                    arrow_forward
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div ref={socialRef} className="flex items-center gap-3 pt-7 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex -space-x-1.5">
              {[
                'linear-gradient(135deg,#2a2a2a,#3a3a3a)',
                'linear-gradient(135deg,#333,#444)',
                'linear-gradient(135deg,#C8FF5A,#aee040)',
              ].map((bg, i) => (
                <div key={i} className="w-7 h-7 rounded-full border border-black/60 flex-shrink-0"
                  style={{ background: bg }} />
              ))}
            </div>
            <p className="text-[13px] font-medium" style={{ color: '#555' }}>
              Bergabung bersama{' '}
              <span className="font-bold" style={{ color: '#C8FF5A' }}>10,000+</span> mahasiswa
            </p>
          </div>
        </div>
      </div>

      {/* ════════ RIGHT — Form Panel ════════ */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-10 lg:px-12 relative"
        style={{ background: '#0A0A0A' }}
      >
        {/* Subtle top highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(200,255,90,0.15), transparent)' }} />

        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10 fi fi-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#C8FF5A' }}>
              <span className="material-symbols-outlined text-black text-[17px]">account_balance_wallet</span>
            </div>
            <span className="text-base font-black tracking-[-0.04em] text-white">Budgetly</span>
          </div>

          {/* Header */}
          <div className="mb-8 fi fi-1">
            <h2 className="text-[2.4rem] font-black tracking-[-0.06em] text-white leading-[0.88]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Daftar<span style={{ color: '#C8FF5A' }}>.</span>
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed" style={{ color: '#555' }}>
              Buat akun & mulai kelola keuanganmu sekarang.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm font-medium flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.06)' }}>
              <span className="material-symbols-outlined text-[15px]">error</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">

            <div className="fi fi-2">
              <label className={labelClass}>Nama Lengkap</label>
              <input
                {...register('name')}
                type="text"
                placeholder="Adrian Wijaya"
                className={inputClass('name')}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">error</span>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="fi fi-3">
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
                <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">error</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="fi fi-3">
              <label className={labelClass}>
                Universitas
                <span className="ml-1.5 normal-case tracking-normal font-normal" style={{ color: '#444' }}>(opsional)</span>
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

            <div className="fi fi-4">
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
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[0,1,2,3,4].map((i) => (
                      <div key={i} className="h-[3px] flex-1 rounded-full transition-all duration-300"
                        style={{ background: i < strengthLevel ? strengthColors[strengthLevel - 1] : '#222' }} />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: strengthLevel > 0 ? strengthColors[strengthLevel - 1] : '#444' }}>
                    {strengthLabels[strengthLevel - 1] || 'Sangat Lemah'}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">error</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="fi fi-5">
              <label className={labelClass}>Konfirmasi Password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="Ulangi password"
                className={inputClass('confirmPassword')}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1.5 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">error</span>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-1 fi fi-6">
              <button
                type="submit"
                disabled={isLoading}
                className="relative overflow-hidden w-full h-[52px] rounded-2xl font-black text-sm uppercase tracking-[0.16em] text-black transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #C8FF5A 0%, #aee040 100%)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(200,255,90,0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  'Daftar Sekarang'
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5 fi fi-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: '#3a3a3a' }}>atau</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Google */}
          <div className="fi fi-7">
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
              className="w-full h-[50px] rounded-2xl flex items-center justify-center gap-2.5 text-white text-sm font-semibold transition-all duration-200"
              style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.14)';
                (e.currentTarget as HTMLAnchorElement).style.background = '#1c1c1c';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLAnchorElement).style.background = '#161616';
              }}
            >
              <svg className="w-[17px] h-[17px] flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Daftar dengan Google
            </a>
          </div>

          <p className="text-center text-[13px] mt-6 fi fi-7" style={{ color: '#444' }}>
            Sudah punya akun?{' '}
            <Link href="/auth/login"
              className="font-bold hover:underline underline-offset-4"
              style={{ color: '#C8FF5A' }}>
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}