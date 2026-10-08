"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import type { AuthUser } from "../lib/server-api";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Lamaran" },
  { href: "/analytics", label: "Analytics" },
];

type NavbarProps = {
  user: AuthUser;
};

function getInitial(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown kalau klik di luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <header className="fixed left-1/2 top-5 z-50 w-[min(1080px,94vw)] -translate-x-1/2">
      <nav className="flex items-center justify-between rounded-full border border-white/[0.08] bg-panel/80 py-3 pl-6 pr-3 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="font-display text-lg font-bold tracking-tight text-white"
        >
          Job Tracker<span className="neon-text text-neon">.</span>
        </Link>

        {/* Links desktop */}
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

        {/* Kanan: User avatar + hamburger mobile */}
        <div className="flex items-center gap-2">
          {/* User dropdown (desktop & mobile) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] py-1.5 pl-1.5 pr-3 transition hover:bg-white/[0.08]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-[11px] font-bold text-night">
                {getInitial(user.name)}
              </span>
              <span className="hidden text-sm font-medium text-zinc-200 sm:block">
                {user.name.split(" ")[0]}
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-3.5 w-3.5 text-zinc-500">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-xl border border-white/[0.08] bg-panel/95 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                {/* Header: nama lengkap + email */}
                <div className="border-b border-white/[0.06] px-4 py-3">
                  <p className="truncate text-sm font-semibold text-white">
                    {user.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {user.email}
                  </p>
                </div>

                {/* Items */}
                <div className="p-1.5">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-zinc-500">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
                    </svg>
                    Profil saya
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-rose-300 transition hover:bg-rose-400/10 hover:text-rose-200 disabled:opacity-50"
                  >
                    {loggingOut ? (
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <path d="m16 17 5-5-5-5" />
                        <path d="M21 12H9" />
                      </svg>
                    )}
                    {loggingOut ? "Keluar…" : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger (mobile) */}
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