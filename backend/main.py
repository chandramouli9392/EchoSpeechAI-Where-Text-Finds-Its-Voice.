import base64
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from models import TTSRequest, TTSJsonResponse, VoicesResponse, HealthResponse
from services.tts_service import (
    synthesize_speech, 
    get_all_presets, 
    preprocess_text
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("txt2speecho_api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Txt2Speecho TTS API backend...")
    logger.info("Ready to accept speech synthesis requests.")
    yield
    logger.info("Shutting down Txt2Speecho TTS API backend.")

app = FastAPI(
    title="Txt2Speecho TTS Backend API",
    description="Production-grade Text-to-Speech API powered by Neural Speech Synthesis",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows development on any local port (3000, 5173, etc.)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint to verify backend operational readiness."""
    return HealthResponse(
        status="healthy",
        engine="edge-tts-neural",
        version="1.0.0"
    )

@app.get("/api/voices", response_model=VoicesResponse)
async def list_voices():
    """Returns the list of configured voice presets and supported options."""
    presets = get_all_presets()
    return VoicesResponse(presets=presets, total=len(presets))

@app.post("/api/synthesize")
async def synthesize_audio(request: TTSRequest):
    """
    Primary endpoint: Synthesizes input text to speech and returns the audio stream directly.
    Content-Type: audio/mpeg
    """
    try:
        audio_bytes, voice_used = await synthesize_speech(
            text=request.text,
            language=request.language,
            voice_id=request.voice_id,
            pitch=request.pitch or "+0Hz",
            rate=request.rate or "+0%",
            volume=request.volume or "+0%"
        )

        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=\"synthesized_speech.mp3\"",
                "X-Voice-Used": voice_used,
                "X-Audio-Format": "mp3",
                "X-Text-Length": str(len(request.text))
            }
        )

    except ValueError as ve:
        logger.warning(f"Validation error: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Synthesis failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Speech synthesis error: {str(e)}"
        )

@app.post("/api/synthesize/json", response_model=TTSJsonResponse)
async def synthesize_audio_json(request: TTSRequest):
    """
    Alternative endpoint: Synthesizes input text to speech and returns Base64 encoded audio in JSON.
    """
    try:
        audio_bytes, voice_used = await synthesize_speech(
            text=request.text,
            language=request.language,
            voice_id=request.voice_id,
            pitch=request.pitch or "+0Hz",
            rate=request.rate or "+0%",
            volume=request.volume or "+0%"
        )

        base64_audio = base64.b64encode(audio_bytes).decode("utf-8")
        return TTSJsonResponse(
            success=True,
            audio_base64=base64_audio,
            format="mp3",
            voice_used=voice_used,
            language=request.language,
            text_length=len(request.text)
        )

    except ValueError as ve:
        logger.warning(f"Validation error: {ve}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        logger.error(f"Synthesis failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Speech synthesis error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
