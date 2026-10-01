
import { Language } from './types';

export const APP_NAME = 'Txt2Speecho';
export const PRIMARY_BLUE = '#0066FF';
export const MAX_TOKEN_LIMIT = 8192;

export const LANGUAGES = [
  { label: 'English (US)', value: Language.ENGLISH },
  { label: 'Telugu (India)', value: Language.TELUGU }
];

export const VOICE_PRESETS = [
  "Use a warm female voice with storytelling style",
  "Deep masculine voice with a professional narrative tone",
  "Youthful and energetic child-like voice",
  "Mature, authoritative male voice for educational content",
  "Expressive female voice with high emotional depth"
];

export const GEMINI_MODEL = 'gemini-2.5-flash-preview-tts';
export const SAMPLE_RATE = 24000; // Gemini TTS standard output rate
