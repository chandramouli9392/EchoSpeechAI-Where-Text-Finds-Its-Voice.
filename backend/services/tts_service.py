import re
import io
import logging
from typing import Dict, Tuple, Optional, List
import edge_tts
from models import VoicePresetInfo

logger = logging.getLogger("tts_service")

# Map of UI preset IDs to Neural Voice ShortNames
PRESET_VOICE_MAP: Dict[str, VoicePresetInfo] = {
    "neutral_male": VoicePresetInfo(
        id="neutral_male",
        label="Neutral Male",
        description="Professional & Clear",
        voice_name="en-US-GuyNeural",
        language="en-US",
        gender="Male",
        category="global"
    ),
    "warm_female": VoicePresetInfo(
        id="warm_female",
        label="Warm Female",
        description="Narrative & Smooth",
        voice_name="en-US-JennyNeural",
        language="en-US",
        gender="Female",
        category="global"
    ),
    "youthful": VoicePresetInfo(
        id="youthful",
        label="Youthful Voice",
        description="Energetic & Vibrant",
        voice_name="en-US-AnaNeural",
        language="en-US",
        gender="Female",
        category="global"
    ),
    "mature_auth": VoicePresetInfo(
        id="mature_auth",
        label="Mature Authoritative",
        description="Deep & Commanding",
        voice_name="en-US-ChristopherNeural",
        language="en-US",
        gender="Male",
        category="global"
    ),
    "expressive": VoicePresetInfo(
        id="expressive",
        label="Expressive Emotional",
        description="High Depth & Range",
        voice_name="en-US-AriaNeural",
        language="en-US",
        gender="Female",
        category="global"
    ),
    "in_male_tel_neu": VoicePresetInfo(
        id="in_male_tel_neu",
        label="Indian Male (Telugu Neutral)",
        description="Telugu Neutral Accent",
        voice_name="te-IN-MohanNeural",
        language="te-IN",
        gender="Male",
        category="indian"
    ),
    "in_female_tel_warm": VoicePresetInfo(
        id="in_female_tel_warm",
        label="Indian Female (Telugu Warm)",
        description="Telugu Warm Accent",
        voice_name="te-IN-ShrutiNeural",
        language="te-IN",
        gender="Female",
        category="indian"
    ),
    "in_male_auth": VoicePresetInfo(
        id="in_male_auth",
        label="Indian Male (Narrator)",
        description="Authoritative Indian Narration",
        voice_name="en-IN-PrabhatNeural",
        language="en-IN",
        gender="Male",
        category="indian"
    ),
    "in_female_story": VoicePresetInfo(
        id="in_female_story",
        label="Indian Female (Storyteller)",
        description="Expressive Storytelling",
        voice_name="en-IN-NeerjaExpressiveNeural",
        language="en-IN",
        gender="Female",
        category="indian"
    ),
}

DEFAULT_VOICE_PER_LANG: Dict[str, str] = {
    "te-IN": "te-IN-ShrutiNeural",
    "en-US": "en-US-JennyNeural",
    "en-IN": "en-IN-NeerjaExpressiveNeural"
}

def preprocess_text(text: str) -> str:
    """
    Sanitize and prepare text for speech synthesis.
    Strips zero-width characters, excessive whitespace, and validates input.
    """
    if not text:
        raise ValueError("Text cannot be empty.")
    
    # Remove control characters except newline and tab
    clean = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', text)
    # Normalize multiple whitespace while keeping single spaces
    clean = re.sub(r'[ \t]+', ' ', clean)
    clean = clean.strip()
    
    if not clean:
        raise ValueError("Text contains only whitespace or invalid characters.")
        
    return clean

def resolve_voice(voice_id: Optional[str], language: str) -> str:
    """
    Resolves the neural voice name from either:
    1. Preset ID (e.g. neutral_male -> en-US-GuyNeural)
    2. Direct Voice ShortName (e.g. te-IN-MohanNeural)
    3. Language default
    """
    if voice_id and voice_id in PRESET_VOICE_MAP:
        preset = PRESET_VOICE_MAP[voice_id]
        # If user explicitly selected Telugu language but chose a global English-only preset,
        # smartly route to appropriate Telugu voice to prevent synthesis failure
        if language == "te-IN" and not preset.voice_name.startswith("te-"):
            if preset.gender == "Male":
                return "te-IN-MohanNeural"
            return "te-IN-ShrutiNeural"
        return preset.voice_name
    
    if voice_id and ("Neural" in voice_id or "-" in voice_id):
        # Likely direct voice identifier
        return voice_id
        
    # Fallback to language default
    return DEFAULT_VOICE_PER_LANG.get(language, "en-US-JennyNeural")

def get_all_presets() -> List[VoicePresetInfo]:
    """Returns list of supported presets."""
    return list(PRESET_VOICE_MAP.values())

async def synthesize_speech(
    text: str,
    language: str = "en-US",
    voice_id: Optional[str] = None,
    pitch: str = "+0Hz",
    rate: str = "+0%",
    volume: str = "+0%"
) -> Tuple[bytes, str]:
    """
    Synthesize speech using Microsoft Edge Neural TTS async pipeline.
    Returns (audio_bytes, voice_used).
    """
    clean_text = preprocess_text(text)
    voice_name = resolve_voice(voice_id, language)
    
    logger.info(f"Synthesizing text of length {len(clean_text)} with voice '{voice_name}' (pitch={pitch}, rate={rate})")
    
    communicate = edge_tts.Communicate(
        text=clean_text,
        voice=voice_name,
        pitch=pitch or "+0Hz",
        rate=rate or "+0%",
        volume=volume or "+0%"
    )
    
    audio_buffer = bytearray()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_buffer.extend(chunk["data"])
            
    if len(audio_buffer) == 0:
        raise RuntimeError(f"TTS engine returned empty audio stream for voice {voice_name}.")
        
    return bytes(audio_buffer), voice_name
