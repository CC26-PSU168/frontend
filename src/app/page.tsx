import Link from 'next/link';
import LandingNavbar from '@/components/layout/LandingNavbar';

export const metadata = {
  title: 'Budgetly — Manajemen Keuangan Mahasiswa Indonesia',
  description:
    'Platform manajemen keuangan pribadi untuk mahasiswa Indonesia. AI-powered insights, budget tracking, dan split bill.',
};

export default function LandingPage() {
  const marqueeItems = ['Catat Transaksi', 'Split Bill', 'Budget Otomatis', 'AI Insight', 'Target Tabungan'];
  const marqueeItemsDuplicated = [...marqueeItems, ...marqueeItems];

  const marqueeItems2 = ['Smart Finance', 'Student Life Hack', 'Investasi Sejak Kuliah', 'Anti-Bokek System'];
  const marqueeItems2Duplicated = [...marqueeItems2, ...marqueeItems2];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E2E1] overflow-x-hidden">
      <LandingNavbar />

      <main className="pt-24 relative z-10">
        {/* ===== Hero Section ===== */}
        <section className="relative px-8 pt-20 pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-6xl md:text-9xl font-[900] tracking-[-0.04em] leading-[0.9] text-[#F4F4F0] mb-12">
            Partner Kamu untuk Keuangan yang <span className="text-[#BCFF4F]">Lebih Cerdas.</span>
          </h1>

          <div className="relative w-full max-w-4xl mt-12">
            {/* Main Balance Card Mockup */}
            <div className="bg-[#2A2A2A] border border-[#BCFF4F]/15 p-8 rounded-xl text-left shadow-2xl relative z-10 overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <span className="text-[#888888] font-bold uppercase tracking-widest text-xs">Total Saldo</span>
                <span className="material-symbols-outlined text-[#BCFF4F]">visibility</span>
              </div>
              <div className="text-4xl md:text-6xl font-[900] text-[#F4F4F0] mb-6 tracking-tighter">Rp4.250.000</div>
              <div className="w-full bg-[#0A0A0A] h-3 rounded-full overflow-hidden mb-2">
                <div className="bg-[#BCFF4F] h-full w-3/4 rounded-full shadow-[0_0_15px_rgba(188,255,79,0.5)]" />
              </div>
              <div className="flex justify-between text-xs font-bold uppercase text-[#888888]">
                <span>Terpakai (75%)</span>
                <span>Limit: Rp5.600.000</span>
              </div>
              {/* Decorative Radial Glow */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#BCFF4F]/5 rounded-full blur-3xl" />
            </div>

            {/* Floating Chips */}
            <div className="absolute -top-6 -left-4 md:-left-12 bg-[#BCFF4F] text-black font-[900] px-6 py-3 rounded-full rotate-[-6deg] z-20 shadow-xl uppercase text-sm">
              🔥 Hemat 20% Minggu Ini
            </div>
            <div className="absolute top-20 -right-4 md:-right-12 bg-[#201F1F] border border-[#BCFF4F]/20 text-[#F4F4F0] font-[900] px-6 py-3 rounded-full rotate-[4deg] z-20 shadow-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[#BCFF4F]">bolt</span> AI Analyst
            </div>
          </div>
        </section>

        {/* ===== Smooth Progression Marquee Strips ===== */}
        <div className="flex flex-col gap-0 overflow-hidden">
          {/* 1. Deep Dark */}
          <section className="bg-black py-4 border-y border-[#BCFF4F]/5 z-30 relative overflow-hidden">
            <div className="marquee-container">
              <div className="marquee-content flex gap-12 items-center text-[#BCFF4F]/80 font-[900] uppercase tracking-tighter text-xl">
                {marqueeItemsDuplicated.map((item, i) => (
                  <span key={`dark-${i}`} className="flex items-center gap-12">
                    <span>{item}</span>
                    <span className="text-[#BCFF4F]/30 text-sm">✦</span>
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Neon Lime Strip (rotated) */}
          <section className="bg-[#BCFF4F] py-5 rotate-[-1deg] scale-105 z-40 relative overflow-hidden shadow-2xl">
            <div className="marquee-container">
              <div className="marquee-content flex gap-12 items-center text-black font-[900] uppercase tracking-tighter text-2xl">
                {marqueeItemsDuplicated.map((item, i) => (
                  <span key={`lime-${i}`} className="flex items-center gap-12">
                    <span>{item}</span>
                    <span className="text-black">✦</span>
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Light / White Version */}
          <section className="bg-[#F8FFF0] py-4 border-y border-black/5 z-30 relative overflow-hidden">
            <div className="marquee-container">
              <div className="marquee-content flex gap-12 items-center text-black/60 font-[900] uppercase tracking-tighter text-xl">
                {marqueeItemsDuplicated.map((item, i) => (
                  <span key={`light-${i}`} className="flex items-center gap-12">
                    <span>{item}</span>
                    <span className="text-black/10">✦</span>
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Original Marquee Section */}
        <section className="bg-[#131313] py-6 border-b border-[#BCFF4F]/10 mt-0">
          <div className="marquee-container overflow-hidden">
            <div className="marquee-content flex gap-8 items-center text-[#888888] font-[900] uppercase tracking-tighter text-2xl">
              {marqueeItems2Duplicated.map((item, i) => (
                <span key={`orig-${i}`} className="flex items-center gap-8">
                  <span>{item}</span>
                  <span className="text-[#BCFF4F]">✦</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Kenapa Mahasiswa Selalu Bokek Section ===== */}
        <section className="bg-white py-32 px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
            <div className="flex flex-col gap-6">
              <h2 className="text-6xl md:text-8xl font-[900] text-black leading-[0.9] tracking-tighter">
                Kenapa<br />Mahasiswa<br />Selalu<br />
                <span className="bg-[#BCFF4F] px-4 inline-block">Bokek?</span>
              </h2>
              <p className="text-black/60 font-bold text-lg max-w-md">
                Masalah finansial bukan karena kamu nggak punya uang, tapi karena sistemnya yang nggak ada.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-[#F8FFF0] p-8 border-l-8 border-black flex gap-6 items-start">
                <span className="text-4xl font-[900] text-black leading-none">01</span>
                <div>
                  <h4 className="text-xl font-[900] text-black mb-1">Lupa Catat Pengeluaran</h4>
                  <p className="text-black/60 font-medium italic">&ldquo;Tiba-tiba saldo tinggal 50 ribu, padahal baru awal bulan.&rdquo;</p>
                </div>
              </div>
              <div className="bg-[#F8FFF0] p-8 border-l-8 border-black flex gap-6 items-start">
                <span className="text-4xl font-[900] text-black leading-none">02</span>
                <div>
                  <h4 className="text-xl font-[900] text-black mb-1">FOMO &amp; Impulsive Buying</h4>
                  <p className="text-black/60 font-medium italic">&ldquo;Beli kopi mahal demi nongkrong, besoknya makan promag.&rdquo;</p>
                </div>
              </div>
              <div className="bg-[#F8FFF0] p-8 border-l-8 border-black flex gap-6 items-start">
                <span className="text-4xl font-[900] text-black leading-none">03</span>
                <div>
                  <h4 className="text-xl font-[900] text-black mb-1">Nabung Cuma Wacana</h4>
                  <p className="text-black/60 font-medium italic">&ldquo;Niat nabung buat konser, malah kepake buat jajan seblak.&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Separator (Depth Enhancement) */}
        <div className="h-40 w-full bg-gradient-to-b from-white to-[#0A0A0A]" />

        {/* ===== Features Bento Grid ===== */}
        <section id="features" className="px-8 py-32 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* AI Feature - spanning 2 cols */}
            <div className="md:col-span-2 bg-[#2A2A2A] p-12 rounded-xl flex flex-col justify-end relative overflow-hidden group border border-[#BCFF4F]/15">
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

            {/* Savings */}
            <div className="bg-[#BCFF4F] p-12 rounded-xl flex flex-col justify-between">
              <span className="material-symbols-outlined text-black text-6xl">savings</span>
              <h3 className="text-3xl font-[900] tracking-tighter text-black">Target Menabung Otomatis</h3>
            </div>

            {/* Community */}
            <div className="bg-[#F4F4F0] p-12 rounded-xl flex flex-col justify-between">
              <span className="material-symbols-outlined text-black text-6xl">group</span>
              <h3 className="text-3xl font-[900] tracking-tighter text-black">Komunitas Cuan Berjamaah</h3>
            </div>

            {/* Reports - spanning 2 cols */}
            <div className="md:col-span-2 bg-[#201F1F] p-12 rounded-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-[#BCFF4F]/15">
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
            <div className="p-8 bg-[#201F1F] rounded-xl border border-[#BCFF4F]/10">
              <span className="text-7xl md:text-9xl font-[900] tracking-tighter leading-none text-[#F4F4F0]">10,000+</span>
              <p className="text-[#BCFF4F] font-[900] uppercase tracking-[0.2em] text-lg mt-4">Mahasiswa Aktif</p>
            </div>
            <div className="p-8 bg-[#201F1F] rounded-xl border border-[#BCFF4F]/10">
              <span className="text-7xl md:text-8xl font-[900] tracking-tighter leading-none text-[#BCFF4F]">50+</span>
              <p className="text-[#888888] font-[900] uppercase tracking-[0.2em] text-lg mt-4">Kampus Bergabung</p>
            </div>
            <div className="p-8 bg-[#201F1F] rounded-xl border border-[#BCFF4F]/10">
              <span className="text-7xl md:text-8xl font-[900] tracking-tighter leading-none text-[#F4F4F0]">Rp2M+</span>
              <p className="text-[#888888] font-[900] uppercase tracking-[0.2em] text-lg mt-4">Tabungan Terkumpul</p>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="bg-[#2A2A2A] border-l-8 border-[#BCFF4F] p-12 max-w-md sticky top-32 md:w-1/2 border border-[#BCFF4F]/15 rounded-r-xl">
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

        {/* ===== Cara Kerja (Full Bleed Lime) ===== */}
        <section className="bg-[#BCFF4F] py-32 px-8 text-black">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -inset-10 bg-black/5 rounded-full blur-3xl" />
              <div className="bg-black p-4 rounded-[3rem] shadow-2xl relative z-10 max-w-xs mx-auto border-8 border-[#1A1A1A]">
                {/* Phone mockup placeholder */}
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
              <div className="relative">
                <span className="absolute -top-10 -left-6 text-9xl font-[900] text-black/5 leading-none">01</span>
                <h4 className="text-4xl font-[900] tracking-tighter relative z-10">Unduh &amp; Registrasi</h4>
                <p className="text-black/70 font-bold max-w-sm mt-2">Cukup 2 menit menggunakan email kampus kamu untuk akses fitur eksklusif.</p>
              </div>
              <div className="relative">
                <span className="absolute -top-10 -left-6 text-9xl font-[900] text-black/5 leading-none">02</span>
                <h4 className="text-4xl font-[900] tracking-tighter relative z-10">Hubungkan Bank</h4>
                <p className="text-black/70 font-bold max-w-sm mt-2">Sinkronisasi aman dengan enkripsi tingkat bank untuk pencatatan otomatis.</p>
              </div>
              <div className="relative">
                <span className="absolute -top-10 -left-6 text-9xl font-[900] text-black/5 leading-none">03</span>
                <h4 className="text-4xl font-[900] tracking-tighter relative z-10">Biarkan AI Beraksi</h4>
                <p className="text-black/70 font-bold max-w-sm mt-2">Terima tips finansial personal yang disesuaikan dengan gaya hidup mahasiswa.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== AI Spotlight ===== */}
        <section className="py-40 px-8 relative overflow-hidden text-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
            <span className="text-[30vw] font-[900] text-[#F4F4F0] select-none">CUAN AI</span>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <span className="text-[#BCFF4F] font-[900] uppercase tracking-[0.4em] mb-6 block">Teknologi Neural</span>
            <h2 className="text-6xl md:text-8xl font-[900] tracking-tighter text-[#F4F4F0] mb-12">
              AI yang tahu kamu <span className="bg-[#BCFF4F] text-black px-4">boros di mana.</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="border border-[#BCFF4F]/30 px-6 py-3 rounded-full text-[#F4F4F0] font-bold">Predictive Spending</span>
              <span className="border border-[#BCFF4F]/30 px-6 py-3 rounded-full text-[#F4F4F0] font-bold">Auto-Categorization</span>
              <span className="border border-[#BCFF4F]/30 px-6 py-3 rounded-full text-[#F4F4F0] font-bold">Fraud Detection</span>
            </div>
          </div>
        </section>

        {/* ===== Testimonials ===== */}
        <section className="px-8 py-32 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#F4F4F0] p-10 rounded-xl text-black rotate-1 h-fit">
              <span className="material-symbols-outlined text-[#BCFF4F] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              <p className="font-bold text-xl mb-6 mt-4">&ldquo;Gokil sih aplikasinya, bener-bener ngerubah mindset gue soal duit jajan.&rdquo;</p>
              <div className="font-[900]">Raka Wijaya</div>
            </div>
            <div className="bg-[#2A2A2A] p-10 rounded-xl -rotate-1 self-center border border-[#BCFF4F]/15">
              <div className="bg-[#BCFF4F] text-black w-fit px-4 py-1 rounded-full font-[900] text-xs mb-6">POPULER</div>
              <p className="font-bold text-xl mb-6 text-[#F4F4F0]">&ldquo;Fitur komunitasnya edukatif banget. Gak cuma catet pengeluaran tapi juga belajar saham!&rdquo;</p>
              <div className="font-[900] text-[#BCFF4F]">Siska Amelia</div>
            </div>
            <div className="bg-[#F4F4F0] p-10 rounded-xl text-black rotate-2 h-fit md:col-start-2 lg:col-start-3">
              <span className="material-symbols-outlined text-[#BCFF4F] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              <p className="font-bold text-xl mb-6 mt-4">&ldquo;UI-nya keren parah, betah banget liatin grafik di sini daripada buka sosmed.&rdquo;</p>
              <div className="font-[900]">Dafa Pratama</div>
            </div>
          </div>

          {/* User Rating */}
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
          <div className="max-w-7xl mx-auto bg-[#BCFF4F] rounded-3xl p-12 md:p-24 overflow-hidden relative">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="text-center md:text-left">
                <h2 className="text-7xl md:text-[10rem] font-[900] text-black tracking-tighter leading-[0.8] mb-8">
                  Mulai hari ini.<br />Gratis
                </h2>
                <p className="text-black font-bold text-2xl">Gabung dengan ribuan mahasiswa cerdas lainnya.</p>
              </div>
              <div className="shrink-0 flex flex-col gap-4">
                <Link href="/auth/register" className="bg-black text-[#BCFF4F] px-12 py-8 rounded-full font-[900] text-2xl hover:scale-105 transition-transform shadow-2xl text-center">
                  Daftar Sekarang
                </Link>
                <p className="text-center text-black/60 font-bold uppercase text-xs tracking-widest">Tersedia di iOS &amp; Android</p>
              </div>
            </div>
            {/* Abstract decorative shapes */}
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
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#BCFF4F]">account_balance_wallet</span>
            <span className="text-xl font-[900] tracking-tighter text-[#F4F4F0]">Budgetly.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <a className="text-[#888888] font-medium hover:text-[#BCFF4F] hover:scale-110 transition-all" href="#features">Fitur</a>
            <a className="text-[#888888] font-medium hover:text-[#BCFF4F] hover:scale-110 transition-all" href="#">Edukasi</a>
            <a className="text-[#888888] font-medium hover:text-[#BCFF4F] hover:scale-110 transition-all" href="#">Komunitas</a>
            <a className="text-[#888888] font-medium hover:text-[#BCFF4F] hover:scale-110 transition-all" href="#">Bantuan</a>
          </div>
          <div className="w-full h-[1px] bg-[#BCFF4F]/10 max-w-7xl" />
          <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl gap-4">
            <p className="text-[#888888] text-sm">© 2024 Budgetly. Smart Finance for Students.</p>
            <div className="flex gap-6">
              <span className="material-symbols-outlined text-[#888888] hover:text-[#BCFF4F] transition-colors cursor-pointer">share</span>
              <span className="material-symbols-outlined text-[#888888] hover:text-[#BCFF4F] transition-colors cursor-pointer">language</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
