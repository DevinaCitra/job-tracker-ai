import {
  getApplications,
  getApplicationStats,
  type Application,
  type ApplicationStats,
} from "../lib/api";
import StatCard from "../components/StatCard";
import ApplicationTable from "../components/ApplicationTable";
import TelegramDemo from "../components/TelegramDemo";

export const instant = false;

export default async function DashboardPage() {
  const result = await getApplications();
  const stats = (await getApplicationStats()) as ApplicationStats;
  const applications = result.data as Application[];

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 11
      ? "Selamat pagi"
      : hour < 15
        ? "Selamat siang"
        : hour < 19
          ? "Selamat sore"
          : "Selamat malam";

  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const percent = (n: number) =>
    stats.total > 0 ? Math.round((n / stats.total) * 100) : 0;

  return (
    <div>
      {/* ===== Hero asimetris ===== */}
      <section className="animate-fade-up grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Kiri: teks */}
        <div>
          {/* Badge baru: status bar sentence-case, bukan pill mono */}
          <div className="flex items-center gap-2.5 text-sm font-medium text-zinc-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Bot Telegram aktif · AI siap mencatat
          </div>

          <h1 className="font-display mt-5 text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
            <span className="text-white">Alur lamaran,</span>
            <br />
            <span className="neon-text bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              terpantau otomatis.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-[15px] leading-7 text-zinc-400">
            {greeting}! · {dateLabel} — semua lamaran yang kamu kirim lewat
            Telegram terkumpul, terstruktur, dan terpantau di satu tempat.
          </p>
        </div>

        {/* Kanan: demo typing Telegram */}
        <TelegramDemo />
      </section>

      {/* ===== Statistik (tidak diubah) ===== */}
      <div className="mt-16 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          delay={160}
          icon="total"
          label="Total Lamaran"
          value={stats.total}
          hint="Seluruh lamaran tercatat"
          accent="from-cyan-400 to-sky-500"
        />
        <StatCard
          delay={240}
          icon="applied"
          label="Sudah Melamar"
          value={stats.applied}
          hint={`${percent(stats.applied)}% dari total lamaran`}
          accent="from-sky-400 to-blue-500"
          progress={percent(stats.applied)}
        />
        <StatCard
          delay={320}
          icon="interview"
          label="Interview"
          value={stats.interview}
          hint={`${percent(stats.interview)}% masuk tahap interview`}
          accent="from-violet-400 to-purple-500"
          progress={percent(stats.interview)}
        />
        <StatCard
          delay={400}
          icon="offer"
          label="Offer"
          value={stats.offer}
          hint={`${percent(stats.offer)}% mendapatkan offer`}
          accent="from-emerald-400 to-teal-500"
          progress={percent(stats.offer)}
        />
      </div>

      {/* ===== Tabel (tidak diubah) ===== */}
      <ApplicationTable applications={applications} />
    </div>
  );
}