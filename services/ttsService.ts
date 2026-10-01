import { Language } from '../types';

export interface SynthesizeOptions {
  text: string;
  language: Language;
  voiceId?: string;
  pitch?: string;
  rate?: string;
}

export interface BackendHealth {
  status: string;
  engine: string;
  version: string;
}

export async function checkBackendHealth(): Promise<BackendHealth> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      throw new Error(`Health check returned status ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    throw new Error(`BACKEND_OFFLINE: Could not reach TTS backend server (${err.message}).`);
  }
}

export async function generateSpeech(options: SynthesizeOptions): Promise<{ audioBlob: Blob; audioUrl: string }> {
  const { text, language, voiceId, pitch, rate } = options;

  if (!text || !text.trim()) {
    throw new Error("VALIDATION_ERROR: Text to speak cannot be empty.");
  }

  const response = await fetch('/api/synthesize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text: text.trim(),
      language,
      voice_id: voiceId,
      pitch: pitch || "+0Hz",
      rate: rate || "+0%"
    }),
  });

  if (!response.ok) {
    let errMsg = "Speech synthesis failed.";
    try {
      const errJson = await response.json();
      errMsg = errJson.detail || errMsg;
    } catch {
      errMsg = (await response.text()) || errMsg;
    }
    throw new Error(`SYNTHESIS_ERROR: ${errMsg}`);
  }

  const audioBlob = await response.blob();
  if (audioBlob.size === 0) {
    throw new Error("EMPTY_AUDIO: The backend returned an empty audio stream.");
  }

  const audioUrl = URL.createObjectURL(audioBlob);
  return { audioBlob, audioUrl };
}
