# MeetScribe AI

Web app para convertir **audios de reuniones o clases** en **transcripción** y **minuta estructurada** usando **Gemini API** (free tier — $0).

Pensada para ese tipo de contenido; el MVP acepta archivos de **cualquier duración hasta 20 MB** y fue **validado con clips de prueba de 30 s a 3 min** (ideal para demos y cuota free tier).

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
  "model": "gemini-2.5-flash"
}
```

## Stack

- Next.js App Router
- Tailwind CSS
- `@google/generative-ai` (Gemini 2.5 Flash)

## Límites MVP

- Máximo **20 MB** por archivo (sin límite mínimo de duración)
- **Pruebas del MVP:** clips de 30 s–3 min; audios más largos son posibles pero consumen más cuota de Gemini
- Free tier Gemini: si ves error 429, espera al reset diario de cuota o usa un audio más corto

## Portafolio (Emplea INACAP)

Copia esto al crear el ítem en [emplea.inacap.cl/account/portafolio](https://emplea.inacap.cl/account/portafolio):

**Título:** MeetScribe AI

**URL:** https://github.com/ElBarSimson9593/meetscribe-ai

**Descripción:**

> Web app Next.js que convierte audios de reuniones o clases en transcripción y minuta estructurada (Markdown) usando Gemini API en free tier. Incluye upload de audio, generación de resumen/compromisos/decisiones y descarga del resultado. MVP validado con clips de 30 s–3 min; soporta archivos mayores hasta 20 MB.

## Autor

**Osvaldo Andrés Díaz Guzmán** — Estudiante Ing. en Informática INACAP · Backend e IA aplicada

## Proyecto relacionado

[SentimentTrend Bot](https://github.com/ElBarSimson9593/sentiment-trend-bot) — API FastAPI de monitoreo de reputación con IA
