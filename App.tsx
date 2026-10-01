
import React, { useState, useRef, useEffect } from 'react';
import { Language, GenerationHistory, VoicePreset, VoiceSourceType } from './types';
import { 
  LANGUAGES, 
  MAX_TOKEN_LIMIT 
} from './constants';
import { generateSpeech, checkBackendHealth } from './services/ttsService';
import NeuralBackground from './components/NeuralBackground';
import { Logo } from './components/Logo';

const VOICE_PRESETS: VoicePreset[] = [
  // Global Presets
  { id: 'neutral_male', label: 'Neutral Male', description: 'Professional & Clear', prompt: 'Neutral professional male voice', category: 'global' },
  { id: 'warm_female', label: 'Warm Female', description: 'Narrative & Smooth', prompt: 'Warm narrative female voice', category: 'global' },
  { id: 'youthful', label: 'Youthful Voice', description: 'Energetic & Vibrant', prompt: 'Youthful energetic voice', category: 'global' },
  { id: 'mature_auth', label: 'Mature Authoritative', description: 'Deep & Commanding', prompt: 'Mature authoritative deep voice', category: 'global' },
  { id: 'expressive', label: 'Expressive Emotional', description: 'High Depth & Range', prompt: 'Expressive emotional voice with varied pitch', category: 'global' },
  // Indian Presets
  { id: 'in_male_tel_neu', label: 'Indian Male', description: 'Telugu Neutral', prompt: 'Indian male voice with neutral Telugu accent', category: 'indian' },
  { id: 'in_female_tel_warm', label: 'Indian Female', description: 'Telugu Warm', prompt: 'Indian female voice with warm Telugu accent', category: 'indian' },
  { id: 'in_male_auth', label: 'Indian Male', description: 'Authoritative Narration', prompt: 'Authoritative Indian male narrator', category: 'indian' },
  { id: 'in_female_story', label: 'Indian Female', description: 'Expressive Storytelling', prompt: 'Expressive Indian female storyteller', category: 'indian' },
];

interface AppError {
  code: string;
  message: string;
  type: 'critical' | 'warning' | 'info';
}

const ErrorDisplay: React.FC<{ error: AppError | null, onClear: () => void }> = ({ error, onClear }) => {
  if (!error) return null;

  const getTheme = () => {
    switch (error.type) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className={`mt-6 p-4 rounded-2xl border-2 flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 duration-300 ${getTheme()}`}>
      <div className="flex-shrink-0 mt-0.5">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{error.code.replace('_', ' ')}</p>
        <p className="text-xs font-bold leading-relaxed">{error.message}</p>
      </div>
      <button onClick={onClear} className="opacity-40 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
    </div>
  );
};

