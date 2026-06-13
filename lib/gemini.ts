import { GoogleGenerativeAI } from "@google/generative-ai";

import { GEMINI_MODEL } from "./constants";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no configurada");
  }
  return new GoogleGenerativeAI(apiKey);
}

function getModel() {
  return getClient().getGenerativeModel({ model: GEMINI_MODEL });
}

export async function transcribeAudio(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  const model = getModel();
  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: buffer.toString("base64"),
      },
    },
    {
      text: `Transcribe este audio al español.
Devuelve SOLO la transcripción literal, sin comentarios.
Si hay varios hablantes, usa párrafos separados cuando cambie el turno.`,
    },
  ]);

  const text = result.response.text()?.trim();
  if (!text) {
    throw new Error("Gemini no devolvió transcripción");
  }
  return text;
}

export async function generateMinutes(transcription: string): Promise<string> {
  const model = getModel();
  const result = await model.generateContent([
    {
      text: `Eres un asistente que redacta minutas profesionales en español.

A partir de la transcripción, genera una minuta en Markdown con EXACTAMENTE estas secciones:

# Minuta de reunión

## Resumen
(2-4 oraciones)

## Puntos tratados
(bullets)

## Compromisos / action items
(bullets con formato: - [ ] Tarea — Persona si se menciona)

## Decisiones
(bullets, o "No se registraron decisiones explícitas")

Transcripción:
"""
${transcription}
"""`,
    },
  ]);

  const text = result.response.text()?.trim();
  if (!text) {
    throw new Error("Gemini no devolvió minuta");
  }
  return text;
}
