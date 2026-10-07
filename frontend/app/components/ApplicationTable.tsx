"use client";

import { useMemo, useState } from "react";

type Application = {
  id: number;
  company: string;
  position: string;
  source: string | null;
  date_applied: string | null;
  status: string;
};

type ApplicationTableProps = {
  applications: Application[];
};

const STATUS: Record<
  string,
  { label: string; pill: string; dot: string; live?: boolean }
> = {
  Applied: {
    label: "Sudah Melamar",
    pill: "border-cyan-400/30 bg-cyan-400/5 text-cyan-300",
    dot: "bg-cyan-400",
  },
  Interview: {
    label: "Interview",
    pill: "border-amber-400/30 bg-amber-400/5 text-amber-300",
    dot: "bg-amber-400",
    live: true,
  },
  Assessment: {
    label: "Assessment",
    pill: "border-violet-400/30 bg-violet-400/5 text-violet-300",
    dot: "bg-violet-400",
    live: true,
  },
  Offer: {
    label: "Offer",
    pill: "border-emerald-400/30 bg-emerald-400/5 text-emerald-300",
    dot: "bg-emerald-400",
  },
  Rejected: {
    label: "Ditolak",
    pill: "border-rose-400/30 bg-rose-400/5 text-rose-300",
    dot: "bg-rose-400",
  },
  Wishlist: {
    label: "Wishlist",
    pill: "border-zinc-400/20 bg-zinc-400/5 text-zinc-300",
    dot: "bg-zinc-400",
  },
  Withdrawn: {
    label: "Mengundurkan Diri",
    pill: "border-zinc-500/20 bg-zinc-500/5 text-zinc-500",
    dot: "bg-zinc-500",
  },
};

const FALLBACK = {
  label: "Unknown",
  pill: "border-zinc-400/20 bg-zinc-400/5 text-zinc-300",
  dot: "bg-zinc-400",
};

const formatFullDate = (s: string | null): string => {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
};

const formatRelative = (s: string | null): string => {
  if (!s) return "";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "";
  const days = Math.round((Date.now() - d.getTime()) / 86400000);
  if (days === 0) return "hari ini";
  const rtf = new Intl.RelativeTimeFormat("id", { numeric: "auto" });
  if (Math.abs(days) < 30) return rtf.format(-days, "day");
  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) return rtf.format(-months, "month");
  return rtf.format(-Math.round(months / 12), "year");
};

