export const GEMINI_MODEL = "gemini-2.5-flash";

export const MAX_AUDIO_BYTES = 20 * 1024 * 1024; // 20 MB

export const ALLOWED_AUDIO_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/m4a",
  "audio/webm",
  "audio/ogg",
]);

export const ALLOWED_EXTENSIONS = [".mp3", ".wav", ".m4a", ".webm", ".ogg"];
