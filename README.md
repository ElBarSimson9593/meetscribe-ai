# MeetScribe AI

Web app para convertir **audios de reuniones o clases** en **transcripción** y **minuta estructurada** usando **Gemini API** (free tier — $0).

Pensada para ese tipo de contenido; el MVP acepta archivos de **cualquier duración hasta 20 MB** y fue **validado con clips de prueba de 30 s a 3 min** (ideal para demos y cuota free tier).

> Next.js · TypeScript · Tailwind · Google Gemini

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
- Free tier Gemini: usa un modelo activo (`gemini-2.5-flash`); modelos deprecados pueden fallar con errores confusos

## Evidencia de demo

Prueba local con clip educativo (~2 min) — `QUÉ ES EL ÁLGEBRA_ Super facil - Para principiantes.mp3` — modelo `gemini-2.5-flash`.

![Selección de audio](docs/evidence/screenshots/01-upload.png)

![Minuta generada](docs/evidence/screenshots/02-minuta.png)

![Transcripción](docs/evidence/screenshots/03-transcripcion.png)

- Salida textual: [docs/evidence/sample-demo-algebra.md](docs/evidence/sample-demo-algebra.md)

## Autor

**Osvaldo Andrés Díaz Guzmán** — Backend e IA aplicada

## Proyecto relacionado

[SentimentTrend Bot](https://github.com/ElBarSimson9593/sentiment-trend-bot) — API FastAPI de monitoreo de reputación con IA
