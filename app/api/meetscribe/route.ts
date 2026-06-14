import { NextRequest, NextResponse } from "next/server";

import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_EXTENSIONS,
  GEMINI_MODEL,
  MAX_AUDIO_BYTES,
} from "@/lib/constants";
import { generateMinutes, transcribeAudio } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 120;

function normalizeMimeType(file: File): string {
  if (file.type && ALLOWED_AUDIO_TYPES.has(file.type)) {
    return file.type === "audio/mp3" ? "audio/mpeg" : file.type;
  }

  const lower = file.name.toLowerCase();
  if (lower.endsWith(".mp3")) return "audio/mpeg";
  if (lower.endsWith(".wav")) return "audio/wav";
  if (lower.endsWith(".m4a")) return "audio/mp4";
  if (lower.endsWith(".webm")) return "audio/webm";
  if (lower.endsWith(".ogg")) return "audio/ogg";

  return file.type || "audio/mpeg";
}

function isAllowedFile(file: File): boolean {
  const mime = normalizeMimeType(file);
  if (ALLOWED_AUDIO_TYPES.has(mime)) return true;
  const lower = file.name.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("audio");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Debes enviar un archivo de audio en el campo 'audio'." },
        { status: 400 }
      );
    }

    if (!isAllowedFile(file)) {
      return NextResponse.json(
        {
          error:
            "Formato no soportado. Usa MP3, WAV, M4A, WEBM u OGG (máx. 20 MB).",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: "El archivo supera el límite de 20 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = normalizeMimeType(file);

    const transcription = await transcribeAudio(buffer, mimeType);
    const minutes = await generateMinutes(transcription);

    return NextResponse.json({
      fileName: file.name,
      transcription,
      minutes,
      model: GEMINI_MODEL,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";

    if (message.includes("429") || message.toLowerCase().includes("quota")) {
      return NextResponse.json(
        {
          error:
            "Límite de Gemini alcanzado (cuota o modelo). Revisa AI Studio o intenta más tarde.",
        },
        { status: 429 }
      );
    }

    if (
      message.toLowerCase().includes("not found") ||
      message.toLowerCase().includes("deprecated") ||
      message.toLowerCase().includes("shut down")
    ) {
      return NextResponse.json(
        {
          error: `Modelo no disponible: ${message}`,
        },
        { status: 503 }
      );
    }

    console.error("MeetScribe error:", error);
    return NextResponse.json(
      { error: message || "No se pudo procesar el audio." },
      { status: 500 }
    );
  }
}
