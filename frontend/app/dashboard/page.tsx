import {
  type Application,
  type ApplicationStats,
} from "../lib/api";

import {
  getAuthenticatedApplications,
  getAuthenticatedApplicationStats,
  getAuthenticatedUser,
} from "../lib/server-api";

import StatCard from "../components/StatCard";
import ApplicationTable from "../components/ApplicationTable";
import JobChat from "../components/JobChat";

export const instant = false;

export default async function DashboardPage() {
  const result = await getAuthenticatedApplications();
  const stats = (await getAuthenticatedApplicationStats()) as ApplicationStats;
  const applications = result.data as Application[];
  const user = await getAuthenticatedUser();

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
      {/* ===== Sapaan personal ===== */}
      <section className="animate-fade-up">
        <p className="text-sm font-medium text-zinc-500">{dateLabel}</p>

        <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {greeting},{" "}
          <span className="neon-text bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
            {user.name}
          </span>{" "}
          👋
        </h1>

        <p className="mt-4 max-w-xl text-[15px] leading-7 text-zinc-400">
          Ini ringkasan perjalanan cari kerja kamu sejauh ini.
        </p>
      </section>

      {/* ===== Statistik ===== */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* ===== Tabel ===== */}
      <ApplicationTable applications={applications} />
      <JobChat />
    </div>
  );
}