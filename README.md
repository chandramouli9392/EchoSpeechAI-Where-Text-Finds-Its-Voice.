<div align="center">

# 🗣️ Txt2Speecho

### **Multilingual Neural Text-to-Speech Application**

<p>
  <strong>Turn written text into natural-sounding neural speech.</strong>
</p>

<p>
  A production-grade, full-stack Text-to-Speech application featuring
  <strong>English & Telugu neural speech synthesis</strong>,
  interactive audio playback, custom voice presets, and audio export.
</p>

<br/>

<p>
  <img src="https://img.shields.io/badge/AI-Neural%20TTS-8A2BE2?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/English%20%2B%20Telugu-Multilingual-FF6F61?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
</p>

<p>
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
  <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/Neural%20TTS-Microsoft%20Edge-0078D4?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/License-MIT-success?style=for-the-badge"/>
</p>

<br/>

**🎙️ Write → Select Voice → Synthesize → Listen → Download**

</div>

---

# 🌟 About

**Txt2Speecho** is a full-stack multilingual **Text-to-Speech (TTS)** web application designed to convert written text into natural-sounding neural speech.

The application supports:

* 🇺🇸 English — US
* 🇮🇳 English — India
* 🇮🇳 Telugu — India
* 🎙️ Multiple neural voice personas
* 🔊 Interactive audio playback
* 📥 Audio export
* ⚡ Real-time API-based synthesis
* 🧠 Neural speech synthesis through the Microsoft Edge Neural TTS pipeline

The application is designed with a modern frontend and lightweight FastAPI backend, requiring **zero GPU**.

---

# 🧠 Architecture Overview

```text
                         ┌─────────────────────┐
                         │        USER         │
                         │      Browser        │
                         └──────────┬──────────┘
                                    │
                                    ▼
              ┌────────────────────────────────────────┐
              │              FRONTEND                  │
              │                                        │
              │  React 19 + TypeScript + Vite         │
              │  TailwindCSS                           │
              │                                        │
              │  • Text Input                          │
              │  • Voice Selection                     │
              │  • Audio Player                        │
              │  • Download                            │
              └──────────────────┬─────────────────────┘
                                 │
                                 │ HTTP POST
                                 │ /api/synthesize
                                 ▼
              ┌────────────────────────────────────────┐
              │               BACKEND                  │
              │                                        │
              │        FastAPI + Uvicorn               │
              │                                        │
              │  • Input Validation                    │
              │  • Text Preprocessing                  │
              │  • Voice Resolution                    │
              │  • Language Resolution                 │
              └──────────────────┬─────────────────────┘
                                 │
                                 ▼
              ┌────────────────────────────────────────┐
              │          TTS ENGINE                    │
              │                                        │
              │ Microsoft Edge Neural TTS Pipeline     │
              │                                        │
              │  en-US  │  en-IN  │  te-IN             │
              └──────────────────┬─────────────────────┘
                                 │
                                 ▼
              ┌────────────────────────────────────────┐
              │          AUDIO GENERATION              │
              │                                        │
              │            audio/mpeg                  │
              └──────────────────┬─────────────────────┘
                                 │
                                 ▼
              ┌────────────────────────────────────────┐
              │             FRONTEND                   │
              │                                        │
              │     🎧 Custom Audio Player             │
              │     📥 Download Master (.mp3)          │
              └────────────────────────────────────────┘
```

---

# 🔄 How Txt2Speecho Works

```text
        ✍️ TEXT
          │
          ▼
   ┌───────────────┐
   │ Input Text    │
   │ Validation    │
   └───────┬───────┘
           │
           ▼
   ┌───────────────┐
   │ Select Voice  │
   │ + Language    │
   └───────┬───────┘
           │
           ▼
   ┌───────────────┐
   │ FastAPI       │
   │ Backend       │
   └───────┬───────┘
           │
           ▼
   ┌───────────────┐
   │ Neural TTS    │
   │ Synthesis     │
   └───────┬───────┘
           │
           ▼
   ┌───────────────┐
   │ audio/mpeg    │
   │ Audio Stream  │
   └───────┬───────┘
           │
           ▼
   ┌───────────────┐
   │ 🎧 Playback   │
   │ 📥 Download   │
   └───────────────┘
```

---

# 🎙️ Supported Voice Personas

Txt2Speecho provides **nine predefined voice personas** across English and Telugu.

| Preset                           | Accent / Language | Gender | Neural Voice                   |
| -------------------------------- | ----------------- | ------ | ------------------------------ |
| **Neutral Male**                 | English (US)      | Male   | `en-US-GuyNeural`              |
| **Warm Female**                  | English (US)      | Female | `en-US-JennyNeural`            |
| **Youthful Voice**               | English (US)      | Female | `en-US-AnaNeural`              |
| **Mature Authoritative**         | English (US)      | Male   | `en-US-ChristopherNeural`      |
| **Expressive Emotional**         | English (US)      | Female | `en-US-AriaNeural`             |
| **Indian Male (Telugu Neutral)** | Telugu (India)    | Male   | `te-IN-MohanNeural`            |
| **Indian Female (Telugu Warm)**  | Telugu (India)    | Female | `te-IN-ShrutiNeural`           |
| **Indian Male (Narrator)**       | English (India)   | Male   | `en-IN-PrabhatNeural`          |
| **Indian Female (Storyteller)**  | English (India)   | Female | `en-IN-NeerjaExpressiveNeural` |

