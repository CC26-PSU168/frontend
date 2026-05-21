'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import LandingNavbar from '@/components/layout/LandingNavbar';
import LogoImage from '@/components/common/LogoImage';
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

  const [activeSection, setActiveSection] = useState<string>('');
  const [clickedFooterLink, setClickedFooterLink] = useState<string>('');

  const marqueeItems = ['Catat Transaksi', 'Split Bill', 'Budget Otomatis', 'AI Insight', 'Target Tabungan'];
  const marqueeItemsDuplicated = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];
  const marqueeItems2 = ['Smart Finance', 'Student Life Hack', 'Investasi Sejak Kuliah', 'Anti-Bokek System'];
  const marqueeItems2Duplicated = [...marqueeItems2, ...marqueeItems2, ...marqueeItems2, ...marqueeItems2];

  useEffect(() => {
    if (activeSection) {
      window.dispatchEvent(new CustomEvent('activeSectionChange', { detail: activeSection }));
    }
  }, [activeSection]);

  useEffect(() => {
    const sectionIds = ['fitur', 'features', 'edukasi', 'komunitas'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const normalized = id === 'features' ? 'fitur' : id;
              setActiveSection(normalized);
            }
          });
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      bentoItemsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el, { y: 50, opacity: 0, scale: 0.95 }, {
          y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)', delay: i * 0.1,
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });

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

      gsap.fromTo(testimonialRef.current, { x: 60, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: testimonialRef.current, start: 'top 80%' }
      });

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

      gsap.fromTo(aiSpotlightRef.current, { opacity: 0, scale: 0.95 }, {
        opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: aiSpotlightRef.current, start: 'top 75%' }
      });
      gsap.to('.ai-bg-text', {
        x: -80, ease: 'none',
        scrollTrigger: { trigger: aiSpotlightRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });

      testimonialCardsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el, { y: 40, opacity: 0, rotate: 0 }, {
          y: 0, opacity: 1,
          rotate: i === 0 ? 1 : i === 1 ? -1 : i === 2 ? 2 : i === 3 ? -2 : 1,
          duration: 0.8, ease: 'back.out(1.4)', delay: i * 0.15,
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });

      gsap.fromTo(ctaRef.current, { y: 60, opacity: 0, scale: 0.97 }, {
        y: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' }
      });

      document.querySelectorAll<HTMLElement>('.marquee-item').forEach(item => {
        item.addEventListener('mouseenter', () => gsap.to(item, { scale: 1.08, duration: 0.25, ease: 'back.out(2)' }));
        item.addEventListener('mouseleave', () => gsap.to(item, { scale: 1, duration: 0.2 }));
      });
    });

    return () => ctx.revert();
  }, []);

  const footerLinks = [
    { label: 'Fitur',     href: '#fitur' },
    { label: 'Edukasi',   href: '#edukasi' },
    { label: 'Komunitas', href: '#komunitas' },
    { label: 'Bantuan',   href: '#bantuan' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E2E1] overflow-x-hidden">
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
        .gsap-reveal { display: inline-block; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0px rgba(188,255,79,0); }
          50%       { box-shadow: 0 0 40px rgba(188,255,79,0.3); }
        }
        .glow-pulse { animation: pulse-glow 3s ease-in-out infinite; }
        .hero-progress-bar { width: 0%; }
        .nav-link-active {
          text-decoration: underline;
          text-underline-offset: 6px;
          text-decoration-thickness: 2px;
          text-decoration-color: #BCFF4F;
          color: #BCFF4F;
          font-weight: 900;
        }
        .footer-link-active {
          text-decoration: underline;
          text-underline-offset: 6px;
          text-decoration-thickness: 2px;
          text-decoration-color: #BCFF4F;
          color: #BCFF4F;
        }
        .testi-stack {
          position: relative;
        }
        .testi-stack .stack-card {
          transition: transform 0.35s cubic-bezier(.34,1.56,.64,1);
        }

        /* ── Bento redesign ── */
        .bento-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(188,255,79,0.1);
          border: 1px solid rgba(188,255,79,0.25);
          color: #BCFF4F;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
        }
        .bento-card-main {
          background: linear-gradient(135deg, #1A1A1A 0%, #131313 100%);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }
        .bento-card-main::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at top left, rgba(188,255,79,0.07) 0%, transparent 60%);
          pointer-events: none;
        }
        .bento-card-lime {
          background: #BCFF4F;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }
        .bento-card-white {
          background: #F4F4F0;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }
        .bento-card-dark {
          background: #111111;
          border: 1px solid rgba(188,255,79,0.08);
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }
        .bento-card-dark::after {
          content: '';
          position: absolute;
          bottom: 0; right: 0;
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(188,255,79,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Stats redesign ── */
        .stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }
        .stat-pill--lime {
          background: rgba(188,255,79,0.12);
          color: #BCFF4F;
          border: 1px solid rgba(188,255,79,0.2);
        }
        .stat-pill--dark {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.4);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .stat-card-new {
          border-radius: 20px;
          padding: 36px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 220px;
        }
        .stat-divider {
          width: 1px;
          background: rgba(255,255,255,0.06);
          align-self: stretch;
        }
        .testi-wide-card {
          border-radius: 20px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 2fr 3fr;
        }
        @media (max-width: 768px) {
          .testi-wide-card { grid-template-columns: 1fr; }
        }
      `}</style>

      <LandingNavbar activeSection={activeSection} />

      <main className="pt-24 relative z-10">

        {/* ===== Hero Section ===== */}
        <section className="relative px-8 pt-20 pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-6xl md:text-9xl font-[900] tracking-[-0.04em] leading-[0.9] text-[#F4F4F0] mb-12">
            Partner Kamu untuk Keuangan yang <span className="text-[#BCFF4F]">Lebih Cerdas.</span>
          </h1>

          <div className="relative w-full max-w-4xl mt-12">
            <div
              ref={balanceCardRef}
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
              className="absolute -top-6 -left-4 md:-left-12 bg-[#BCFF4F] text-black font-[900] px-6 py-3 rounded-full rotate-[-6deg] z-20 shadow-xl uppercase text-sm"
            >
              🔥 Hemat 20% Minggu Ini
            </div>
            <div
              ref={chip2Ref}
              className="absolute top-20 -right-4 md:-right-12 bg-[#201F1F] border border-[#BCFF4F]/20 text-[#F4F4F0] font-[900] px-6 py-3 rounded-full rotate-[4deg] z-20 shadow-xl flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[#BCFF4F]">bolt</span> AI Analyst
            </div>
          </div>
        </section>

        {/* ===== Marquee Strips ===== */}
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

        {/* ===== Features Bento Grid — REDESIGNED ===== */}
        <section id="fitur" className="px-8 py-32 max-w-7xl mx-auto">

          {/* Section header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="bento-tag mb-4 inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-[#BCFF4F]" />
                Fitur Unggulan
              </span>
              <h2 className="text-5xl md:text-7xl font-[900] tracking-tighter text-[#F4F4F0] leading-[0.9] mt-3">
                Semua yang kamu<br />butuhkan, <span className="text-[#BCFF4F]">satu app.</span>
              </h2>
            </div>
            <p className="hidden md:block text-[#555555] font-medium max-w-xs text-right leading-relaxed">
              Dirancang khusus untuk ritme hidup mahasiswa yang dinamis dan penuh kejutan.
            </p>
          </div>

          {/* Row 1: Large card (2/3) + Tall card (1/3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

            {/* Card 1 — AI Analisa — 2 col wide */}
            <div
              ref={(el) => { bentoItemsRef.current[0] = el; }}
              className="bento-card-main md:col-span-2 p-10 flex flex-col justify-between min-h-[320px]"
            >
              <div className="flex items-start justify-between">
                <span className="bento-tag">AI-Powered</span>
                <div className="w-14 h-14 rounded-2xl bg-[#BCFF4F]/10 border border-[#BCFF4F]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#BCFF4F] text-3xl">psychology</span>
                </div>
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-[900] tracking-tighter text-[#F4F4F0] leading-tight mb-3">
                  Kamu catat,<br />AI yang analisa
                </h3>
                <p className="text-[#666666] font-medium max-w-sm leading-relaxed">
                  Biarkan teknologi neural network kami membedah setiap pengeluaran kopi susu kamu.
                </p>
              </div>
              {/* mini chart decoration */}
              <div className="flex items-end gap-1.5 mt-6">
                {[40, 65, 45, 80, 55, 95, 70].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{ height: `${h * 0.5}px`, background: i === 5 ? '#BCFF4F' : 'rgba(188,255,79,0.15)' }} />
                ))}
              </div>
            </div>

            {/* Card 2 — Target Nabung — 1 col */}
            <div
              ref={(el) => { bentoItemsRef.current[1] = el; }}
              className="bento-card-lime p-10 flex flex-col justify-between min-h-[320px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-3xl">savings</span>
              </div>
              <div>
                {/* circular progress mock */}
                <div className="mb-5">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="6" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke="black" strokeWidth="6"
                      strokeDasharray="213.6" strokeDashoffset="64" strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
                    <text x="40" y="46" textAnchor="middle" fontSize="14" fontWeight="900" fill="black">70%</text>
                  </svg>
                </div>
                <h3 className="text-2xl font-[900] tracking-tighter text-black leading-tight">Target Menabung<br />Otomatis</h3>
                <p className="text-black/60 font-medium text-sm mt-2">Konser bulan depan? Budgetly bantu kamu nabung dari sekarang.</p>
              </div>
            </div>
          </div>

          {/* Row 2: Small card (1/3) + Wide card (2/3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Card 3 — Komunitas */}
            <div
              ref={(el) => { bentoItemsRef.current[2] = el; }}
              className="bento-card-white p-10 flex flex-col justify-between min-h-[260px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-black/8 flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-3xl">group</span>
              </div>
              <div>
                <h3 className="text-2xl font-[900] tracking-tighter text-black leading-tight">Komunitas Cuan<br />Berjamaah</h3>
                <div className="flex -space-x-2 mt-4">
                  {['#3A3939', '#888888', '#BCFF4F', '#444', '#222'].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white" style={{ background: c }} />
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-black flex items-center justify-center">
                    <span className="text-white text-[9px] font-[900]">+9k</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4 — Laporan Mingguan — 2 col */}
            <div
              ref={(el) => { bentoItemsRef.current[3] = el; }}
              className="bento-card-dark md:col-span-2 p-10 flex flex-col md:flex-row items-end justify-between gap-8 min-h-[260px]"
            >
              <div className="flex-1">
                <span className="bento-tag mb-4 inline-flex">Laporan Visual</span>
                <h3 className="text-3xl md:text-4xl font-[900] tracking-tighter text-[#F4F4F0] leading-tight">Laporan Mingguan<br />Tanpa Ribet.</h3>
                <p className="text-[#555555] mt-2 font-medium">Laporan visual bergaya editorial langsung ke HP-mu.</p>
              </div>
              {/* bar chart mockup */}
              <div className="flex items-end gap-2 shrink-0 pb-1">
                {[
                  { h: 50, label: 'Sen' },
                  { h: 75, label: 'Sel' },
                  { h: 45, label: 'Rab' },
                  { h: 100, label: 'Kam' },
                  { h: 65, label: "Jum" },
                  { h: 80, label: 'Sab' },
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div
                      className="w-6 rounded-md"
                      style={{
                        height: `${bar.h * 0.9}px`,
                        background: i === 3 ? '#BCFF4F' : 'rgba(188,255,79,0.15)',
                      }}
                    />
                    <span className="text-[9px] font-[900] uppercase text-[#444]">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Stats Section — REDESIGNED ===== */}
        <section className="px-8 py-32 max-w-7xl mx-auto">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-16">
            <div className="w-10 h-[2px] bg-[#BCFF4F]" />
            <span className="text-[#BCFF4F] font-[900] uppercase tracking-[0.4em] text-xs">Dampak Nyata</span>
          </div>

          {/* Stats row — horizontal strip layout */}
          <div className="rounded-2xl border border-white/5 overflow-hidden mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">

              {/* Stat 1 */}
              <div
                ref={(el) => { statCardsRef.current[0] = el; }}
                className="bg-[#0F0F0F] px-10 py-12 flex flex-col gap-4 relative overflow-hidden group"
              >
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #BCFF4F 0px, #BCFF4F 1px, transparent 1px, transparent 12px)',
                }} />
                <span className="stat-pill stat-pill--dark self-start">01 / Pengguna</span>
                <div className="mt-2">
                  <span
                    className="stat-number block text-[4.5rem] md:text-[5.5rem] font-[900] tracking-[-0.04em] leading-none text-[#F4F4F0]"
                    data-target="10000"
                    data-prefix=""
                    data-suffix="+"
                  >
                    10,000+
                  </span>
                  <p className="font-[900] uppercase tracking-[0.25em] text-xs mt-3 text-[#BCFF4F]">Mahasiswa Aktif</p>
                </div>
                <div className="w-full h-0.5 bg-gradient-to-r from-[#BCFF4F]/40 to-transparent mt-auto" />
              </div>

              {/* Stat 2 — highlighted */}
              <div
                ref={(el) => { statCardsRef.current[1] = el; }}
                className="bg-[#BCFF4F] px-10 py-12 flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
                <span className="stat-pill self-start" style={{ background: 'rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,0,0,0.12)' }}>02 / Jangkauan</span>
                <div className="mt-2">
                  <span
                    className="stat-number block text-[4.5rem] md:text-[5.5rem] font-[900] tracking-[-0.04em] leading-none text-black"
                    data-target="50"
                    data-prefix=""
                    data-suffix="+"
                  >
                    50+
                  </span>
                  <p className="font-[900] uppercase tracking-[0.25em] text-xs mt-3 text-black/60">Kampus Bergabung</p>
                </div>
                <div className="w-full h-0.5 bg-black/20 mt-auto" />
              </div>

              {/* Stat 3 */}
              <div
                ref={(el) => { statCardsRef.current[2] = el; }}
                className="bg-[#181818] px-10 py-12 flex flex-col gap-4 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#BCFF4F]/5 to-transparent" />
                <span className="stat-pill stat-pill--dark self-start">03 / Aset</span>
                <div className="mt-2">
                  <span
                    className="stat-number block text-[4.5rem] md:text-[5.5rem] font-[900] tracking-[-0.04em] leading-none text-[#F4F4F0]"
                    data-target="2"
                    data-prefix="Rp"
                    data-suffix="M+"
                  >
                    Rp2M+
                  </span>
                  <p className="font-[900] uppercase tracking-[0.25em] text-xs mt-3 text-[#888888]">Tabungan Terkumpul</p>
                </div>
                <div className="w-full h-0.5 bg-gradient-to-r from-[#BCFF4F]/20 to-transparent mt-auto" />
              </div>
            </div>
          </div>

          {/* Testimonial wide card — REDESIGNED */}
          <div
            ref={testimonialRef}
            className="testi-wide-card border border-[#BCFF4F]/10"
          >
            {/* Left — author panel */}
            <div className="bg-[#BCFF4F] p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-black/10 rounded-full blur-3xl" />
              <div>
                <span className="font-[900] uppercase tracking-[0.4em] text-black/40 text-xs block mb-3">Featured Review</span>
                <div className="flex gap-1 mt-2">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className="text-black text-lg leading-none">★</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[8rem] font-[900] leading-none text-black/10 select-none">&ldquo;</div>
                <div className="flex items-center gap-3 -mt-8">
                  <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center font-[900] text-[#BCFF4F] text-lg">AD</div>
                  <div>
                    <div className="font-[900] text-black text-lg leading-tight">Aditya Rahmawan</div>
                    <div className="text-black/60 text-xs font-[900] uppercase tracking-widest">Universitas Indonesia</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — quote */}
            <div className="bg-[#111111] p-10 md:p-14 flex flex-col justify-between relative">
              <div className="absolute top-8 right-8 opacity-5">
                <span className="text-[10rem] font-[900] text-[#BCFF4F] leading-none select-none">&rdquo;</span>
              </div>
              <div>
                <span className="text-[#BCFF4F] font-[900] uppercase tracking-[0.3em] text-xs mb-6 block">Cerita Pengguna</span>
                <p className="text-2xl md:text-3xl font-[800] leading-[1.35] text-[#F4F4F0]">
                  &ldquo;Dulu saldo selalu habis di tengah bulan. Sejak pake Budgetly, gue jadi tau borosnya di mana dan sekarang malah bisa nabung buat beli laptop baru.&rdquo;
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                {['Budget Otomatis', 'AI Insight', 'Target Nabung'].map((tag) => (
                  <span key={tag} className="border border-[#BCFF4F]/20 text-[#BCFF4F]/70 text-xs font-[800] uppercase tracking-widest px-4 py-2 rounded-full">
                    {tag}
                  </span>
                ))}
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
              <span className="bg-[#BCFF4F] text-black px-4 inline-block">
                boros di mana.
              </span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Predictive Spending', 'Auto-Categorization', 'Fraud Detection'].map((tag, i) => (
                <span
                  key={i}
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
              className="bg-[#F4F4F0] p-10 rounded-xl text-black rotate-1 h-fit"
            >
              <span className="material-symbols-outlined text-[#BCFF4F] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              <p className="font-bold text-xl mb-6 mt-4">&ldquo;Gokil sih aplikasinya, bener-bener ngerubah mindset gue soal duit jajan.&rdquo;</p>
              <div className="font-[900]">Raka Wijaya</div>
            </div>

            <div
              ref={(el) => { testimonialCardsRef.current[1] = el; }}
              className="bg-[#2A2A2A] p-10 rounded-xl -rotate-1 self-center border border-[#BCFF4F]/15"
            >
              <div className="bg-[#BCFF4F] text-black w-fit px-4 py-1 rounded-full font-[900] text-xs mb-6">POPULER</div>
              <p className="font-bold text-xl mb-6 text-[#F4F4F0]">&ldquo;Fitur komunitasnya edukatif banget. Gak cuma catet pengeluaran tapi juga belajar saham!&rdquo;</p>
              <div className="font-[900] text-[#BCFF4F]">Siska Amelia</div>
            </div>

            <div
              ref={(el) => { testimonialCardsRef.current[2] = el; }}
              className="bg-[#F4F4F0] p-10 rounded-xl text-black rotate-2 h-fit md:col-start-2 lg:col-start-3"
            >
              <span className="material-symbols-outlined text-[#BCFF4F] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              <p className="font-bold text-xl mb-6 mt-4">&ldquo;UI-nya keren parah, betah banget liatin grafik di sini daripada buka sosmed.&rdquo;</p>
              <div className="font-[900]">Dafa Pratama</div>
            </div>

            <div className="lg:col-span-1 relative" style={{ perspective: '600px' }}>
              <div
                className="absolute inset-0 bg-[#1A1A1A] rounded-xl border border-[#BCFF4F]/10"
                style={{ transform: 'rotate(-3deg) translateY(10px) translateX(-6px)', zIndex: 0 }}
              />
              <div
                className="absolute inset-0 bg-[#222] rounded-xl border border-[#BCFF4F]/15"
                style={{ transform: 'rotate(-1.5deg) translateY(5px) translateX(-3px)', zIndex: 1 }}
              />
              <div
                ref={(el) => { testimonialCardsRef.current[3] = el; }}
                className="relative bg-[#2A2A2A] p-10 rounded-xl -rotate-2 border border-[#BCFF4F]/20"
                style={{ zIndex: 2 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-[#BCFF4F]/10 text-[#BCFF4F] border border-[#BCFF4F]/30 text-xs font-[900] uppercase tracking-widest px-3 py-1 rounded-full">UGM</span>
                </div>
                <span className="material-symbols-outlined text-[#BCFF4F] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                <p className="font-bold text-xl mb-6 mt-4 text-[#F4F4F0]">&ldquo;Dari anak rantau yang sering telpon ortu minta kiriman, sekarang gue malah yang transfer dulu tiap bulan. Terima kasih Budgetly!&rdquo;</p>
                <div className="font-[900] text-[#BCFF4F]">Van Dough</div>
                <div className="text-[#888888] text-sm uppercase font-bold tracking-widest mt-1">Universitas Gadjah Mada</div>
              </div>
            </div>

            <div className="lg:col-span-2 relative" style={{ perspective: '600px' }}>
              <div
                className="absolute inset-0 bg-[#F0FFD6] rounded-xl"
                style={{ transform: 'rotate(3deg) translateY(10px) translateX(6px)', zIndex: 0 }}
              />
              <div
                className="absolute inset-0 bg-[#E8FFB8] rounded-xl"
                style={{ transform: 'rotate(1.5deg) translateY(5px) translateX(3px)', zIndex: 1 }}
              />
              <div
                ref={(el) => { testimonialCardsRef.current[4] = el; }}
                className="relative bg-[#BCFF4F] p-10 rounded-xl rotate-1 text-black"
                style={{ zIndex: 2 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-black/10 text-black border border-black/20 text-xs font-[900] uppercase tracking-widest px-3 py-1 rounded-full">ITB</span>
                  <span className="bg-black text-[#BCFF4F] text-xs font-[900] uppercase tracking-widest px-3 py-1 rounded-full">⭐ TOP SAVER</span>
                </div>
                <span className="material-symbols-outlined text-black text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                <p className="font-bold text-xl mb-6 mt-4">&ldquo;Sebagai anak teknik yang sering begadang ngerjain project, gue butuh app yang simple tapi powerful. Budgetly is exactly that. Budget otomatis-nya gila banget akuratnya.&rdquo;</p>
                <div className="font-[900]">Nabili Karunia</div>
                <div className="text-black/60 text-sm uppercase font-bold tracking-widest mt-1">Institut Teknologi Bandung</div>
              </div>
            </div>
          </div>

          <div className="mt-20 flex justify-center">
            <div className="bg-[#201F1F] border-2 border-[#BCFF4F] rounded-full px-12 py-6 flex items-center gap-4">
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
          <div className="flex items-center gap-4 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
            <LogoImage className="w-20 h-20 rounded-full object-cover" />
            <span className="text-xl font-[900] tracking-tighter text-[#F4F4F0]">Budgetly.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {footerLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = clickedFooterLink === sectionId || activeSection === sectionId;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setClickedFooterLink(sectionId)}
                  className={`font-medium transition-all duration-200 ${
                    isActive
                      ? 'footer-link-active'
                      : 'text-[#888888]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
          <div className="w-full h-[1px] bg-[#BCFF4F]/10 max-w-7xl" />
          <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl gap-4">
            <p className="text-[#888888] text-sm">© 2024 Budgetly. Smart Finance for Students.</p>
            <div className="flex gap-6">
              <span className="material-symbols-outlined text-[#888888]">share</span>
              <span className="material-symbols-outlined text-[#888888]">language</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}