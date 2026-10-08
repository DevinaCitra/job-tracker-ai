import Link from "next/link";

export default function BackHome() {
  return (
    <Link
      href="/"
      className="group fixed left-4 top-6 z-50 flex items-center gap-2 rounded-full border border-white/[0.08] bg-panel/80 px-4 py-2 text-sm font-medium text-zinc-400 shadow-[0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl transition hover:border-cyan-400/30 hover:text-white sm:left-6"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      Beranda
    </Link>
  );
}