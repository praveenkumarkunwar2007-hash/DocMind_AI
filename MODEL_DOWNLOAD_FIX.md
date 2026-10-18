# DocMind AI — WebAssembly/model compatibility fix

This update addresses the browser error:

`WebAssembly.instantiate(): Import #0 "env" ... ResetThreadPoolEnv ... function import requires a callable`

## Root cause addressed

The previous revision registered a third-party custom `model_lib` WASM file under a custom model ID. Its runtime imports were not compatible with the WebLLM runtime bundled into this app. This revision removes that custom mapping and uses the official `Qwen2.5-0.5B-Instruct-q4f16_1-MLC` entry from `@mlc-ai/web-llm`'s `prebuiltAppConfig`, which pairs the model weights with the WASM module expected by that package version.

The app keeps IndexedDB caching because the earlier version reported a `Cache.add()` network error during model download.

## Deploy the fix

1. Extract this ZIP.
2. Copy the *contents* of `DocMindAI_Render_Free_Static` into your existing local GitHub repository folder, replacing matching files. Do not delete the repository's hidden `.git` folder.
3. In GitHub Desktop, commit with message `Use official WebLLM model WASM pairing` and push `main`.
4. Wait for Render to complete the new deployment. Confirm the latest deployment is marked Live and is from the new commit.
5. Open the site in Chrome or Edge and press `Ctrl+Shift+R`.
6. If the exact old `ResetThreadPoolEnv` error persists, open Chrome DevTools → Application → Storage → Clear site data, then reload and click **Load local AI**. Clearing site data removes browser-local documents and chat history for this website, so export or back up anything important first.

## Constraints

The first download is about 290 MB and requires a stable connection. The AI model runs in the visitor's browser; no inference API is used. The browser/device must support WebGPU and have sufficient available GPU memory. This update fixes the known incompatible custom WASM mapping, but it cannot guarantee model initialization on every GPU/browser/driver combination.
