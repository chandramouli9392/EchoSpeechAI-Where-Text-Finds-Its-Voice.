from typing import Optional, List
from pydantic import BaseModel, Field

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000, description="Text to synthesize")
    language: str = Field(default="en-US", description="Language code (e.g. en-US, te-IN)")
    voice_id: Optional[str] = Field(default=None, description="Preset ID or Edge Voice ShortName")
    pitch: Optional[str] = Field(default="+0Hz", description="Pitch adjustment, e.g. +0Hz, -5Hz, +10Hz")
    rate: Optional[str] = Field(default="+0%", description="Speaking rate, e.g. +0%, -10%, +20%")
    volume: Optional[str] = Field(default="+0%", description="Volume adjustment, e.g. +0%, -10%, +10%")

class VoicePresetInfo(BaseModel):
    id: str
    label: str
    description: str
    voice_name: str
    language: str
    gender: str
    category: str

class VoicesResponse(BaseModel):
    presets: List[VoicePresetInfo]
    total: int

class TTSJsonResponse(BaseModel):
    success: bool
    audio_base64: str
    format: str = "mp3"
    voice_used: str
    language: str
    text_length: int

class HealthResponse(BaseModel):
    status: str
    engine: str
    version: str
