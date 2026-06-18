"use client";

import { useState } from "react";

type Result = {
  fileName: string;
  transcription: string;
  minutes: string;
  model: string;
};

export default function MeetScribeApp() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [tab, setTab] = useState<"minutes" | "transcription">("minutes");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Selecciona un archivo de audio.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const response = await fetch("/api/meetscribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al procesar el audio");
      }

      setResult(data);
      setTab("minutes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  function downloadMarkdown() {
    if (!result) return;
    const isMinutes = tab === "minutes";
    const content = isMinutes ? result.minutes : result.transcription;
    const prefix = isMinutes ? "minuta" : "transcripcion";
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${prefix}-${result.fileName.replace(/\.[^.]+$/, "")}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="space-y-2 border-l-4 border-teal-500 pl-4">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-400">
          MeetScribe AI
        </p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Audio → transcripción → minuta
        </h1>
        <p className="max-w-2xl text-slate-400">
          Pensado para audios de reuniones o clases. Sube un clip (recomendado
          1–3 min para pruebas) o un archivo mayor, hasta 20 MB. Gemini
          transcribe y genera una minuta estructurada. $0 con free tier de Google
          AI.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-lg shadow-teal-950/20"
      >
        <label className="block text-sm font-medium text-slate-300">
          Archivo de audio (MP3, WAV, M4A — máx. 20 MB)
        </label>
        <p className="mt-1 text-xs text-slate-500">
          Para probar el MVP, un clip de 1–3 min suele dar mejores minutas que
          30 s.
        </p>
        <input
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.webm,.ogg"
          className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-teal-500"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setError("");
          }}
        />

        <button
          type="submit"
          disabled={loading || !file}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-teal-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Procesando con Gemini…" : "Generar minuta"}
        </button>

        {error && (
          <p className="mt-4 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </form>

      {result && (
        <section className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTab("minutes")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  tab === "minutes"
                    ? "bg-teal-600 text-white"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                Minuta
              </button>
              <button
                type="button"
                onClick={() => setTab("transcription")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  tab === "transcription"
                    ? "bg-teal-600 text-white"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                Transcripción
              </button>
            </div>
            <button
              type="button"
              onClick={downloadMarkdown}
              className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
            >
              {tab === "minutes" ? "Descargar minuta .md" : "Descargar transcripción .md"}
            </button>
          </div>

          <p className="mb-3 text-xs text-slate-500">
            {result.fileName} · {result.model}
          </p>

          <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm leading-relaxed text-slate-200">
            {tab === "minutes" ? result.minutes : result.transcription}
          </pre>
        </section>
      )}
    </div>
  );
}
