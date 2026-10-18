# DocMind AI — Render Free Static Edition

DocMind AI is a browser-local document assistant designed for **Render's free Static Site hosting**. The website can remain available while your PC is turned off because Render only serves static files; each visitor's own browser runs the AI model.

## No inference API

- Qwen2.5 1.5B Instruct inference runs inside the visitor's browser using WebLLM/WebGPU.
- Document files are parsed in the browser; extracted text, prompts, answers, and chat history stay in that browser's IndexedDB.
- The site has no Python backend, hosted model service, AI inference API, D1, or R2 dependency.
- The first visit downloads model/runtime assets from external static hosts. That is a file download, not an AI inference API call.

## Deploy free

Follow [DEPLOY_RENDER.md](./DEPLOY_RENDER.md). Create a **Static Site**, not a Web Service. Build command:

```bash
npm install --no-audit --no-fund && npm run build
```

Publish directory: `dist`.

Render Static Sites are free to deploy but have monthly included bandwidth and pipeline usage limits, and the browser AI depends on each visitor's WebGPU/memory support. This is a no-backend demo/hobby deployment, not a shared multi-user document server.


## Model download reliability

The model loader uses the official WebLLM prebuilt `Qwen2.5-1.5B-Instruct-q4f16_1-MLC` model/runtime pairing and IndexedDB caching. The first visit downloads about 880 MB of browser model files; inference runs on the visitor's device with WebGPU and does not call an AI inference API. See `MODEL_DOWNLOAD_FIX.md` for troubleshooting.


## Model upgrade

This current package uses `Qwen2.5-1.5B-Instruct-q4f16_1-MLC` for stronger document summarization and PDF question answering. Its first model download is about 880 MB and the WebLLM configuration estimates about 1.63 GB of GPU memory. See `README_MODEL_UPGRADE.md` for the trade-offs and limitations.

## Runtime stability note

This build pins `@mlc-ai/web-llm` to `0.2.82` because a documented upstream issue reports the `Object has already been disposed` generation error on some integrated GPUs in 0.2.83+; the issue report says 0.2.82 is unaffected. See `README_MODEL_RUNTIME_FIX.md`.
