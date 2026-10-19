# DocMind AI — Complete Backend Starter

This is a separate FastAPI backend intended to be added alongside your existing static frontend. It does **not** replace, edit, or redeploy your current frontend.

## Included features

- Email/password registration and login; password hashes use PBKDF2-HMAC-SHA256.
- Signed expiring bearer tokens (JWT).
- User-scoped document upload/list/read/delete for PDF, DOCX, TXT, and Markdown.
- Text extraction, bounded uploads, simple lexical passage retrieval with source filename and character offsets.
- Server-side Q&A, document summaries, and comparisons through a self-hosted Ollama endpoint.
- Conversation history saved in SQL database.
- PostgreSQL support for production; SQLite for local development only.
- CORS allowlist and optional registration invitation code.
- `/health` and interactive API docs at `/docs`.

## Important deployment realities

1. **Render Free does not have enough RAM to host Ollama + Qwen2.5-1.5B reliably.** The backend calls a separately hosted Ollama service using `OLLAMA_BASE_URL`. That can be a private machine/server you control, but it must be reachable from Render. Do not expose Ollama's port publicly without access controls. If Ollama runs on your home PC, it will be unavailable when the PC or internet connection is off and exposing it directly to the internet is not recommended.
2. The Render free web service filesystem is ephemeral. Use a PostgreSQL database URL for persistence. Do not rely on SQLite on Render for durable user documents/history.
3. This stores extracted text and metadata in PostgreSQL, not the original uploaded binary file. If original file downloads are required, add private object storage.
4. Open signup is available unless `REGISTRATION_CODE` is configured. Configure it for a small/private deployment. For a public product, add rate limiting, email verification, account recovery, abuse monitoring, and a privacy/retention policy before launch.
5. This backend is a starter and has not been connected to your frontend yet. The current frontend uses browser-based WebLLM; a separate integration change is required to make it use these APIs.
6. API responses and source excerpts may contain sensitive document content. Use HTTPS, restrict database access, and only upload documents you are permitted to process.

## Run locally on Windows (PowerShell)

From the extracted project folder:

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
```

For a quick local-only test, you can leave `DATABASE_URL` unset to use `sqlite:///./docmind.db`, and set `OLLAMA_BASE_URL=http://127.0.0.1:11434`. Make sure Ollama is installed and the model exists:

```powershell
ollama pull qwen2.5:1.5b
```

Edit `.env` and set a random `JWT_SECRET`. In PowerShell, environment variables from `.env` are not loaded automatically by this starter; set them in the current shell before running, or use Render's Environment settings for production. For a local smoke test:

```powershell
$env:JWT_SECRET = "replace-this-with-a-long-random-local-secret"
$env:FRONTEND_ORIGINS = "http://localhost:5173"
$env:OLLAMA_BASE_URL = "http://127.0.0.1:11434"
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Open `http://127.0.0.1:8000/docs` to try the API. This creates `docmind.db` in the backend directory. Local SQLite is only for development.

## Deploy a separate backend to Render

### A. Add the folder to GitHub

Keep your current static-site service untouched. Add the `backend/` folder from this package to the same GitHub repository, then commit and push. The existing frontend auto-deploy may run because the repository changed, but it will continue using its existing static-site settings.

### B. Create a new Web Service

1. In Render, choose **New → Web Service** and select `praveenkumarkunwar2007-hash/DocMind_AI`.
2. Name: `docmind-ai-backend`.
3. Runtime/language: **Python 3**.
4. Branch: `main`.
5. Root Directory: `backend` (must contain `requirements.txt` and the `app/` folder).
6. Build Command: `pip install -r requirements.txt`.
7. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
8. Choose Free only for a test API; a free instance may sleep and is not appropriate for production guarantees.

### C. Add environment variables in Render

In backend service → **Environment**, add:

- `JWT_SECRET`: a long random secret, different from registration code. Use a password manager or generate one securely.
- `FRONTEND_ORIGINS`: exact live frontend origin, e.g. `https://docmind-ai-example.onrender.com`, without trailing slash. Use your actual static-site URL.
- `DATABASE_URL`: URL for a PostgreSQL database. Use the internal URL when the database is in the same Render region, and ensure the URL is compatible with `postgresql+psycopg://` (the app normalizes `postgres://` and `postgresql://`).
- `OLLAMA_BASE_URL`: base URL of the separate Ollama host; no `/api/chat` suffix. It must be reachable from Render.
- `OLLAMA_MODEL`: `qwen2.5:1.5b` only if that model is installed on the Ollama host.
- `REGISTRATION_CODE`: a long, private invitation code (recommended for private use).
- `MAX_UPLOAD_MB`: `10` (optional).

Never put database passwords, JWT secrets, or registration codes in frontend JavaScript or commit them to GitHub.

### D. Database

Create a PostgreSQL database from Render or another trusted provider. Copy its connection URL into `DATABASE_URL`. Ensure the database plan's current pricing, expiry, and storage rules before relying on it; free database offers change and may expire. Tables are created on startup by this starter.

### E. Ollama server

The backend sends requests to `OLLAMA_BASE_URL/api/chat`. Install Ollama on a server with enough RAM for your selected model and pull the model there. A Render Free web service with 512 MB RAM should not be used to run Ollama and this model together. Keep Ollama private behind a VPN/private network or authenticated gateway if possible; do not expose port 11434 to the whole internet.

### F. Verify

After deploy, open `https://YOUR-BACKEND.onrender.com/health` and `/docs`. Health confirms the API is up, not that Ollama or PostgreSQL is fully healthy. Test registration with `X-Registration-Code` header if configured, then login, upload a document, and call `/chat` with a document ID.

## API overview

- `POST /auth/register` — JSON `{ "email": "you@example.com", "password": "at-least-10-characters" }`; if configured, add `X-Registration-Code`.
- `POST /auth/login` — returns bearer token.
- `GET /auth/me`
- `POST /documents` — multipart form field `file`.
- `GET /documents`, `GET /documents/{id}`, `DELETE /documents/{id}`
- `POST /conversations`, `GET /conversations`, `GET /conversations/{id}`, `DELETE /conversations/{id}`
- `POST /chat` — JSON `{ "question": "...", "document_ids": [1], "conversation_id": null }`.
- `POST /summarize/{document_id}`
- `POST /compare` — JSON `{ "document_ids": [1, 2], "prompt": "Compare key points" }`.

All document, chat, summary, compare, and conversation endpoints require `Authorization: Bearer <token>`.

## Frontend connection is a separate step

The current frontend has not been modified by this package. After the backend deploys, we must update frontend JavaScript to:

1. Register/login and keep the token safely (prefer short-lived tokens and avoid storing tokens for shared/public devices).
2. Send `Authorization: Bearer <token>` with protected API requests.
3. Upload files to `POST /documents`.
4. Use `/chat`, `/summarize/{id}`, `/compare`, and history endpoints.
5. Display returned `sources` in the UI.

Do not publish a shared admin/API secret in frontend code; browsers expose it to every visitor.
