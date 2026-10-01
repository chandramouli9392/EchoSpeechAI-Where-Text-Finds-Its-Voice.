
import { GoogleGenAI, Modality } from "@google/genai";
import { Language } from '../types';
import { GEMINI_MODEL } from '../constants';

const API_KEY = process.env.API_KEY || '';

// The specialized TTS model only supports text input.
// For voice adaptation (cloning), we must use the native audio multimodal model.
const NATIVE_AUDIO_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';

export async function generateSpeech(
  text: string, 
  language: Language, 
  voiceInstruction: string,
  customVoiceBase64?: string,
  customVoiceMimeType?: string
): Promise<string> {
  if (!API_KEY) {
    throw new Error("AUTH_ERROR: API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const isAdaptation = !!(customVoiceBase64 && customVoiceMimeType);
  
  // Selection of model based on modality support
  const targetModel = isAdaptation ? NATIVE_AUDIO_MODEL : GEMINI_MODEL;

  const promptText = `TASK: Convert the following text to high-fidelity, crystal clear studio-quality speech.
  Language: ${language === Language.ENGLISH ? 'English' : 'Telugu'}. 
  Voice Persona: ${voiceInstruction}. 
  Quality: Professional modulation, natural pacing.
  ${isAdaptation ? 'VOICE ADAPTATION: I have provided a sample of the target voice. Extract the vocal timbre, pitch, and tone from the attached audio part and apply it precisely to this new generation.' : ''}
  
  Text to speak: ${text}`;

  // Build content parts
  const parts: any[] = [{ text: promptText }];

  if (isAdaptation) {
    parts.push({
      inlineData: {
        data: customVoiceBase64,
        mimeType: customVoiceMimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: targetModel,
      contents: [{ parts }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("EMPTY_RESPONSE: The model processed your request but returned no audio data.");
    }

    return base64Audio;
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);

    const errorMessage = error.message || "";
    
    // Categorize common API errors
    if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("quota")) {
      throw new Error("RATE_LIMIT: System is currently under heavy load. Please wait a minute before trying again.");
    }
    
    if (errorMessage.includes("401") || errorMessage.includes("403")) {
      throw new Error("AUTH_ERROR: API authentication failed. Verify your project settings.");
    }

    if (errorMessage.toLowerCase().includes("network") || errorMessage.toLowerCase().includes("fetch")) {
      throw new Error("NETWORK_FAILURE: Connection lost. Check your internet connectivity.");
    }

    if (errorMessage.toLowerCase().includes("modality") || errorMessage.includes("400")) {
      if (isAdaptation) {
        throw new Error("MODALITY_ERROR: The Voice Adaptation model is currently unavailable or the audio format is unsupported.");
      } else {
        throw new Error("INVALID_ARGUMENT: The synthesis request was rejected. Please check your input parameters.");
      }
    }

    if (errorMessage.toLowerCase().includes("safety") || errorMessage.toLowerCase().includes("blocked")) {
      throw new Error("POLICY_VIOLATION: Content was flagged by safety filters. Please use professional and respectful text.");
    }

    throw new Error(`GENERIC_FAILURE: ${errorMessage || "An unexpected error occurred during synthesis."}`);
  }
}
