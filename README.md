# MeetScribe AI

Web app para convertir **audios de reuniones o clases** en **transcripción** y **minuta estructurada** usando **Gemini API** (free tier — $0).

> Proyecto de portafolio — Next.js · TypeScript · Tailwind · Google Gemini

## Qué hace

1. Subes un archivo de audio (MP3, WAV, M4A…).
2. Gemini transcribe el contenido al español.
3. Gemini genera una minuta Markdown con resumen, puntos, compromisos y decisiones.
4. Descargas el resultado como `.md`.

## Demo local

```bash
cp .env.example .env.local
# Pega tu GEMINI_API_KEY de https://aistudio.google.com/apikey

npm install
npm run dev
```

Abre **http://localhost:3000**

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `GEMINI_API_KEY` | API key de Google AI Studio |

## API

```http
POST /api/meetscribe
Content-Type: multipart/form-data

audio: <archivo>
```

Respuesta:

```json
{
  "fileName": "reunion.mp3",
  "transcription": "...",
  "minutes": "# Minuta de reunión\n...",
  "model": "gemini-2.0-flash"
}
```

## Stack

- Next.js App Router
- Tailwind CSS
- `@google/generative-ai` (Gemini 2.0 Flash)

## Límites MVP

- Máximo **20 MB** por archivo
- Free tier Gemini: si ves error 429, espera al reset diario de cuota

## Autor

**Osvaldo Andrés Díaz Guzmán** — Estudiante Ing. en Informática INACAP · Backend e IA aplicada

## Proyecto relacionado

[SentimentTrend Bot](https://github.com/ElBarSimson9593/sentiment-trend-bot) — API FastAPI de monitoreo de reputación con IA
