"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Lamaran" },
  { href: "/analytics", label: "Analytics" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-1/2 top-5 z-50 w-[min(1080px,94vw)] -translate-x-1/2">
      <nav className="flex items-center justify-between rounded-full border border-white/[0.08] bg-panel/80 py-3 pl-6 pr-3 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="font-display text-lg font-bold tracking-tight text-white"
        >
          Job Tracker<span className="text-neon neon-text">.</span>
        </Link>

        {/* Links desktop + underline aktif */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 text-sm transition-colors ${
                  active
                    ? "font-semibold text-white"
                    : "font-medium text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all duration-300 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Kanan: CTA + hamburger mobile */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Buka menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-zinc-300 transition hover:text-white md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Dropdown mobile */}
      {open && (
        <div className="mt-2 rounded-2xl border border-white/[0.08] bg-panel/95 p-2 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl md:hidden">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-cyan-400/10 font-semibold text-cyan-200"
                    : "font-medium text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}