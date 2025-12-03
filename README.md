<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MemoRoo - Your On-Device AI Memory Layer

This repository contains the full stack for MemoRoo, an on-device, Arm-optimized personal memory engine. It includes the frontend (React/TypeScript) and the backend (FastAPI/Python) with integrated AI pipelines.

## Run Locally

**Prerequisites:** Node.js, Python 3.10+, Docker (for PostgreSQL and optional backend deployment)

### Frontend
1.  Navigate to the project root: `cd /path/to/MemoRoo-New`
2.  Install dependencies:
    `npm install`
3.  Run the app:
    `npm run dev`

### Backend
1.  Ensure Docker is running. Create and start a PostgreSQL container (replace `user`, `password`, `memoroo_db`):
    `docker run --name memoroo-postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -e POSTGRES_DB=memoroo_db -p 5432:5432 -d postgres:16-alpine`
2.  Create and activate a Python virtual environment:
    `python3 -m venv venv && source venv/bin/activate`
3.  Install backend dependencies:
    `pip install -r requirements.txt` (You will need to create a `requirements.txt` based on the provided setup.py and installed packages)
4.  Configure your database URL and secret key in `.env` (example provided in `.env.example`).
5.  Run database migrations:
    `alembic upgrade head`
6.  Start the FastAPI backend:
    `uvicorn src.main:app --reload`

## AI Pipelines (On-Device Focus)

MemoRoo is designed for on-device AI inference, leveraging technologies like ExecuTorch, TFLite, and ONNX Runtime Mobile, optimized for Arm CPUs and Mali GPUs. Specific models will be loaded from the `data/global_models` directory.

## Project Structure

-   `public/`: Frontend assets.
-   `src/`: Frontend React components and backend Python modules.
-   `src/backend/`: (Future proposed if needed for clarity) Backend Python modules.
-   `src/api/`: FastAPI route handlers (controllers).
-   `src/services/`: Business logic and AI pipeline orchestration.
-   `src/models/`: SQLAlchemy database models.
-   `src/schemas/`: Pydantic data validation schemas.
-   `src/config/`: Application settings.
-   `src/database/`: Database connection and utilities.
-   `src/core/`: Core utilities like security and exceptions.
-   `src/ai/`: AI-specific modules, including model loading, embedding generation, OCR, and LLM inference.
-   `migrations/`: Alembic database migration scripts.
-   `.env`: Environment variables (local, sensitive).
-   `.gitignore`: Git ignore rules.
-   `alembic.ini`: Alembic configuration for migrations.
-   `requirements.txt`: Python dependencies.
-   `package.json`: Node.js dependencies.
-   `vite.config.ts`: Frontend build configuration.
