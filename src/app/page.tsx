'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import LandingNavbar from '@/components/layout/LandingNavbar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const balanceCardRef = useRef<HTMLDivElement>(null);
  const chip1Ref = useRef<HTMLDivElement>(null);
  const chip2Ref = useRef<HTMLDivElement>(null);
  const bokekItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bokekTitleRef = useRef<HTMLDivElement>(null);
  const bentoItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const statCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const caraKerjaRef = useRef<HTMLElement>(null);
  const caraKerjaStepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const phoneRef = useRef<HTMLDivElement>(null);
  const aiSpotlightRef = useRef<HTMLElement>(null);
  const testimonialCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  const marqueeItems = ['Catat Transaksi', 'Split Bill', 'Budget Otomatis', 'AI Insight', 'Target Tabungan'];
  const marqueeItemsDuplicated = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];
  const marqueeItems2 = ['Smart Finance', 'Student Life Hack', 'Investasi Sejak Kuliah', 'Anti-Bokek System'];
  const marqueeItems2Duplicated = [...marqueeItems2, ...marqueeItems2, ...marqueeItems2, ...marqueeItems2];

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (cursor && cursorDot) {
      let mouseX = 0, mouseY = 0;
      let curX = 0, curY = 0;
      const onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.1 });
      };
      document.addEventListener('mousemove', onMouseMove);
      const animateCursor = () => {
        curX += (mouseX - curX) * 0.12;
        curY += (mouseY - curY) * 0.12;
        gsap.set(cursor, { x: curX, y: curY });
        requestAnimationFrame(animateCursor);
      };
      animateCursor();

      document.querySelectorAll<HTMLElement>('a, button, [data-cursor-grow]').forEach(el => {
        el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 2.5, opacity: 0.6, duration: 0.3 }));
        el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 }));
      });

      return () => {
        document.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Hero Section Entrance ──
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .fromTo('h1', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' })
        .fromTo(balanceCardRef.current,
          { y: 60, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.4)' }, '-=0.4')
        .fromTo(chip1Ref.current,
          { x: -40, opacity: 0, rotate: -12 },
          { x: 0, opacity: 1, rotate: -6, duration: 0.7, ease: 'back.out(2)' }, '-=0.5')
        .fromTo(chip2Ref.current,
          { x: 40, opacity: 0, rotate: 8 },
          { x: 0, opacity: 1, rotate: 4, duration: 0.7, ease: 'back.out(2)' }, '-=0.5');

      gsap.to(balanceCardRef.current, { y: -12, duration: 2.8, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to(chip1Ref.current, { rotate: -4, y: -6, duration: 2.2, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.to(chip2Ref.current, { rotate: 6, y: 6, duration: 2.6, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.fromTo('.hero-progress-bar', { width: '0%' }, { width: '75%', duration: 1.8, ease: 'power2.out', delay: 1.2 });

      // ── Bokek Section ──
      gsap.fromTo(bokekTitleRef.current, { x: -60, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: bokekTitleRef.current, start: 'top 80%' }
      });

      bokekItemsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el, { x: 50, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: i * 0.15,
          scrollTrigger: { trigger: el, start: 'top 85%' }
        });
      });

      // ── Features Bento Grid ──
      bentoItemsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el, { y: 50, opacity: 0, scale: 0.95 }, {
          y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)', delay: i * 0.1,
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });

      // ── Stats Counter Animation ──
      statCardsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: i * 0.2,
          scrollTrigger: { trigger: el, start: 'top 85%' }
        });
        const numEl = el.querySelector<HTMLElement>('.stat-number');
        if (numEl) {
          const target = numEl.dataset.target;
          if (target) {
            ScrollTrigger.create({
              trigger: el, start: 'top 80%', once: true,
              onEnter: () => {
                const obj = { val: 0 };
                gsap.to(obj, {
                  val: parseFloat(target), duration: 2, ease: 'power2.out',
                  onUpdate: () => {
                    numEl.textContent = (numEl.dataset.prefix ?? '') + Math.round(obj.val).toLocaleString('en-US') + (numEl.dataset.suffix ?? '');
                  }
                });
              }
            });
          }
        }
      });

      // ── Testimonial Quote ──
      gsap.fromTo(testimonialRef.current, { x: 60, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: testimonialRef.current, start: 'top 80%' }
      });

      // ── Cara Kerja Section ──
      gsap.fromTo(phoneRef.current, { y: 80, opacity: 0, scale: 0.85 }, {
        y: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: phoneRef.current, start: 'top 80%' }
      });

      ScrollTrigger.create({
        trigger: caraKerjaRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self: ScrollTrigger) => {
          if (phoneRef.current) {
            gsap.to(phoneRef.current, { y: -40 * self.progress, ease: 'none', duration: 0 });
          }
        }
      });

      caraKerjaStepsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el, { x: 60, opacity: 0 }, {
          x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: i * 0.2,
          scrollTrigger: { trigger: el, start: 'top 85%' }
        });
      });

      // ── AI Spotlight ──
      gsap.fromTo(aiSpotlightRef.current, { opacity: 0, scale: 0.95 }, {
        opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: aiSpotlightRef.current, start: 'top 75%' }
      });
      gsap.to('.ai-bg-text', {
        x: -80, ease: 'none',
        scrollTrigger: { trigger: aiSpotlightRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });

      // ── Testimonials Grid ──
      testimonialCardsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el, { y: 40, opacity: 0, rotate: 0 }, {
          y: 0, opacity: 1,
          rotate: i === 0 ? 1 : i === 1 ? -1 : 2,
          duration: 0.8, ease: 'back.out(1.4)', delay: i * 0.15,
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });

      // ── CTA Section ──
      gsap.fromTo(ctaRef.current, { y: 60, opacity: 0, scale: 0.97 }, {
        y: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' }
      });

      // ── Marquee hover ──
      document.querySelectorAll<HTMLElement>('.marquee-item').forEach(item => {
        item.addEventListener('mouseenter', () => gsap.to(item, { scale: 1.08, duration: 0.25, ease: 'back.out(2)' }));
        item.addEventListener('mouseleave', () => gsap.to(item, { scale: 1, duration: 0.2 }));
      });
    });

    return () => ctx.revert();
  }, []);

  // ── GSAP hover helpers ──
  const handleCardEnter = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { scale: 1.04, y: -8, boxShadow: '0 24px 60px rgba(188,255,79,0.18)', duration: 0.35, ease: 'back.out(2)' });
  };
  const handleCardLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { scale: 1, y: 0, boxShadow: '0 0px 0px rgba(0,0,0,0)', duration: 0.3, ease: 'power3.out' });
  };
  const handleChipEnter = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { scale: 1.12, duration: 0.3, ease: 'back.out(2)' });
  };
  const handleChipLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.25 });
  };
  const handleBokekItemEnter = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { x: 8, scale: 1.02, duration: 0.3, ease: 'power3.out' });
    const num = e.currentTarget.querySelector<HTMLElement>('.bokek-num');
    if (num) gsap.to(num, { color: '#BCFF4F', scale: 1.15, duration: 0.3 });
  };
  const handleBokekItemLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { x: 0, scale: 1, duration: 0.3, ease: 'power3.out' });
    const num = e.currentTarget.querySelector<HTMLElement>('.bokek-num');
    if (num) gsap.to(num, { color: '#000', scale: 1, duration: 0.3 });
  };
  const handleTagEnter = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { scale: 1.1, borderColor: '#BCFF4F', color: '#BCFF4F', duration: 0.25, ease: 'back.out(2)' });
  };
  const handleTagLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { scale: 1, borderColor: 'rgba(188,255,79,0.3)', color: '#F4F4F0', duration: 0.25 });
  };
  const handleStatEnter = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { scale: 1.04, y: -6, borderColor: 'rgba(188,255,79,0.4)', duration: 0.35, ease: 'back.out(2)' });
  };
  const handleStatLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { scale: 1, y: 0, borderColor: 'rgba(188,255,79,0.1)', duration: 0.3 });
  };
  const handleTestiCardEnter = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { scale: 1.05, rotate: 0, y: -10, duration: 0.35, ease: 'back.out(2)' });
  };
  const handleTestiCardLeave = (e: React.MouseEvent<HTMLElement>, rot: number) => {
    gsap.to(e.currentTarget, { scale: 1, rotate: rot, y: 0, duration: 0.3, ease: 'power3.out' });
  };
  const handleCtaBtnEnter = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { scale: 1.08, y: -4, duration: 0.3, ease: 'back.out(2)' });
  };
  const handleCtaBtnLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.25 });
  };
  const handleBentoEnter = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { scale: 1.03, y: -6, boxShadow: '0 20px 50px rgba(188,255,79,0.15)', duration: 0.35, ease: 'back.out(1.8)' });
  };
  const handleBentoLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { scale: 1, y: 0, boxShadow: 'none', duration: 0.3 });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E2E1] overflow-x-hidden" style={{ cursor: 'none' }}>
      {/* Custom Cursor */}
      <div ref={cursorRef} style={{ position: 'fixed', top: 0, left: 0, width: 36, height: 36, border: '2px solid #BCFF4F', borderRadius: '50%', pointerEvents: 'none', zIndex: 99999, transform: 'translate(-50%, -50%)', mixBlendMode: 'difference' }} />
      <div ref={cursorDotRef} style={{ position: 'fixed', top: 0, left: 0, width: 6, height: 6, background: '#BCFF4F', borderRadius: '50%', pointerEvents: 'none', zIndex: 100000, transform: 'translate(-50%, -50%)' }} />

      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-track { display: flex; width: max-content; will-change: transform; }
        .marquee-track--left       { animation: marquee-left  28s linear infinite; }
        .marquee-track--right      { animation: marquee-right 22s linear infinite; }
        .marquee-track--left-slow  { animation: marquee-left  36s linear infinite; }
        .marquee-track--right-slow { animation: marquee-right 40s linear infinite; }
        .marquee-wrapper { overflow: hidden; width: 100%; }
        * { cursor: none !important; }
        .gsap-reveal { display: inline-block; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0px rgba(188,255,79,0); }
          50%       { box-shadow: 0 0 40px rgba(188,255,79,0.3); }
        }
        .glow-pulse { animation: pulse-glow 3s ease-in-out infinite; }
        .hero-progress-bar { width: 0%; }
      `}</style>

      <LandingNavbar />

      <main className="pt-24 relative z-10">

        {/* ===== Hero Section ===== */}
        <section className="relative px-8 pt-20 pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-6xl md:text-9xl font-[900] tracking-[-0.04em] leading-[0.9] text-[#F4F4F0] mb-12">
            Partner Kamu untuk Keuangan yang <span className="text-[#BCFF4F]">Lebih Cerdas.</span>
          </h1>

          <div className="relative w-full max-w-4xl mt-12">
            <div
              ref={balanceCardRef}
              onMouseEnter={handleCardEnter}
              onMouseLeave={handleCardLeave}
              data-cursor-grow
              className="glow-pulse bg-[#2A2A2A] border border-[#BCFF4F]/15 p-8 rounded-xl text-left shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-[#888888] font-bold uppercase tracking-widest text-xs">Total Saldo</span>
                <span className="material-symbols-outlined text-[#BCFF4F]">visibility</span>
              </div>
              <div className="text-4xl md:text-6xl font-[900] text-[#F4F4F0] mb-6 tracking-tighter">Rp4.250.000</div>
              <div className="w-full bg-[#0A0A0A] h-3 rounded-full overflow-hidden mb-2">
                <div className="hero-progress-bar bg-[#BCFF4F] h-full rounded-full shadow-[0_0_15px_rgba(188,255,79,0.5)]" />
              </div>
              <div className="flex justify-between text-xs font-bold uppercase text-[#888888]">
                <span>Terpakai (75%)</span>
                <span>Limit: Rp5.600.000</span>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#BCFF4F]/5 rounded-full blur-3xl" />
            </div>

            <div
              ref={chip1Ref}
              onMouseEnter={handleChipEnter}
              onMouseLeave={handleChipLeave}
              data-cursor-grow
              className="absolute -top-6 -left-4 md:-left-12 bg-[#BCFF4F] text-black font-[900] px-6 py-3 rounded-full rotate-[-6deg] z-20 shadow-xl uppercase text-sm"
            >
              🔥 Hemat 20% Minggu Ini
            </div>
            <div
              ref={chip2Ref}
              onMouseEnter={handleChipEnter}
              onMouseLeave={handleChipLeave}
              data-cursor-grow
              className="absolute top-20 -right-4 md:-right-12 bg-[#201F1F] border border-[#BCFF4F]/20 text-[#F4F4F0] font-[900] px-6 py-3 rounded-full rotate-[4deg] z-20 shadow-xl flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[#BCFF4F]">bolt</span> AI Analyst
            </div>
          </div>
        </section>

        {/* ===== Marquee Strips ===== */}
        {/* Strip 1 — Putih bg, teks hitam, scrolls LEFT */}
        <div className="bg-white py-5 border-t border-black/8 overflow-hidden">
          <div className="marquee-wrapper">
            <div className="marquee-track marquee-track--left flex items-center gap-10">
              {marqueeItemsDuplicated.map((item, i) => (
                <span key={`s1-${i}`} className="marquee-item flex items-center gap-10 pr-10 text-black font-[800] uppercase tracking-widest text-sm whitespace-nowrap">
                  <span>{item}</span>
                  <span className="text-black/20 text-xs">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Strip 2 — Lime bg, teks hitam, scrolls RIGHT */}
        <div className="bg-[#BCFF4F] py-5 overflow-hidden">
          <div className="marquee-wrapper">
            <div className="marquee-track marquee-track--right flex items-center gap-10">
              {marqueeItems2Duplicated.map((item, i) => (
                <span key={`s2-${i}`} className="marquee-item flex items-center gap-10 pr-10 text-black font-[800] uppercase tracking-widest text-sm whitespace-nowrap">
                  <span>{item}</span>
                  <span className="text-black/20 text-xs">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Strip 3 — Hitam bg, teks lime, scrolls LEFT slow */}
        <div className="bg-[#111111] py-5 overflow-hidden">
          <div className="marquee-wrapper">
            <div className="marquee-track marquee-track--left-slow flex items-center gap-10">
              {marqueeItemsDuplicated.map((item, i) => (
                <span key={`s3-${i}`} className="marquee-item flex items-center gap-10 pr-10 text-[#BCFF4F] font-[800] uppercase tracking-widest text-sm whitespace-nowrap">
                  <span>{item}</span>
                  <span className="text-[#BCFF4F]/30 text-xs">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Strip 4 — Abu gelap bg, teks putih redup, scrolls RIGHT slow */}
        <div className="bg-[#1C1C1C] py-5 border-b border-white/5 overflow-hidden">
          <div className="marquee-wrapper">
            <div className="marquee-track marquee-track--right-slow flex items-center gap-10">
              {marqueeItems2Duplicated.map((item, i) => (
                <span key={`s4-${i}`} className="marquee-item flex items-center gap-10 pr-10 text-[#f4f4f0] font-[800] uppercase tracking-widest text-sm whitespace-nowrap">
                  <span>{item}</span>
                  <span className="text-[#333333] text-xs">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Kenapa Mahasiswa Selalu Bokek Section ===== */}
        <section id="features" className="bg-white py-32 px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
            <div ref={bokekTitleRef} className="flex flex-col gap-6">
              <h2 className="text-6xl md:text-8xl font-[900] text-black leading-[0.9] tracking-tighter">
                Kenapa<br />Mahasiswa<br />Selalu<br />
                <span className="bg-[#BCFF4F] px-4 inline-block gsap-reveal">Bokek?</span>
              </h2>
              <p className="text-black/60 font-bold text-lg max-w-md">
                Masalah finansial bukan karena kamu nggak punya uang, tapi karena sistemnya yang nggak ada.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              {[
                { num: '01', title: 'Lupa Catat Pengeluaran', quote: 'Tiba-tiba saldo tinggal 50 ribu, padahal baru awal bulan.' },
                { num: '02', title: 'FOMO & Impulsive Buying', quote: 'Beli kopi mahal demi nongkrong, besoknya makan promag.' },
                { num: '03', title: 'Nabung Cuma Wacana', quote: 'Niat nabung buat konser, malah kepake buat jajan seblak.' },
              ].map((item, i) => (
                <div
                  key={i}
                  ref={(el) => { bokekItemsRef.current[i] = el; }}
                  onMouseEnter={handleBokekItemEnter}
                  onMouseLeave={handleBokekItemLeave}
                  data-cursor-grow
                  className="bg-[#F8FFF0] p-8 border-l-8 border-black flex gap-6 items-start"
                >
                  <span className="bokek-num text-4xl font-[900] text-black leading-none">{item.num}</span>
                  <div>
                    <h4 className="text-xl font-[900] text-black mb-1">{item.title}</h4>
                    <p className="text-black/60 font-medium italic">&ldquo;{item.quote}&rdquo;</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Separator */}
        <div className="h-40 w-full bg-gradient-to-b from-white to-[#0A0A0A]" />

        {/* ===== Features Bento Grid ===== */}
        <section id="fitur" className="px-8 py-32 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            <div
              ref={(el) => { bentoItemsRef.current[0] = el; }}
              onMouseEnter={handleBentoEnter}
              onMouseLeave={handleBentoLeave}
              data-cursor-grow
              className="md:col-span-2 bg-[#2A2A2A] p-12 rounded-xl flex flex-col justify-end relative overflow-hidden group border border-[#BCFF4F]/15"
            >
              <div className="absolute top-8 right-8 text-[#BCFF4F] opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                <span className="material-symbols-outlined text-8xl">psychology</span>
              </div>
              <h3 className="text-5xl font-[900] tracking-tighter text-[#F4F4F0] relative z-10">
                Kamu catat,<br />AI yang analisa
              </h3>
              <p className="text-[#888888] mt-4 font-medium max-w-sm">
                Biarkan teknologi neural network kami membedah setiap pengeluaran kopi susu kamu.
              </p>
            </div>

            <div
              ref={(el) => { bentoItemsRef.current[1] = el; }}
              onMouseEnter={handleBentoEnter}
              onMouseLeave={handleBentoLeave}
              data-cursor-grow
              className="bg-[#BCFF4F] p-12 rounded-xl flex flex-col justify-between"
            >
              <span className="material-symbols-outlined text-black text-6xl">savings</span>
              <h3 className="text-3xl font-[900] tracking-tighter text-black">Target Menabung Otomatis</h3>
            </div>

            <div
              ref={(el) => { bentoItemsRef.current[2] = el; }}
              onMouseEnter={handleBentoEnter}
              onMouseLeave={handleBentoLeave}
              data-cursor-grow
              className="bg-[#F4F4F0] p-12 rounded-xl flex flex-col justify-between"
            >
              <span className="material-symbols-outlined text-black text-6xl">group</span>
              <h3 className="text-3xl font-[900] tracking-tighter text-black">Komunitas Cuan Berjamaah</h3>
            </div>

            <div
              ref={(el) => { bentoItemsRef.current[3] = el; }}
              onMouseEnter={handleBentoEnter}
              onMouseLeave={handleBentoLeave}
              data-cursor-grow
              className="md:col-span-2 bg-[#201F1F] p-12 rounded-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-[#BCFF4F]/15"
            >
              <div>
                <h3 className="text-4xl font-[900] tracking-tighter text-[#F4F4F0]">Laporan Mingguan Tanpa Ribet.</h3>
                <p className="text-[#888888] mt-2 font-medium">Laporan visual bergaya editorial langsung ke HP-mu.</p>
              </div>
              <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#BCFF4F]/20 flex gap-2">
                <div className="w-2 h-16 bg-[#BCFF4F]/20 rounded-full flex flex-col justify-end"><div className="h-1/2 bg-[#BCFF4F] rounded-full" /></div>
                <div className="w-2 h-16 bg-[#BCFF4F]/20 rounded-full flex flex-col justify-end"><div className="h-3/4 bg-[#BCFF4F] rounded-full" /></div>
                <div className="w-2 h-16 bg-[#BCFF4F]/20 rounded-full flex flex-col justify-end"><div className="h-2/4 bg-[#BCFF4F] rounded-full" /></div>
                <div className="w-2 h-16 bg-[#BCFF4F]/20 rounded-full flex flex-col justify-end"><div className="h-full bg-[#BCFF4F] rounded-full" /></div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Stats Section ===== */}
        <section className="px-8 py-32 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="flex flex-col gap-16 md:w-1/2">
            {[
              { num: 10000, display: '10,000', prefix: '', suffix: '+', label: 'Mahasiswa Aktif', color: '#F4F4F0', accent: '#BCFF4F' },
              { num: 50, display: '50', prefix: '', suffix: '+', label: 'Kampus Bergabung', color: '#BCFF4F', accent: '#888888' },
              { num: 2, display: '2', prefix: 'Rp', suffix: 'M+', label: 'Tabungan Terkumpul', color: '#F4F4F0', accent: '#888888' },
            ].map((item, i) => (
              <div
                key={i}
                ref={(el) => { statCardsRef.current[i] = el; }}
                onMouseEnter={handleStatEnter}
                onMouseLeave={handleStatLeave}
                data-cursor-grow
                className="p-8 bg-[#201F1F] rounded-xl border border-[#BCFF4F]/10"
              >
                <span
                  className="stat-number text-7xl md:text-9xl font-[900] tracking-tighter leading-none"
                  style={{ color: item.color }}
                  data-target={item.num}
                  data-prefix={item.prefix}
                  data-suffix={item.suffix}
                >
                  {item.prefix}{item.display}{item.suffix}
                </span>
                <p className="font-[900] uppercase tracking-[0.2em] text-lg mt-4" style={{ color: item.accent }}>{item.label}</p>
              </div>
            ))}
          </div>

          <div
            ref={testimonialRef}
            onMouseEnter={handleCardEnter}
            onMouseLeave={handleCardLeave}
            data-cursor-grow
            className="bg-[#2A2A2A] border-l-8 border-[#BCFF4F] p-12 max-w-md sticky top-32 md:w-1/2 border border-[#BCFF4F]/15 rounded-r-xl"
          >
            <span className="material-symbols-outlined text-[#BCFF4F] text-5xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
            <p className="text-2xl font-bold leading-relaxed text-[#F4F4F0] mb-8">
              &ldquo;Dulu saldo selalu habis di tengah bulan. Sejak pake Budgetly, gue jadi tau borosnya di mana dan sekarang malah bisa nabung buat beli laptop baru.&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#3A3939] flex items-center justify-center font-[900]">AD</div>
              <div>
                <div className="font-[900] text-[#F4F4F0]">Adit Daniswara</div>
                <div className="text-[#888888] text-sm uppercase font-bold">Binus University</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Cara Kerja ===== */}
        <section ref={caraKerjaRef} id="edukasi" className="bg-[#BCFF4F] py-32 px-8 text-black">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -inset-10 bg-black/5 rounded-full blur-3xl" />
              <div
                ref={phoneRef}
                onMouseEnter={handleCardEnter}
                onMouseLeave={handleCardLeave}
                data-cursor-grow
                className="bg-black p-4 rounded-[3rem] shadow-2xl relative z-10 max-w-xs mx-auto border-8 border-[#1A1A1A]"
              >
                <div className="rounded-[2.5rem] w-full aspect-[9/16] bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] flex flex-col items-center justify-center gap-6 p-8">
                  <span className="material-symbols-outlined text-[#BCFF4F] text-6xl">account_balance_wallet</span>
                  <span className="text-[#BCFF4F] font-[900] text-2xl tracking-tighter">Budgetly</span>
                  <div className="w-full space-y-3">
                    <div className="bg-[#2A2A2A] h-3 rounded-full w-full" />
                    <div className="bg-[#BCFF4F] h-3 rounded-full w-3/4" />
                    <div className="bg-[#2A2A2A] h-3 rounded-full w-1/2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-16">
              {[
                { num: '01', title: 'Unduh & Registrasi', desc: 'Cukup 2 menit menggunakan email kampus kamu untuk akses fitur eksklusif.' },
                { num: '02', title: 'Hubungkan Bank', desc: 'Sinkronisasi aman dengan enkripsi tingkat bank untuk pencatatan otomatis.' },
                { num: '03', title: 'Biarkan AI Beraksi', desc: 'Terima tips finansial personal yang disesuaikan dengan gaya hidup mahasiswa.' },
              ].map((step, i) => (
                <div
                  key={i}
                  ref={(el) => { caraKerjaStepsRef.current[i] = el; }}
                  onMouseEnter={handleBokekItemEnter}
                  onMouseLeave={handleBokekItemLeave}
                  data-cursor-grow
                  className="relative"
                >
                  <span className="absolute -top-10 -left-6 text-9xl font-[900] text-black/5 leading-none">{step.num}</span>
                  <h4 className="text-4xl font-[900] tracking-tighter relative z-10">{step.title}</h4>
                  <p className="text-black/70 font-bold max-w-sm mt-2">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== AI Spotlight ===== */}
        <section ref={aiSpotlightRef} className="py-40 px-8 relative overflow-hidden text-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
            <span className="ai-bg-text text-[30vw] font-[900] text-[#F4F4F0] select-none">CUAN AI</span>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <span className="text-[#BCFF4F] font-[900] uppercase tracking-[0.4em] mb-6 block gsap-reveal">Teknologi Neural</span>
            <h2 className="text-6xl md:text-8xl font-[900] tracking-tighter text-[#F4F4F0] mb-12">
              AI yang tahu kamu{' '}
              <span onMouseEnter={handleChipEnter} onMouseLeave={handleChipLeave} data-cursor-grow className="bg-[#BCFF4F] text-black px-4 inline-block">
                boros di mana.
              </span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Predictive Spending', 'Auto-Categorization', 'Fraud Detection'].map((tag, i) => (
                <span
                  key={i}
                  onMouseEnter={handleTagEnter}
                  onMouseLeave={handleTagLeave}
                  data-cursor-grow
                  className="border border-[#BCFF4F]/30 px-6 py-3 rounded-full text-[#F4F4F0] font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Testimonials ===== */}
        <section id="komunitas" className="px-8 py-32 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              ref={(el) => { testimonialCardsRef.current[0] = el; }}
              onMouseEnter={handleTestiCardEnter}
              onMouseLeave={(e) => handleTestiCardLeave(e, 1)}
              data-cursor-grow
              className="bg-[#F4F4F0] p-10 rounded-xl text-black rotate-1 h-fit"
            >
              <span className="material-symbols-outlined text-[#BCFF4F] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              <p className="font-bold text-xl mb-6 mt-4">&ldquo;Gokil sih aplikasinya, bener-bener ngerubah mindset gue soal duit jajan.&rdquo;</p>
              <div className="font-[900]">Raka Wijaya</div>
            </div>
            <div
              ref={(el) => { testimonialCardsRef.current[1] = el; }}
              onMouseEnter={handleTestiCardEnter}
              onMouseLeave={(e) => handleTestiCardLeave(e, -1)}
              data-cursor-grow
              className="bg-[#2A2A2A] p-10 rounded-xl -rotate-1 self-center border border-[#BCFF4F]/15"
            >
              <div onMouseEnter={handleChipEnter} onMouseLeave={handleChipLeave} className="bg-[#BCFF4F] text-black w-fit px-4 py-1 rounded-full font-[900] text-xs mb-6">POPULER</div>
              <p className="font-bold text-xl mb-6 text-[#F4F4F0]">&ldquo;Fitur komunitasnya edukatif banget. Gak cuma catet pengeluaran tapi juga belajar saham!&rdquo;</p>
              <div className="font-[900] text-[#BCFF4F]">Siska Amelia</div>
            </div>
            <div
              ref={(el) => { testimonialCardsRef.current[2] = el; }}
              onMouseEnter={handleTestiCardEnter}
              onMouseLeave={(e) => handleTestiCardLeave(e, 2)}
              data-cursor-grow
              className="bg-[#F4F4F0] p-10 rounded-xl text-black rotate-2 h-fit md:col-start-2 lg:col-start-3"
            >
              <span className="material-symbols-outlined text-[#BCFF4F] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              <p className="font-bold text-xl mb-6 mt-4">&ldquo;UI-nya keren parah, betah banget liatin grafik di sini daripada buka sosmed.&rdquo;</p>
              <div className="font-[900]">Dafa Pratama</div>
            </div>
          </div>

          <div className="mt-20 flex justify-center">
            <div onMouseEnter={handleCardEnter} onMouseLeave={handleCardLeave} data-cursor-grow className="bg-[#201F1F] border-2 border-[#BCFF4F] rounded-full px-12 py-6 flex items-center gap-4">
              <div className="flex -space-x-4">
                <div className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-[#3A3939]" />
                <div className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-[#888888]" />
                <div className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-[#BCFF4F]" />
              </div>
              <span className="font-[900] text-[#F4F4F0] text-2xl">4.9/5</span>
              <span className="text-[#888888] font-bold uppercase text-sm tracking-widest">User Rating</span>
            </div>
          </div>
        </section>

        {/* ===== Final CTA ===== */}
        <section className="px-8 mb-32">
          <div
            ref={ctaRef}
            onMouseEnter={handleCardEnter}
            onMouseLeave={handleCardLeave}
            data-cursor-grow
            className="max-w-7xl mx-auto bg-[#BCFF4F] rounded-3xl p-12 md:p-24 overflow-hidden relative"
          >
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="text-center md:text-left">
                <h2 className="text-7xl md:text-[10rem] font-[900] text-black tracking-tighter leading-[0.8] mb-8">
                  Mulai hari ini.<br />Gratis
                </h2>
                <p className="text-black font-bold text-2xl">Gabung dengan ribuan mahasiswa cerdas lainnya.</p>
              </div>
              <div className="shrink-0 flex flex-col gap-4">
                <Link
                  href="/auth/register"
                  onMouseEnter={handleCtaBtnEnter}
                  onMouseLeave={handleCtaBtnLeave}
                  data-cursor-grow
                  className="bg-black text-[#BCFF4F] px-12 py-8 rounded-full font-[900] text-2xl shadow-2xl text-center inline-block"
                >
                  Daftar Sekarang
                </Link>
                <p className="text-center text-black/60 font-bold uppercase text-xs tracking-widest">Tersedia di iOS &amp; Android</p>
              </div>
            </div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/10 rounded-full blur-3xl" />
            <div className="absolute top-10 right-10 opacity-10">
              <span className="material-symbols-outlined text-[20rem]">trending_up</span>
            </div>
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="bg-[#0A0A0A] w-full py-12 border-t border-[#BCFF4F]/15 relative z-10">
        <div className="flex flex-col items-center gap-8 w-full px-8">
          <div onMouseEnter={handleChipEnter} onMouseLeave={handleChipLeave} data-cursor-grow className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#BCFF4F]">account_balance_wallet</span>
            <span className="text-xl font-[900] tracking-tighter text-[#F4F4F0]">Budgetly.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { label: 'Fitur',     href: '#fitur' },
              { label: 'Edukasi',   href: '#edukasi' },
              { label: 'Komunitas', href: '#komunitas' },
              { label: 'Bantuan',   href: '#bantuan' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={handleTagEnter}
                onMouseLeave={handleTagLeave}
                data-cursor-grow
                className="text-[#888888] font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="w-full h-[1px] bg-[#BCFF4F]/10 max-w-7xl" />
          <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl gap-4">
            <p className="text-[#888888] text-sm">© 2024 Budgetly. Smart Finance for Students.</p>
            <div className="flex gap-6">
              <span onMouseEnter={handleChipEnter} onMouseLeave={handleChipLeave} data-cursor-grow className="material-symbols-outlined text-[#888888]">share</span>
              <span onMouseEnter={handleChipEnter} onMouseLeave={handleChipLeave} data-cursor-grow className="material-symbols-outlined text-[#888888]">language</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}