---

# 🌍 Multilingual Support

```text
                 Txt2Speecho
                      │
          ┌───────────┴───────────┐
          │                       │
       English                  Telugu
          │                       │
     ┌────┴────┐                  │
     │         │                  │
   en-US     en-IN              te-IN
     │         │                  │
     ▼         ▼                  ▼
  US Voices Indian Voices    Telugu Voices
```

### Supported Languages

| Language     | Locale  | Availability  |
| ------------ | ------- | ------------- |
| 🇺🇸 English | `en-US` | Neural voices |
| 🇮🇳 English | `en-IN` | Neural voices |
| 🇮🇳 Telugu  | `te-IN` | Neural voices |

---

# ✨ Core Features

### 🧠 Neural Speech Synthesis

Uses the **Microsoft Edge Neural TTS pipeline** for high-fidelity speech synthesis.

### 🌍 Multilingual

Supports English and Telugu neural voices.

### 🎭 Custom Voice Personas

Choose from multiple predefined voice styles based on:

* Gender
* Accent
* Language
* Voice persona
* Speaking style

### 🎧 Interactive Audio Playback

Generated speech can be played directly through the custom frontend audio player.

### 📥 Audio Export

Generated speech can be exported as an `.mp3` audio file.

### ⚡ Full-Stack Architecture

The application separates the presentation layer from the TTS processing layer:

```text
React
  ↓
FastAPI
  ↓
TTS Engine
  ↓
Audio
  ↓
React Player
```

### 🖥️ Zero GPU Requirement

The project is designed to run without requiring a dedicated GPU.

---

# 🛠️ Technology Stack

| Layer            | Technology                         |
| ---------------- | ---------------------------------- |
| 🎨 Frontend      | React 19                           |
| 🟦 Language      | TypeScript                         |
| ⚡ Build Tool     | Vite                               |
| 🎨 Styling       | TailwindCSS                        |
| 🐍 Backend       | Python                             |
| 🚀 API Framework | FastAPI                            |
| 🌐 Server        | Uvicorn                            |
| 🗣️ TTS Engine   | Microsoft Edge Neural TTS Pipeline |
| 🔊 Output        | `audio/mpeg`                       |
| 🎵 Export        | `.mp3`                             |
| 🖥️ Hardware     | Zero GPU requirement               |

---

# 📋 Prerequisites

Before running the application, make sure the following are installed.

### Python

```text
Python 3.10+
```

**Python 3.11 recommended**

### Node.js

```text
Node.js v18+
```

Recommended:

```text
Node.js v20
Node.js v24
```

### Operating Systems

The application supports:

```text
Windows
Linux
macOS
```

### Hardware

```text
GPU: Not Required
```

---

# 🚀 Quick Start

## 1️⃣ Install Backend Dependencies

Navigate to the backend:

```bash
cd TXT2Speechoo-main/backend
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

---

## 2️⃣ Install Frontend Dependencies

Return to the project root:

```bash
cd ../
```

Install the Node.js dependencies:

```bash
npm install
```

---

# ▶️ Run the Application

There are two ways to start the application.

## ⚡ Option 1 — Run Everything Together

From the project root:

```bash
python run_servers.py
```

### Windows

You can also simply double-click:

```text
start_app.bat
```

---

# 🖥️ Option 2 — Run Frontend & Backend Separately

## Terminal 1 — Backend API

```bash
cd backend

python -m uvicorn main:app \
  --host 127.0.0.1 \
  --port 8000 \
  --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

---

## Terminal 2 — Frontend UI

From the project root:

```bash
npm run dev -- --host 127.0.0.1 --port 3000
```

The frontend will be available at:

```text
http://127.0.0.1:3000/
```

---

# 🌐 Application URLs

Once the application is running:

### 🎨 Frontend

**http://127.0.0.1:3000/**

### 🔧 FastAPI API

**http://127.0.0.1:8000**

### 📚 Interactive API Documentation

**http://127.0.0.1:8000/docs**

---

# 🔌 API Endpoints

Txt2Speecho exposes four primary API endpoints.

| Method | Endpoint               | Purpose                                                |
| ------ | ---------------------- | ------------------------------------------------------ |
| `GET`  | `/api/health`          | Checks backend health and TTS engine status            |
| `GET`  | `/api/voices`          | Returns supported voice presets and details            |
| `POST` | `/api/synthesize`      | Synthesizes text and returns binary `audio/mpeg`       |
| `POST` | `/api/synthesize/json` | Synthesizes text and returns Base64-encoded audio JSON |

---

## ❤️ Health Check

```http
GET /api/health
```

Checks:

* Backend health
* TTS engine status

---

## 🎙️ Get Voices

```http
GET /api/voices
```

Returns the list of supported voice presets and their details.

---

## 🔊 Synthesize Speech

```http
POST /api/synthesize
```

Converts text into speech and returns:

