# DocMind AI — WebLLM runtime stability fix

## Diagnosis

The reported `Object has already been disposed` error matches a documented WebLLM regression introduced in 0.2.83. A WebLLM issue reports that generation on some integrated GPUs fails with longer prompts in 0.2.83/0.2.84 while 0.2.82 is unaffected. The app's previous package used WebLLM 0.2.86. This points to a runtime issue rather than a reason to change the model.

## Changes

- Pin `@mlc-ai/web-llm` to exactly `0.2.82` (not `^0.2.82`).
- Use `useIndexedDBCache: true`, the option supported by this version, so model artifacts can be cached in IndexedDB.
- Use `Qwen2.5-1.5B-Instruct-q4f16_1-MLC`, a prebuilt model/runtime pair listed in WebLLM 0.2.82. Its estimated requirement is about 1.63 GB GPU memory, so very low-memory devices may not load it.
- Reduce prompt/context payload on summaries/comparisons for low-memory browser devices.
- Improve user-facing reporting for a disposed WebGPU object.

## Deploy

1. Copy the contents of this folder over the existing GitHub repository (keep `.git`).
2. Commit and push to `main`.
3. Wait for Render to deploy.
4. Fully close Chrome/Edge once after deployment, reopen, then visit the site and load the model. The older runtime uses a different model-library asset URL, so that compatible WASM file will download again; the model weights may remain cached.

## Limitations

The model still runs inside each visitor's browser. It needs a compatible WebGPU-capable browser and enough GPU memory. This patch has syntax/config checks, but was not verified by a full production build or a real-browser inference test in this environment.
