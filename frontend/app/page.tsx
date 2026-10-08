import Link from "next/link";
import TelegramDemo from "./components/TelegramDemo";
import Reveal from "./components/Reveal";

const PIPELINE = [
  { name: "Wishlist", desc: "Simpan lowongan incaran", dot: "bg-zinc-400" },
  { name: "Applied", desc: "Lamaran terkirim", dot: "bg-cyan-400" },
  { name: "Interview", desc: "Ngobrol dengan recruiter", dot: "bg-amber-400" },
  { name: "Offer", desc: "Kabar baik 🎉", dot: "bg-emerald-400" },
  { name: "Rejected", desc: "Bukan rejeki, gas lagi", dot: "bg-rose-400" },
];

const STEPS = [
  {
    number: "01",
    title: "Daftar akun gratis",
    desc: "Cukup email dan password, langsung bisa pakai tanpa kartu kredit.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
        <path d="M16 3.1a4 4 0 0 1 0 7.8" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.9" />
      </svg>
    ),
    gradient: "from-cyan-400 to-sky-500",
  },
  {
    number: "02",
    title: "Tambah lamaran",
    desc: "Ketik bahasa sehari-hari di chat AI atau kirim via Telegram, AI yang rapiin.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1L3 20l1-5.3c-.6-1.2-1-2.7-1-4.2A8.5 8.5 0 0 1 11.5 2a8.38 8.38 0 0 1 8.5 8.5Z" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
    gradient: "from-violet-400 to-purple-500",
  },
  {
    number: "03",
    title: "Pantau progress",
    desc: "Dashboard otomatis update, semua lamaran terpantau di satu tempat.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    gradient: "from-emerald-400 to-teal-500",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      {/* Aurora background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="animate-aurora absolute -top-32 left-[18%] h-[420px] w-[720px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="animate-aurora-slow absolute -left-40 top-1/3 h-[380px] w-[380px] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="animate-aurora absolute -right-32 top-2/3 h-[300px] w-[300px] rounded-full bg-sky-500/[0.07] blur-[120px]" />
      </div>

      {/* ===== Floating navbar ===== */}
      <header className="fixed left-1/2 top-5 z-50 w-[min(1080px,94vw)] -translate-x-1/2">
        <nav className="flex items-center justify-between rounded-full border border-white/[0.08] bg-panel/80 py-3 pl-6 pr-3 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <Link href="/" className="font-display text-lg font-bold tracking-tight text-white">
            Job Tracker<span className="neon-text text-neon">.</span>
          </Link>

          {/* Links desktop */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#fitur" className="text-sm font-medium text-zinc-400 transition hover:text-white">
              Fitur
            </a>
            <a href="#cara-pakai" className="text-sm font-medium text-zinc-400 transition hover:text-white">
              Cara Pakai
            </a>
            <a href="#cara-kerja" className="text-sm font-medium text-zinc-400 transition hover:text-white">
              Cara Kerja
            </a>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-night transition hover:brightness-110"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* ===== Hero ===== */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-40">
        {/* Kiri */}
        <div className="animate-fade-up">
          <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Bot Telegram aktif · AI siap mencatat
          </div>

          <h1 className="font-display mt-5 text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-white">Alur lamaran,</span>
            <br />
            <span className="neon-text bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              terpantau otomatis.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-7 text-zinc-400 sm:text-base">
            Catat, kelola, dan pantau seluruh proses lamaran kerja kamu
            dalam satu tempat dengan bantuan AI.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-center text-sm font-semibold text-night shadow-[0_0_30px_rgba(34,211,238,0.25)] transition hover:brightness-110"
            >
              Mulai Sekarang
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-white/[0.1] px-6 py-3 text-center text-sm font-medium text-zinc-300 transition hover:border-cyan-400/30 hover:text-white"
            >
              Sudah punya akun? Login
            </Link>
          </div>
        </div>

        {/* Kanan — TelegramDemo dibiarkan apa adanya */}
        <div className="animate-fade-up">
          <TelegramDemo />
        </div>
      </section>

      {/* ===== Features ===== */}
      <section id="fitur" className="scroll-mt-28 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <div className="flex items-center justify-center gap-3 text-sm font-medium text-cyan-300">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400" />
                Fitur utama
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400" />
              </div>

              <h2 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Semua lamaran dalam satu tempat.
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                Tidak perlu lagi mencatat lamaran di banyak tempat.
                Job Tracker AI membantu kamu menjaga seluruh proses
                tetap terorganisir.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {/* AI Assistant */}
            <Reveal delay={0}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-panel/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/25 hover:shadow-[0_0_40px_rgba(34,211,238,0.10)]">
                <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-400 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-300 ring-1 ring-inset ring-cyan-400/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M12 3l1.9 5.7L19.6 10l-5.7 1.9L12 17.6l-1.9-5.7L4.4 10l5.7-1.9L12 3Z" />
                    <path d="M19 17l.9 2.6L22.5 20l-2.6.9L19 23.5l-.9-2.6L15.5 20l2.6-.9L19 17Z" />
                  </svg>
                </div>
                <h3 className="font-display text-lg font-semibold text-white">AI Assistant</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Catat lamaran menggunakan bahasa natural tanpa harus
                  mengisi banyak form.
                </p>
              </div>
            </Reveal>

            {/* Dashboard */}
            <Reveal delay={120}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-panel/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/25 hover:shadow-[0_0_40px_rgba(167,139,250,0.10)]">
                <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-400 to-fuchsia-500 opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400/20 to-fuchsia-500/20 text-violet-300 ring-1 ring-inset ring-violet-400/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect x="3" y="3" width="7" height="9" rx="1.5" />
                    <rect x="14" y="3" width="7" height="5" rx="1.5" />
                    <rect x="14" y="12" width="7" height="9" rx="1.5" />
                    <rect x="3" y="16" width="7" height="5" rx="1.5" />
                  </svg>
                </div>
                <h3 className="font-display text-lg font-semibold text-white">Dashboard Terpusat</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Pantau status, sumber, dan perkembangan seluruh lamaran
                  melalui satu dashboard.
                </p>
              </div>
            </Reveal>

            {/* Telegram */}
            <Reveal delay={240}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-panel/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/25 hover:shadow-[0_0_40px_rgba(56,189,248,0.10)]">
                <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-sky-400 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/20 to-cyan-400/20 text-sky-300 ring-1 ring-inset ring-sky-400/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="m22 2-7 20-4-9-9-4 20-7Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </div>
                <h3 className="font-display text-lg font-semibold text-white">Telegram Bot</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Tambahkan dan kelola lamaran langsung dari Telegram
                  tanpa membuka dashboard.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== Cara Pakai ===== */}
      <section id="cara-pakai" className="scroll-mt-28 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <div className="flex items-center justify-center gap-3 text-sm font-medium text-cyan-300">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400" />
                Cara pakai
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400" />
              </div>

              <h2 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Mulai dalam 3 langkah mudah.
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                Tidak perlu setup rumit, langsung bisa dipakai dalam hitungan menit.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <Reveal key={step.number} delay={index * 120}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-panel/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/25">
                  {/* Garis gradient atas */}
                  <span className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${step.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-80`} />
                  
                  {/* Angka besar gradient */}
                  <div className="mb-6">
                    <span className={`font-display text-5xl font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                      {step.number}
                    </span>
                  </div>

                  {/* Icon + title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${step.gradient.replace('from-', 'from-').replace('to-', 'to-')}/20 text-white ring-1 ring-inset ring-white/10`}>
                      {step.icon}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-6 text-zinc-400">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Workflow / Pipeline ===== */}
      <section id="cara-kerja" className="scroll-mt-28 border-t border-white/[0.06]">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center lg:px-8">
          <Reveal>
            <div className="flex items-center justify-center gap-3 text-sm font-medium text-cyan-300">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400" />
              Application tracking
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400" />
            </div>

            <h2 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Dari apply sampai mendapatkan hasil.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Pantau setiap tahap proses rekrutmen tanpa kehilangan jejak
              lamaran yang sudah kamu kirim.
            </p>
          </Reveal>

          <div className="relative mt-12 grid gap-3 sm:grid-cols-5">
            {/* Garis penghubung */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-1/2 hidden h-px bg-gradient-to-r from-zinc-500/40 via-cyan-400/40 to-emerald-400/40 sm:block"
            />

            {PIPELINE.map((step, index) => (
              <Reveal key={step.name} delay={index * 90} className="relative">
                <div className="relative rounded-xl border border-white/[0.08] bg-panel/90 px-4 py-4 text-left backdrop-blur-xl transition hover:border-cyan-400/30">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[11px] tracking-[0.2em] text-zinc-500">
                      0{index + 1}
                    </p>
                    <span className={`h-2 w-2 rounded-full ${step.dot}`} />
                  </div>
                  <p className="mt-2 text-sm font-medium text-zinc-100">{step.name}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-panel/70 px-8 py-16 text-center backdrop-blur-xl sm:px-16">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-[100px]"
              />

              <h2 className="font-display relative text-3xl font-bold tracking-tight sm:text-5xl">
                Siap mengelola lamaranmu
                <br />
                <span className="neon-text bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                  dengan lebih teratur?
                </span>
              </h2>

              <p className="relative mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                Mulai catat dan pantau perjalanan lamaran kerja kamu
                dalam satu tempat.
              </p>

              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-7 py-3.5 text-sm font-semibold text-night shadow-[0_0_30px_rgba(34,211,238,0.25)] transition hover:brightness-110"
                >
                  Buat Akun Gratis
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl border border-white/[0.1] px-7 py-3.5 text-sm font-medium text-zinc-300 transition hover:border-cyan-400/30 hover:text-white"
                >
                  Login dulu
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-center text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">
          <p className="font-display text-sm font-semibold text-zinc-300">
            Job Tracker<span className="text-neon">.</span>
          </p>
          <p>© 2026 Job Tracker AI · Devina Citra Felisha</p>
        </div>
      </footer>
    </main>
  );
}