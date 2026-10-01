
export enum Language {
  ENGLISH = 'en-US',
  TELUGU = 'te-IN'
}

export type VoiceSourceType = 'preset' | 'custom';

export interface VoicePreset {
  id: string;
  label: string;
  description: string;
  prompt: string;
  category: 'global' | 'indian';
}

export interface GenerationHistory {
  id: string;
  text: string;
  language: Language;
  voicePrompt: string;
  timestamp: number;
  audioUrl: string;
  audioBlob: Blob;
  rating?: number;
  feedback?: string;
  voiceSource: string;
}

export interface AudioMetadata {
  sampleRate: number;
  numChannels: number;
  bitsPerSample: number;
}
