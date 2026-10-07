"use client";

import { useEffect, useState } from "react";
import AnimatedNumber from "./AnimatedNumber";

type StatCardProps = {
  label: string;
  value: number;
  hint: string;
  icon: "total" | "applied" | "interview" | "offer";
  accent: string;
  progress?: number | null;
  delay?: number;
};

const icons = {
  total: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13.5 9 5 9-5" />
    </svg>
  ),
  applied: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      <path d="M22 2 11 13" />
    </svg>
  ),
  interview: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <rect x="9" y="3" width="6" height="10" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  ),
  offer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]">
      <path d="M6 3h12v5a6 6 0 0 1-12 0V3Z" />
      <path d="M6 5H3v1a4 4 0 0 0 4 4" />
      <path d="M18 5h3v1a4 4 0 0 1-4 4" />
      <path d="M12 14v4" />
      <path d="M8 21h8" />
    </svg>
  ),
};

export default function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
  progress = null,
  delay = 0,
}: StatCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="group animate-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-panel/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Garis neon di atas card, ala kartu tahap referensi #2 */}
      <span className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${accent} opacity-80`} />

      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${accent} text-night`}>
          {icons[icon]}
        </div>
        <p className="text-sm font-medium text-zinc-400">{label}</p>
      </div>

      <p className="font-display mt-5 text-5xl font-bold leading-none tracking-tight text-white">
        <AnimatedNumber value={value} />
      </p>

      <p className="mt-3 text-[13px] text-zinc-500">{hint}</p>

      {progress !== null && (
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${accent} transition-all duration-1000 ease-out`}
            style={{ width: mounted ? `${progress}%` : "0%" }}
          />
        </div>
      )}
    </div>
  );
}