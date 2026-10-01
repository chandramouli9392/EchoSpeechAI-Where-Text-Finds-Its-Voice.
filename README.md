# Txt2Speecho — Multilingual Neural Text-to-Speech Application

A production-grade, full-stack Text-to-Speech (TTS) web application featuring high-fidelity neural speech synthesis for English and Telugu, interactive audio playback, custom voice presets, and audio export.

---

## Architecture Overview

```
User (Browser)
   │
   ▼
Frontend (React 19 + TypeScript + Vite + TailwindCSS)
   │
   │  [HTTP POST /api/synthesize]
   ▼
Backend API (FastAPI + Uvicorn)
   │
   ├─► Input Validation & Text Preprocessing
   ├─► Voice & Language Resolution
   │
   ▼
TTS Engine (Microsoft Edge Neural TTS Pipeline - MIT License)
   │
   ├─► Neural Synthesis (en-US, en-IN, te-IN)
   ├─► Audio Stream Generation (audio/mpeg)
   │
   ▼
Frontend Custom Audio Player & Download Master (.mp3)
```

---

## Supported Voice Personas

| Preset Label | Accent / Language | Gender | Underlying Neural Voice |
| :--- | :--- | :--- | :--- |
| **Neutral Male** | English (US) | Male | `en-US-GuyNeural` |
| **Warm Female** | English (US) | Female | `en-US-JennyNeural` |
| **Youthful Voice** | English (US) | Female | `en-US-AnaNeural` |
| **Mature Authoritative** | English (US) | Male | `en-US-ChristopherNeural` |
| **Expressive Emotional** | English (US) | Female | `en-US-AriaNeural` |
| **Indian Male (Telugu Neutral)** | Telugu (India) | Male | `te-IN-MohanNeural` |
| **Indian Female (Telugu Warm)** | Telugu (India) | Female | `te-IN-ShrutiNeural` |
| **Indian Male (Narrator)** | English (India) | Male | `en-IN-PrabhatNeural` |
| **Indian Female (Storyteller)** | English (India) | Female | `en-IN-NeerjaExpressiveNeural` |

---

## Prerequisites

- **Python**: 3.10+ (Python 3.11 recommended)
- **Node.js**: v18+ (Node v20 or v24 recommended)
- **Operating System**: Windows / Linux / macOS (Zero GPU requirement)

---

## Quick Start (Clean Environment)

### 1. Install Backend Dependencies
```bash
cd TXT2Speechoo-main/backend
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies
```bash
cd ../
npm install
```

### 3. Run the Application
You can run both backend and frontend together with a single command:
```bash
python run_servers.py
```
*(On Windows, you can also double-click `start_app.bat`)*

Or run them individually in separate terminals:

**Terminal 1 (Backend API):**
```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 (Frontend UI):**
```bash
npm run dev -- --host 127.0.0.1 --port 3000
```

Open your browser at: **[http://127.0.0.1:3000/](http://127.0.0.1:3000/)**  
Interactive API docs at: **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

---

## API Endpoints

- `GET /api/health` — Checks backend health and TTS engine status.
- `GET /api/voices` — Returns the list of supported voice presets and details.
- `POST /api/synthesize` — Synthesizes text to speech, returning `audio/mpeg` binary audio.
- `POST /api/synthesize/json` — Synthesizes text to speech, returning Base64-encoded audio JSON.