```text
audio/mpeg
```

binary audio.

---

## 📦 JSON Synthesis

```http
POST /api/synthesize/json
```

Returns synthesized audio as:

```text
Base64-encoded audio JSON
```

---

# 🧩 API Architecture

```text
                    HTTP Request
                         │
                         ▼
                ┌────────────────┐
                │    FastAPI     │
                └───────┬────────┘
                        │
                ┌───────▼────────┐
                │ Input Validation│
                └───────┬────────┘
                        │
                ┌───────▼────────┐
                │ Text Processing │
                └───────┬────────┘
                        │
                ┌───────▼────────┐
                │ Voice Resolution│
                └───────┬────────┘
                        │
                ┌───────▼────────┐
                │Language Resolve │
                └───────┬────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │  Neural TTS Engine  │
              └──────────┬──────────┘
                         │
                         ▼
                   Audio Stream
                         │
                         ▼
                   `audio/mpeg`
```

---

# 📦 Project Resources

### 📖 Repository

**[TXT2Speecho on GitHub](https://github.com/chandramouli9392/TXT2Speecho)**

### 📘 README

**[Read README](https://github.com/chandramouli9392/TXT2Speecho#readme-ov-file)**

### 📈 Activity

**[View Repository Activity](https://github.com/chandramouli9392/TXT2Speecho/activity)**

### ⭐ Stars

**1 Star**

### 👀 Watchers

**0 Watchers**

### 🍴 Forks

**0 Forks**

---

# 📦 Releases

**No releases published**

[Create a new release](https://github.com/chandramouli9392/TXT2Speecho/releases/new)

---

# 📦 Packages

**No packages published**

[Publish your first package](https://github.com/chandramouli9392/TXT2Speecho/packages)

---

# 👨‍💻 Contributor

<div align="center">

### **Chandramouli Boppana**

**[@chandramouli9392](https://github.com/chandramouli9392)**

</div>

The repository currently has **1 contributor**.

---

# 💻 Language Distribution

| Language   | Percentage |
| ---------- | ---------: |
| TypeScript |    **71%** |
| Python     |  **25.5%** |
| HTML       |   **3.4%** |
| Batchfile  |   **0.1%** |

---

# 🤖 Repository Generation

The repository metadata states that the project was generated from:

**[google-gemini/aistudio-repository-template](https://github.com/google-gemini/aistudio-repository-template)**

---

# ⚙️ Suggested GitHub Workflows

Based on the repository's technology stack, GitHub suggests the following workflows:

### 1. Datadog Synthetics

**Run Datadog Synthetic tests within your GitHub Actions workflow**

By Datadog.

### 2. SLSA Generic Generator

**Generate SLSA3 provenance for existing release workflows**

By Open Source Security Foundation (OpenSSF).

### 3. Django

**Build and Test a Django Project**

By GitHub Actions.

More workflows:

**[Explore GitHub Actions Workflows](https://github.com/chandramouli9392/TXT2Speechoo/actions/new)**

---

# 🧭 Project Flow

```text
             ┌───────────────────────┐
             │       TXT2SPEECHO     │
             └───────────┬───────────┘
                         │
                         ▼
                 ✍️ Enter Text
                         │
                         ▼
                 🎙️ Select Voice
                         │
                         ▼
                 🌍 Select Language
                         │
                         ▼
                 🚀 Synthesize
                         │
                         ▼
                 🧠 Neural TTS
                         │
                         ▼
                 🔊 Generate Audio
                         │
                  ┌──────┴──────┐
                  ▼             ▼
              🎧 Listen      📥 Export
```

---

# 🎯 Project Highlights

```text
┌────────────────────────────────────────────┐
│              TXT2SPEECHO                  │
├────────────────────────────────────────────┤
│                                            │
│  🧠 Neural Speech Synthesis                │
│  🌍 English + Telugu                       │
│  🎙️ 9 Voice Personas                      │
│  ⚡ FastAPI Backend                         │
│  ⚛️ React 19 Frontend                      │
│  🔷 TypeScript + Vite                      │
│  🎨 TailwindCSS                            │
│  🎧 Interactive Audio Player               │
│  📥 MP3 Audio Export                       │
│  🔌 REST API                               │
│  📚 Swagger / OpenAPI Docs                 │
│  🖥️ Zero GPU Requirement                   │
│                                            │
└────────────────────────────────────────────┘
```

---

# 🌟 Vision

Txt2Speecho focuses on making neural speech synthesis accessible through a clean full-stack application.

The experience is intentionally simple:

> **Write your text. Choose your voice. Generate natural speech. Listen. Download.**

```text
                    TEXT
                     │
                     ▼
               VOICE SELECTION
                     │
                     ▼
              NEURAL SYNTHESIS
                     │
                     ▼
                 AUDIO
                ↙     ↘
            LISTEN    DOWNLOAD
```

---

<div align="center">

# 🗣️ Txt2Speecho

### **Write it. Speak it. Hear it.**

**Multilingual Neural Text-to-Speech**

<br/>

⭐ **Built with React + FastAPI + Neural TTS**

<br/>

**© 2026 Txt2Speecho**

</div>