const CustomPlayer: React.FC<{ url: string }> = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current?.paused) {
      audioRef.current.play();
    } else {
      audioRef.current?.pause();
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
    }
  };

  return (
    <div className="flex items-center space-x-3 w-full bg-slate-50 p-2 rounded-xl border border-slate-100">
      <audio 
        ref={audioRef} 
        src={url} 
        onTimeUpdate={onTimeUpdate} 
        onLoadedMetadata={onLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <button 
        onClick={togglePlay}
        className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        {isPlaying ? (
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        ) : (
          <svg className="w-4 h-4 md:w-5 md:h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        )}
      </button>
      <div className="flex-1 flex items-center space-x-2">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={progress || 0} 
          onChange={handleSeek}
          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-[10px] font-mono text-slate-400 w-8">
          {Math.floor(duration || 0)}s
        </span>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [activeVoiceId, setActiveVoiceId] = useState(VOICE_PRESETS[0].id);
  const [isCustomVoiceSelected, setIsCustomVoiceSelected] = useState(false);
  const [customVoiceFile, setCustomVoiceFile] = useState<File | null>(null);
  const [customVoiceBase64, setCustomVoiceBase64] = useState<string | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  
  useEffect(() => {
    checkBackendHealth()
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('offline'));
  }, []);
  
  const charCount = text.length;
  const isOverLimit = charCount > MAX_TOKEN_LIMIT;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        setError({
          code: 'INVALID_FILE',
          message: 'Voice sample must be an audio file (WAV, MP3, AAC, etc.).',
          type: 'warning'
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError({
          code: 'FILE_TOO_LARGE',
          message: 'The audio sample exceeds the 10MB processing limit.',
          type: 'warning'
        });
        return;
      }

      setCustomVoiceFile(file);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setCustomVoiceBase64(base64);
        setIsCustomVoiceSelected(true);
        setActiveVoiceId('custom');
      };
      reader.onerror = () => {
        setError({
          code: 'FILE_READ_ERROR',
          message: 'System failed to access the audio data.',
          type: 'critical'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;
    if (isOverLimit) return;
    
    if (isCustomVoiceSelected) {
      if (!customVoiceFile) {
        setError({ code: 'MISSING_SAMPLE', message: 'Please upload a voice sample to activate Adaptation mode.', type: 'warning' });
        return;
      }
      if (!hasConsent) {
        setError({ code: 'CONSENT_REQUIRED', message: 'Ethical usage consent must be confirmed.', type: 'warning' });
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    const preset = VOICE_PRESETS.find(p => p.id === activeVoiceId);

    try {
      const { audioBlob, audioUrl } = await generateSpeech({
        text,
        language,
        voiceId: isCustomVoiceSelected ? undefined : activeVoiceId,
      });

      const newEntry: GenerationHistory = {
        id: crypto.randomUUID(),
        text: text.slice(0, 60) + (text.length > 60 ? '...' : ''),
        language,
        voicePrompt: isCustomVoiceSelected ? `Adaptation: ${customVoiceFile?.name}` : preset?.label || "Preset",
        timestamp: Date.now(),
        audioUrl,
        audioBlob,
        voiceSource: isCustomVoiceSelected ? 'Custom Voice Model' : preset?.label || 'Neural Preset'
      };

      setHistory(prev => [newEntry, ...prev]);

    } catch (err: any) {
      const parts = err.message.split(': ');
      setError({
        code: parts[0] || 'GENERIC_FAILURE',
        message: parts[1] || 'An unexpected error occurred during synthesis.',
        type: err.message.includes('GENERIC') ? 'critical' : 'warning'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setRating = (id: string, rating: number) => {
    setHistory(prev => prev.map(h => h.id === id ? { ...h, rating } : h));
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 md:py-12 bg-slate-50/20">
      <NeuralBackground />

      <header className="flex flex-col items-center mb-10 text-center">
        <div className="animate-float mb-4">
          <Logo className="w-16 h-16 md:w-20 md:h-20" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-1">
          Txt2<span className="text-blue-600">Speecho</span>
        </h1>
        <p className="text-slate-500 text-sm md:text-base font-medium opacity-80">The Sovereign Standard in Multilingual Audio Synthesis</p>
        
        <div className="flex items-center space-x-2 mt-3 px-3 py-1 rounded-full bg-white/70 border border-slate-200/60 shadow-sm backdrop-blur-sm">
          <span className={`w-2 h-2 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : backendStatus === 'checking' ? 'bg-amber-400' : 'bg-red-500'}`} />
          <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">
            {backendStatus === 'connected' ? 'Neural Engine: Ready (FastAPI + Edge-TTS)' : backendStatus === 'checking' ? 'Connecting to TTS Engine...' : 'TTS Engine Offline'}
          </span>
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Unified Voice Selection */}
        <div className="lg:col-span-4 space-y-6 sticky top-8">
          <div className="bg-white rounded-[2rem] p-6 shadow-2xl shadow-blue-100/40 border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center">
              <span className="w-8 h-[2px] bg-blue-600 mr-2 rounded-full"></span>
              Voice Selection Engine
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-3 uppercase">Primary Language</label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.value}
                      onClick={() => setLanguage(lang.value as Language)}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${language === lang.value ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-600 block uppercase">Voice Persona</label>
                
                <div 
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all p-4 cursor-pointer group ${isCustomVoiceSelected ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 hover:border-blue-200'}`}
                  onClick={() => setIsCustomVoiceSelected(true)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </div>
                    {isCustomVoiceSelected && <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Voice Adaptation</h4>
                  <p className="text-[10px] text-slate-500 mb-4 leading-tight">Clones vocal characteristics from an uploaded sample using Multimodal AI.</p>
                  
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="audio/*" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <button className="w-full py-2 border border-blue-200 rounded-lg text-[10px] font-bold text-blue-600 uppercase group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {customVoiceFile ? 'Change Audio' : 'Upload Sample'}
                    </button>
                  </div>

                  {isCustomVoiceSelected && (
                    <div className="mt-4 pt-4 border-t border-blue-100">
                      <div className="flex items-start space-x-2">
                        <input 
                          type="checkbox" 
                          id="consent"
                          checked={hasConsent}
                          onChange={(e) => setHasConsent(e.target.checked)}
                          className="mt-0.5 w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="consent" className="text-[9px] text-slate-500 leading-tight select-none">
                          I acknowledge authorized use of this voice profile.
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h5 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1">AI Presets</h5>
                  <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-2 custom-scroll">
                    {VOICE_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActiveVoiceId(p.id);
                          setIsCustomVoiceSelected(false);
                          setHasConsent(false);
                          setError(null);
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition-all relative ${activeVoiceId === p.id && !isCustomVoiceSelected ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-50 hover:border-slate-200 bg-slate-50/30'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-bold text-slate-800">{p.label}</p>
                            <p className="text-[9px] text-slate-500">{p.description}</p>
                          </div>
                          {p.category === 'indian' && (
                             <div className="flex space-x-0.5 opacity-60">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF] border border-slate-100"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#128807]"></div>
                             </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Editor & History */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-blue-100/40 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                <span className="w-8 h-[2px] bg-blue-600 mr-2 rounded-full"></span>
                Synthesis Script
              </h3>
              <div className="flex items-center space-x-3">
                 <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${isOverLimit ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                   {charCount.toLocaleString()} / {MAX_TOKEN_LIMIT.toLocaleString()}
                 </span>
              </div>
            </div>
            
            <textarea
              spellCheck="false"
              value={text}
              onChange={(e) => { setText(e.target.value); if (error) setError(null); }}
              placeholder="Paste the text you want to transform into audio..."
              className="w-full h-80 p-6 rounded-3xl border-2 border-slate-50 focus:border-blue-500 outline-none transition-all resize-none text-slate-800 text-lg leading-relaxed placeholder:text-slate-200 bg-slate-50/30 font-medium"
            />

            <ErrorDisplay error={error} onClear={() => setError(null)} />

            <button
              onClick={handleGenerate}
              disabled={isLoading || !text.trim() || isOverLimit}
              className={`w-full mt-8 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all transform flex items-center justify-center space-x-4 
                ${isLoading || !text.trim() || isOverLimit 
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 hover:-translate-y-1'}`}
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <span>Generate High-Fi Audio</span>
              )}
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Synthesis Ledger</h3>
              <button 
                onClick={() => setHistory([])} 
                className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
              >
                Clear History
              </button>
            </div>
            
            {history.length === 0 ? (
              <div className="bg-white/40 rounded-[2.5rem] py-20 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                <p className="text-sm font-bold uppercase tracking-widest opacity-40">Awaiting Generation</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {history.map((h) => (
                  <div key={h.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/30 flex flex-col md:flex-row gap-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                          {h.language === Language.ENGLISH ? 'English' : 'Telugu'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                          {h.voiceSource}
                        </span>
                        <div className="flex ml-auto space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button 
                              key={star} 
                              onClick={() => setRating(h.id, star)}
                              className={`transition-all transform hover:scale-125 ${h.rating && h.rating >= star ? 'text-amber-400' : 'text-slate-100 hover:text-amber-200'}`}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm font-medium italic line-clamp-2">"{h.text}"</p>
                    </div>

                    <div className="flex flex-col justify-center items-end gap-3 md:min-w-[300px]">
                      <CustomPlayer url={h.audioUrl} />
                      <button 
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = h.audioUrl;
                          a.download = `txt2speecho-${h.id.slice(0, 5)}.mp3`;
                          a.click();
                        }}
                        className="text-[10px] font-black text-slate-400 hover:text-blue-600 flex items-center space-x-2 transition-colors uppercase tracking-widest"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span>Download Master</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 py-10 w-full border-t border-slate-100 flex flex-col items-center text-slate-400">
        <p className="text-[9px] tracking-widest font-bold uppercase opacity-60">Txt2Speecho Master Synthesis &bull; &copy; {new Date().getFullYear()}</p>
      </footer>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default App;
