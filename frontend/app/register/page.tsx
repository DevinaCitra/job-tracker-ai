"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "../lib/api";

// ===== Password strength helper =====
function getStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Terlalu lemah", "Lemah", "Lumayan", "Kuat", "Sangat kuat"];
  return { score, label: labels[score] };
}

const STRENGTH_COLORS = [
  "bg-rose-400",
  "bg-rose-400",
  "bg-amber-400",
  "bg-cyan-400",
  "bg-emerald-400",
];

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const strength = getStrength(password);
  const passwordsMatch = confirm.length > 0 && password === confirm;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (password !== confirm) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await registerUser(name, email, password);

      if (data?.requireLogin) {
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal. Mungkin email sudah dipakai — coba login saja.");
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-clip px-4 py-16">
      {/* Aurora background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="animate-aurora absolute -top-32 left-[18%] h-[420px] w-[720px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="animate-aurora-slow absolute -left-40 top-1/3 h-[380px] w-[380px] rounded-full bg-violet-600/10 blur-[140px]" />
      </div>

      {/* ===== Back button ===== */}
      <Link
        href="/"
        className="fixed left-4 top-5 z-50 flex items-center gap-2 rounded-full border border-white/[0.08] bg-panel/80 px-4 py-2.5 text-sm font-medium text-zinc-300 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl transition hover:border-cyan-400/30 hover:text-white sm:left-6"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span className="hidden sm:inline">Kembali</span>
      </Link>

      <div className="animate-fade-up w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="font-display text-2xl font-bold tracking-tight text-white"
          >
            Job Tracker<span className="neon-text text-neon">.</span>
          </Link>
          <p className="mt-2 text-sm text-zinc-500">
            Mulai perjalanan kariermu dari sini.
          </p>
        </div>

        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-panel/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {/* Garis neon atas */}
          <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500" />

          <h1 className="font-display text-xl font-bold tracking-tight text-white">
            Buat akun baru ✨
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Gratis, dan lamaranmu langsung terpantau sejak hari pertama.
          </p>

          {/* Error banner */}
          {error && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-rose-400/25 bg-rose-400/[0.08] px-4 py-3 text-sm text-rose-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4 shrink-0">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            {/* Nama */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-300">
                Nama
              </span>
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
                </svg>
                <input
                  type="text"
                  placeholder="Nama kamu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/40 focus:bg-white/[0.06] focus:ring-4 focus:ring-cyan-400/10"
                />
              </div>
            </label>

            {/* Email */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-300">
                Email
              </span>
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/40 focus:bg-white/[0.06] focus:ring-4 focus:ring-cyan-400/10"
                />
              </div>
            </label>

            {/* Password + strength meter */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-300">
                Password
              </span>
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                >
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-11 pr-12 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/40 focus:bg-white/[0.06] focus:ring-4 focus:ring-cyan-400/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-300"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3 3.9M6.6 6.6C3.7 8.6 2 12 2 12s3.5 7 10 7c1.4 0 2.7-.3 3.9-.8" />
                      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Strength meter */}
              {password.length > 0 && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          i < strength.score
                            ? STRENGTH_COLORS[strength.score]
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-zinc-500">
                    Kekuatan password:{" "}
                    <span className="font-medium text-zinc-300">
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}
            </label>

            {/* Konfirmasi password */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-300">
                Konfirmasi password
              </span>
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                >
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  <path d="m9 16 2 2 4-4" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ulangi password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className={`w-full rounded-xl border bg-white/[0.04] py-3 pl-11 pr-11 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:bg-white/[0.06] focus:ring-4 ${
                    confirm.length === 0
                      ? "border-white/[0.08] focus:border-cyan-400/40 focus:ring-cyan-400/10"
                      : passwordsMatch
                        ? "border-emerald-400/40 focus:border-emerald-400/50 focus:ring-emerald-400/10"
                        : "border-rose-400/40 focus:border-rose-400/50 focus:ring-rose-400/10"
                  }`}
                />
                {/* Icon centang / silang */}
                {confirm.length > 0 && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    {passwordsMatch ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400">
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4 text-rose-400">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    )}
                  </span>
                )}
              </div>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !name || !email || !password || !confirm || !passwordsMatch}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 py-3 text-sm font-semibold text-night shadow-[0_0_30px_rgba(34,211,238,0.25)] transition enabled:hover:brightness-110 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Mendaftarkan…
                </>
              ) : (
                "Buat Akun"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              Login di sini
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Dengan mendaftar, kamu setuju data lamaranmu disimpan aman di PostgreSQL.
        </p>
      </div>
    </main>
  );
}