export default function ApplicationTable({
  applications,
}: ApplicationTableProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortDesc, setSortDesc] = useState(true);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: applications.length };
    for (const a of applications) c[a.status] = (c[a.status] || 0) + 1;
    return c;
  }, [applications]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = applications.filter((a) => {
      const matchQuery =
        !q ||
        [a.company, a.position, a.source].some((v) =>
          v?.toLowerCase().includes(q)
        );
      const matchStatus = filter === "All" || a.status === filter;
      return matchQuery && matchStatus;
    });
    return rows.sort((a, b) => {
      const da = a.date_applied ? new Date(a.date_applied).getTime() : 0;
      const db = b.date_applied ? new Date(b.date_applied).getTime() : 0;
      return sortDesc ? db - da : da - db;
    });
  }, [applications, query, filter, sortDesc]);

  const chips = ["All", "Applied", "Interview", "Assessment", "Offer", "Rejected"];

  return (
    <section
      className="animate-fade-up relative mt-12 overflow-hidden rounded-2xl border border-white/[0.06] bg-panel/80 backdrop-blur-xl"
      style={{ animationDelay: "320ms" }}
    >
      {/* Header */}
      <div className="px-6 pb-4 pt-6">
        <h2 className="font-display text-xl font-bold tracking-tight text-white">
          Lamaran Terbaru
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Cari, filter, dan urutkan lamaran kamu secara real-time.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-6 pb-4">
        <label className="relative min-w-0 flex-1 sm:max-w-xs">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari perusahaan, posisi, sumber…"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-cyan-400/10"
          />
        </label>

        <button
          onClick={() => setSortDesc((v) => !v)}
          className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-300 transition hover:border-cyan-400/30 hover:text-cyan-200"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="m8 9 4-4 4 4" />
            <path d="m8 15 4 4 4-4" />
          </svg>
          {sortDesc ? "Terbaru" : "Terlama"}
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2 px-6 pb-5">
        {chips.map((key) => {
          const count = counts[key] ?? 0;
          if (key !== "All" && count === 0) return null;
          const active = filter === key;
          const label = key === "All" ? "Semua" : STATUS[key]?.label ?? key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all ${
                active
                  ? "border-transparent bg-gradient-to-r from-cyan-400 to-violet-500 text-night shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                  : "border-white/10 text-zinc-400 hover:border-cyan-400/30 hover:text-cyan-200"
              }`}
            >
              {label}
              <span className={`ml-1.5 ${active ? "text-night/60" : "text-zinc-600"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Isi */}
      {applications.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <div className="glow-card mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-cyan-300">
              <path d="M22 12h-6l-2 3h-4l-2-3H2" />
              <path d="M5 4h14l3 8v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6l3-8Z" />
            </svg>
          </div>
          <p className="font-display mt-5 text-lg font-semibold text-white">
            Belum ada lamaran
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
            Kirim pesan ke bot Telegram kamu, misalnya{" "}
            <span className="text-cyan-300">
              "Aku apply di Telkom sebagai Frontend Developer"
            </span>
            , dan lamaran akan muncul di sini otomatis.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="text-sm font-medium text-zinc-300">
            Tidak ada hasil untuk pencarian ini
          </p>
          <button
            onClick={() => {
              setQuery("");
              setFilter("All");
            }}
            className="mt-4 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2 text-[13px] font-semibold text-night transition hover:brightness-110"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-[15px]">
              <thead>
                <tr className="border-b border-white/[0.06] font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  <th className="px-6 py-4 font-medium">Perusahaan & Posisi</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Sumber</th>
                  <th className="px-6 py-4 font-medium">Tanggal Melamar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((a) => {
                  const s = STATUS[a.status] ?? FALLBACK;
                  return (
                    <tr key={a.id} className="group transition-colors hover:bg-cyan-400/[0.04]">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-zinc-100 transition-colors group-hover:text-cyan-200">
                          {a.company}
                        </p>
                        <p className="mt-0.5 text-sm text-zinc-500">{a.position}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] ${s.pill}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${s.live ? "animate-pulse" : ""}`} />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {a.source ?? <span className="text-zinc-600">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-zinc-300">{formatFullDate(a.date_applied)}</p>
                        <p className="mt-0.5 text-xs text-zinc-600">
                          {formatRelative(a.date_applied)}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-white/[0.04] md:hidden">
            {filtered.map((a) => {
              const s = STATUS[a.status] ?? FALLBACK;
              return (
                <div key={a.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-zinc-100">{a.company}</p>
                      <p className="mt-0.5 truncate text-sm text-zinc-500">{a.position}</p>
                    </div>
                    <span className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${s.pill}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                    <span>{a.source ?? "—"}</span>
                    <span>
                      {formatFullDate(a.date_applied)} · {formatRelative(a.date_applied)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Footer */}
      {applications.length > 0 && (
        <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4 text-[13px] text-zinc-500">
          <p>
            Menampilkan{" "}
            <span className="font-semibold text-cyan-300">{filtered.length}</span>{" "}
            dari{" "}
            <span className="font-semibold text-zinc-300">{applications.length}</span>{" "}
            lamaran
          </p>
          <a
            href="/applications"
            className="font-medium text-cyan-300 transition hover:text-cyan-200 hover:neon-text"
          >
            Lihat semua →
          </a>
        </div>
      )}
    </section>
  );
}