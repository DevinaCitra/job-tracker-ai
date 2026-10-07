"use client";

import { useEffect, useState } from "react";

const MESSAGE =
  "Aku baru apply di Telkom sebagai Frontend Developer lewat LinkedIn.";

const FIELDS = [
  { label: "Perusahaan", value: "Telkom" },
  { label: "Posisi", value: "Frontend Developer" },
  { label: "Sumber", value: "LinkedIn" },
];

type Phase = "typing" | "parsing" | "result" | "done";

export default function TelegramDemo() {
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [visibleFields, setVisibleFields] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (chars < MESSAGE.length) {
        t = setTimeout(() => setChars((c) => c + 1), 38);
      } else {
        t = setTimeout(() => setPhase("parsing"), 500);
      }
    } else if (phase === "parsing") {
      t = setTimeout(() => setPhase("result"), 1300);
    } else if (phase === "result") {
      if (visibleFields < FIELDS.length) {
        t = setTimeout(() => setVisibleFields((v) => v + 1), 380);
      } else {
        t = setTimeout(() => setPhase("done"), 500);
      }
    } else {
      // done → tahan sebentar, lalu ulangi
      t = setTimeout(() => {
        setChars(0);
        setVisibleFields(0);
        setPhase("typing");
      }, 4500);
    }

    return () => clearTimeout(t);
  }, [phase, chars, visibleFields]);

  return (
    <div className="animate-fade-up relative mx-auto w-full max-w-md lg:mx-0" style={{ animationDelay: "200ms" }}>
      {/* Glow di belakang kartu */}
      <div aria-hidden className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-cyan-500/15 to-violet-600/10 blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-panel/80 backdrop-blur-xl transition-transform duration-500 lg:rotate-1 lg:hover:rotate-0">
        {/* Header chat */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m22 2-7 20-4-9-9-4 20-7Z" />
                <path d="M22 2 11 13" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">jobtracker_bot</p>
              <p className="text-[11px] text-emerald-400">online</p>
            </div>
          </div>
          <span className="rounded-full border border-violet-400/25 bg-violet-400/[0.08] px-2.5 py-1 text-[11px] font-medium text-violet-300">
            Gemini AI
          </span>
        </div>

        {/* Body chat */}
        <div className="space-y-4 px-5 py-6">
          {/* Bubble user: typing */}
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md border border-cyan-400/20 bg-cyan-400/[0.08] px-4 py-3 text-sm leading-6 text-zinc-200">
              {MESSAGE.slice(0, chars)}
              {phase === "typing" && (
                <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-cyan-300" />
              )}
            </div>
          </div>

          {/* Bubble bot: parsing → hasil */}
          {(phase === "parsing" || phase === "result" || phase === "done") && (
            <div className="flex justify-start">
              <div className="w-full max-w-[90%] rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.04] px-4 py-3">
                {phase === "parsing" ? (
                  <p className="text-sm text-zinc-400">
                    Gemini mengekstrak informasi
                    <span className="animate-pulse">…</span>
                  </p>
                ) : (
                  <div className="space-y-2">
                    {FIELDS.slice(0, visibleFields).map((f) => (
                      <div key={f.label} className="animate-fade-up flex items-center gap-2 text-sm">
                        <span className="w-24 shrink-0 text-zinc-500">{f.label}</span>
                        <span className="rounded-lg border border-cyan-400/25 bg-cyan-400/[0.08] px-2.5 py-1 font-medium text-cyan-200">
                          {f.value}
                        </span>
                      </div>
                    ))}
                    {phase === "done" && (
                      <p className="animate-fade-up pt-1 text-[13px] text-emerald-400">
                        ✓ Tersimpan ke PostgreSQL
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}