# MeetScribe AI — PRD (MVP v0.1)

## Problema

Redactar minutas de reuniones o clases consume tiempo. El audio existe, pero convertirlo en resumen accionable es manual.

## Solución

Web app Next.js que recibe audio, usa **Gemini API** (free tier) para transcribir y generar minuta en Markdown.

## Alcance MVP

### Incluido

- Upload audio (MP3, WAV, M4A, WEBM, OGG — máx. 20 MB)
- Transcripción con Gemini (audio nativo)
- Minuta estructurada (resumen, puntos, compromisos, decisiones)
- Vista Minuta / Transcripción + descarga `.md`
- API `POST /api/meetscribe`

### Fuera de alcance

- Auth, historial, base de datos
- Grabación desde navegador
- Integración Zoom/Meet
- OpenAI / Groq (stack $0 solo Gemini)

## Stack

- Next.js 16, TypeScript, Tailwind CSS
- `@google/generative-ai`
- Modelo: `gemini-2.0-flash`

## Criterios de aceptación

1. Subir audio de prueba (clip 30 s–3 min) genera transcripción y minuta.
2. Descarga Markdown funciona.
3. Error claro si falta `GEMINI_API_KEY` o límite 429.
4. README con instrucciones locales.

## Validación

- Caso de uso: reuniones o clases (contenido hablado con puntos y compromisos).
- Pruebas del MVP: clips cortos (30 s–3 min) por cuota free tier; límite técnico 20 MB por archivo.
- No se afirma procesamiento de reuniones completas de larga duración en esta versión.

## Variables

- `GEMINI_API_KEY` — Google AI Studio
