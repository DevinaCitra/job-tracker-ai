"use client";

import { useState } from "react";
import { sendChatMessage } from "../lib/api";



type Message = {
  role: "user" | "ai";
  text: string;
};

export default function JobChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [jobPreview, setJobPreview] = useState<{
  company: string | null;
  position: string | null;
  source: string | null;
  date_applied: string | null;
    } | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "👋 Hai! Mau mencatat lamaran baru?",
    },
    {
      role: "ai",
      text: 'Ceritakan saja seperti biasa, misalnya: "Aku baru apply di Telkom sebagai Frontend Developer lewat LinkedIn."',
    },
  ]);

    async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  const text = input.trim();

  if (!text || isLoading) return;

  setMessages((currentMessages) => [
    ...currentMessages,
    {
      role: "user",
      text,
    },
  ]);

  setInput("");
  setIsLoading(true);

  try {
    const result = await sendChatMessage(text);

    if (result.is_job_application) {
      setJobPreview({
        company: result.company,
        position: result.position,
        source: result.source,
        date_applied: result.date_applied,
      });

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "ai",
          text: "✨ Aku menemukan informasi lamaran kerja dari pesanmu.",
        },
      ]);
    } else {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "ai",
          text: "🤔 Sepertinya pesan tersebut bukan informasi lamaran kerja.",
        },
      ]);
    }
  } catch (error) {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "ai",
        text: "❌ Maaf, terjadi kesalahan saat menghubungi AI.",
      },
    ]);
  } finally {
    setIsLoading(false);
  }
}

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-xl text-white shadow-lg transition hover:scale-105 hover:bg-slate-800"
          aria-label="Buka Job Tracker AI"
        >
          💬
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[380px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm">
                ✨
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Job Tracker AI
                </p>

                <p className="text-xs text-emerald-600">
                  ● Online
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 transition hover:text-slate-700"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    message.role === "user"
                      ? "rounded-tr-sm bg-slate-900 text-white"
                      : "rounded-tl-sm bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            )
            )}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                    ✨ Sedang menganalisis...
                    </div>
                </div>
            )}
            {jobPreview && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-4">
                    <p className="text-sm font-semibold text-slate-900">
                        ✨ Lamaran Terdeteksi
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Periksa informasi berikut sebelum disimpan.
                    </p>
                    </div>

                    <div className="space-y-3">
                    <div>
                        <p className="text-xs text-slate-400">
                        Perusahaan
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                        {jobPreview.company || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-slate-400">
                        Posisi
                        </p>
                        <p className="text-sm font-medium text-slate-900">
                        {jobPreview.position || "-"}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                        <p className="text-xs text-slate-400">
                            Sumber
                        </p>
                        <p className="text-sm text-slate-700">
                            {jobPreview.source || "-"}
                        </p>
                        </div>

                        <div>
                        <p className="text-xs text-slate-400">
                            Tanggal
                        </p>
                        <p className="text-sm text-slate-700">
                            {jobPreview.date_applied || "-"}
                        </p>
                        </div>
                    </div>
                    </div>

                    <button
                    type="button"
                    className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                    >
                    💾 Simpan Lamaran
                    </button>
                </div>
                )}

          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200 bg-white p-3"
          >
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">

              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ceritakan lamaranmu..."
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-slate-800"
              >
                ↑
              </button>

            </div>
          </form>

        </div>
      )}
    </>
  );
}