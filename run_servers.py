import subprocess
import sys
import os
import signal
import time

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")

    print("=" * 60)
    print("   Starting Txt2Speecho: Full Stack TTS Application")
    print("=" * 60)
    print(f"Backend directory:  {backend_dir}")
    print(f"Frontend directory: {root_dir}")
    print("-" * 60)

    # Start FastAPI backend
    print("[1/2] Launching FastAPI TTS Engine on http://127.0.0.1:8000 ...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=backend_dir)

    time.sleep(1.5)

    # Start Vite frontend
    print("[2/2] Launching Vite Frontend on http://127.0.0.1:3000 ...")
    shell_flag = os.name == 'nt'
    frontend_cmd = "npm run dev -- --host 127.0.0.1 --port 3000"
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=root_dir, shell=shell_flag)

    print("-" * 60)
    print("   Application successfully launched!")
    print("   Open in your browser: http://127.0.0.1:3000/")
    print("   API Documentation:    http://127.0.0.1:8000/docs")
    print("   Press CTRL+C to stop both servers.")
    print("=" * 60)

    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print("Backend stopped unexpectedly.")
                break
            if frontend_proc.poll() is not None:
                print("Frontend stopped unexpectedly.")
                break
    except KeyboardInterrupt:
        print("\nShutting down servers...")
    finally:
        if backend_proc.poll() is None:
            backend_proc.terminate()
        if frontend_proc.poll() is None:
            frontend_proc.terminate()
        print("Both servers terminated cleanly.")

if __name__ == "__main__":
    main()
